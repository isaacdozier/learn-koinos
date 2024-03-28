const { ChainId, KOIN, Token } = require("@koindx/v2-sdk");

async function go(){
    try{
        // DECLARE ASSETS
        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET);

        // USDT is NOT a native asset and is declared using the Token class
        // This same operation would be used for other alt-token in the ecosystem
        const usdt_contract_address = '19WrWze3XAoMa3Mwqys4rJMP6emZX2wfpH'
        const usdt = new Token(ChainId.MAINNET, usdt_contract_address);

        console.log(usdt)

    } catch (error) {
        console.error(error);
    }
}

go()