import { React, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../container/Navbar.jsx";
import editWatchlistName from "../functions/editwatchlistname.jsx";
import deleteWatchlistName from "../functions/deletewatchlistname.jsx";
import './home.css';

const Watchlists = () => {
    const [watchlists, setWatchlists] = useState([]);
    const [actual_watchlists, setActualWatchlists] = useState([]);
    const username = sessionStorage.getItem('username');

    const handleEditComment = async(channel_title, id) => {
        try{
            const editCommentUrl = "http://localhost:8800/editComment";
            const newComment = prompt("Enter new comment: ");
            if (newComment !== null){
                const result = await axios.post(editCommentUrl, {username, channel_title, newComment, id});
                if(result.data.success){
                    console.log("do stuff to refersh");
                    window.location.reload(true)
                }
                else{
                    alert(result.data.message);
                }
            }
        }
        catch (err){
            console.error("erro editing comment: ", err);
        }
    }
    
    const handleUnfollow = async(channel_title, watchlist_id) => {
        try {
            const url = "http://localhost:8800/unfollow";
            const res3 = await axios.post(url, { username, channel_title, watchlist_id });
            console.log(res3);
            if(res3.data.success){
                window.location.reload(true)
            }
            else{
                alert(res3.data.message);
            }

        }
        catch (err) {
            console.log("Error unfollowing:", err);
        }
    }

    useEffect(() => {
        const fetchAllWatchlists = async () => {
            try {
                const url = "http://localhost:8800/getwatchlists/" + username;
                const res = await axios.get(url);
                const watchlistsData = res.data;
                setWatchlists(watchlistsData);
                sessionStorage.setItem('actual_watchlist', JSON.stringify(watchlistsData));
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllWatchlists();
    }

    , []); // Run this effect only once on mount

    useEffect(() => {
        if (watchlists) {
            console.log(watchlists);
            let list_of_actual_watchlists = []
                for(let i = 0; i<watchlists.length; i++){
                    const watchlist = watchlists[i];
                    const channels = JSON.parse(watchlist["json_arrayagg(channel_id)"]);
                    const comments = JSON.parse(watchlist["json_arrayagg(comments)"]);

                    let final_watchlist = {"id": watchlist["watchlist_id"],"name":watchlist["title"], "channels": [], "comments": []}
                    for(let j = 0; j< channels.length; j++){
                        final_watchlist.channels.push(channels[j]);
                        final_watchlist.comments.push(comments[j]);
                    }
                    list_of_actual_watchlists.push(final_watchlist);
                }
            setActualWatchlists(list_of_actual_watchlists);
            console.log(actual_watchlists);
        }
    }, [watchlists]);
    return (
        <div>
            <>
                {Navbar()}
            </>
            <h1> Watchlists for {username}: </h1>
            _____________________________________________________________________________________________________________________________________________________________
            <div className="">
                {actual_watchlists.map((watchlist, index)=> (
                    <div key = {watchlist.id} className = "">
                        <h2><a href={`/watchlist/${watchlist.id}`}>{watchlist.name}</a>: </h2>
                        <button onClick={() => editWatchlistName(watchlist.id, username)}>Edit Watchlist Name 📝</button> 
                        <button className="unfollowbutton" onClick={() => deleteWatchlistName(watchlist.id,watchlist.name, username)}>Delete Watchlist ❌</button>
                            
                            <table className="watchlists-table" cellPadding="2" cellSpacing="2">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th width="250">Channel Name</th>
                                        <th width="550">Comments</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {watchlist["channels"].map((channel, ind) => (
                                    <tr key = {channel} className = "" >
                                        <td><button className="unfollowbutton" onClick={() => handleUnfollow(channel, watchlist.id)}>Unfollow ❌</button></td>
                                        <td><a href={`/channel/${channel}`}>{channel}</a></td>
                                        <td>{watchlist["comments"][ind]}</td>
                                        <td><button onClick={() => handleEditComment(channel, index+1)}>Edit Comment 📝</button></td>
                                    </tr>))}

                                </tbody>
                                


                            </table>
                            _____________________________________________________________________________________________________________________________________________________________


                            




                    </div>



                ))}


            </div>


        </div>
    );
};

export default Watchlists;
