const { spawn } = require('child_process');
const uuid      = require('uuid');
const fs        = require('fs')
const readline  = require('readline')
const path      = require('path')

const envPath = path.join(__dirname, '.env');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
 
const instances = {}

async function load(){
    await api_key_req()
    const wallet = await wallet_address_req()
    if(wallet){
        try { 
            setInterval(async () => {
                const id      = uuid.v4()
                const start   = new Date()
                const route = [
                    'REST_json_req.js', 
                    'https://api.koinos.pro', 'v1', 'account', wallet, 'mana'
                ]
                spawnInstance(id,start,wallet,route)
            }, (1000 * 3))

        } catch (error) {
            console.error("Loop Error:", error)
        }
    }
}

function spawnInstance(id,start,wallet,route) {
    instances[id]           = spawn('node', route)
    instances[id]['start']  = start
    instances[id]['wallet'] = wallet

    instances[id].stdout.on('data', (data) => {
        let json = safeJSON(data.toString())

        if(json.value){
            instances[id]['value'] = `${json.value}`
        }

        if(json.end){
            instances[id]['end']   = `${json.end}`
        }
    })

    instances[id].stderr.on('data', (error) => {
        instances[id]['error'] = `${error}`
    });

    instances[id].on('close', (code) => {
        dashboard(id)
        delete instances[id]
    });
}

function safeJSON(data) {
    if (typeof data !== 'string') {return {}}

    try {
        const json = JSON.parse(data)
        return json;
    } catch (error) {
        return {}
    }
}

//Display
function dashboard(id){
    process.stdout.write('\x1B[2J\x1B[0f');

    console.log('] Welcome to Open-K ')
    console.log('] A Koinos Network CMS')
    console.log('] Built by Isaac Dozier')
    
        const start  = instances[id].start
        const wallet = instances[id].wallet
        const mana   = instances[id].value
        const end    = instances[id].end
        const error  = instances[id].error

        if (start && end || mana) {
            const ping  = new Date(end) - new Date(start) 
            let display_ping = ping ? ping + 'ms' : ' error'
            
            console.log('] koinos.pro => Ping: ' + display_ping)
            console.log('')
            console.log('  Wallet: ' + wallet)
            console.log('    Mana: ' + mana)
        } 

        if (error) console.log('   ERROR: ' + error)
    
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
        return `${wallet}`
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