const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./local_notes/space.db"
    }
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

// Get notes
router.get('/notes', (req, res) => {
    let notesResults = knex.select("*").from("SPACE");
    notesResults.then(function (notes) {
        return notes;
    })

});

module.exports = router;