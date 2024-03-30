const { ChainId, Token, KOIN, Fetcher } = require("@koindx/v2-sdk")

async function go(){
    try{

        // DECLARE ASSETS
        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET)

        // USDT is NOT a native asset and is declared using the Token class
        // This same method would be used for other alt-tokens in the ecosystem
        const usdt_contract_address = '19WrWze3XAoMa3Mwqys4rJMP6emZX2wfpH'
        const usdt = new Token(ChainId.MAINNET, usdt_contract_address)

        // This retrieves the Koin/USDT pool data by utilizing the Koindx SDK
        const PAIR = await Fetcher.fetchPairData(ChainId.MAINNET, koin, usdt)
        
        console.log(PAIR)

    } catch (error) {
        console.error(error)
    }
}

go()