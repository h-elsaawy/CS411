import axios from "axios";

const deletewatchlistName = async (watchlist_id, watchlist_title, user) => {
    try {
        const delete_bool = confirm(`Are you sure you want to delete  ${watchlist_title} ?`); // eslint-disable-line no-restricted-globals
        if(delete_bool){
            const response = await axios.post(`http://localhost:8800/deleteWatchlist/`, {watchlist_id, watchlist_title, user});
            if(response.data.success){
                window.location.reload(true);
                window.location.href="http://localhost:3000/watchlist/"

            } else {
                alert(response.data.message);
            }
        }
    } catch (err) {
        console.log("error editing watchlist name", err)
}};

export default deletewatchlistName