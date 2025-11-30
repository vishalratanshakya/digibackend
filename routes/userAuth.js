const jwt = require("jsonwebtoken")

const  authenticateToken =  (req, res, next) => {                                                                      // "next" here is jab const  authenticateToken ka poora kaam ho jayega tab aaage kiya hone hai yeh yeh batata hai or jo next request hogi uspe kaam krega
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split (" ")[1]                                                                   // split the bearer and the token
    if (token == null){
        return res.status(401).json ({message : "Authentication token required"})

    }
    jwt.verify(token, "bookstore123" , (err,user) =>{
                                                                                                                                                                                                            //jwt is using its verify method ki jo authoriaztion token header me aaya hai postman ke wo sahi h ki nahi
                                                                                                                                                                                                         //bookstore123 is the key   used fro encryption and dcryption for our token
        if (err){
            return res.status(403).json({message : "Token Expired, Please SignIn Again"})

        }
        req.user = user
        next();                                                                                                                                                                     //authenticate token  ek middleware hai between client and server jb request jayegi client se middleware pe phir authenticate wala kaam hoga if i is successfull toh aage bheja server pe 
    });
};
module.exports = { authenticateToken}