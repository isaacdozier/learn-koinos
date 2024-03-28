const { ChainId, KOIN } = require("@koindx/v2-sdk");

async function go(){
    try{
        // DECLARE ASSETS
        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET);

        console.log(koin)

    } catch (error) {
        console.error(error);
    }
}

go()