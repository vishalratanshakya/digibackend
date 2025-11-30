const mongoose = require("mongoose") //importing mongoose mongoose is an library jo ham bolte hai vhi mmongodb me bnadeta hai
const book = new mongoose.Schema(
    {
        url:{ // url of img
            type:String,
            required: true,

        },

        title:{
            type:String,
            required: true,

        },
        author:{
            type:String,
            required: true,

        },
        price:{
            type:Number,
            required: true,

        },
        desc:{
            type:String,
            required: true,

        },
        language:{
            type:String,
            required: true,

        },
        category:{
            type:String,
            default:"General",
        },
        rating:{
            type:Number,
            default:0,
        },},
{timestamps: true}
);
module.exports = mongoose.model("books", book)