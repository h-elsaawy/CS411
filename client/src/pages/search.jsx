import { React, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
// import Header from "../pages/header.jsx"

const Search = () => {
    const [search_str, setSearchStr] = useState("");
    // const type_str = "youtuber"
    const [type_str, setTypeStr] = useState("youtuber");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleTypeChange = (event) => {
        setTypeStr(event.target.value);
      };


    const handleSubmit = async e => {
        // e.preventDefault();

        if (search_str === "") {
            setResults([])
        } else {
            try{
                const url = "http://localhost:8800/search/" 
                const res = await axios.get(url, {params: {search:search_str, type: type_str}});
                console.log(res)
                if (res.data !== undefined) {
                    setResults(res.data);
                } 
                else
                {
                    setResults([]);
                }

                console.log(results);
            } catch (err){
                console.log(err);
            }
        }

  }
    return (
        <div>
            {/* <>{Header()}</> */}
            <p>
                <label>Search: 
                <input type="text" autoFocus onChange={e => setSearchStr(e.target.value)} /> </label>
                <button type="submit" onClick={handleSubmit}>Submit</button>  
            </p>
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
                        Title
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
                        <h2>{results.title}</h2>
                        <a href = {"http://localhost:3000/" + results.channel_title}> {"View channel"}</a>
                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default Search