const express = require('express')
const router = express.Router()
const {getNotes, postNote, updateNote, deleteNote} = require('../controllers/noteController.js')

const { protect } = require('../middleware/authMiddleware');
router.route('/').get(protect, getNotes).post(protect, postNote)
router.route('/:id').patch(protect, updateNote).delete(protect, deleteNote)

module.exports = router