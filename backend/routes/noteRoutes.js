const { addNote, getNotes } = require("../controllers/notesController")

const { Router } = require("express")

const router = Router();

router.post("/addNote", addNote)

router.post("/getNotes", getNotes)

module.exports = router