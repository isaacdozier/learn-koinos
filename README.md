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

Example_4.js : returns Koin & USDT Pool Reserves

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

        // Lets declare our availbile reserves to get the pools current ratio
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
Koin Reserves:  BigNumber { s: 1, e: 12, c: [ 8752538877288 ] }
USDT Reserves:  877155023.1824
```

BigNumber.js is an arithmitic standard used for working with a wide range of different number types.

```javascript
const BigNumber = require('bignumber.js');
```

"The library exports a single constructor function, BigNumber, which accepts a value of type Number, String or BigNumber"

This makes working with numbers easier for developers.

## Arithmic functions with numbers, strings or big numbers
```javascript
console.log('Koin Reserves: ', koin_reserves * 1)
```
```sh
Output: Koin Reserves:  8810421275766
```

```javascript
console.log('Koin Reserves: ', koin_reserves * '1')
```
```sh
Output: Koin Reserves:  8810421275766
```

## Simplify operations with Percent

```javascript
const koin_reserves = new Percent(PAIR.reserve_0)
const usdt_reserves = new Percent(PAIR.reserve_1)

console.log('Koin Reserves: ', koin_reserves.numerator / koin_reserves.denominator)
```
```sh
Koin Reserves:  875956851.2107
USDT Reserves:  Percent {
  numerator: BigNumber { s: 1, e: 12, c: [ 8764493211385 ] },
  denominator: BigNumber { s: 1, e: 4, c: [ 10000 ] }
}
```

[Learn how to work with BigNumber.js](https://github.com/MikeMcl/bignumber.js)