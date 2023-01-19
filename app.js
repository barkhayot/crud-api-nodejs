const express = require('express')
const app = express()
const port = 3000
// const bodyParser = require('body-parser');
// const kafka = require('kafka-node');
const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg')

const db = new Client({
    user: "admin",
    host: "dpg-cf4log1gp3js6fk0opu0-a",
    database: "postgresadmin",
    password: "fvJhkcZmrKgmRssEYt3woe0wPJ7Z8dhq",
    port: 5432
});

db.connect();


// Database Connection and implementation
//const db = new sqlite3.Database('./database.db');

// Parse JSON request body
app.use(express.json());

// Implementing Blog model in Database
db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS Blog (id INTEGER PRIMARY KEY, title TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)'
    );
});

// Route to GET all list og blogs
app.get('/blogs', (req, res) => {
    db.all('SELECT * FROM Blog', (err, data) => {
        if (err) {
          console.error(err.message);
        }
        res.send(data);
      });
});


// Route to POST method for Blog model to Database
app.post('/blogs', (req, res) => {
    const data = req.body;
  
    db.run(`INSERT INTO Blog (title, content) VALUES (?, ?)`, [data.title, data.content], (error) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);  // Internal Server Error
      } else {
        res.send(
            {
                "title":data.title,
                "content":data.content
            }
        );  // Created
      }
    });
  });

// Route to GET Blog model with exact id
app.get('/blog/:id', (req, res) => {
    const id = req.params.id;
    db.all('SELECT * FROM Blog WHERE id = ?', [id], 
    (err, data) => {
        if (err) {
          console.error(err.message);
        }
        res.send(data);
      });
});

//  Route to PUT method for Blog model to Database
app.put('/blog/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    db.run(`UPDATE Blog SET title = ?, content = ? WHERE id = ?`, [data.title, data.content, id],
    (error) => {
        if (error) {
            console.error(error);
            res.sendStatus(500); // Internal Server Error
        }
        else {
            res.send(
                {
                    "title":data.title,
                    "content":data.content
                }
            ); // Send back updated data
        }
    });
});

//  Route to PUT method for Blog model to Database
app.delete('/blog/:id', (req, res) => {
    const id = req.params.id;

    db.run(`DELETE FROM Blog WHERE id = ?`, [id],
    (error) => {
        if (error) {
            console.error(error);
            res.sendStatus(500); // Internal Server Error
        }
        else {
            res.send(
                {
                    "message": "Data has been Deleted Successfully"
                }
            ); // Send Success message
        }
    });
});

// Static Data for testing
var data = {
    "message": "test"
}

app.get('/', (req, res) => {
    res.send(data);
});
  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
