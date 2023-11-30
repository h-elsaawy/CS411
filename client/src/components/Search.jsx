import { useState } from 'react'
import './Search.css'

import SearchField from './SearchField'

function Search() {
  const [results, setResults] = useState("");
  function search(text) {
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
