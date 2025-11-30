const router = require ("express").Router()
const User = require("../models/user")
const {authenticateToken} = require("./userAuth")


//add book to favourites
router.put("/add-book-to-favourite", authenticateToken, async (req,res) => {
try{
const {bookid , id} = req.headers;
const userData = await User.findById(id)
const isBookFavourite = userData.favourites.includes(bookid);
if(isBookFavourite){
    return res.status(200).json ({message : "This Book Is Already In Your Favourites"})
}
await User.findByIdAndUpdate(id, {$push:{favourites: bookid }})
return res.status(200).json ({message : "This Book Is Added To Your Favourites"})

} catch(error){
    res.status(500).json ({message : "Internal Server Error"})
}
})

//delete book from your favourite
router.put("/remove-book-from-favourite", authenticateToken, async (req,res) => {
    try{
    const {bookid , id} = req.headers;
    const userData = await User.findById(id)
    const isBookFavourite = userData.favourites.includes(bookid);
    if(isBookFavourite){
        await User.findByIdAndUpdate(id, {$pull:{favourites: bookid }})

    }
    return res.status(200).json ({message : "This Book Has Been Removed From Your Favourites"})
    
    } catch(error){
        res.status(500).json ({message : "Internal Server Error"})
    }
    })

//api for fetching favourite books of user   

router.get("/get-favourite-books", authenticateToken, async (req,res) => {
    try{
    const { id} = req.headers;
    const userData = await User.findById(id).populate("favourites")                                                                                     // populate gere will give all details of book like price wagera but agar ham populatre nause kre toh sirf hame status success dega or data ke andar hame sirf id hi dega
    const favouriteBooks = userData.favourites
    return res.json ({status: "Success" , data :favouriteBooks, })
    
    } catch(error){
        res.status(500).json ({message : "Internal Server Error"})
    }
    })

module.exports = router;