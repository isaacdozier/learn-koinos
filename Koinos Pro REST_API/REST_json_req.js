const axios   = require('axios')
const process = require('process')
                require('dotenv').config();

let url    = process.argv.splice(2,process.argv.length).join('/')
let config = {
     headers:{
          'X-API-KEY': process.env.KOINOS_PRO_API_KEY
     }
}
axios.get(url,config)
     .then((res)    => {
          console.log(JSON.stringify(res.data))
     })
     .catch((error) => {
          throw error
     })
     .finally(()    => {
          console.log(JSON.stringify({end : new Date()}))
     })
     