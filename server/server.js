import express from 'express'
import mysql from 'mysql'
import cors from "cors"
import bodyParser from 'body-parser'
 import JWT from 'jsonwebtoken' 
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

//middleware for comms between front and backend
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  
app.use(cors(corsOptions));

// Allows sending client requests using JSON.
app.use(express.json())
app.use(bodyParser.json());

 
// app.set('views', path.join(__dirname, 'views'));
 
// app.get("/", (req,res) =>{
//     res.json("hello this is the backend.")
// })
 
 
app.get("/getwatchlists/:username", (req, res) => {
    const username = req.params.username
    console.log("hi");
    const q = `SELECT watchlist_id, title, json_arrayagg(channel_id), json_arrayagg(comments)
                FROM Watchlist
                WHERE username = ?
                GROUP BY watchlist_id, title;
                `;

    db.query(q, [username], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// app.post("/search", (req,res) => {
    
//     console.log("searching");
//     const search_string = req.body.search_string; //replace w/keywords list ?
//     const type_string = req.body.type_string;
//     const q = `CALL variablesearch("${search_string}", "${type_string}");`
 
//     db.query(q,  (err, data) => {
//         if (err) return res.json(err);
//         console.log(data[0])
//         return res.json(data[0])

//     })
// })



app.get("/search/", (req,res) => {

    const string = req.query.search; //replace w/keywords list ?

    
    const type_string = req.query.type
    // console.log(req, req.params.string)
    console.log(req.query)

    const q = `SELECT youtuber as channel FROM channels WHERE youtuber LIKE "%${string}%"
                UNION
               SELECT channel_title as channel FROM videos WHERE channel_title LIKE "%${string}%";` ;
    const q2 = `CALL variablesearch("${string}", "${type_string}");`
    console.log(q2)

    db.query(q2,  (err, data) => {
        if (err) return res.json(err);
        //console.log(data[0])
        return res.json(data[0])

    })

    // db.query(q, (err, data) => {
    //     if (err) return res.json(err);
    //     console.log(data)
    //     return res.json(data)
    // })
    // return res.json({message: "hi", body: req.body})
})
    
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


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Insert user into the database
    const result = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

    // Handle result and send response
    res.json({ success: true, message: 'User registered successfully' });
});

app.post("/login", async (req, res) => {

    const { username, password } = req.body;
    // Retrieve user from the database
    db.query('SELECT username, password FROM users WHERE username = ?', [username], (err,data) => {
        if (err) return res.json(err);

        // user.length === 0 means no user tied to the username. 
        if (data[0].username === "" || data[0].password != password) {
            return res.json({ success: false, message: 'Invalid username or password' });
        } else {

        res.json({ success: true, username });   
        }
    
  
    });


});


app.get("/topchannels", (req,res) => {
    const q1 = `SELECT c.title
                FROM distinct_videos v JOIN categories c USING (category_id) 
                GROUP BY c.title
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


app.get("/", async (req, res) => {
    const q1 = `SELECT c.title
                FROM distinct_videos v JOIN categories c USING (category_id) 
                GROUP BY c.title
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
           const category = row.title;
           if (!organizedData[category]) {
               organizedData[category] = [];
               categoryOrder.push(category);
           }
       });

        // Use the result to refine the next query
        const q2 = `SELECT channel_title, c.title, COUNT(video_id) AS num_videos, SUM(views) as num_views
                    FROM distinct_videos v LEFT JOIN categories c USING (category_id, region_id)
                    WHERE c.title = ? 
                    GROUP BY channel_title, c.title
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
                    category_title: row.title,
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
    console.log('Connected to backend on http://localhost:8800')
})