const { ChainId, Token, Fetcher, KOIN } = require("@koindx/v2-sdk")
const BigNumber = require("bignumber.js")

// usdt dollar qty in
const udst_dollars_in = 100

// Convert usdt to BigNumber Object
// Our number needs to be of a certain decimal length
// 1 with 8x trailing 0's converts to a decimal length of -> [0.12345678]
const asset = new BigNumber(udst_dollars_in * 100000000)

// Koindx fee is needed for estimating exchange rate [ 0.25% ]
const koindx_fee = new BigNumber(1 - 0.0025)

go(asset)

async function go(asset_in){
    try{

        // DECLARE ASSETS
        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET)

        // USDT is NOT a native asset and is declared using the Token class
        // This same method would be used for other alt-tokens in the ecosystem
        const usdt_contract_address = '19WrWze3XAoMa3Mwqys4rJMP6emZX2wfpH'
        const usdt = new Token(ChainId.MAINNET, usdt_contract_address)

        // This retrieves the Koin/USDT pool data by utilizing the Koindx SDK
        const PAIR = await Fetcher.fetchPairData(ChainId.MAINNET, usdt, koin)

        // Lets declare our availible reserves to get the pool ratio
        // This can be used to get an estimated exchange rate for any given pool
        let rsv_0 = PAIR.reserve_0
        let rsv_1 = PAIR.reserve_1

        // Calculate margin impact of asset-in - [ apply koindx fee = 0.25% ]
        let impact = rsv_0.dividedBy(rsv_0.plus(asset_in * koindx_fee))

        // Calculate margin impact of asset-out
        let est = rsv_1.minus(rsv_1.times(impact))

        console.log(est)
        

    } catch (error) {
        console.error(error)
    }
}

