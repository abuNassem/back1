const db = require('mongoose')
const schemaUsers = require('../model/schemaUsers')
require('dotenv').config()
const dburl=process.env.DB_URL

db.connect(dburl)
  .then(async() => {
    // schemaUsers.findOneAndUpdate({email:'qutaibah@gmail.com'},{$set:{favorit:[]}},{new:true})
    // .then(res=>{
    //   console.log(res)
    // })
     console.log('conacted succ')
   
  })
  .catch(error => {
    console.log(error)
  })

module.exports = db
