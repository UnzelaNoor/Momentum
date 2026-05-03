const asyncHandler = require('express-async-handler') // Alternative to the try-catch block

const Note = require('../models/noteModel')
const User = require('../models/User')

// @desc Fetch all the notes of a particular user
// @route GET /api/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).json(notes);
});

// @desc  Post a note
// @route POST /api/notes
// @access Private
const postNote = asyncHandler(async (req, res) => {
    console.log('req.body:', req.body)
    console.log('req.user:', req.user)
    if (!req.body.title) {
        res.status(400);
        throw new Error('Please add a title.');
    }
    const note = await Note.create({
        user: req.user.id,
        title: req.body.title,
        text: req.body.text || '',
        category: req.body.category || '',
        lastEdited: new Date().toLocaleDateString('en-GB')
    });
    res.status(201).json(note);
});

// @desc Modify a note
// @route PATCH /api/notes/:id
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)
    if (!note) {
        res.status(404)
        throw new Error('Note not found.')
    }

    const user = await User.findById(req.user.id)
    if (!user){
        res.status(401)
        throw new Error('User not found.')
    }

    if (note.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized.')
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedNote)
})

// @desc Delete a note
// @route DELETE /api/notes/:id
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)
    if (!note) {
        res.status(404)
        throw new Error('Note not found.')
    }

    const user = await User.findById(req.user.id)
    if (!user){
        res.status(401)
        throw new Error('User not found.')
    }

    if (note.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized.')
    }

    await note.deleteOne()
    res.status(200).json({ id: req.params.id })
})

module.exports= {
    getNotes,
    postNote, 
    updateNote,
    deleteNote,
}