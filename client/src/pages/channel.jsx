import axios from "axios"
import React, { useEffect, useState } from "react";
import Navbar from "../container/Navbar.jsx"
import { MediaCard, RankCard, StatsCard} from "../container/card.jsx"
import { useParams} from "react-router-dom";
import Grid from '@mui/material/Grid';
import './home.css';

const Channel = () => {
    const { channel_title } = useParams();
    const [channel, setChannel] = useState([]);
    // const [isClick, setClick] = useState();

    useEffect( () => {
        const fetchChannelStats = async () => { 
            try{ 
                const url = "http://localhost:8800/channel/" + channel_title
                const res = await axios.get(url);
                setChannel(res.data);
                console.log("hi");
            } catch(err) {
                console.log(err);
            }
        }
        fetchChannelStats();
    });

    return (
        <div className="page" >
            <>{Navbar()}</>

            <div className="channel">
            <h1>Channel Watch</h1>

            <Grid  container spacing={2}>
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={1}>
                    <>{MediaCard(560, ch.channel_title, ch.subscribers, ch.video_views, ch.uploads, ch.channel_type,ch.region, ch.created_date, ch.created_month, ch.created_year)}</>
                </div>
            ))}
            </Grid>
            <Grid item xs={8}>
            {channel.map((ch) => (
                <div key={4} >
                    <>{StatsCard(460, 'Stats', ch.highest_yearly_earnings, ch.highest_monthly_earnings,ch.lowest_yearly_earnings, ch.lowest_monthly_earnings, ch.subscribers_for_last_30_days, ch.video_views_for_the_last_30_days)}</>
                </div>
            ))}
            </Grid>
            <Grid item xs={12}>
            {channel.map((ch) => (
                <div key={2}>
                    <>{RankCard(460, 'Rankings',ch.country_rank, ch.channel_type_rank,ch.video_views_rank)}</>
                </div>
            ))}
            </Grid>{/*
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={3} >
                    <>{MediaCard(800, ch.channel_title, ch.subscribers, ch.video_views, ch.uploads, ch.country_rank, ch.channel_type,ch.created_year,ch.highest_yearly_earnings,ch.highest_monthly_earnings)}</>
                </div>
            ))}
            </Grid>
            <Grid item xs={12}>
            {channel.map((ch) => (
                <div key={4} >
                    <>{StatsCard(460, 'Stats', ch.highest_yearly_earnings, ch.highest_monthly_earnings,ch.lowest_yearly_earnings, ch.lowest_monthly_earnings, ch.subscribers_for_last_30_days, ch.video_views_for_the_last_30_days)}</>
                </div>
            ))}
            </Grid> */}
            </Grid>
            </div>
        </div>
        
    )
}

export default Channel


// function searchByKeyword() {
//     var results = YouTube.Search.list('id,snippet', {q: 'dogs', maxResults: 25});
  
//     for(var i in results.items) {
//       var item = results.items[i];
//       Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
//     }
//   }