import Note from "../models/note.model.js";
import { errorHandler } from "../utils/error.js";

import multer from "multer";
import path from "path";

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads will be stored in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });
export { upload };

// Add Note Function (Now Supports Image Upload)
export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { id } = req.user;
  const image = req.file ? `/uploads/${req.file.filename}` : ""; // Store image path

  if (!title) return next(errorHandler(400, "Title is required"));
  if (!content) return next(errorHandler(400, "Content is required"));

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: id,
      image, // Store the image path in DB
    });
    await note.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Edit Note Function (Now Supports Image Update)
export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) return next(errorHandler(404, "Note not found"));
  if (req.user.id !== note.userId)
    return next(errorHandler(401, "You can only update your own note!"));

  const { title, content, tags, isPinned } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : note.image; // Update image if provided

  if (!title && !content && !tags && isPinned === undefined && !req.file) {
    return next(errorHandler(400, "No changes provided"));
  }

  try {
    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
    note.image = image; // Update image

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Getall Notes function

export const getAllNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const notes = await Note.find({ userId: userId }).sort(
      { isPinned: -1 },
      { createdAt: 1 }
    );
    res.status(200).json({
      success: true,
      message: "All notes retrieved successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

//deleteNote function
export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });

    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }

    await Note.deleteOne({ _id: noteId, userId: req.user.id });
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//updateNotePinned function

export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return next(errorHandler(404, "Note not found!"));
    }
    if (req.user.id !== note.userId.toString()) {
      return next(errorHandler(401, "You can only update your own Note!"));
    }
    const { isPinned } = req.body;

    if (isPinned === undefined) {
      return next(errorHandler(400, "isPinned is required"));
    }

    note.isPinned = isPinned;

    await note.save();
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

//search note function

export const searchNote = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(errorHandler(400, "Search query is required"));
  }
  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    next(error);
  }
};
