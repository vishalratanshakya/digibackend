const mongoose = require("mongoose")
const order = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
         ref: "user", //user from models
    },
    book:{
        type:mongoose.Types.ObjectId,
         ref: "books",
    },
    status:{
        type:String,
        enum: [
            "Order Placed",
            "Processing",
            "Packed",
            "Dispatched",
            "Out for Delivery",
            "Out For Delivery",
            "Delivered",
            "Canceled",
            "ORDER_PLACED",
            "ORDER_CONFIRMED",
            "PROCESSING",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELED",
            "RETURNED",
            "REFUNDED",
            "FAILED",
        ],
        default:"ORDER_PLACED",
    },
    

},
{timestamps: true}
);
module.exports = mongoose.model("order", order)