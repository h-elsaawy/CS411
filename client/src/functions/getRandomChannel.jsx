import axios from "axios";

const getRandomChannel = async () => {
    try {
        // alert("I'm feeling lucky clicked")
        const response = await axios.get(`http://localhost:8800/randomChannel/`);
        const result = await response.data;

        console.log(result)
        // alert("I'm feeling lucky clicked")

        if (result.success) {
            window.location.href=`http://localhost:3000/channel/${result.youtuber}`;
        }    
    }
    catch (err) {
        console.log("error editing watchlist name", err)

    }
};

export default getRandomChannel;