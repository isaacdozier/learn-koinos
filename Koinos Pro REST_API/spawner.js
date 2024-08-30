const { spawn } = require('child_process');
const uuid      = require('uuid');

const instances = {}

function load(wallet){
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

function spawnInstance(id,start,wallet,route) {
    instances[id]          = spawn('node', route)
    instances[id]['start'] = start
    instances[id]['wallet'] = wallet

    instances[id].stdout.on('data', (data) => {
        let json = safeJSON(data.toString())

        if(json.value)
            instances[id]['value'] = `${json.value}`

        if(json.end)  
            instances[id]['end']   = `${json.end}`
    });

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
        const json = JSON.parse(data);
        return json;
    } catch (error) {
        return {};
    }
}

function dashboard(id){
    process.stdout.write('\x1B[2J\x1B[0f');

    console.log('] Welcome to Open-K ')
    console.log('] A Koinos Network CMS')

    
        const start  = instances[id].start
        const wallet = instances[id].wallet
        const mana   = instances[id].value
        const end    = instances[id].end
        const error  = instances[id].error

        if (start && end || mana) {
            const ping  = new Date(end) - new Date(start) 
            let display_ping = ping ? ping + 'ms' : ' error'
                   
            console.log('] Ping: ' + display_ping)
            console.log('')
            console.log('  Wallet: ' + wallet)
            console.log('    Mana: ' + mana)
        } 

        if (error) console.log('   ERROR: ' + error)
    
}

load('15tagV4TF6AawesDrWNmzsTp64wWr1oQet','mana')