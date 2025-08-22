
const express=require('express')
const cors=require('cors')
const path=require('path')
const urlPublic=path.join(__dirname,'../public')
require('../db/db')
const Router = require('../router/router')

const app=express()
app.use(cors({
  origin: ['http://localhost:4173','https://myecomercets.vercel.app','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true
}));

app.use(express.json())
app.use(Router)
app.use(express.static(urlPublic))

const port=process.env.PORT||3000
app.listen(port,()=>{
    console.log(`http://localhost:${port}/productapi`)
        console.log(`http://localhost:${port}/category`)

})
