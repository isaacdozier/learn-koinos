# How to access Koinos Blockchain Network with Node.js

Koinos is made to be accessible to developers and users. With just a few lines of code, we can interact with the blockchain.

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

Example 2: returns Koin token data

```javascript
const { ChainId, KOIN } = require("@koindx/v2-sdk");

async function go(){
    try{

        // KOIN can be declared directly with Koindx sdk
        const koin = new KOIN(ChainId.MAINNET);

        console.log(koin)

    } catch (error) {
        console.error(error);
    }
}

go()
```

```sh
node example_2.js
```

![src2 console output example](https://github.com/isaacdozier/learn-koinos/blob/main/img/src2%20console%20output.png)