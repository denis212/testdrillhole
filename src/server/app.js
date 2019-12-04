const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const faker = require('faker');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

//Create Database, tables, and seed
const db = new sqlite3.Database(':memory:', (err)=> {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQLite in-memory database');
  
  console.log('Creating tables...');
  db.run('CREATE TABLE drill_holes (' +
    'id       INTEGER PRIMARY KEY,' +
    'name     TEXT NOT NULL,' +
    'lat      REAL NOT NULL,' +
    'lng      REAL NOT NULL,' +
    'dip      REAL NOT NULL,' +
    'azimuth  REAL NOT NULL' +
    ')', (err) => {
    db.run('CREATE TABLE depth_readings (' +
      'id         INTEGER PRIMARY KEY,' +
      'hole_id    INTEGER,' +
      'depth      REAL NOT NULL,' +
      'dip        REAL NOT NULL,' +
      'azimuth    REAL NOT NULL,' +
      'trustworthy  INTEGER NOT NULL,' +
      'FOREIGN KEY(hole_id) REFERENCES drill_holes(id)' +
      ')', (err) => {
      console.log('Table creation completed!');
      
      //Seed database
      let drillHoleSeedCount = 3;
      let depthReadingSeedCount = 100;
      let drillHoleIDs = [];
      console.log('Seeding drill holes...');
      for (let i = 0; i < drillHoleSeedCount; i++) {
        let addDrillHolesSql = "INSERT INTO drill_holes (name, lat, lng, dip, azimuth) VALUES(?,?,?,?,?)";
        db.run(addDrillHolesSql, [
          faker.address.streetName(),
          faker.random.number({min: -90, max: 90}),
          faker.random.number({min: -90, max: 90}),
          faker.random.number({min: 0, max: 90}),
          faker.random.number({min: 0, max: 360})
        ], function (err) {
          drillHoleIDs.push(this.lastID);
          
          if (drillHoleIDs.length === drillHoleSeedCount) {
            console.log('Drill hole seeding completed!');
            console.log('Seeding depth readings...');
            drillHoleIDs.forEach((hole_id, hole_index) => {
              let recentTrustworthy = [];
              for (let i = 0; i < depthReadingSeedCount; i++) {
                //Random depth reading values (0-10), 2 decimal places
                let depth = Math.round(Math.random() * 10 * 100) / 100;
                let dip = Math.round(Math.random() * 10 * 100) / 100;
                let azimuth = Math.round(Math.random() * 10 * 100) / 100;
                let trustworthy = 1;
                
                //Get last 5 trustworthy depth readings
                if (recentTrustworthy.length > 0) {
                  let lastAzimuth = recentTrustworthy[0].azimuth;
                  let meanDip = recentTrustworthy.reduce((acc, item) => acc + item.dip, 0) / recentTrustworthy.length;
                  if (Math.abs(azimuth - lastAzimuth) > 5 || // azimuth is within 5 degrees of previous trustworthy azimuth reading
                    Math.abs(dip - meanDip) > 3) { // dip is within 3 degrees of the mean dip from 5 previous trustworthy depth readings
                    trustworthy = 0;
                  }
                }
                
                //Local copy of recent trustworthy depth readings for lastAzimuth and meanDip calculations
                if (trustworthy) {
                  recentTrustworthy.unshift({
                    dip: dip,
                    azimuth: azimuth
                  });
                  
                  //Don't keep anything older than 5
                  if (recentTrustworthy.length > 5) {
                    recentTrustworthy.pop();
                  }
                }
                
                //Now add the new depth reading with the calculated trustworthy value
                let sql = "INSERT INTO depth_readings (id, hole_id, depth, dip, azimuth, trustworthy) VALUES(?,?,?,?,?,?)";
                db.run(sql,
                  [
                    hole_index*depthReadingSeedCount+i+1,
                    hole_id,
                    depth,
                    dip,
                    azimuth,
                    trustworthy
                  ]);
              }
            });
  
            console.log("Seeding completed!");
          }
        });
      }
    });
  });
});

//Create API endpoints
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
    "WHERE hole_id=? " +
    "ORDER BY id DESC";
  
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

//Set up server to listen at process.env.PORT or 8081
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
