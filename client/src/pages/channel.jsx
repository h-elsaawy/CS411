import axios from "axios"
import React, { useEffect, useState } from "react";
import Navbar from "../container/Navbar.jsx"
import { MediaCard, RankCard, graphCard, StatsCard} from "../container/card.jsx"
import { useParams} from "react-router-dom";
import Grid from '@mui/material/Grid';
import './home.css';
import Follow from "../functions/follow.jsx";
import getRandomChannel from "../functions/getRandomChannel.jsx";
// import searchAPI from "../functions/googleChannel.jsx";




const Channel = () => {
    const { channel_title } = useParams();
    const [channel, setChannel] = useState([]);
    const username = sessionStorage.getItem("username");
    const handleUnfollow = async (channel_title) => {
        console.log("Clicked to unfollow: " + channel_title)
        try{
            const url = "http://localhost:8800/unfollow";
  
            const url4watchlists = `http://localhost:8800/getWatchlistIds/${username}/${channel_title}`;
            const watchlist_id_res = await axios.get(url4watchlists);
            const returned_watchlists = watchlist_id_res.data
            
            let valid_watchlist_ids = []
            let watchlists_with_channel = ""
            for(let i = 0; i < returned_watchlists.length; i++){
              watchlists_with_channel +=  "\n" + returned_watchlists[i]["watchlist_id"] + " - " + returned_watchlists[i]["title"];
              valid_watchlist_ids.push(parseInt(returned_watchlists[i]["watchlist_id"]));
            }
            let watchlist_id = prompt(`Enter the watchlist id # you want to unfollow from: ${watchlists_with_channel}`);
            if(watchlist_id != null){
              if(valid_watchlist_ids.includes(parseInt(watchlist_id))){
                const res = await axios.post(url, {username, channel_title , watchlist_id});
                window.location.reload(true);
              }
              else{
                alert(`Invalid watchlist id #. Valid watchlists that contain ${channel_title} are: ${valid_watchlist_ids}, but you entered ${watchlist_id}.`);
              }
  
            }
            
        } catch (err) {
            console.log("Error unfollowing:", err);
        }
    };
    const unloggedinFollowClick = () => {
        window.location.href = '/login';
      }

    useEffect( () => {
        const fetchChannelStats = async () => { 
            try{ 
                const url = "http://localhost:8800/channel/" + channel_title
                const res = await axios.get(url);
                setChannel(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchChannelStats();
    }, []);

    

    return (
        <div className="page" >
            <>{Navbar()}</>

            <div className="channel">
            <h1>Channel Watch</h1>
            <div>
            {sessionStorage.getItem("username")  ?
                            (sessionStorage.getItem("watchlist").includes(channel_title) ? 
                                    (<><button className = "followbutton" onClick={() => Follow(channel_title)}>Follow 👆</button>
                                    <button className = "unfollowbutton" onClick={() => handleUnfollow(channel_title)}>Unfollow ❌</button></>) : <button className = "followbutton" onClick={() => Follow(channel_title)}>Follow 👆</button>)
                            : <button onClick={unloggedinFollowClick}>Follow 👆</button>}
            <button onClick={getRandomChannel} style={{float: "right",}} >🍀 I'm feelin' lucky! 🍀</button>
            </div>
            <br></br>
            <Grid  container spacing={2} item style={{width: "1200px"}} >
            {/* <Grid item xs={2}></Grid> */}
            <Grid  item xs={4}>
            {channel.map((ch) => (
                <div key={1}>
                    <>{MediaCard(300, ch.channel_title, ch.subscribers, ch.video_views, ch.uploads, ch.channel_type,ch.region, ch.created_date, ch.created_month, ch.created_year)}</>
                </div>
            ))}
            </Grid>
            
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={4} >
                    <>{graphCard(90,300, 'Yearly Earnings', 'Highest', 'Lowest',ch.highest_yearly_earnings, ch.lowest_yearly_earnings)}</> 
                </div>
            ))}
            </Grid>
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={4} >
                    <>{graphCard(90, 300, 'Monthly Earnings', 'Highest', 'Lowest',ch.highest_monthly_earnings, ch.lowest_monthly_earnings)}</> 
                </div>
            ))}
            </Grid>
            {/* <Grid item xs={1}></Grid>
            <Grid item xs={2}></Grid> */}
            <br></br>
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={2}>
                    <>{RankCard(300, 'Rankings',ch.country_rank, ch.channel_type_rank,ch.video_views_rank)}</>
                </div>
            ))}
            </Grid>
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={4} >
                    <>{graphCard(90,300, 'Subs for Last 30 Days', 'Current', 'Gained',ch.subscribers, ch.subscribers_for_last_30_days)}</> 
                </div>
            ))}
            </Grid>
            <Grid item xs={4}>
            {channel.map((ch) => (
                <div key={4} > {/* left padding, width, labels, data */}
                    <>{graphCard(110, 300, 'Views for Last 30 Days', 'Current', 'Gained',ch.video_views, ch.video_views_for_the_last_30_days)}</> 
                </div>
            ))}
            </Grid>
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