const router = require ("express").Router() //exprress se server ka  route ban rha hai
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./userAuth")

//sign up
router.post("/sign-up", async (req,res) =>{                                                                         //async matlab ek baari me ek hi request handle hogi
    try{
        const{username,email,password,address} = req.body                                                                             //req.body is the input in form of json in postman

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Please provide a valid email address"})
        }

        if(!passwordRegex.test(password)){
            return res.status(400).json({message:"Password must be at least 8 characters long and include uppercase, lowercase and a special character"})
        }

        //check what usernmae length is more than 4
        if(username.length < 4){
            return res.status(400).json({message:"Username length should be greater than 3"})
        }
      //chek username already exisi or not?
      const existingUsername = await User.findOne({username:username})

  if(existingUsername){
    return res.status(400).json({message:"Username already exists"})

  }

  //chek email already exisi or not?
  const existingEmail = await User.findOne({email:email})

  if(existingEmail){
    return res.status(400).json({message:"Email already exists"})

  }

  //check password length
  if(password.length<= 5){
    return res.status(400).json({message:"Password's length should be greater than 5 "})
  }
  const hashPass = await bcrypt.hash(password, 10);

  const newUser = new User({                                                                                                        //User model ke andar jo User.js hai uske liye ek naya naya user ban jayega
    username:username,
    password:hashPass,
    email:email,
    address : address,
});
    await newUser.save();
    return res.status(200).json ({message:"SignUp is Successfull"});




    }catch(error){
      console.log(error)
        res.status(500).json({message:"Internal Server Error"});
    }
})


                                                                                                                                    //Sign In jb sign in karenge tab ek token generate hoga, is token ke through authorization hpora hai
router.post("/sign-in", async (req,res) =>{
  try{
       const {username,password} = req.body;

       const exsistingUser = await User.findOne({username})
       if(!exsistingUser){
        return res.status(400).json({message:"Invalid Credentials"});

       }

              await bcrypt.compare(password, exsistingUser.password , (err,data) => {
                if (data){

                  const authClaims = [{                                                                                         // authClaims = jwt ke liye input hai jo encrpt hioga or hame token dega
                    name:exsistingUser.username},
                    {role:exsistingUser.role}]                                                                                              // yaha role check krega ki useer hai ya admin

                  const token = jwt.sign({authClaims}, "bookstore123", {expiresIn:"30d"})                         //jwt.sign({authClaims} token generate kkra hai acc to the role , role = user ya admin
                  res.status(200).json({id: exsistingUser._id, role : exsistingUser.role,token:token })
                }
                else{
                  res.status(400).json({message:"Invalid Credentials"})
                }
              })

  }
      catch(error){
      res.status(500).json({message:"Internal Server Error"});
  }
})

//get user information to show on frontend
router.get("/get-user-information", authenticateToken, async (req,res)=>{
  try{
  const{id} = req.headers;                                                                                                            //headers yaha pe wo headers hai jo ham postman me dalte hai 
  const data = await User.findById(id).select('-password')                                                                                          // - sign here means to exclude the password
  return res.status(200).json(data)

  } catch(error){
    res.status(500).json({message: "Internal Server Error"})
  }
})

//update address
router.put("/update-address" , authenticateToken , async (req,res) => {
  try{
    const{id} = req.headers;
    const {address} = req.body
    await User.findByIdAndUpdate(id,{address : address})
    return res.status(200).json({message :"Your Address Has Been Updated Successfully" })
  } catch (error){
    res.status(500).json({message: "Internal Server Error"})

  }
})




module.exports=router;