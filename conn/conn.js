const mongoose = require("mongoose")                                                                                            //This line imports the Mongoose library into the project. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
const conn = async() =>{
    try{
await mongoose.connect(`${process.env.MONGO_URI}`)                                                         // The connection URI is retrieved from an environment variable named URI. This variable typically contains the full MongoDB connection string, which includes the protocol (mongodb+srv), username, password, cluster address, and database name. By using process.env.URI, the actual URI value is pulled from the environment, keeping it secure and separate from the codebase.
                                                                                                        //This method attempts to establish a connection to MongoDB using the connection URI provided. It returns a promise that either resolves if the connection is successful or rejects if there’s an error
console.log('Connected To Database');

    }catch (error){
        console.log(error);
        
    }
}
conn()