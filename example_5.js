const { ChainId, KOIN, Token, Fetcher} = require("@koindx/v2-sdk")

async function go(){
    try{
        // DECLARE ASSETS
        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET)

        // USDT is NOT a native asset and is declared using the Token class
        // This same method would be used for other alt-token in the ecosystem
        const usdt_contract_address = '19WrWze3XAoMa3Mwqys4rJMP6emZX2wfpH'
        const usdt = new Token(ChainId.MAINNET, usdt_contract_address);

        // This retrieves the Koin/USDT pool info by utilizing the Koindx SDK
        const PAIR = await Fetcher.fetchPairData(ChainId.MAINNET, koin, usdt);

        // Lets declare our availible reserves to get the pool ratio
        // This can be used to get an estimated exchange rate for any given pool
        const koin_reserves = PAIR.reserve_0
        const usdt_reserves = PAIR.reserve_1

        // Calculate reserve ratio for Koin:USDT pool
        const results = koin_reserves / usdt_reserves

        console.log(results)

    } catch (error) {
        console.error(error)
    }
}

go()