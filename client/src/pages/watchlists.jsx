import React from "react"
import { useEffect } from "react";
import { useState } from "react"
import axios from "axios"
import Header from "./header.jsx"


const Watchlists = () => {
    const [watchlists, setWatchlists] = useState([]);
    const username = sessionStorage.getItem('username');
    useEffect(() => {
        const fetchAllWatchlists = async () => {
            try{
                const url = "http://localhost:8800/getwatchlists/" + username
                const res = await axios.get(url);
                setWatchlists(res.data);

                console.log(watchlists[0]["json_arrayagg(channel_id)"]);
            } catch (err){
                console.log(err);
            }
        }
        fetchAllWatchlists();
    }, []);


    return (
        <div>
            <>
            {Header()}
            </>
            <h1> Watchlists for {username}: </h1>
            <div className="watchlists">
                {watchlists.map((watchlist) => (
                    <div key={watchlist.watchlist_id} className="watchlist">
                        <h2>{watchlist.watchlist_id}</h2>
                        <h2>{watchlist.title} has channels:</h2>
                        <h2>{watchlist["json_arrayagg(channel_id)"]}</h2>
                        {/* {watchlist["json_arrayagg(channel_id)"].map((channel) => (
                            <div key = {channel} className="channel">
                                <h2>{channel}</h2>
                                </div>
                        ))

                        } */}
                        
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Watchlists