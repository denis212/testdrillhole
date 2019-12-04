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
    'depth      REAL NOT NULL,' +
    'dip        REAL NOT NULL,' +
    'azimuth    REAL NOT NULL,' +
    'trustworthy  INTEGER NOT NULL,' +
    'FOREIGN KEY(hole_id) REFERENCES drill_holes(id)' +
    ')');
});

app.get('/api/drillholes', (req, res) => {
  let sql = "SELECT * FROM drill_holes";
  
  db.all(sql, (err, allRows) => {
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    
    res.send(allRows);
  });
});

app.get('/api/drillholes/:id', (req, res) => {
  let sql = "SELECT * FROM drill_holes " +
    "WHERE id=?";
  
  db.get(sql, [req.params.id], function(err, row){
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    
    res.send(row);
  });
});

app.put('/api/drillholes', (req, res) => {
  let sql = "UPDATE drill_holes " +
    "SET name=?, lat=?, lng=?, dip=?, azimuth=? " +
    "WHERE id=?";
  
  db.run(sql, [req.body.name, req.body.lat, req.body.lng, req.body.dip, req.body.azimuth, req.body.id], function(err){
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    res.sendStatus(200);
  });
});

app.post('/api/drillholes', (req, res) => {
  let sql = "INSERT INTO drill_holes (name, lat, lng, dip, azimuth) VALUES(?,?,?,?,?)";
  
  db.run(sql, [req.body.name, req.body.lat, req.body.lng, req.body.dip, req.body.azimuth], function(err){
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    
    res.send({
      id: this.lastID,
      name: req.body.name,
      lat: req.body.lat,
      lng: req.body.lng,
      dip: req.body.dip,
      azimuth: req.body.azimuth
    });
  });
});

app.get('/api/depthreadings/:hole_id', (req, res) => {
  let sql = "SELECT * FROM depth_readings " +
    "WHERE hole_id=?";
  
  db.all(sql, [req.params.hole_id], (err, allRows) => {
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    res.send(allRows);
  });
});

app.put('/api/depthreadings', (req, res) => {
  let sql = "UPDATE depth_readings " +
    "SET depth=?, dip=?, azimuth=?, trustworthy=? " +
    "WHERE id=?";
  
  db.run(sql, [req.body.depth, req.body.dip, req.body.azimuth, req.body.trustworthy, req.body.id], function(err){
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    res.sendStatus(200);
  });
});

app.post('/api/depthreadings', (req, res) => {
  //Calculate trustworthiness, assume true
  let trustworthy = 1;
  //Get last 5 trustworthy depth readings
  let trustworthysql = "SELECT dip, azimuth FROM depth_readings " +
    "WHERE hole_id=? AND trustworthy=1 " +
    "ORDER BY id DESC " +
    "LIMIT 5";
  
  db.all(trustworthysql, [req.body.hole_id], (err, allRows) => {
    if(err){
      res.sendStatus(400);
      return console.error(err.message);
    }
    
    if(allRows.length>0){
      let lastAzimuth = allRows[0].azimuth;
      let meanDip = allRows.reduce((acc,item)=>acc+item.dip,0)/allRows.length;
      
      if(Math.abs(req.body.azimuth-lastAzimuth)>5 || // azimuth is within 5 degrees of previous trustworthy azimuth reading
        Math.abs(req.body.dip-meanDip)>3){ // dip is within 3 degrees of the mean dip from 5 previous trustworthy depth readings
        trustworthy = 0;
      }
    }
    
    //Now add the new depth reading with the calculated trustworthy value
    let sql = "INSERT INTO depth_readings (hole_id, depth, dip, azimuth, trustworthy) VALUES(?,?,?,?,?)";
    db.run(sql, [req.body.hole_id, req.body.depth, req.body.dip, req.body.azimuth, trustworthy], function(err){
      if(err){
        res.sendStatus(400);
        return console.error(err.message);
      }
    
      res.send({
        id: this.lastID,
        hole_id: req.body.hole_id,
        depth: req.body.depth,
        dip: req.body.dip,
        azimuth: req.body.azimuth,
        trustworthy: trustworthy
      });
    });
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
