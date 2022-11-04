require('dotenv').config()
const { connect } = require('mongoose')
const { MONGO_URL } = process.env

const dbConnection = async () => {
  try {
    const db = await connect(MONGO_URL)
    console.log(`db connected to ${db.connection.name}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = dbConnection