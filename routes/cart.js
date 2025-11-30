const router = require ("express").Router()
const User = require("../models/user")
const {authenticateToken} = require("./userAuth")

router.put("/add-to-cart", authenticateToken, async (req,res) => {
    try{
        const {bookid , id} = req.headers;
    const userData = await User.findById(id)
    const isBookInCart = userData.cart.includes(bookid);                                               //yaha pe bookid hamere db me jo user ka cart ka array hai uspe chech hoga ki bookid hai ya nahi
    if(isBookInCart){
        return res.json ({
            status : "Success",
            message : "Book Is Already in Cart",
        })

    }
    await User.findByIdAndUpdate(id, {$push: {cart : bookid},})                                          //jab hame monggose ke andar cart ke array ko update rna hota hai push se hota hai wo
    return res.json ({
        status : "Success",
        message : "Book Added To Cart",
    })
    } catch(error){
        res.status(500).json ({message : "Internal Server Error"})
    }
    })

//deletion in cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req,res) => {
    try{
        const {bookid} = req.params;                                                                                //headers koi ni deekh sakta par param me deekh sakta hai yaha header bhi de sakte the
        const {id} = req.headers
        await User.findByIdAndUpdate(id, {$pull: {cart : bookid},})
{
        return res.json ({
            status : "Success",
            message : "Book Is Removed From Your Cart",
        })

    }
    } catch(error){
        res.status(500).json ({message : "Internal Server Error"})
    }
    })

//get user cart for a particular user
router.get("/get-user-cart", authenticateToken, async (req,res) => {
    try{
        const {id} = req.headers
       const userData =  await User.findByIdAndUpdate(id).populate("cart")                                                                                       //populate is used to show data of cart
       const cart = userData.cart.reverse()                                                                     // reverse is pushung the recent item of cart to top
{
        return res.json ({
            status : "Success",
            data : cart,
        })

    }
    } catch(error){
        res.status(500).json ({message : "Internal Server Error"})
    }
    })
module.exports = router;