import  {React, useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom";

import Header from "./header.jsx"

const Home = () => {
    const [channels1, setChannels1] = useState([])
    const [channels2, setChannels2] = useState([])
    const [channels3, setChannels3] = useState([])
    const [channels4, setChannels4] = useState([])
    const [channels5, setChannels5] = useState([])
 
    const [orders, setOrders] = useState([])

    const handleFollow = (channel_title) => {

      const fetchAllWatchlists = async () => {
        try{
            const url = "http://localhost:8800/getwatchlists/" + sessionStorage.getItem("username")
            const res = await axios.get(url);
            setWatchlists(res.data);

            // console.log(watchlists[0]["json_arrayagg(channel_id)"]);
        } catch (err){
            console.log(err);
        }
      }
      fetchAllWatchlists();

      const addChannel = async () => {
        try{
            const url = "http://localhost:8800/follow/"
            const body = {
              username: sessionStorage.getItem("username"),
              channel_id: channel_title,
              title: "watchlist 1",
              watchlist_id: 1};
            const res = await axios.get(url);
            setWatchlists(res.data);

            // console.log(watchlists[0]["json_arrayagg(channel_id)"]);
        } catch (err){
            console.log(err);
        }
      }
      console.log("Button clicked for " + channel_title)
      
    }
    const renderCategory = (order, channels) => (
        <>
          <h2 className="CategoryTitle">{order}</h2>
          <div className="categories">
            {channels.map((channel) => (
              <div className="category" key={channel.channel_title}>
                <img className="channelCover" src="\yt_image.png" alt=""/>
                <h3 id="channelTitle">
                  { (sessionStorage.getItem("watchlist")) ?
                      (sessionStorage.getItem("watchlist").includes(channel.channel_title) ? 
                        (<>{channel.channel_title} ❤️</>) : (<>{channel.channel_title}</>))
                    : (<>{channel.channel_title}</>)
                    } 
                </h3>
                <p>
                  {channel.num_videos} videos<br/>
                  {channel.num_views} views
                </p>
                <button className="follow" value={channel.channel_title} onClick={e => handleFollow(channel.channel_title)}>
                  {sessionStorage.getItem("username") ? (<Link to="/">Follow</Link>) : (<Link to="/login">Follow</Link>)}
                </button>
              </div>
            ))}
          </div>
        </>
      );
 
    useEffect( () => {
        const fetchTopChannels = async () => { 
            try{ 
                const res = await axios.get("http://localhost:8800/");
 
                let orders = res.data["order"];
                console.log(orders);
                setChannels1(res.data[orders[0]]);
                setChannels2(res.data[orders[1]]);
                setChannels3(res.data[orders[2]]);
                setChannels4(res.data[orders[3]]);
                setChannels5(res.data[orders[4]]);
 
                setOrders(res.data["order"]);
                console.log(orders);
            } catch(err) {
                console.log(err)
            }
        }
        fetchTopChannels();
        //var hasUsername = sessionStorage.getItem("username");
        
    }, [])
    return (
        <div>
            <>{Header()}</>
            
            <h1 className="pageTitle">Top Trending Channels</h1>
                <>
                {renderCategory(orders[0], channels1)}
                {renderCategory(orders[1], channels2)}
                {renderCategory(orders[2], channels3)}
                {renderCategory(orders[3], channels4)}
                {renderCategory(orders[4], channels5)}
                </>

        </div>
    )
}
 
export default Home