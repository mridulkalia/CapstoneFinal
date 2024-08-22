const mongoose = require("mongoose");

const database = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "Database Connected",
      mongoose.connection.name,
      mongoose.connection.host
    );
  } catch (error) {
    console.log("Error connecting to database...");
    throw new Error(error);
  }
};

module.exports = database;
