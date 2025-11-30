//here the book that are in csaart are being transfered tto the order section which cant be deleted by the user or admin. here the books in the cart are being ordered.


const router = require("express").Router()
const {authenticateToken} = require ("./userAuth")
const Book= require("../models/book")
const Order = require("../models/order")
const User = require("../models/user")

//api for place order
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        const createdOrders = [];

        for (const orderData of order) {                                                                                                                            //jo orderdata hai postman me usme se har ek object ko lera hai or ek naya order-instance crrearte kkrra hai taki naya order creae ho jaye db me
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();
            createdOrders.push(orderDataFromDb);

            // Saving order in user model
            await User.findByIdAndUpdate(id, {                                                                                                           //jo model ke andat jo user.js hai usme order wale array ko iupdate kkra hai
                $push: { orders: orderDataFromDb._id },
            });

            // Clearing cart
            await User.findByIdAndUpdate(id, {                                                                                                      //ek baar order place hjo gya toh remove cart
                $pull: { cart: orderData._id },
            });
        }

        return res.json({
            status: "success",
            message: "Order Placed Successfully!",
            orders: createdOrders,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//api for getting order history of a user 
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
       const userData = await User.findById(id).populate({
        path : "orders",
        populate: {path : "book"},
       })

       const ordersData = userData.orders.reverse();
       return res.json ({
        status : "Success",
        data : ordersData,
       })
        
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


//get all order by admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
        .populate({
            path : "book",
        })
        .populate({
            path : "user",                                                                                                                                      //so admin could know which user it is
        })
        .sort({ createdAt : -1})
        return res.json ({
            status : "Success",
            data : userData,
        })
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//order update by addmin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
       const {id} = req.params;
       await Order.findByIdAndUpdate(id, {status : req.body.status})
       return res.json({
        status: "Success",
        message : "Status Updated Successfully"
       })
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// get single order by id (for tracking)
router.get("/get-order/:id", authenticateToken, async (req, res) => {
    try {
        const { id: userId } = req.headers;
        const { id } = req.params;
        const orderData = await Order.findById(id)
            .populate({ path: "book" })
            .populate({ path: "user" });

        if (!orderData) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // allow owner or admin to view
        if (orderData.user && orderData.user._id.toString() !== userId) {
            const currentUser = await User.findById(userId);
            if (!currentUser || currentUser.role !== "admin") {
                return res.status(403).json({ message: "Not Authorized" });
            }
        }

        return res.json({
            status: "Success",
            data: orderData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// cancel order (for user or admin)
router.delete("/delete-order/:id", authenticateToken, async (req, res) => {
    try {
        const { id: userId } = req.headers;
        const { id } = req.params;

        const orderData = await Order.findById(id);
        if (!orderData) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // allow owner or admin to cancel
        const ownerId = orderData.user.toString();
        if (ownerId !== userId) {
            const currentUser = await User.findById(userId);
            if (!currentUser || currentUser.role !== "admin") {
                return res.status(403).json({ message: "Not Authorized" });
            }
        }

        // only allow cancel when status is "Order Placed" or "Processing"
        const cancellableStatuses = ["Order Placed", "Processing", "ORDER_PLACED", "PROCESSING"]; 
        if (!cancellableStatuses.includes(orderData.status)) {
            return res.status(400).json({
                status: "Failed",
                message: "Order can no longer be canceled at this stage.",
            });
        }

        await Order.findByIdAndUpdate(id, { status: "Canceled" });

        return res.json({
            status: "Success",
            message: "Order Canceled Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router