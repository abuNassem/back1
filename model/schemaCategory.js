
const mongo=require('mongoose')

const categorySchema= new mongo.Schema({
    id:{type:Number},
    title:{type:String},
    prefix:{type:String},
    img:{type:String}
})

module.exports=mongo.model('categories',categorySchema)