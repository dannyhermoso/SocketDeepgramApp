const express = require("express")

const NoteRouter = require("./noteRoutes")

const router = express.Router()

router.use("/notes", NoteRouter);


module.exports = router