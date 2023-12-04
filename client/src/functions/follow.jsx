import {React, useState, useEffect } from "react";
import axios from "axios";

const Follow = ({ channel_title: channel_title }) => {
  const [selectedWatchlist, setSelectedWatchlist] = useState("");
  const [watchlists, setWatchlists] = useState([]);

  // Fetch user's watchlists
  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const response = await axios.get("http://localhost:8800/watchlists");
        
        setWatchlists(response.data.watchlists);
        console.log(watchlists)
      } catch (error) {
        console.error("Error fetching watchlists", error);
      }
    };

    fetchWatchlists();
  });

  const handleFollow = async () => {
    try {
      const response = await axios.post("http://localhost:8800/follow", {
        channel_title: channel_title,
        watchlistName: selectedWatchlist,
      });

      if (response.data.success) {
        console.log(`Successfully followed ${channel_title} to ${selectedWatchlist}`);
        // Add logic to update UI or handle success
      } else {
        console.error(`Failed to follow ${channel_title}`, response.data.message);
        // Add logic to handle failure
      }
    } catch (error) {
      console.error("Error in follow request", error);
      // Add logic to handle error
    }
  };

  return (
    <div>
      <p>Select watchlist:</p>
      <select value={selectedWatchlist} onChange={(e) => setSelectedWatchlist(e.target.value)}>
        <option value="">Select watchlist</option>
        {watchlists.map((watchlist) => (
          <option key={watchlist} value={watchlist}>
            {watchlist}
          </option>
        ))}
      </select>
      <button onClick={handleFollow}>Follow 👆</button>
    </div>
  );
};

export default Follow;