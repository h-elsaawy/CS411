import { React, useEffect, useState } from "react";
import axios from "axios"
import Navbar from "../container/Navbar.jsx"



const Watchlists = () => {
    const [watchlists, setWatchlists] = useState([]);
    const username = sessionStorage.getItem('username');
    useEffect(() => {
        const fetchAllWatchlists = async () => {
            try{
                const url = "http://localhost:8800/getwatchlists/" + username
                const res = await axios.get(url);
                setWatchlists(res.data);
                console.log(res.data);
                sessionStorage.setItem('actual_watchlist', JSON.stringify(res.data))
                console.log("here");
                console.log(watchlists);
                // console.log(watchlists[0]["json_arrayagg(channel_id)"]);
            } catch (err){
                console.log(err);
            }
        }
        fetchAllWatchlists();
    });


    return (
        <div>
            <>
            {Navbar()}
            </>
            <h1> Watchlists for {username}: </h1>
            <div className="watchlists">
                {watchlists.map((watchlist) => (
                    <div key={watchlist.watchlist_id} className="watchlist">
                        <h2><a href= {`/watchlist/${watchlist.watchlist_id}`}>{watchlist.title}</a> has channels:</h2>
                        <h2>{watchlist["json_arrayagg(channel_id)"]}</h2>
                </div>
                ))}
            </div>
            
        </div>
    )
}

export default Watchlists