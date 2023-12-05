// Packages required for this application.
const PORT = process.env.PORT || 8081;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// Load existing notes from file.
let savedNotes = require('./db/db.json');

// Middlewares for serving static files and parsing request bodies.
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for serving the main page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// Route for serving the notes page.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API route for getting all notes.
app.get('/api/notes', (req, res) => {
    res.json(savedNotes.slice(1));
});

// Function to create a new note.
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray)) notesArray = [];

    if (notesArray.length === 0) notesArray.push(0);
    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

// API route for creating a new note.
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, savedNotes);
    res.json(newNote);
});

// Function to delete a note.
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        if (notesArray[i].id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
}

// API route for deleting a note.
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, savedNotes);
    res.json(true);
});

// Universal catch all route for any other request and redirect to main page.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Server and listen on the specified port.
app.listen(PORT, () => {
    console.log(`Application running at ${PORT}!`);
});


