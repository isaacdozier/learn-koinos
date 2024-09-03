const { spawn } = require('child_process');
const uuid      = require('uuid');
const fs        = require('fs')
const readline  = require('readline')
const path      = require('path')
const axios   = require('axios')

const each = require('foreach');

const envPath = path.join(__dirname, '.env');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const koindx_list_json_url = 'https://raw.githubusercontent.com/koindx/token-list/main/src/tokens/mainnet.json'
let koindx_list = {}

let state = {
    wallet : '',
    data   : {}
}

function watchState(state, onChange) {
    return new Proxy(state, {
        set: function(target, property, value, receiver) {
            if (typeof value === 'object' && value !== null) {
                target[property] = watchState(value, onChange);
            } else {
                target[property] = value;
            }
            onChange(target);
            return true;
        }
    });
}
let watchedState = watchState(state, dashboard);

async function load(){
    await api_key_req()
    await wallet_address_req()

    await axios.get(koindx_list_json_url)
    .then((res) => {
        koindx_list = res.data.tokens
    })
    
    if(state.wallet){
        watchedState.data = { mana : '', token : {} }
        manaCheck
        tokenCheck
    }   
}

const tokenCheck = setInterval(async () => {
    each(koindx_list, function (value, key, object) {
        if(value.address == 'koin'){value.address = '15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL'}
        spawnInstance(uuid.v4(), ['koilib_read.js', state.wallet, value.address], value.symbol)
    });
}, 15000)


const manaCheck = setInterval(async () => {
    spawnInstance(uuid.v4(), ['REST_json_req.js', state.wallet, 'mana'])
}, 3000)

const instances = {}
function spawnInstance(id, route, name) {
    try {
        instances[id] = {
            spawn: spawn('node', route),
            start: new Date()
        };

        instances[id]['name'] = name

        instances[id]['spawn'].stdout.on('data', (data) => {
            let json = safeJSON(data.toString());

            if (json && json.res && json.req === 'mana') {

                if (!watchedState.data) watchedState.data = {};
                watchedState.data.mana = json.res;

            } else if (json && json.res && json.req) {

                if (!watchedState.data.token) watchedState.data.token = {};
                watchedState.data.token[instances[id]['name']] = json.res

            }
        });

        instances[id]['spawn'].stderr.on('data', (error) => {
            instances[id]['error'] = `${error}`;
        });

        instances[id]['spawn'].on('close', (code) => {
            delete instances[id];
        });

    } catch (error) {
        console.error(`Failed to spawn instance ${id}:`, error);
    }
}

function safeJSON(data) {
    if (typeof data !== 'string') {
        return {}
    }

    try {
        const json = JSON.parse(data)
        return json;
    } catch (error) {
        return {}
    }
}

function dashboard() {
    process.stdout.write('\x1B[2J\x1B[0f');

    console.log("┌──────────────────────────────────────────────────┐");
    console.log("│ Welcome to Open-K                                │");
    console.log("│ A Koinos Network CMS                             │");
    console.log("│ Built by Isaac Dozier                            │");
    console.log("└──────────────────────────────────────────────────┘");

    console.log(`│_Wallet_[ ${watchedState.wallet    || 'loading'} ]`);
    console.log(`│   Mana:  ${watchedState.data.mana  || 'loading'}`);
    console.log(`│`)
    console.log(`│_Tokens_ `)

    each(state.data.token, function (value, key, object) {
        if(value > 0)
            console.log(`│   ${key} : ${value}`);
    })

    const now = new Date();
    console.log(`\nLast Updated: ${now.toLocaleTimeString()}`);
}

function getUserInput(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (input) => {
        resolve(input);
        });
    });
}

async function api_key_req() {
    let api_exist = readEnvFile()
    if(!api_exist)
        try {
            const api_key = await getUserInput("Enter API key: ")
            const data = `${api_key}`
            update_env(data)
            return
        } catch (err) {
            console.error('err:', err);
        }
}

async function wallet_address_req() {
    try {
        const wallet = await getUserInput("Enter Wallet Address: ")
        state.wallet = wallet
    } catch (err) {
        console.log('err:', err)
    }
}

function update_env(k) {
    let result = readEnvFile()
    const type = 'KOINOS_PRO_API_KEY = '
    result = type + k;
    fs.writeFileSync(envPath, result, 'utf8')
}

function readEnvFile() {
    try {
        return fs.readFileSync(envPath, 'utf8')
    } catch (error) {
        if (error.code === 'ENOENT') {
            return ''
        }
        throw error
    }
}

load()