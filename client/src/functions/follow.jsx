// follow.jsx
import axios from "axios";


const follow = async (channel_title, source_page) => {
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

        watchlist_titles = watchlist_titles.map(title => title.toLowerCase())

        // Check to see if the user's selected watchlist is in the user's watchlists?
        // if user selected an existing watchlist, build the json for the request.
        let request = {}
        if (watchlist_ids.includes(parseInt(selected_watchlist)) || watchlist_titles.includes(selected_watchlist.toLowerCase())) {
            if (watchlist_ids.indexOf(parseInt(selected_watchlist)) > -1 ){
                let comment = prompt("Input comments: \n")

                request = {
                    username: sessionStorage.getItem('username'),
                    watchlist_id: selected_watchlist,
                    watchlist_title: watchlist_titles[watchlist_ids.indexOf(parseInt(selected_watchlist))],
                    channel: channel_title,
                    comments: comment
                }
                console.log('watchlist requested was an int: ' + JSON.stringify(request))
            } else if (watchlist_titles.indexOf(selected_watchlist) > -1) {
                let comment = prompt("Input comments: \n")

                request = {
                    username: sessionStorage.getItem('username'),
                    watchlist_id: watchlist_ids[watchlist_titles.indexOf(selected_watchlist)],
                    watchlist_title: selected_watchlist,
                    channel: channel_title,
                    comments: comment
                }
                console.log('watchlist requested was a string: ' + JSON.stringify(request))
            } 
        // Else, create a new watchlist ID and title for the new watchlist.
        }else if (selected_watchlist.length <= 1) {
                let selected_watchlist_new = prompt(`Watchlist ID: ${selected_watchlist} does not exist, please input a title for the new watchlist. \n`)

                let comment = prompt("Input comments: \n")

                request = {
                    username: sessionStorage.getItem('username'),
                    watchlist_id: Math.max(watchlist_ids) + 1,
                    watchlist_title: selected_watchlist_new,
                    channel: channel_title,
                    comments: comment
                }
                console.log('watchlist requested was a new string: ' + JSON.stringify(request))
        }
        // Post info to the database 
        const postResponse = await axios.post("http://localhost:8800/follow", request, {
            headers: {
              "Content-Type": "application/json",
            },
        });
        if (postResponse.data.success) {
            // Save the watchlist (e.g., in sessionStorage) for subsequent requests
            let updated_list = JSON.parse(sessionStorage.getItem('watchlist'));
            updated_list.push(channel_title);
            sessionStorage.setItem('watchlist', JSON.stringify(updated_list));           
          } else {
            // Handle login failure
            alert(postResponse.data.message);
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