const Note = require("../model/Note")


//Post a new note in MongoDB Atlas
module.exports.addNote = async (req, res) => {

    const newNote = req.body
    try{
        await Note.create(newNote)

        return res.status(200).json({ newNote: newNote })
    }
    catch(error){
        return res.status(500).json({ error: error })
    }
}

//Reutrn all notes ing MongoDB Atlas
module.exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({}) 

        return res.status(200).json({ notes: notes })
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}