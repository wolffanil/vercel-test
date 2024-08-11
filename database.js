const db = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

db.connect(process.env.MONGODB_URL);
module.exports = db;
