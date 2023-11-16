const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected:".cyan.bold + conn.connection.host.red.bold);
  } catch (error) {
    console.log("error" + error.message);
    process.exit();
  }
};

module.exports = connection;
