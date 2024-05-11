const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on("error", (error) => { console.error(error) })
db.once("open", () => console.log("Oi mo, o banco ta conectadozizinho"))
