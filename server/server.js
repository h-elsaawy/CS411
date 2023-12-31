import express from 'express'
import mysql from 'mysql'
import cors from "cors"
import bodyParser from 'body-parser'
 
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
// Get a random channel for I'm feeling lucky
app.get("/randomChannel", (req, res) => {
    const q = `SELECT youtuber 
                FROM channels
                WHERE youtuber REGEXP '^[[:alnum:]]+$'
                ORDER BY RAND()
                LIMIT 1;`

    db.query(q, (err, data) => {
        if (err){
            return res.json(err);
        }else {
            console.log({youtuber: data[0].youtuber, success: true})
            return res.json({youtuber: data[0].youtuber, success: true});
        }
    })
})

//Advanced search functionality
app.get("/search/", (req,res) => {

    const string = req.query.search; 
    const type_string = req.query.type;
    const cat_string = req.query.category;
    // console.log(req, req.params.string)

    console.log(req.query)

    const q = `CALL variablesearch2("${string}",  "${cat_string}", "${type_string}");`

    console.log(q)

    db.query(q,  (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err)
        } else {            
            // console.log(data[0])
            return res.json(data[0])
        }
    })

});

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

// Unfollows channel using a transaction and then updates the 
app.post("/unfollow", (req, res) => {
    const user = req.body.username
    const channel = req.body.channel_title
    const id = req.body.watchlist_id

    // Create Transaction
    const q = ` DELETE FROM watchlist
                WHERE username = "${user}" and channel_id = "${channel}" and watchlist_id = ${id};
                CALL updateWatchlistIDsForUser2("${user}");
                `
    console.log(q);
    db.query(q,[user, channel, id, user] ,(err,data) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, username: user, message:`@${user}' unfollowing ${channel} failed due to Server Error`});  
        } else if (data[0].affectedRows >= 1)  {
            console.log(`@${user}' unfollowed ${channel}`);
            return res.json({ success: true, username: user, message:`@${user}' unfollowed ${channel}, watchlist_id update complete.`});  
        } else {
            console.log(`@${user}' unfollowing ${channel} failed`);
            console.log(data);
            return res.json({ success: false, username: user, message:`@${user}' unfollowing ${channel} failed`});  
        }
    });
});


// Edit Comment for Watchlist
app.post("/editComment", (req, res) => {
    const comment = req.body.newComment
    const user = req.body.username
    const channel = req.body.channel_title
    const id = req.body.id.toString()
    console.log(comment, user, channel, id);
    const q = `UPDATE watchlist
        SET comments = ?
        WHERE username = ? and channel_id = ? and watchlist_id = ?;`
    db.query(q,[comment, user, channel, id] ,(err,data) => {
        if (err) {
            console.log(err)
            return res.json(err);
        } else if (data.affectedRows == 1)  {
            console.log(`@${user}' added comment ${comment} for channel ${channel}`);
            return res.json({ success: true, username: user, message:`@${user}' added comment ${comment} for channel ${channel}`});  
        } else {
            console.log("Asdf");
            console.log(data);
            console.log(`@${user}' unable to add comment ${comment} for channel ${channel}`);
            return res.json({ success: false, username: user, message:`@${user}' unable to add comment ${comment} for channel ${channel}`});  
        }
    });
});

// Edit watchlist name
app.post("/editWatchlist", (req, res) => {
    const new_name = req.body.new_name
    const watchlist_id = req.body.watchlist_id
    const user = req.body.user
    console.log(new_name, user, watchlist_id);

    const q = `UPDATE watchlist
                SET title = ?
                WHERE username = ? and watchlist_id = ?;`

    db.query(q, [new_name, user, watchlist_id], (err, data) => {
        console.log(data);
        if (err) {
            console.log(err)
            return res.json(err);
        } else if (data.affectedRows >= 1)  {
            console.log(`@${user}' updated watchlist ${watchlist_id} with name ${new_name}`);
            return res.json({ success: true, username: user, message:`@${user}' updated watchlist ${watchlist_id} with name ${new_name}`});  
        } else {
            console.log(`@${user}' failed to update watchlist ${watchlist_id} with name ${new_name}`);
            return res.json({ success: false, username: user, message:`@${user}' failed to update watchlist ${watchlist_id} with name ${new_name}`});  
        }
    })
});

// Delete watchlist
app.post("/deleteWatchlist", (req, res) => {
    const watchlist_title = req.body.watchlist_title
    const watchlist_id = req.body.watchlist_id
    const user = req.body.user
    console.log(`@${user} requested to delete (${watchlist_id})-watchlist_title`);

    const q = ` DELETE FROM watchlist
                WHERE username = "${user}" AND watchlist_id = "${watchlist_id}" AND title = "${watchlist_title}";
                CALL updateWatchlistIDsForUser2("${user}");
                `
    console.log(q)
    // const q = `DELETE FROM watchlist
    //             WHERE username = ? and watchlist_id = ? and title LIKE ?;`

    db.query(q, (err, data) => {
        console.log(data);
        if (err) {
            console.log(err)
            return res.json({ success: false, username: user, message:`failed to delete @${user}'s watchlist ${watchlist_id} - ${watchlist_title} due to SQL Error.` });  
        } else if (data[0].affectedRows >= 1)  {
            console.log(`@${user} deleted watchlist ${watchlist_id} - ${watchlist_title}`);
            return res.json({success: true, 
                            username: user, 
                            message:`@${user} deleted watchlist ${watchlist_id} - ${watchlist_title}, watchlist_id's updated.`}); 
        } else {
            console.log(`failed to delete @${user}'s watchlist ${watchlist_id} - ${watchlist_title}`);
            return res.json({success: false, 
                            username: user, 
                            message:`failed to delete @${user}'s watchlist ${watchlist_id} - ${watchlist_title}`});  
        }
    })
})

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

    const title = req.params.channel_title;
    const q = `SELECT youtuber as channel_title, subscribers, video_views, uploads, region, channel_type, 
                    video_views_rank, country_rank, channel_type_rank,
                    lowest_monthly_earnings,highest_monthly_earnings, 
                    lowest_yearly_earnings, highest_yearly_earnings,
                    subscribers_for_last_30_days, video_views_for_the_last_30_days,
                    created_year, created_month, created_date 
                    FROM channels WHERE youtuber LIKE ? LIMIT 1;`;
    console.log(title);
    db.query(q, [title], (err, data) => {
        if (err) return res.json(err);

        if(data[0] === undefined){ // channel DNE in our database
            data = [{
                  channel_title: title, subscribers: 'null', video_views: 'null', uploads: 'null',
                  region: 'null', channel_type: 'null', video_views_rank: 'null', country_rank: 'null',
                  channel_type_rank: 'null', lowest_monthly_earnings: 'null', highest_monthly_earnings: 'null', 
                  lowest_yearly_earnings: 'null', highest_yearly_earnings: 'null', subscribers_for_last_30_days: 'null',
                  video_views_for_the_last_30_days: 'null', created_year: 'null', created_month: 'null', created_date: 'null'
                }];
        } 
        
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

// Handles Follow request
app.post("/follow", (req, res) => {
    const username = req.body.username
    const channel = req.body.channel
    const watchlist_id = req.body.watchlist_id
    const watchlist_title = req.body.watchlist_title
    const comments = req.body.comments

    const q = `INSERT INTO watchlist(username, watchlist_id, title, channel_id, comments)
                VALUES (?,?,?,?,?) `

    db.query(q, [username, watchlist_id, watchlist_title, channel, comments], (err,data) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log('Attempted to add duplicate entry added to the same watchlist.')
                return res.json({ success: false, message:`Channel is already in the selected watchlist.`});  
            } else {
                console.log(err)
                return res.json({ success: false, message:`The database update failed due to a fatal error.`})
            }
            
        } else if (data.affectedRows == 1)  {
            // if affected rows does not equal 1, no rows were changed.
            console.log(`@${username} added ${channel} to watchlist ${watchlist_title}`);
            return res.json({ success: true, message:`@${channel} added to ${watchlist_title}.`});  
        } else {
            console.log(`Updating watchlist failed.`);
            return res.json({ success: false, message:`Channel follow request failed.`});  
        }
    });
});


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