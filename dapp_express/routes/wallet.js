const express = require('express')
const router = express.Router()
const { Provider, Contract, utils } = require("koilib")
const BigNumber = require("bignumber.js")
const process = require('process')
require('dotenv').config()

const koilib_read = async function (req, res, next) {
  try {
    const provider = new Provider(["https://api.koinos.pro/jsonrpc/?apikey=" + process.env.KOINOS_PRO_API_KEY])
    const contract = new Contract({
      id: req.token,
      abi: utils.tokenAbi,
      provider
    })
    const token = contract.functions
    const { result } = await token.balanceOf({
      owner: req.address
    })

    req.balance = new BigNumber(result.value).dividedBy(1e8)
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/:address/:token', 

(req, res, next) => {
  req.address = req.params.address
  req.token   = req.params.token
  next()
}, 

koilib_read, 

(req, res, next) => {
  res.render('wallet', { 
    address: req.address, 
    token  : req.token,
    balance: req.balance
  })
});

router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

module.exports = router