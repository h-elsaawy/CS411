import { React, useState } from "react"
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import Navbar from "../container/Navbar";
import getRandomChannel from "../functions/getRandomChannel.jsx";

const Search = () => {
    const [search_str, setSearchStr] = useState("");
    const [search_cat, setSearchCat] = useState("");
    const [type_str, setTypeStr] = useState("youtuber");
    const [results, setResults] = useState([]);



    const handleTypeChange = (event) => {
        setTypeStr(event.target.value);
      };

    const handleSubmit = async e => {
        e.preventDefault();

        if (search_str === "" && search_cat === "") {
            setResults([])
        } else {
            try{
                const url = "http://localhost:8800/search/" 
                const res = await axios.get(url, {params: {search:search_str.trim(), type: type_str, category: search_cat}});
                console.log(res)
                if (res.data !== undefined) {
                    await setResults(res.data);

                } else {
                    setResults([]);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div>
            <>{Navbar()}</>
            <br></br>
                {/* <form> */}
                <label>Search: <input type="text" autoFocus onChange={e => setSearchStr(e.target.value)} /> </label>
                {type_str === 'category' && (<label> 
                <select id="region" name="region" size="1" onChange={e => setSearchCat(e.target.value)}>
                    <option value="">Select a category</option>
                    <option value="Autos & Vehicles">Autos & Vehicles</option>
                    <option value="Comedy">Comedy </option>
                    <option value="Education">Education</option>
                    <option value="Film & Animation">Film & Animation</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Howto & Style">Howto & Style</option>
                    <option value="Music">Music</option>
                    <option value="News & Politics">News & Politics</option>
                    <option value="Nonprofits & Activism">Nonprofits & Activism</option>
                    <option value="People & Blogs">People & Blogs</option>
                    <option value="Pets & Animals">Pets & Animals</option>
                    <option value="Science & Technology">Science & Technology</option>
                    <option value="Shows">Shows</option>
                    <option value="Sports">Sports</option>
                    <option value="Travel & Events">Travel & Events</option>
                </select>
            </label> )}
                <button type="submit" onClick={handleSubmit}>Search 🔎</button>  
                <button onClick={getRandomChannel}>🍀 I'm feelin' lucky! 🍀</button>

                {/* </form> */}

            <br></br>
            <div>
                <p>Search for:
                    <label>
                        <input
                        type="radio"
                        value="youtuber"
                        checked={type_str=== 'youtuber'}
                        onChange={handleTypeChange}
                        />
                        Youtuber
                    </label>

                    <label>
                        <input
                        type="radio"
                        value="title"
                        checked={type_str=== 'title'}
                        onChange={handleTypeChange}
                        />
                        Video Title
                    </label>

                    <label>
                        <input
                        type="radio"
                        value="tags"
                        checked={type_str=== 'tags'}
                        onChange={handleTypeChange}
                        />
                        Tags
                    </label>

                    <label>
                        <input
                        type="radio"
                        value="category"
                        checked={type_str=== 'category'}
                        onChange={handleTypeChange}
                        />
                        Category
                    </label>
                </p>
            </div>
            
            <p></p>
            <div className="channels">
                {results.map((results, index) => (
                    <div key={index} className="channel">
                        <h2><a href = {"http://localhost:3000/channel/" + results.channel_title}> {results.channel_title}</a></h2>
                        
                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default Search