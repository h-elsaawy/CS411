import { React, useEffect, useState } from "react";
import axios from "axios"
import Header from "./header.jsx"
import { useParams} from "react-router-dom";

const Watchlist = () => {
    const { id } = useParams();
    const username = sessionStorage.getItem('username');
    const [watchlist, setWatchlist] = useState();
    const [channels, setChannelsInWatchList] = useState();
    const [watchlist_title, setWatchlistTitle] = useState();
    

    useEffect(() => {
        const fetchWatchlistInfo = async () => {
            try{
                const url = "http://localhost:8800/getwatchlists/" + username + "/"+ id
                const res = await axios.get(url);
                console.log(res);
                setWatchlist(res.data[0]);
                console.log("gets res data");
                console.log(res.data[0]);
                console.log("stored in watchlist variable:");
                console.log(watchlist);
                setWatchlistTitle(watchlist["title"]);
                const channels_followed = JSON.parse(watchlist["json_arrayagg(channel_id)"]);
                const comments = JSON.parse(watchlist["json_arrayagg(comments)"]);
                const channels_in_watch_list = []
                for(let i = 0; i < channels_followed.length; i++){
                    channels_in_watch_list.push({"channel_name": channels_followed[i], "comments": comments[i]});
                }
                setChannelsInWatchList(channels_in_watch_list);
                console.log(channels);
                console.log();

            } catch (err){
                console.log(err);
            }
        }
        fetchWatchlistInfo();
    }, []);

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
    )
}

export default Watchlist