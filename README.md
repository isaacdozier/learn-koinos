# How to access Koinos Blockchain Network

Koinos is made to be accessible to developers and users. With just a few lines of code, we can interact with the blockchain.

## Clone this repo

[How to Clone a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

```sh
git clone https://github.com/isaacdozier/learn-koinos.git
```

## Install Dependencies

[The Basics of Dependencies for Node.js & NPM](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/)

[Koindx V2-SDK Github Repo](https://github.com/koindx/v2-sdk)

[Koindx V2-SDK NPM Package](https://www.npmjs.com/package/@koindx/v2-sdk)

```sh
npm i @koindx/v2-sdk
```

## Run Examples

```sh
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
```

```sh
node src2.js
```

![src2 console output example](https://github.com/isaacdozier/learn-koinos/blob/main/src2%20console%20output.png)