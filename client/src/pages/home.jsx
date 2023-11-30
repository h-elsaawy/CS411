import React, { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";
 
const Home = () => {
    const [channels1, setChannels1] = useState([])
    const [channels2, setChannels2] = useState([])
    const [channels3, setChannels3] = useState([])
    const [channels4, setChannels4] = useState([])
    const [channels5, setChannels5] = useState([])
 
    const [orders, setOrders] = useState([])
    const renderCategory = (order, channels) => (
        <>
          <h2>{order}</h2>
          <div className="categories">
            {channels.map((channel) => (
              <div className="category" key={channel.channel_title}>
                <img src="\yt_image.png" alt=""/>
                <h3>{channel.channel_title}</h3>
                <p>
                  {channel.num_videos} videos<br/>
                  {channel.num_views} views
                </p>
                <button className="follow">{sessionStorage.getItem("username") ? (<Link to="/">Follow</Link>) : (<Link to="/login">Follow</Link>)}</button>
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
            <div className="menuBar">
                <button className="menu">{sessionStorage.getItem("username") ? (<Link to="/watchlist">Watchlist</Link>) : (<Link to="/login">Watchlist</Link>)}</button>
                <button className="menu"><Link to="/search">Search</Link></button>
                <button className="menu"><Link to="/videos">Videos</Link></button>
                <button className="menu"><Link to="/login">Sign In</Link></button>

            </div>
            <h1>Top Trending Channels</h1>
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