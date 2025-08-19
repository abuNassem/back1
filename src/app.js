
const express=require('express')
const cors=require('cors')
const path=require('path')
const urlPublic=path.join(__dirname,'../public')
require('../db/db')
const Router = require('../router/router')

const app=express()
app.use(cors());
app.use(express.json())
app.use(Router)
app.use(express.static(urlPublic))

const port=process.env.PORT||3000
app.listen(port,()=>{
    console.log(`http://localhost:${port}/productapi`)
        console.log(`http://localhost:${port}/category`)

})
