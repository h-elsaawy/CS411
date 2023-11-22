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

    useEffect( () => {
        const fetchTopChannels = async () => { 
            try{ 
                const res = await axios.get("http://localhost:8800/");
                console.log(res.data)
                setChannels1(res.data[1]);
                setChannels2(res.data[10]);
                setChannels3(res.data[22]);
                setChannels4(res.data[23]);
                setChannels5(res.data[24]);
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
            <h2>Film and Animation (id:1)</h2>
            <div className="categories" >
                {channels1.map( (channels1) => (
                    <div className="category" key={channels1.channel_title}>
                        <img src="\yt_image.png" alt="" />
                        <h3>{channels1.channel_title}</h3>
                        <p>{channels1.num_videos} videos<br></br> {channels1.num_views} views</p>
                        <button className="follow">Follow</button>
                    </div>
                ))}
            </div>

            <h2>Music (id:10)</h2>
            <div className="categories" >
            {channels2.map( (channels2) => (
                    <div className="category" key={channels2.channel_title}>
                        <img src="\yt_image.png" alt="" />
                        <h3>{channels2.channel_title}</h3>
                        <p>{channels2.num_videos} videos<br></br> {channels2.num_views} views</p>
                        <button className="follow">Follow</button>
                    </div>
            ))}
            </div>
            <h2>People and Blogs (id:22)</h2>
            <div className="categories" >
            {channels3.map( (channels3) => (
                    <div className="category" key={channels3.channel_title}>
                        <img src="\yt_image.png"  alt=""/>
                        <h3>{channels3.channel_title}</h3>
                        <p>{channels3.num_videos} videos<br></br> {channels3.num_views} views</p>
                        <button className="follow">Follow</button>
                    </div>
            ))}
            </div>
            <h2>Comedy (id:23)</h2>
            <div className="categories" >
            {channels4.map( (channels4) => (
                    <div className="category" key={channels4.channel_title}>
                        <img src="\yt_image.png"  alt=""/>
                        <h3>{channels4.channel_title}</h3>
                        <p>{channels4.num_videos} videos<br></br> {channels4.num_views} views</p>
                        <button className="follow">Follow</button>
                    </div>
            ))}
            </div>
            <h2>Entertainment (id:24)</h2>
            <div className="categories" >
            {channels5.map( (channels5) => (
                    <div className="category" key={channels5.channel_title}>
                        <img src="\yt_image.png"  alt="" />
                        <h3>{channels5.channel_title}</h3>
                        <p>{channels5.num_videos} videos<br></br> {channels5.num_views} views</p>
                        <button className="follow">Follow</button>
                    </div>
            ))}
            </div>
        </div>
    )
}

export default Home