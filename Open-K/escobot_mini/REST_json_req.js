const axios   = require('axios')
const process = require('process')
                require('dotenv').config();

let base   = 'https://api.koinos.pro/v1/account/'
let config = {
     headers:{
          'X-API-KEY': process.env.KOINOS_PRO_API_KEY
     }
}

let url = base + process.argv[2] + '/' + process.argv[3]

axios.get(url,config)
.then((res)    => {
     console.log(JSON.stringify({
            req : process.argv[3],
            res : res.data.value, 
            end : new Date()
        }))
})
.catch((error) => {
     console.log(JSON.stringify({error: error}))
})
.finally(()    => {
     console.log(JSON.stringify({end : new Date()}))
})