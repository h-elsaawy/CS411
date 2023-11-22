import express from 'express'
import mysql from 'mysql'
import cors from "cors"

import axios from "axios"
// var path = require('path');

const app = express()

const db = mysql.createConnection({
    host:"128.174.134.197",
    user:"haadi",
    password:"Test1234",
    database:"youtube",
    multipleStatements: true
})
// IF THERE IS AUTHENTICATION ISSUE:
// ALTER USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'Test1234';

// Allows sending client requests using JSON.
app.use(express.json())
app.use(cors())

// app.set('views', path.join(__dirname, 'views'));

// app.get("/", (req,res) =>{
//     res.json("hello this is the backend.")
// })

app.post("/user", (req,res) => {
    const q = "INSERT INTO users (`username`, `name`, `password`, `email`, `region_id`, `role`) VALUES (?)";
    const values = [
        req.body.username,
        req.body.name,
        req.body.password, 
        req.body.email,
        req.body.region_id, 
        req.body.role];

    db.query(q,[values], (err, data) => {
        if (err) return res.json(err);
        return res.json("User created successfully.");
    })
})

app.get("/topchannels", (req,res) => {
    const q1 = `SELECT c.title
                FROM distinct_videos v JOIN categories c USING (category_id) 
                GROUP BY c.title, category_id 
                ORDER BY SUM(views) DESC 
                LIMIT 2;
                `
    db.query(q1, (err,data) => {
        if (err) return res.json(err)

            var result = [];
            var keys = Object.keys(data);
            keys.forEach(function(key){
                result.push(data[key].title);
            });
            // console.log(result)
        return res.send(result)
    })
})

app.get("/", (req,res) => {
    const q1 = `SELECT  channel_title, COUNT(video_id) AS num_videos, SUM(views) as num_views
                FROM distinct_videos v JOIN categories c USING (category_id, region_id)
                WHERE c.title = ?
                GROUP BY channel_title
                ORDER BY num_videos DESC
                LIMIT 5; 
                `
    const q2 = `SELECT  channel_title, COUNT(video_id) AS num_videos, SUM(views) as num_views
                FROM distinct_videos v JOIN categories c USING (category_id, region_id)
                WHERE c.title = ?
                GROUP BY channel_title
                ORDER BY num_videos DESC
                LIMIT 5; 
                `
    var topChannels = []
        const fetchTopChannels = () => { 
            try{ 
                const res1 =  app.get("/topchannels");
                console.log(res1)
                // return res1
            } catch(err) {
                console.log(err)
            }
        }
        fetchTopChannels()
        console.log(topChannels)
    db.query(q1 + q2, [topChannels] , (err,data) => {
        if (err) return res.json(err)
        
        return res.json(data)
    })
})


app.listen(8800, () => {
    console.log('Connected to backend!')
})