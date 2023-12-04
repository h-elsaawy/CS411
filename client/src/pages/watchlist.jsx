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
                    </tr>
                </thead>
                <tbody>
                    {channels.map((channel) => (
                        <tr key={channel.channel_name} className="watchlists-row">
                            <td>
                                <a href={`/channel/${channel.channel_name}`}>
                                    {channel.channel_name}
                                </a>
                            </td>
                            <td>{channel.comments}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Watchlist;
