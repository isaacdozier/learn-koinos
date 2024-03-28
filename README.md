# How to access Koinos Blockchain Network with Node.js

Koinos is made to be accessible to developers and users. With just a few lines of code, we can interact with the blockchain.

[Learn to Use Terminal](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line)

[Install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

## Clone this repo

```sh
git clone https://github.com/isaacdozier/learn-koinos.git
cd learn-koinos
```

[How to Clone a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

## Install Dependencies

```sh
npm install @koindx/v2-sdk
```

[The Basics of Dependencies for Node.js & NPM](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/)

[Koindx V2-SDK Examples](https://docs.koindx.com/sdk/v2-sdk/examples)

## Run Examples

Example_2.js : returns Koin token data

```javascript
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
```

## Terminal

```sh
node example_4.js
```

## Output

```sh
Koin Reserves:  BigNumber { s: 1, e: 12, c: [ 8840149497854 ] }
USDT Reserves:  BigNumber { s: 1, e: 12, c: [ 8684394652263 ] }
```

[Learn how to work with BigNumber.js](https://github.com/MikeMcl/bignumber.js)