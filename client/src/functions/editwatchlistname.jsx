import axios from "axios";

const editWatchlistName = async (watchlist_id, user) => {
    try {
        const new_name = prompt("Enter the new watchlist name: ");
        const response = await axios.post(`http://localhost:8800/editWatchlist/`, {new_name, watchlist_id, user});
        if(response.data.success){
            window.location.reload(true);
        }
        else{
            alert(response.data.message);
        }

    }
    catch (err) {
        console.log("error editing watchlist name", err)

    }
};

export default editWatchlistName