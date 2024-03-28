const { ChainId, Fetcher, KOIN, Token} = require("@koindx/v2-sdk");

async function go(){
    try{
        // DECLARE ASSETS
        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET);

        // USDT is NOT a native asset and is declared using the Token class
        // This same operation would be used for other alt-token in the ecosystem
        const usdt_contract_address = '19WrWze3XAoMa3Mwqys4rJMP6emZX2wfpH'
        const usdt = new Token(ChainId.MAINNET, usdt_contract_address);

        // This retrieves the Koin/USDT pool info by utilizing the Koindx SDK
        const PAIR = await Fetcher.fetchPairData(ChainId.MAINNET, koin, usdt);

        // Lets declare our availbile reserves to get an estimated ratio
        // This can be used to get an estimated exchange rate for any given pool
        const koin_reserves = PAIR.reserve_0
        const usdt_reserves = PAIR.reserve_1

        console.log('Koin Reserves: ', koin_reserves)
        console.log('USDT Reserves: ', usdt_reserves)

    } catch (error) {
        console.error(error);
    }
}

go()