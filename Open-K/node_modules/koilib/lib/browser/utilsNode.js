"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainTypes = exports.decodeGenesisData = exports.encodeGenesisData = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const Serializer_1 = require("./Serializer");
const utils_1 = require("./utils");
const chain_proto_json_1 = __importDefault(require("./jsonDescriptors/chain-proto.json"));
const defaultAlias = {
    "object_key::head_block": { typeName: "block" },
    "object_key::chain_id": {},
    "object_key::genesis_key": { isAddress: true },
    "object_key::resource_limit_data": { typeName: "resource_limit_data" },
    "object_key::max_account_resources": { typeName: "max_account_resources" },
    "object_key::protocol_descriptor": {},
    "object_key::compute_bandwidth_registry": {
        typeName: "compute_bandwidth_registry",
    },
    "object_key::block_hash_code": {},
};
function prepareDictionary(dictionary) {
    const serializerChain = new Serializer_1.Serializer(chain_proto_json_1.default, { bytesConversion: true });
    const defaultDictionary = {};
    Object.keys(defaultAlias).forEach((alias) => {
        const key = (0, utils_1.encodeBase64)((0, utils_1.multihash)((0, sha256_1.sha256)(alias)));
        defaultDictionary[key] = {
            serializer: serializerChain,
            alias,
            ...defaultAlias[alias],
        };
    });
    const dic = {
        ...defaultDictionary,
        ...dictionary,
    };
    return dic;
}
/**
 * Function to encode genesis data in order to launch a
 * new blockchain. The different values are serialized using
 * protobuffers. One of the arguments is the dictionary which
 * contains the relevant information to perform the serialization.
 * By default the function contains the dictionary for the
 * following keys:
 *
 * - "object_key::head_block"
 * - "object_key::chain_id"
 * - "object_key::genesis_key"
 * - "object_key::resource_limit_data"
 * - "object_key::max_account_resources"
 * - "object_key::protocol_descriptor"
 * - "object_key::compute_bandwidth_registry"
 * - "object_key::block_hash_code"
 *
 * @param genesisDataDecoded - Genesis data where the values are
 * objects.
 * @param dictionary - Set of keys which contains the relevant
 * information to perform the serialization
 *
 * @example
 *
 * ```ts
 * const signer = Signer.fromSeed("seed");
 * const genesisDataDecoded = {
 *   entries: [
 *     {
 *       space: { system: true },
 *       alias: "object_key::genesis_key",
 *       value: signer.address,
 *     },
 *   ],
 * };
 *
 * const genesisData = await encodeGenesisData(genesisDataDecoded);
 * console.log(genesisData);
 *
 * // {
 * //   entries: [
 * //     {
 * //       space: { system: true },
 * //       key: "EiC3nO+XbeKg4C8ugW7M7XdfmJKY4i3l91KoJWxosQPImA==",
 * //       value: "AMpASH7CjUHBpl2QR8E5lGKVjVLAvJRg5g==",
 * //     },
 * //   ],
 * // }
 * ```
 *
 * @example adding a custom dictionary
 *
 * ```ts
 * const contractId = Signer.fromSeed("seed").address;
 * const zone = encodeBase64(decodeBase58(contractId));
 * const genesisDataDecoded = {
 *   entries: [
 *     {
 *       space: { system: true, zone, id: 1 },
 *       key: "difficulty_metadata_key",
 *       value: {
 *         target: encodeBase64url(toUint8Array("F".repeat(64))),
 *         last_block_time: "1641038400000",
 *         difficulty: encodeBase64url(toUint8Array("1".repeat(64))),
 *         target_block_interval: "10",
 *       },
 *     },
 *   ],
 * };
 *
 * const powJson = {
 *   nested: {
 *     mypackage: {
 *       nested: {
 *         difficulty_metadata: {
 *           "fields": {
 *             "target": { "type": "bytes", "id": 1 },
 *             "last_block_time": { "type": "uint64", "id": 2,
 *               "options": { "jstype": "JS_STRING" }
 *             },
 *             "difficulty": { "type": "bytes", "id": 3 },
 *             "target_block_interval": { "type": "uint64", "id": 4,
 *                "options": { "jstype": "JS_STRING" }
 *             }
 *           }
 *         },
 *       }
 *     }
 *   }
 * }
 *
 * const dic = {
 *   difficulty_metadata_key: {
 *     serializer: new Serializer(powJson),
 *     typeName: "difficulty_metadata",
 *   },
 * };
 *
 * const genesisData = await encodeGenesisData(genesisDataDecoded, dic);
 * console.log(genesisData);
 *
 * // {
 * //   entries: [
 * //     {
 * //       key: "difficulty_metadata_key",
 * //       space: {
 * //         id: 1,
 * //         system: true,
 * //         zone: "AMpASH7CjUHBpl2QR8E5lGKVjVLAvJRg5g==",
 * //       },
 * //       value:
 * //         "CiD//////////////////////////////////////////xCAlIus4S8aIBERERERERERERERERERERERERERERERERERERERERERIAo=",
 * //     },
 * //   ],
 * // };
 * ```
 */
async function encodeGenesisData(genesisDataDecoded, dictionary = {}) {
    const genesisData = {};
    if (!genesisDataDecoded || !genesisDataDecoded.entries)
        return genesisData;
    const dic = prepareDictionary(dictionary);
    genesisData.entries = await Promise.all(genesisDataDecoded.entries.map(async (entry) => {
        const key = Object.keys(dic).find((k) => k === entry.key || (entry.alias && dic[k].alias === entry.alias));
        if (!key)
            return {
                error: `key ${entry.key} not found in the dictionary`,
                space: entry.space,
                key: entry.key,
                value: (0, utils_1.encodeBase64)(new Uint8Array()),
            };
        const { isAddress, serializer, typeName } = dic[key];
        let valueBytes;
        let error = "";
        if (isAddress) {
            valueBytes = (0, utils_1.decodeBase58)(entry.value);
        }
        else if (serializer && typeName) {
            valueBytes = await serializer.serialize(entry.value, typeName);
        }
        else {
            valueBytes = new Uint8Array();
            error = "no serializer or typeName defined in the dictionary";
        }
        return {
            ...(error && { error }),
            space: entry.space,
            key,
            value: (0, utils_1.encodeBase64)(valueBytes),
        };
    }));
    return genesisData;
}
exports.encodeGenesisData = encodeGenesisData;
/**
 * Function to decode genesis data used to launch a
 * new blockchain. The different values are deserialized using
 * protobuffers. One of the arguments is the dictionary which
 * contains the relevant information for the deserialization.
 * By default the function contains the dictionary for the
 * following keys:
 *
 * - "object_key::head_block"
 * - "object_key::chain_id"
 * - "object_key::genesis_key"
 * - "object_key::resource_limit_data"
 * - "object_key::max_account_resources"
 * - "object_key::protocol_descriptor"
 * - "object_key::compute_bandwidth_registry"
 * - "object_key::block_hash_code"
 *
 * @param genesisData - Genesis data
 * @param dictionary - Set of keys which contains the relevant
 * information to perform the deserialization
 *
 * @example
 *
 * ```ts
 * const genesisData = {
 *   entries: [
 *     {
 *       space: { system: true },
 *       key: "EiC3nO+XbeKg4C8ugW7M7XdfmJKY4i3l91KoJWxosQPImA==",
 *       value: "AMpASH7CjUHBpl2QR8E5lGKVjVLAvJRg5g==",
 *     },
 *   ],
 * }
 *
 * const genesisDataDecoded = await decodeGenesisData(genesisData);
 * console.log(genesisDataDecoded);
 *
 * // {
 * //   entries: [
 * //     {
 * //       space: { system: true },
 * //       key: "EiC3nO+XbeKg4C8ugW7M7XdfmJKY4i3l91KoJWxosQPImA==",
 * //       alias: "object_key::genesis_key",
 * //       value: "1KSQWDyUnFZ48Pf2hsW8Akh1b5fKUWc8Z3",
 * //     },
 * //   ],
 * // };
 * ```
 *
 * @example adding a custom dictionary
 *
 * ```ts
 * const genesisData = {
 *   entries: [
 *     {
 *       key: "difficulty_metadata_key",
 *       space: {
 *         id: 1,
 *         system: true,
 *         zone: "AMpASH7CjUHBpl2QR8E5lGKVjVLAvJRg5g==",
 *       },
 *       value:
 *         "CiD//////////////////////////////////////////xCAlIus4S8aIBERERERERERERERERERERERERERERERERERERERERERIAo=",
 *     },
 *   ],
 * };
 *
 * const powJson = {
 *   nested: {
 *     mypackage: {
 *       nested: {
 *         difficulty_metadata: {
 *           "fields": {
 *             "target": { "type": "bytes", "id": 1 },
 *             "last_block_time": { "type": "uint64", "id": 2,
 *               "options": { "jstype": "JS_STRING" }
 *             },
 *             "difficulty": { "type": "bytes", "id": 3 },
 *             "target_block_interval": { "type": "uint64", "id": 4,
 *                "options": { "jstype": "JS_STRING" }
 *             }
 *           }
 *         },
 *       }
 *     }
 *   }
 * }
 *
 * const dic = {
 *   difficulty_metadata_key: {
 *     serializer: new Serializer(powJson),
 *     typeName: "difficulty_metadata",
 *   },
 * };
 *
 * const genesisDataDecoded = await decodeGenesisData(genesisData, dic);
 * console.log(genesisData);
 *
 * // {
 * //   entries: [
 * //     {
 * //       space: { system: true, zone, id: 1 },
 * //       key: "difficulty_metadata_key",
 * //       value: {
 * //         target: "__________________________________________8=",
 * //         last_block_time: "1641038400000",
 * //         difficulty: "ERERERERERERERERERERERERERERERERERERERERERE=",
 * //         target_block_interval: "10",
 * //       },
 * //     },
 * //   ],
 * // };
 * ```
 */
async function decodeGenesisData(genesisData, dictionary = {}) {
    const genesisDataDecoded = {};
    if (!genesisData || !genesisData.entries)
        return genesisDataDecoded;
    const dic = prepareDictionary(dictionary);
    genesisDataDecoded.entries = await Promise.all(genesisData.entries.map(async (entry) => {
        const key = Object.keys(dic).find((k) => k === entry.key);
        if (!key)
            return {
                error: `key ${entry.key} not found in the dictionary`,
                ...entry,
            };
        const { isAddress, serializer, typeName, alias } = dic[key];
        const valueBase64url = (0, utils_1.encodeBase64url)((0, utils_1.decodeBase64)(entry.value));
        let value;
        let error = "";
        if (isAddress) {
            value = (0, utils_1.encodeBase58)((0, utils_1.decodeBase64url)(valueBase64url));
        }
        else if (serializer && typeName) {
            value = await serializer.deserialize(valueBase64url, typeName);
        }
        else {
            value = valueBase64url;
            error = "no serializer or typeName defined in the dictionary";
        }
        return {
            ...(error && { error }),
            space: entry.space,
            key,
            value,
            ...(alias && { alias }),
        };
    }));
    return genesisDataDecoded;
}
exports.decodeGenesisData = decodeGenesisData;
exports.ChainTypes = chain_proto_json_1.default;
//# sourceMappingURL=utilsNode.js.map