import axios from "axios";

const getRandomChannel = async () => {
    try {
        // alert("I'm feeling lucky clicked")
        const response = await axios.get(`http://localhost:8800/randomChannel/`);
        const result = response.data.youtuber;
        window.location.href=`http://localhost:3000/channel/${result}`;

    }
    catch (err) {
        console.log("error editing watchlist name", err)

    }
};

export default getRandomChannel