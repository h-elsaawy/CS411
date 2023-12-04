import React, { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";

import follow from "../functions/follow.jsx"
import Header from "./header.jsx"

const Home = () => {
    const [channels1, setChannels1] = useState([])
    const [channels2, setChannels2] = useState([])
    const [channels3, setChannels3] = useState([])
    const [channels4, setChannels4] = useState([])
    const [channels5, setChannels5] = useState([])
 
    const [orders, setOrders] = useState([])



    const handleRemove = (channel_title) => {
      console.log("Clicked unfollow for channel: " + channel_title)
    }
    const renderCategory = (order, channels) => (
        <>
          <h2 className="CategoryTitle">{order}</h2>
          <div className="categories">
            {channels.map((channel) => (
              <div className="category" key={channel.channel_title}>
                <img className="channelCover" src="\yt_image.png" alt=""/>
                <h3 id="channelTitle">
                {sessionStorage.getItem("watchlist") ?
                  (sessionStorage.getItem("watchlist").includes(channel.channel_title) ? (<>{channel.channel_title} ❤️</>) : (<>{channel.channel_title}</>))
                  : (<>{channel.channel_title}</>)
                }
            </h3>
                <p>
                  {channel.num_videos} videos<br/>
                  {channel.num_views} views
                </p>

                  {sessionStorage.getItem("username")  ?
                            (sessionStorage.getItem("watchlist").includes(channel.channel_title) ? 
                                    (<button onClick={() => handleRemove(channel.channel_title)}>Remove</button>) : (<button onClick={() => follow(channel.channel_title)}>Follow 👆</button>))
                            : (<button><Link to="/login">Follow 👆</Link></button>)}

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

                setChannels1(res.data[orders[0]]);
                setChannels2(res.data[orders[1]]);
                setChannels3(res.data[orders[2]]);
                setChannels4(res.data[orders[3]]);
                setChannels5(res.data[orders[4]]);
 
                setOrders(res.data["order"]);

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