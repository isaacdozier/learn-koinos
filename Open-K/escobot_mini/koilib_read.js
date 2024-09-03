const {
    Contract,
    Provider,
    utils,
  } = require("koilib");

const BigNumber = require('bignumber.js');

const process = require('process')
                require('dotenv').config();

async function read() {
    try{
        const provider = new Provider(["https://api.koinos.pro/jsonrpc/?apikey=" + process.env.KOINOS_PRO_API_KEY]);
        
        const koinContract = new Contract({
            id: process.argv[3],
            abi: utils.tokenAbi,
            provider,
        });

        const koin = koinContract.functions;

        const { result } = await koin.balanceOf({
            owner: process.argv[2]
        });

        console.log(JSON.stringify({
            req : process.argv[3],
            res : Number(new BigNumber(result.value) / '100000000').toFixed(8), 
            end : new Date()
        }))

    } catch (error) {
        console.log(JSON.stringify({
            error : error
        }))

    } finally {
        console.log(JSON.stringify({
            closed : new Date()
        }))
    }
}

read()