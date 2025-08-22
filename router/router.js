const express =require('express')
const schemaProduct = require('../model/schemaProduct')
const schemaCategory = require('../model/schemaCategory')
const schemaPurchases = require('../model/schemaPurchases')
const schemaUsers = require('../model/schemaUsers')
const bcrypt=require('bcrypt')

const Router=express.Router()

Router.get('/',async(req,res)=>{
    
    res.send('welcom in home page')
})

// show all product
Router.get('/productapi', async (req, res) => {
  try {
    if (req.query.cat_prefix) {
      const filterValue = req.query.cat_prefix;
      // نفترض أنك تريد فلترة حسب حقل معين، مثلاً cat_prefix
      const filteredData = await schemaProduct.find({ cat_prefix: filterValue });
      return res.json(filteredData);
    } else {
      const allData = await schemaProduct.find();
      return res.json(allData);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// show one product
Router.get('/productapi/:id', async (req, res) => {
  const id = Number(req.params.id);  // تحويل النص إلى رقم
  const data = await schemaProduct.findOne({ id });
  if (!data) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(data);
  console.log('added to server');
});

// to up date element
Router.patch('/productapi/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body; 

    const updatedProduct = await schemaProduct.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// show allcategory
Router.get('/category',async(req,res)=>{
  try{
    const data=await schemaCategory.find({})
    res.json(data)
    console.log('no error')
  }catch(error){
    console.log(error)
}
}
)
 

// get users

Router.get('/users',async(req,res)=>{
  try{
    const data=await schemaUsers.find()
    res.status(200).json(data)
  }
  catch(error){
    res.status(400).json({message:error})
  }
})

// send users
Router.post('/users',async(req,res)=>{
  const {email,passWord,userName}=req.body
      const strongPassWord=await bcrypt.hash(passWord,10)
  try {
    const newUser = new schemaUsers({email:email,passWord:strongPassWord,userName:userName,items:[]});
    await newUser.save();
    
    res.status(201).send({ message: 'User created successfully',user:{userName:newUser.userName,email:newUser.email} });
  } catch (err) {
    // لو خطأ تحقق من البيانات
    if (err.name === 'ValidationError') {
      // هنا نرجع أول رسالة خطأ من الفاليديشن
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).send({ error: firstError });
    }

    // لو إيميل مكرر (unique)
    if (err.code === 11000) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    // أي خطأ آخر
    res.status(500).send({ error: 'Server error' });
  }

  
})

Router.patch('/users:id',(req,res)=>{
  const updateData=req.body
  const id=req.params
  const allowKey=Object.keys(schemaUsers.schema.paths)
  console.log(allowKey)
  const keys=Object.keys(updateData)
  
  schemaUsers.updateOne
  

  
  console.log(updateData)

})



Router.post('/login', async(req, res) => {
  const sendedEmail = req.body.email;
  const sendedPassWord = req.body.passWord;

try{
  
const user= await schemaUsers.findOne({ email: sendedEmail })

if(!user){ res.status(400).json({ message: 'this email not found or uncorrect' });}


const isCorrect=await bcrypt.compare(sendedPassWord,user.passWord)

if(!isCorrect){
   res.status(400).json({ message: 'password incorrect' });
}



 res.status(200).json({
          message:'login successfully',
          user: {
            email: user.email,
            userName: user.userName
          }})
  
}
catch(error){
  console.log(error)
}
 
});

// to  post product  to  user  

Router.post('/chosen/:email',(req,res)=>{
  const chosenItem=req.body
  const email=req.params.email
  const updateChosen={
    ...chosenItem,
    isInCart:true,
    quantity:1,
  }
    schemaUsers.findOneAndUpdate({email:email},{$push:{items:updateChosen}},{new:true})
  .then(product=>{
    
    res.status(200).json(product)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })


})

// to delete product from user

Router.delete('/chosen/:email/:id',(req,res)=>{
  const {email,id}=req.params
  
  schemaUsers.findOneAndUpdate({email:email},{$pull:{items:{id:Number(id)}}},{new:true})
  .then(user=>{
    res.status(200).json(user)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })
})

Router.get('/chosen/:email',async(req,res)=>{
  const email=req.params.email
 const data= await schemaUsers.findOne({email:email})
  res.json(data)
})

// delete all chosen
Router.delete('/chosen/:email',(req,res)=>{
  const email=req.params.email
   schemaUsers.findOneAndUpdate({email:email},{$set:{items:[]}},{new:true})
  .then(product=>{
    res.status(200).json(product)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })
})

Router.patch('/chosen/:email/:id',(req,res)=>{
  const {email,id}=req.params
  const mode=req.body.mode
if(mode=='inc'){
  schemaUsers.findOneAndUpdate({email:email,"items.id":id},{$inc:{"items.$.quantity":1}},{new:true})
  .then(data=>{
    res.status(200).json(data)
  })
  .catch(error=>{
    res.status(400).json({message:error})})
}else{
    schemaUsers.findOneAndUpdate({email:email,"items.id":id},{$inc:{"items.$.quantity":-1}},{new:true})
    .then(data=>{
    res.status(200).json(data)
  })
  .catch(error=>{
    res.status(400).json({message:error})})
}
})

// add item to  favorit
Router.post('/favorit/:email',(req,res)=>{
  const favoItem=req.body
  const email=req.params.email
  schemaUsers.findOneAndUpdate({email:email},{$push:{favorit:favoItem}},{new:true})
  .then(data=>{
    console.log(data)
    res.status(200).json(data)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })
})

// list favorit's user
Router.get('/favorit/:email',(req,res)=>{
  const email=req.params.email
  schemaUsers.findOne({email:email})
  .then(data=>{
    
    res.status(200).json(data.favorit)
  })
  .catch(error=>{
    res.status(400).json({message:error})
  })
})

Router.delete('/favorit/:email/:id', async (req, res) => {
  const { id, email } = req.params;
  try {
    const user = await schemaUsers.findOneAndUpdate(
      { email: email },
      { $pull: { favorit: { id: Number(id) } } }, // خليه string لو في الداتا string
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
console.log(user.favorit)
    res.status(200).json(user.favorit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


Router.post('/orders/:email', async (req, res) => {
  const email=req.params.email
  const data = req.body;

  try {
  
    if (!data.address || !data.name || !data.phone) {
      return res.status(400).json({ message: 'One or more required fields are missing' });
    }

    // حساب السعر الإجمالي
    const arryOfPrice = data.items.map(ele => ele.quantity * (Number(ele.price) - Number(ele.discount || 0)));
    const totalPrice = arryOfPrice.reduce((curr, total) => curr + total, 0);

    const now = new Date();
    const orderId = now.getTime();

    // إنشاء الطلب
     const order= {
      orderId: orderId,
      address: data.address,
      fullName: data.name,
      phone: data.phone,
      items: [...data.items],
      totalPrice: totalPrice,
      priceWithDelavery:totalPrice+20,
      status: 'pending',
      dateOrder: now.toISOString() 
    }
    const newOrder = await schemaUsers.findOneAndUpdate({email:email},{$push:{orders:order}});

   return res.status(200).json(newOrder.orders);

  } catch (error) {
    if (error.code === 11000) { // مفتاح مكرر
      return res.status(400).json({ message: 'Your data already exists' });
    }

  return  res.status(500).json({ message: 'Server error' });
  }
});

Router.get('/orders/:email', async (req, res) => {
  const email=req.params.email
  try {
    const orders = await schemaUsers.findOne({email:email});
    console.log(orders)
    res.status(200).json(orders.orders);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});


module.exports=Router