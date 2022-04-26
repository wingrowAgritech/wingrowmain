const express = require('express')
const app = express();
const mongoose = require('mongoose');
require('dotenv/config')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const Inward = require('./models/Inward')
const Outward = require('./models/Outward')
const User = require('./models/User')
const router = express.Router()
const cors = require('cors');
const bcrypt = require('bcryptjs/dist/bcrypt');


app.use(cors());
app.use('/', router);

router.use(cors())

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true , useUnifiedTopology: true} , console.log("connected to db"));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/inward' , async(req,res)=>{
    const inwardData = await Inward.find()
    res.send(inwardData)
})

router.get('/outward' , async(req,res)=>{
    const outwardData = await Outward.find()
    res.send(outwardData)
})


//register route
                                                               
router.post('/register' , async(req,res)=>{
    
    const { fname , lname , email , password , phone } = req.body;

    if(!fname || !lname || !email || !password || !phone){
        return res.status(422).json({error:"please fill the fields properly"})
    }

    try {
        const userExist = await User.findOne({email:email})

        if(userExist){
            return res.status(422).json({error:"email already exists"})
        }

        const user = new User({fname , lname , email , password , phone})
        
        await user.save();
        res.status(201).json({message:"user registered succesfully"})
    } catch (error) {
        console.log(error)
    }
})

//login route

router.post('/signin', async(req,res)=>{
    console.log(req.body)
    try {
        const { phone , password} = req.body
        if(!phone || !password){
            return res.status(400).json({error:"data invalid"})
        }

        const userLogin = await User.findOne({phone:phone});

        if(userLogin){
            const isMatch = await bcrypt.compare(password , userLogin.password)

            const token = await userLogin.generateAuthToken()
            console.log(token)

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+2589200000),
                httpOnly:true
            });


            if(!isMatch){
                return res.status(400).json({error:"invalid Credentials"})
            }else{
                res.json({message:"signin successful"})
            }
            
        }else{
            return res.status(400).json({error:"invalid Credentials"})
        }
        
    } catch (error) {
        console.log(error)    
    }
})


router.post('/inward' ,async(req,res)=>{
    const {farmer_name , farmers_market ,data, mobile_num} = req.body
    const inwardData = await Inward.findOne({farmer_name,farmers_market,mobile_num})
    if(!inwardData){
        const response = {...req.body}
        const {data} = response;
        data.forEach((e)=>{
            response.total_cummulative_purchase=e.total_purchase
        })
        try {
            const inward = new Inward(response)
            console.log(inward)
            const createInward = await inward.save();
            res.status(201).send(createInward);
        } catch (error) {
            res.status(404).send(error)
        }
    }else{
        let cummPurchase
        let obj;
        data.forEach((e)=>{
            cummPurchase=e.total_purchase
            obj={...e}
        })
        try {
            const query = {farmer_name,farmers_market,mobile_num}
            const update = {"$push": { "data": obj } , $inc:{total_cummulative_purchase:cummPurchase}}
            const options = { returnNewDocument: true };
            const inwardreq = await Inward.findOneAndUpdate(query, update, options)
            const reqData = await inwardreq.save()
            res.status(201).send(reqData);
        } catch (error) {
            res.status(404).send(error)
        }
    }
})


router.post('/outward',async(req,res)=>{
    const {farmer_name , farmers_market , data , mobile_num} = req.body
    const outwardData = await Outward.findOne({farmers_market,mobile_num,farmer_name})

    if(!outwardData){
        const response = {...req.body}
        const {data} = response;
        data.forEach((e)=>{
            response.total_cummulative_sales=e.total_sales
            response.wingrow_sc=e.sales_quantity
        })
        console.log(response)
        try {
            const outward = new Outward(response)
            const createOutward = await outward.save();
            res.status(201).send(createOutward);
        } catch (error) {
            res.status(404).send(error)
        }
    }else{
        let cummSales = 0
        let sumSc = 0
        let obj;
        data.forEach((e)=>{
            cummSales=e.total_sales
            sumSc=e.sales_quantity
            obj={...e}
        })

        try {
            const query = {farmer_name,farmers_market,mobile_num}
            const update = {
                "$push": { "data": obj },
                $inc:{total_cummulative_sales:cummSales,wingrow_sc:sumSc}}
            const options = { returnNewDocument: true };
            const outwardreq = await Outward.findOneAndUpdate(query, update, options)
            const reqData = await outwardreq.save()
            res.status(201).send(reqData);
        } catch (error) {
            res.status(404).send(error)
        }
    }
})


    if(process.env.NODE_ENV == "production"){
        app.use(express.static('client/build'))
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}!!!!!!!!!`);
    });

