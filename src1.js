const { ChainId } = require("@koindx/v2-sdk");

async function go(){
    try{
        
        console.log(ChainId.MAINNET)

    } catch (error) {
        console.error(error);
    }
}

go()