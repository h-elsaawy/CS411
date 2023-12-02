import mysql from 'mysql'


const getTopChannels = async function (res,req) {

    const db = mysql.createConnection({
        host:"128.174.134.197",
        user:"haadi",
        password:"Test1234",
        database:"youtube",
        multipleStatements: true
    })

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

        // Iterate through the results and organize them by category
        data.forEach((row) => {
            const category = row.category_id;
            if (!organizedData[category]) {
                organizedData[category] = [];
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

        return organizedData;
    } catch (err) {
        console.log(err)
    }
};

export default getTopChannels;
