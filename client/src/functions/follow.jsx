// follow.jsx
import axios from "axios";

const follow = async (channel_title) => {
        // Create an object to organize the results by category

    let watchlist_titles = [];
    let watchlist_ids = [];
    console.log(channel_title + ' follow button clicked')
    
    // Fetch user's watchlist
    try {
        const username = sessionStorage.getItem("username");
        const response = await axios.get(`http://localhost:8800/getwatchlists/${username}`);
        console.log(response)


        // Iterate through the results and organize them by category
        response.data.forEach((row) => {
            const id = row.watchlist_id;
            const title = row.title;
            watchlist_ids.push(id);
            watchlist_titles.push(title)
        });
        // watchlist_ids = await response.data;
        console.log(watchlist_ids, watchlist_titles)
        let watchlist_str = '';
        let num_watchlists = watchlist_ids.length;
        console.log(num_watchlists)
        for (let i=0; i<num_watchlists; i++) {
            console.log(`${watchlist_ids[i]} - ${watchlist_titles[i]} \n`)
            watchlist_str = watchlist_str.concat(`${watchlist_ids[i]} - ${watchlist_titles[i]} \n`)

        }
        console.log(watchlist_str)
        let watchlist = prompt("Please enter which watchlist to add channel to, or to create new watchlist input unique watchlist title: \n\n" +watchlist_str )

    } catch (error) {
        console.error("Error fetching watchlists", error);
    }

    console.log("outside the function, " + watchlist_ids)


    return (
    //will return the status of the code running
    true
    );
};

export default follow;