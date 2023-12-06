// follow.jsx
import axios from "axios";

const follow = async (channel_title) => {
    console.log(channel_title + ' follow button clicked')
    
    // Fetch user's watchlist
    try {
        // Create an object to organize the results by category
        let watchlist_titles = [];
        let watchlist_ids = [];

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

        // Create watchlist string for the Prompt()
        let watchlist_str = '';
        for (let i=0; i < watchlist_ids.length; i++) {
            watchlist_str = watchlist_str.concat(`${watchlist_ids[i]} - ${watchlist_titles[i]} \n`)
        }

        let selected_watchlist = prompt("Please enter which watchlist to add channel to, or to create new watchlist input unique watchlist title: \n\n" + watchlist_str )
        
        // Build the request packet for the post function to update the user's watchlists.
        let request = {};

        for (let i = 0; i < watchlist_ids.length; i++) {
            if (watchlist_ids[i] == parseInt(selected_watchlist) || watchlist_titles[i].toLowerCase() == selected_watchlist.toLowerCase()) {
                request = {
                    username: sessionStorage.getItem('username'),
                    watchlist_id: watchlist_ids[i],
                    watchlist_title: watchlist_titles[i],
                    channel: channel_title
                }
            } 
        }
        // selected watchlist doesn't exist, user wants a new watchlist.
        if (request["watchlist_id"] == undefined) {
            console.log('Watchlist is new, entered if statement')                
            console.log('entered while loop: ', selected_watchlist, !isNaN(selected_watchlist))

            while ((!isNaN(selected_watchlist) || selected_watchlist === '') && selected_watchlist != null)  {
                console.log('entered while loop: ', selected_watchlist, !isNaN(selected_watchlist))
                selected_watchlist = prompt(`Please input a valid non-numeric title for the new watchlist.`)
            }
            request = {
                username: sessionStorage.getItem('username'),
                watchlist_id: watchlist_ids.length > 0 ? (Math.max(...watchlist_ids) + 1) : 1,
                watchlist_title: selected_watchlist,
                channel: channel_title
            }
        };

        // Ask user for watchlist comments for the new channel.
        if (request["watchlist_title"] != null) {
            let comment = prompt("Input comments: \n")

            request["comments"] = comment;

            console.log('Follow requested for: ' + JSON.stringify(request))


            if (confirm(`Add ${request.channel} to '${request.watchlist_title}?' `)){ // eslint-disable-line no-restricted-globals
                // Post info to the database 
                const postResponse = await axios.post("http://localhost:8800/follow", request, {
                    headers: {
                    "Content-Type": "application/json",
                    },
                });
                if (postResponse.data.success) {
                    // reload screen so session storage updates
                    window.location.reload(true);
                    
                } else {
                    // Handle follow request failure
                    alert(postResponse.data.message);

                }
            } else {alert('Follow request cancelled.')}
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