import { React, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../container/Navbar";
import { useParams } from "react-router-dom";

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
            await axios.post(url, { username, channel_title, watchlist_id });
            // Update state only after a successful unfollow
            setChannelsInWatchList((prevChannels) =>
                prevChannels.filter((channel) => channel.channel_name !== channel_title)
            );
        } catch (err) {
            console.log("Error unfollowing:", err);
        }
    };

    const handleEditComment = async (channel_title) => {
        console.log("Clicked to edit comment for: " + channel_title);
        try {
            // Replace this URL with your actual edit comment API endpoint
            const editCommentUrl = "http://localhost:8800/editComment";
            const newComment = prompt("Enter new comment:");
            if (newComment !== null) {
                await axios.post(editCommentUrl, { username, channel_title, newComment });
                // Update state only after a successful comment edit
                setChannelsInWatchList((prevChannels) =>
                    prevChannels.map((channel) =>
                        channel.channel_name === channel_title
                            ? { ...channel, comments: newComment }
                            : channel
                    )
                );
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
                            <td>
                                <button onClick={() => handleUnfollow(channel.channel_name)}>
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
                                <button onClick={() => handleEditComment(channel.channel_name)}>
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
