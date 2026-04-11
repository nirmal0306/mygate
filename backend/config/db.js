// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.log("MongoDB Error:", error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;

    console.log("Mongo URI:", uri); // debug

    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;