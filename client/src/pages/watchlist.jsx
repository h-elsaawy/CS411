import { React, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../container/Navbar";
import { useParams } from "react-router-dom";
import editWatchlistName from "../functions/editwatchlistname.jsx";
import deleteWatchlistName from "../functions/deletewatchlistname.jsx";
import './home.css';

const Watchlist = () => {
    const { id } = useParams();
    const username = sessionStorage.getItem('username');
    const [watchlist, setWatchlist] = useState();
    const [channels, setChannelsInWatchList] = useState([]);
    const [watchlist_title, setWatchlistTitle] = useState();

    const handleUnfollow = async (channel_title, watchlist_id) => {
        console.log("Clicked to unfollow: " + channel_title);
        try {
            const url = "http://localhost:8800/unfollow";
            const res3 = await axios.post(url, { username, channel_title, watchlist_id });
            console.log(res3);
            if(res3.data.success){
                setChannelsInWatchList((prevChannels) =>
                prevChannels.filter((channel) => channel.channel_name !== channel_title)
            );
            }
            else{
                alert(res3.data.message);
            }
            // Update state only after a successful unfollow
            
        } catch (err) {
            console.log("Error unfollowing:", err);
        }
    };

    const handleEditComment = async (channel_title, id) => {
        console.log("Clicked to edit comment for: " + channel_title);
        try {
            // Replace this URL with your actual edit comment API endpoint
            const editCommentUrl = "http://localhost:8800/editComment";
            const newComment = prompt("Enter new comment:");
            if (newComment !== null) {
                const result = await axios.post(editCommentUrl, { username, channel_title, newComment, id });
                if(result.data.success){
                    setChannelsInWatchList((prevChannels) =>
                    prevChannels.map((channel) =>
                        channel.channel_name === channel_title
                            ? { ...channel, comments: newComment }
                            : channel
                    )
                );
                }
                else{
                    alert(result.data.message);
                }
                // Update state only after a successful comment edit
                
            }
        } catch (err) {
            console.error("Error editing comment:", err);
        }
    };

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
                        "comments": comments[index],
                    }));
                    setChannelsInWatchList(channels_in_watch_list);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchWatchlistInfo();
    }, []); // Run this effect only once on mount

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
            <h1>@{username}, here is information on your watchlist titled:</h1>
            <h2><u>{watchlist_title}</u> </h2>
            <button onClick={() => editWatchlistName(id, username)}>Edit Watchlist Name 📝</button> 
            <button onClick={() => deleteWatchlistName(id, watchlist_title, username)}>Delete Watchlist ❌</button>

            <br></br><br></br>
            <table className="watchlists-table" cellPadding="4" cellSpacing="2">
                
                <thead>
                    <tr>
                        <th></th>
                        <th width="250">Channel Name</th>
                        <th width="550">Comments</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {channels.map((channel) => (
                        <tr key={channel.channel_name} className="watchlists-row">
                            <td>
                                <button className="unfollowbutton" onClick={() => handleUnfollow(channel.channel_name, id)}>
                                    Unfollow ❌
                                </button>
                            </td>
                            <td>
                                <a href={`/channel/${channel.channel_name}`}>
                                    {channel.channel_name}
                                </a>
                            </td>
                            <td>{channel.comments}</td>
                            <td>
                                <button onClick={() => handleEditComment(channel.channel_name, id)}>
                                    Edit Comment 📝
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Watchlist;
