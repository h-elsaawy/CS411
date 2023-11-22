import React, { useEffect } from "react"
import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom";

const Home = () => {
    const [channels1, setChannels1] = useState([])
    const [channels2, setChannels2] = useState([])

    useEffect( () => {
        const fetchTopChannels = async () => { 
            try{ 
                const res1 = await axios.get("http://localhost:8800/");

                setChannels1(res1.data[0]);
                setChannels2(res1.data[1])
            } catch(err) {
                console.log(err)
            }
        }
        fetchTopChannels()

    }, [])
    return (
        <div>
            <button><Link to="/add">Add a new category</Link></button>
            <button><Link to="/videos">Search Videos</Link></button>
            <button><Link to="/add">Sign In</Link></button>

            <h1>Top Trending Channels</h1>
            <h2>Music Channels</h2>
                        <div className="categories" >
                {channels1.map( (channels1) => (
                    <div className="category" key={channels1.channel_title}>
                        <img src={channels1.cover} alt="" />
                        <h3>{channels1.channel_title}</h3>
                        <p>{channels1.num_videos} videos<br></br> {channels1.num_views} views</p>
                        <button className="follow">Follow</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home