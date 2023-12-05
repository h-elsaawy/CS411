import { useState } from 'react'
import './Search.css'
import axios from "axios"

import SearchField from './SearchField'

function Search() {
  const [results, setResults] = useState("");
  function search(text) {

    async function send_search() {
      console.log("search called")

      const response = await fetch(`http://localhost:8800/search/${text}`, {
          text: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data)
        // console.log(response)
        
    }

    send_search()
    return text;
  }
  function handleResultsChange(text)
  {
    setResults(search(text));
  }

  return (
    <>
      <h1>Search</h1>
      <SearchField initalText="" onSearch={handleResultsChange}/>
      <h2> Results: {results} </h2>
    </>
  )
}

export default Search
