import { React, useEffect, useState } from "react";
import axios from "axios"
import Navbar from "../container/Navbar"
import { useParams } from "react-router-dom";

const Watchlist = () => {
    const { id } = useParams();
    const username = sessionStorage.getItem('username');
    const [watchlist, setWatchlist] = useState();
    const [channels, setChannelsInWatchList] = useState([]);
    const [watchlist_title, setWatchlistTitle] = useState();
    const handleFollow = (channel_title) => {
        console.log("Clicked to unfollow: " + channel_title)
      }
    const handleEditComment = (channel_title) => {
        console.log("Clicked to edit comment for: " + channel_title)
    }

    useEffect(() => {
        const fetchWatchlistInfo = async () => {
            try {
                const url = "http://localhost:8800/getwatchlists/" + username + "/" + id;
                const res = await axios.get(url);
                const watchlistData = res.data[0];
                setWatchlist(watchlistData);

                // Ensure that watchlistData is not undefined before accessing its properties
                if (watchlistData) {
                    setWatchlistTitle(watchlistData["title"]);
                    const channels_followed = JSON.parse(watchlistData["json_arrayagg(channel_id)"]);
                    const comments = JSON.parse(watchlistData["json_arrayagg(comments)"]);
                    const channels_in_watch_list = channels_followed.map((channel, index) => ({
                        "channel_name": channel,
                        "comments": comments[index]
                    }));
                    setChannelsInWatchList(channels_in_watch_list);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchWatchlistInfo();
    }, []);

    // Use useEffect to update watchlist_title whenever watchlist changes
    useEffect(() => {
        if (watchlist) {
            setWatchlistTitle(watchlist["title"]);
        }
    }, [watchlist]);

    return (
        <div>
            <>
                {Navbar()}
            </>
            <h1>{username}, here is information on your watchlist titled:</h1>
            <h1>{watchlist_title}</h1>
            <table className="watchlists-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Channel Name</th>
                        <th>Comments</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {channels.map((channel) => (
                        <tr key={channel.channel_name} className="watchlists-row">
                            <td><button onClick={() => handleFollow(channel.channel_name)}>Unfollow ❌</button></td>
                            <td>
                            <a href={`/channel/${channel.channel_name}`}>
                                    {channel.channel_name}
                                </a>
                            </td>
                            <td>{channel.comments}</td>
                            <td><button onClick={() => handleEditComment(channel.channel_name)}>Edit Comment 📝</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Watchlist;
