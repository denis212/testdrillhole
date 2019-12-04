const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const sqlite3 = require('sqlite3').verbose();

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const db = new sqlite3.Database(':memory:', (err)=>{
  if(err){
    return console.error(err.message);
  }
  console.log('Connected to SQLite in-memory database');

  db.run('CREATE TABLE drill_holes (' +
    'id       INTEGER PRIMARY KEY,' +
    'name     TEXT NOT NULL,' +
    'lat      REAL NOT NULL,' +
    'lng      REAL NOT NULL,' +
    'dip      REAL NOT NULL,' +
    'azimuth  REAL NOT NULL' +
    ')');

  db.run('CREATE TABLE depth_readings (' +
    'id         INTEGER PRIMARY KEY,' +
    'hole_id    INTEGER,' +
    'timestamp  TEXT NOT NULL,' +
    'depth      REAL NOT NULL,' +
    'dip        REAL NOT NULL,' +
    'azimuth    REAL NOT NULL,' +
    'FOREIGN KEY(hole_id) REFERENCES drill_holes(id)' +
    ')');
});

app.get('/api/drillholes', (req, res) => {
  let sql = "SELECT * FROM drill_holes";
  
  db.all(sql, (err, allRows) => {
    res.send(allRows);
  });
});

app.put('/api/drillholes', (req, res) => {
  console.log(req.body);
  res.send({
    message: "put request sent"
  });
});

app.post('/api/drillholes', (req, res) => {
  let sql = "INSERT INTO drill_holes (name, lat, lng, dip, azimuth) VALUES(?,?,?,?,?)";
  let itemId = null;
  
  db.run(sql, [req.body.name, req.body.lat, req.body.lng, req.body.dip, req.body.azimuth], function(err){
    if(err){
      return console.error(err.message);
    }
    itemId = this.lastID;
  });
  
  res.send({
    id: itemId,
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    dip: req.body.dip,
    azimuth: req.body.azimuth
  });
});

const server = app.listen(process.env.PORT || 8081);

//Make sure to close the database when process is terminated
process.on('SIGINT', code => {
  db.close(err => {
    if(err){
      return console.error(err.message);
    }
    console.log('DB connection closed');
  });
  server.close();
});

function isValidDrillHole(req){

}
