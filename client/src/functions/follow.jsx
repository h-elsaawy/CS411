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

        for (let i=0; i<num_watchlists; i++) {
            console.log(`${watchlist_ids[i]} - ${watchlist_titles[i]} \n`)
            watchlist_str = watchlist_str.concat(`${watchlist_ids[i]} - ${watchlist_titles[i]} \n`)

        }

        let selected_watchlist = prompt("Please enter which watchlist to add channel to, or to create new watchlist input unique watchlist title: \n\n" + watchlist_str )

        let comment = prompt("Input comments: \n")
        // Check to see if the user's selected watchlist is in the user's watchlists?
        watchlist_titles = watchlist_titles.map(title => title.toLowerCase())

        if (watchlist_ids.includes(parseInt(selected_watchlist)) || watchlist_titles.includes(selected_watchlist.toLowerCase())) {
            console.log("this worked")
            if (watchlist_ids.indexOf(parseInt(selected_watchlist)) > -1 ){
                const request = {
                    username: sessionStorage.getItem('username'),
                    watchlist_id: selected_watchlist,
                    watchlist_title: watchlist_titles[watchlist_ids.indexOf(parseInt(selected_watchlist))],
                    channel: channel_title,
                    comments: comment
                }
                console.log('watchlist requested was an int: ' + JSON.stringify(request))
            } else if (watchlist_titles.indexOf(selected_watchlist) > -1) {
                const request = {
                    username: sessionStorage.getItem('username'),
                    watchlist_id: watchlist_ids[watchlist_titles.indexOf(selected_watchlist)],
                    watchlist_title: selected_watchlist,
                    channel: channel_title,
                    comments: comment
                }
                console.log('watchlist requested was a string: ' + JSON.stringify(request))
            }

        }



    } catch (error) {
        console.error("Error fetching watchlists", error);
    }


    return (
    //will return the status of the code running
    true
    );
};

export default follow;