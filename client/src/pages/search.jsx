import { React, useState } from "react"
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import Navbar from "../container/Navbar";
import GetRandomChannel from "../functions/getRandomChannel.jsx";

const Search = () => {
    const [search_str, setSearchStr] = useState("");
    const [type_str, setTypeStr] = useState("youtuber");
    const [results, setResults] = useState([]);


    const handleTypeChange = (event) => {
        setTypeStr(event.target.value);
      };

    const handleSubmit = async e => {
        e.preventDefault();

        if (search_str === "") {
            setResults([])
        } else {
            try{
                const url = "http://localhost:8800/search/" 
                const res = await axios.get(url, {params: {search:search_str.trim(), type: type_str}});
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
                <form>
                <label>Search: <input type="text" autoFocus onChange={e => setSearchStr(e.target.value)} /> </label>
                <button type="submit" onClick={handleSubmit}>Submit</button>  
                <button onClick={GetRandomChannel()}>I'm feelin' lucky!</button>
                </form>
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