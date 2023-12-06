import axios from "axios";

const GetRandomChannel = async (watchlist_id, user) => {
    try {

        const response = await axios.get(`http://localhost:8800/randomChannel/`);
        const result = response.data.youtuber;
        window.location.href=`http://localhost:3000/channel/${result}`;

    }
    catch (err) {
        console.log("error editing watchlist name", err)

    }
};

export default GetRandomChannel