import {useState} from 'react';

export default function SearchField({initalText, onSearch}) 
{
    const [searchText, setSearchText] = useState(initalText)
    
    function handleSearchClick() {onSearch(searchText)}

    function handleChange(event) {setSearchText(event.target.value)}
    
    return (
    <div>
            <span >
                <input type="text" required value={searchText} onChange={handleChange}/>
            </span>
            <button onClick={handleSearchClick}> GO </button>
      </div>

    );
}