import { React, useState } from 'react'
import axios from 'axios'
import Navbar from '../container/Navbar.jsx'

const Search = () => {
    const [search_str, setSearchStr] = useState('');
    const [results, setResults] = useState([]);


    const handleSubmit = async e => {
        // e.preventDefault();
        if (search_str === '') {
            setResults([])
        } else {
            try{
                const url = 'http://localhost:8800/search/' + search_str
                const res = await axios.get(url);

                setResults(res.data);

                console.log(results);
            } catch (err){
                console.log(err);
            }
        }

  }
    return (
        <div>
            <>{Navbar()}</>
            <p>
                <label>Search: 
                <input type='text' autoFocus onChange={e => setSearchStr(e.target.value)} /> </label>
                <button type='submit' onClick={handleSubmit}>Submit</button>  
            </p>
            <p></p>
            <div className='channels'>
                {results.map((results) => (
                    <div key={results.channel} className='channel'>
                        <h2>{results.channel}</h2>
                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default Search