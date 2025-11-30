const router = require ("express").Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth")
const Book = require("../models/book")

// add book by admin
router.post ("/add-book", authenticateToken, async(req, res) =>{
    try{
        const {id} = req.headers                                                                                                                                //this is to check if it is user or admin
       const user =  await User.findById(id)
       if(user.role !== "admin"){
       return res.status(400).json({message:"You Do Not Have Access To Perform Admin Work"});

       }

        const book = new Book({                                                                                 //jese peeche new user ban rha tha vese hi edhar naya book add hogi
                                                                                                                    // yeh url title author wagera sab nook.js from model me kyuki wo hamesha required rahengi
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
            category: req.body.category,
        })
await book.save()
res.status(200).json({message:"Book Added Successfully"});

    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
})

//updatebook
router.put("/update-book", authenticateToken,async (req,res) => {
    try{
        const {bookid} = req.headers;                                                                                   //headrs me se book id bhenjenge
        await Book.findByIdAndUpdate (bookid,{                                                                                  // book find karenge by findByIdAndUpdat
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,

        });
        return res.status(200).json ({
            message:"Book Updated Successfully!"
        });
        
    }
    catch(error){

        return res.status(500).json ({message: "An Error Occured!"})
    }
});

//deletion of a book
router.delete("/delete-book", authenticateToken,async (req,res) => {
    try{
        const {bookid} = req.headers;                                                                                                       //headrs me se book id bhenjenge
        await Book.findByIdAndDelete (bookid)

        
        return res.status(200).json ({
            message:"Book Deleted Successfully!"
        });
        
    }
    catch(error){

        return res.status(500).json ({message: "An Error Occured!"})
    }
});


//api to get all books with optional filters
router.get("/get-all-books",async (req,res) => {
    try{
        const { language, category, minPrice, maxPrice, sort, search, minRating } = req.query;

        const filter = {};
        if (language && language !== "All") {
            filter.language = language;
        }
        if (category && category !== "All") {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            const regex = new RegExp(search, "i");
            filter.$or = [
                { title: regex },
                { author: regex },
            ];
        }
        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "price_asc") {
            sortOption = { price: 1 };
        } else if (sort === "price_desc") {
            sortOption = { price: -1 };
        }

        const books = await Book.find(filter).sort(sortOption);                                                                                          // createdAt: -1 this wil show books at he top which were created latest 
        return res.json({status: "Success", data: books,})
     }
    catch(error){
        console.log("Error in /get-all-books:", error)
        return res.status(500).json ({message: "An Error Occured!"})
    }
});


                                                                                                                                                                //api to get Recently Added Books limit to 4 only matlab 4 hi books dikgayega main page pe
router.get("/get-recent-books",async (req,res) => {
    try{
        const books = await Book.find().sort({ createdAt: -1}).limit(4)                                                           // createdAt: -1 this wil show books at he top which were created latest 
        return res.json({status: "Success", data: books,})
     }
    catch(error){
        console.log("Error in /get-recent-books:", error)
        return res.status(500).json ({message: "An Error Occured!"})
    }
});


                                                                                                                             //get book by id this will show book descripption "we will get book by id here"
router.get("/get-book-by-id/:id",async (req,res) => {
    try{
        const {id} = req.params;                                                                                                            // we are using parametrs here to get the id or we can also use heards to get the id
        const book = await Book.findById(id)
        return res.json({
            status:"Success",
            data:book,
        })
     }
    catch(error){

        return res.status(500).json ({message: "An Error Occured!"})
    }
});



module.exports = router;
