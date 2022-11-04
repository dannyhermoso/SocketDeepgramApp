require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./db.js");
const cors = require("cors");
const socket = require("socket.io");
const { Server } = require("socket.io")
const http = require("http")
const mongoose = require("mongoose");
const noteRoutes = require("./routes/noteRoutes");
const Sockets = require("./socket");
const { join, dirname } = require("path");
const { fileURLToPath } = require("url");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

  app.use("/notes", noteRoutes);


  const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', (socket) => {
  console.log(socket.id)

  socket.on('text', (text) => {
    console.log('text: ', text)
    socket.broadcast.emit('text', text)
  })

  socket.on('record', (text) => {
    console.log('record: ', text)
    socket.broadcast.emit('record', text)
  })

})

server.listen(PORT);
console.log(`server on port ${PORT}`);