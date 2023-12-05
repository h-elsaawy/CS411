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
    origin: 'http://localhost:3000'
  };
app.use(cors(corsOptions));

// Allows sending client requests using JSON.
app.use(express.json())
app.use(bodyParser.json());

 // Basic search functionality
app.get("/search/:string", (req,res) => {

    const string = req.params.string; //replace w/keywords list ?
    // console.log(req, req.params.string)

    const q = `SELECT youtuber as channel FROM channels WHERE youtuber LIKE "%${string}%"
                UNION
               SELECT channel_title as channel FROM videos WHERE channel_title LIKE "%${string}%";` ;
    console.log(q)

    db.query(q, [string], (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        return res.send(data)
    })
})

// Return the watchlists a user has. 
app.get("/getwatchlists/:username", (req, res) => {
    const username = req.params.username

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

app.get("/getwatchlists/:username/:id", async (req, res) => {
    const username = req.params.username
    const id = req.params.id

    const q = `SELECT watchlist_id, title, json_arrayagg(channel_id), json_arrayagg(comments)
                FROM Watchlist
                WHERE username = ? AND watchlist_id = ?
                GROUP BY watchlist_id, title;
                `;

    db.query(q, [username, id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Unfollows channel
app.post("/unfollow", (req, res) => {
    const user = req.body.username
    const channel = req.body.channel_title
    const id = req.body.watchlist_id
    const q = `DELETE FROM watchlist
        WHERE username = ? and channel_id = ? and watchlist_id = ?;`
    
    db.query(q,[user, channel, id] ,(err,data) => {
        if (err) {
            console.log(err)
            return res.json(err);
        } else if (data.affectedRows == 1)  {
            console.log(`@${user}' unfollowed ${channel}`);
            return res.json({ success: true, username: user, message:`@${user}' unfollowed ${channel}`});  
        } else {
            console.log(`@${user}' unfollowing ${channel} failed`);
            return res.json({ success: false, username: user, message:`@${user}' unfollowing ${channel} failed`});  
        }
    });
});

// Edit Comment for Watchlist
app.post("/editComment", (req, res) => {
    const comment = req.body.newComment
    const user = req.body.username
    const channel = req.body.channel_title
    
    const q = `UPDATE watchlist
        SET comments = ?
        WHERE username = ? and channel_id = ?;`
    
    db.query(q,[comment, user, channel] ,(err,data) => {
        if (err) {
            console.log(err)
            return res.json(err);
        } else if (data.affectedRows == 1)  {
            console.log(`@${user}' added comment ${comment} for channel ${channel}`);
            return res.json({ success: true, username: user, message:`@${user}' added comment ${comment} for channel ${channel}`});  
        } else {
            console.log(`@${user}' unable to add comment ${comment} for channel ${channel}`);
            return res.json({ success: false, username: user, message:`@${user}' unable to add comment ${comment} for channel ${channel}`});  
        }
    });
});

// Get watchlist ids for a specific channel and user
app.get("/getWatchlistIds/:username/:channel_id", (req, res) => {
    const username = req.params.username
    const channel_id = req.params.channel_id
    const q = `SELECT DISTINCT watchlist_id, title
        FROM watchlist
        WHERE username = ? and channel_id = ?;`
    
    db.query(q,[username, channel_id] ,(err,data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/channel/:channel_title", (req,res) => {

    const channel_title = req.params.channel_title;
    console.log("berfore call");
    const q = `SELECT youtuber as channel_title, subscribers, video_views, uploads, region, channel_type, 
                    video_views_rank, country_rank, channel_type_rank,
                    lowest_monthly_earnings,highest_monthly_earnings, 
                    lowest_yearly_earnings, highest_yearly_earnings,
                    subscribers_for_last_30_days, video_views_for_the_last_30_days,
                    created_year, created_month, created_date 
                    FROM channels WHERE youtuber LIKE ? LIMIT 1;`;
    console.log(channel_title);
    db.query(q, [channel_title], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);

    });
});
    
//handles new user registration.
app.post("/register", async (req,res) => {
    const q = `CALL set_user(?)`
                
    const values = [
        req.body.username,
        req.body.name,
        req.body.password, 
        req.body.email,
        req.body.region, 
        req.body.role];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.log("there's an error")
            return res.json(err)
        } else {
            console.log("Response: " + data[0][0].user_set_code)
            if (data[0][0].user_set_code === "username"){
                return res.json({ success: false, message: data[0][0].user_set_code })
            } else if (data[0][0].user_set_code === "email") {
                return res.json({success: false, message: data[0][0].user_set_code})
            } else {
                return res.json({success: true, message: data[0][0].user_set_code})
            }
        }
    })
})

// Handles user changing password.
app.post("/changePass", (req, res) => {
    const user = req.body.username
    const pass = req.body.password
    const q = `UPDATE users
        SET password = ?
        WHERE username LIKE ?;`
    
    db.query(q,[pass, user] ,(err,data) => {
        if (err) {
            console.log(err)
            return res.json(err);
        } else if (data.affectedRows == 1)  {
            // if affected rows does not equal 1, no rows were changed.
            console.log(`@${user}'s password sucessfully changed.`);
            return res.json({ success: true, username: user, message:`@${user}'s password sucessfully changed.`});  
        } else {
            console.log(`@${user}'s password change failed.`);
            return res.json({ success: false, username: user, message:`@${user}'s password change failed.`});  
        }
    });
});

// Handles the user login requests.
app.post("/login", async (req, res) => {
    const user = req.body.username
    const pass = req.body.password

    // Retrieve user from the database
    db.query('SELECT username, password FROM users WHERE username = ?', [user], (err,data) => {

        if (err) {
            return res.json(err);
        } else if (data[0] == undefined) {
            return res.json({ success: false, message: 'Invalid username or password' } )
        } else {

            if (data[0].password != pass) {
                return res.json({ success: false, message: 'Invalid username or password' });
            } else {
                // create a second query that pulls all the user's watchlist channels.
                const user_channels = [];
                db.query('SELECT channel_id FROM watchlist WHERE username LIKE ?;', [user], (err, data2) => {
                    if (err) { 
                        return res.json(err);
                    } else {
                        // console.log(data2)
                        data2.forEach((row) => {
                            const channel = row.channel_id;
                            user_channels.push(channel);
                        });
                        // console.log(user_channels);
                        return res.json({ success: true, username: user, channels: user_channels});   

                    }
                })
            }
        }
    });
});

// Get the top 25 trending channels from a specific category.
app.get("/topchannels/:category", (req,res) => {
    const selected_cat = req.params.category
    const q1 = `SELECT v.channel_title, c.title, COUNT(v.video_id) AS num_videos, SUM(views) as num_views
                FROM distinct_videos v JOIN categories c USING (category_id) 
                GROUP BY c.title, v.channel_title
                HAVING c.title LIKE ?
                ORDER BY SUM(views) DESC 
                LIMIT 25;
                `
    db.query(q1,[selected_cat], (err,data) => {
        if (err) return res.json(err)

        return res.send(data)
    })
});

// Return the top channels in the top categories, limit of 5 per category.
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