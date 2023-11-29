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
 
// app.post("/getwatchlists", (req, res) => {
//     const q2 = `SELECT watchlist_id, title, json_arrayagg(group_channel_id), json_arrayagg(comments)
//                 FROM Watchlist
//                 WHERE username = ?
//                 GROUP BY watchlist_id, title;
//                 `
 
//     db.query(q2, (err, data) => {
 
//     })
// })
 
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
 
// app.get("/", (req,res) => {
 
//     const q1 = `SELECT  channel_title, COUNT(video_id) AS num_videos, SUM(views) as num_views
//                 FROM distinct_videos v JOIN categories c USING (category_id, region_id)
//                 WHERE c.title = ?
//                 GROUP BY channel_title
//                 ORDER BY num_videos DESC
//                 LIMIT 5; 
//                 `
//     const q2 = `SELECT  channel_title, COUNT(video_id) AS num_videos, SUM(views) as num_views
//                 FROM distinct_videos v JOIN categories c USING (category_id, region_id)
//                 WHERE c.title = ?
//                 GROUP BY channel_title
//                 ORDER BY num_videos DESC
//                 LIMIT 5; 
//                 `
//     db.query(q1 + q2, topChannels, (err,data) => {
//         if (err) return res.json(err)
 
//         return res.json(data)
//     })
// })
 
// app.get("/", (req, res) => {
//     const q1 = `SELECT c.category_id
//                 FROM distinct_videos v JOIN categories c USING (category_id) 
//                 GROUP BY c.category_id 
//                 ORDER BY SUM(views) DESC 
//                 LIMIT 5;`;
 
//     db.query(q1, (err, data) => {
//         if (err) return res.json(err);
 
//         // Create an object to organize the results by category
//         const organizedData = {};
 
//         // Iterate through the results and organize them by category
//         data.forEach((row) => {
//             const category = row.category_id;
//             if (!organizedData[category]) {
//                 organizedData[category] = [];
//             }
//         });
 
//         // Use the result to refine the next query
//         const q2 = `SELECT channel_title, c.category_id, COUNT(video_id) AS num_videos, SUM(views) as num_views
//                     FROM distinct_videos v LEFT JOIN categories c USING (category_id, region_id)
//                     WHERE c.category_id IN (?) 
//                     GROUP BY channel_title, c.category_id
//                     ORDER BY num_videos DESC
//                     LIMIT 5;`;
//         for (let i = 0; i < 5; i++ ) {
//             console.log(Object.keys(organizedData)[2])
//             db.query(q2, [Object.keys(organizedData)[i]], (err, data) => {
//                 if (err) return res.json(err);
 
//                 // Iterate through the results and add them to the organizedData object
//                 data.forEach((row) => {
//                     const category = row.category_id;
//                     organizedData[category].push({
//                         channel_title: row.channel_title,
//                         category_id: row.category_id,
//                         num_videos: row.num_videos,
//                         num_views: row.num_views,
//                     });
//                 });
 
//             });
//         }
//         return res.json(organizedData);
 
//     });
// });
 
app.get("/", async (req, res) => {
    const q1 = `SELECT c.category_id
                FROM distinct_videos v JOIN categories c USING (category_id) 
                GROUP BY c.category_id 
                ORDER BY SUM(views) DESC 
                LIMIT 5;`;
 
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(q1, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
 
        // Create an object to organize the results by category
        const organizedData = {};
        const categoryOrder = [];
 
        // Iterate through the results and organize them by category
        data.forEach((row) => {
            const category = row.category_id;
            if (!organizedData[category]) {
                organizedData[category] = [];
                categoryOrder.push(category);
            }
        });
 
 
 
 
        // Use the result to refine the next query
        const q2 = `SELECT channel_title, c.category_id, COUNT(video_id) AS num_videos, SUM(views) as num_views
                    FROM distinct_videos v LEFT JOIN categories c USING (category_id, region_id)
                    WHERE c.category_id = ? 
                    GROUP BY channel_title, c.category_id
                    ORDER BY num_videos DESC
                    LIMIT 5;`;
 
        // Iterate through the keys and execute the query for each category
        for (const category of Object.keys(organizedData)) {
            const results = await new Promise((resolve, reject) => {
                db.query(q2, [category], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
 
            // Add the results to the organizedData object
            results.forEach((row) => {
                organizedData[category].push({
                    channel_title: row.channel_title,
                    category_id: row.category_id,
                    num_videos: row.num_videos,
                    num_views: row.num_views,
                });
            });
        }
 
        organizedData["order"] = categoryOrder;
 
        return res.json(organizedData);
    } catch (err) {
        return res.json(err);
    }
});
 
app.listen(8800, () => {
    console.log('Connected to backend!')
})