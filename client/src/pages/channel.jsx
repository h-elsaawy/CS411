import axios from "axios"
import React, { useEffect, useState } from "react";
import Navbar from "../container/Navbar.jsx"
import MediaCard from "../container/card.jsx"
import { useParams} from "react-router-dom";

const Channel = () => {
    const { channel_title } = useParams();
    const [channel, setChannel] = useState([]);

    useEffect( () => {
        const fetchChannelStats = async () => { 
            try{ 
                const url = "http://localhost:8800/channel/" + channel_title
                const res = await axios.get(url);
                setChannel(res.data);

                // console.log(res.data);

            } catch(err) {
                console.log(err)
            }
        }
        fetchChannelStats();
    });
    return (
        
        <div className="page" >
            <>{Navbar()}</>

            <div className="channel">
            <h1>Channel Watch</h1>
                {
                channel.map((ch) => (
                    <div key={ch.channel} className="channel">
                        <>{MediaCard(360, ch.channel_title, ch.subscribers, ch.video_views,ch.uploads, ch.channel_type,ch.created_year,ch.highest_yearly_earnings,ch.highest_monthly_earnings)}</>
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default Channel