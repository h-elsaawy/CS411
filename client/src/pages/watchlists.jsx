import { React, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../container/Navbar.jsx";

const Watchlists = () => {
    const [watchlists, setWatchlists] = useState([]);
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        const fetchAllWatchlists = async () => {
            try {
                const url = "http://localhost:8800/getwatchlists/" + username;
                const res = await axios.get(url);
                const watchlistsData = res.data;
                setWatchlists(watchlistsData);
                console.log(watchlistsData);
                sessionStorage.setItem('actual_watchlist', JSON.stringify(watchlistsData));
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllWatchlists();
    }, []); // Run this effect only once on mount

    return (
        <div>
            <>
                {Navbar()}
            </>
            <h1> Watchlists for {username}: </h1>
            <div className="watchlists">
                {watchlists.map((watchlist) => (
                    <div key={watchlist.watchlist_id} className="watchlist">
                        <h2><a href={`/watchlist/${watchlist.watchlist_id}`}>{watchlist.title}</a> has channels:</h2>
                        <h2>{watchlist["json_arrayagg(channel_id)"]}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watchlists;
