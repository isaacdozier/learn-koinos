# How to access Koinos Blockchain Network

Koinos is made to be accessible to developers and users. With just a few lines of code, we can interact with the blockchain.

## Clone this repo

```sh
git clone https://github.com/isaacdozier/learn-koinos.git
```

[How to Clone a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

## Install Dependencies

```sh
npm install @koindx/v2-sdk
```

[The Basics of Dependencies for Node.js & NPM](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/)

[Koindx V2-SDK Github Repo](https://github.com/koindx/v2-sdk)

[Koindx V2-SDK Examples](https://docs.koindx.com/sdk/v2-sdk/examples)

## Run Examples

Example 2: returns Koin token data

```sh
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

![src2 console output example](https://github.com/isaacdozier/learn-koinos/blob/main/src2%20console%20output.png)