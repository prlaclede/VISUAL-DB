const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

String.prototype.format = function () {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./local_notes/space.db"
    },
    useNullAsDefault: true
});


// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get columns
router.get('/columns', (req, res) => {
    let notesResults = knex.raw("PRAGMA table_info(SPACE);");
    notesResults.then(function (notes) {
        res.send(notes);
    });
});

// Get notes
router.get('/notes', (req, res) => {
    let notesResults = knex.select("*").from("SPACE");
    notesResults.then(function (notes) {
        res.send(notes);
    });
});

router.post('/note/save', function (req, res) {
    let note = req.body;
    let noteSave = knex("SPACE")
        .insert({
            DATE: note.date,
            TITLE: note.title,
            NOTE: note.note,
            PARENT: note.parent
        });
    noteSave.then(function (status) {
        res.sendStatus(status);
    });
});

router.post('/note/update', function (req, res) {
    let note = req.body;
    let noteUpdate = knex("SPACE").where("ID", "=", note.id)
        .update({
            DATE: note.date,
            TITLE: note.title,
            NOTE: note.note,
            PARENT: note.parent
        });

    noteUpdate.then(function (status) {
        console.log(status);
        res.sendStatus(status);
    });
});

module.exports = router;