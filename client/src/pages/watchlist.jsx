import { React, useEffect, useState } from "react";
import axios from "axios"
import Header from "./header.jsx"
import { useParams } from "react-router-dom";

const Watchlist = () => {
    const { id } = useParams();
    const username = sessionStorage.getItem('username');
    const [watchlist, setWatchlist] = useState();
    const [channels, setChannelsInWatchList] = useState([]);
    const [watchlist_title, setWatchlistTitle] = useState();

    const [refresh, setRefresh] = useState(false); // Add a state for refreshing
    const handleFollow = async (channel_title) => {
        console.log("Clicked to unfollow: " + channel_title)
        try{
            const url = "http://localhost:8800/unfollow";
            const res = await axios.post(url, {username, channel_title});
            console.log(res);
            setChannelsInWatchList((prevChannels) => {
                const updatedChannels = prevChannels.filter((channel) => channel.channel_name !== channel_title);
                return updatedChannels;
            });
        } catch (err) {
            console.log("Error unfollowing:", err);
        }
    };
    const handleEditComment = async (channel_title) => {
        console.log("Clicked to edit comment for: " + channel_title)
        try {
            // Replace this URL with your actual edit comment API endpoint
            const editCommentUrl = "http://localhost:8800/editComment";
            const newComment = prompt("Enter new comment:"); // You may use a more sophisticated UI for this
            if (newComment !== null) {
                await axios.post(editCommentUrl, { username, channel_title, newComment });
                // Refreshes the state of watchlist
                setChannelsInWatchList((prevChannels) => {
                    const updatedChannels = prevChannels.map((channel) => {
                        if (channel.channel_name === channel_title) {
                            return { ...channel, comments: newComment };
                        }
                        return channel;
                    });
                    return updatedChannels;
                });
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
                {Header()}
            </>
            <h1>{username}, here is information on your watchlist titled:</h1>
            <h1>{watchlist_title}</h1>
            <table className="watchlists-table">
                <thead>
                    <tr>
                        <th>Channel Name</th>
                        <th>Comments</th>
                        <th></th>
                        <th>Channel Name</th>
                        <th>Comments</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {channels.map((channel) => (
                        <tr key={channel.channel_name} className="watchlists-row">
                            <td>
                                <a href={`/channel/${channel.channel_name}`}>
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
