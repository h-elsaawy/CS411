import {google} from 'googleapis';
import axios from "axios";


const searchAPI = ( title ) => {
    const gkey =  'AIzaSyCdDcjjmeViKyh4l5-JYD7HnjxukmKMum4';
    const youtube = google.youtube('v3');
    let results = {};
    let pfp_url = '';
    let channelId = '';
    let googleTitle = '';

    let data = [{
        channel_title: title, subscribers: null, video_views: null, uploads: null,
        region: null, channel_type: null, video_views_rank: null, country_rank: null,
        channel_type_rank: null, lowest_monthly_earnings: null, highest_monthly_earnings: null, 
        lowest_yearly_earnings: null, highest_yearly_earnings: null, subscribers_for_last_30_days: null,
        video_views_for_the_last_30_days: null, created_year: null, created_month: null, created_date: null
      }];

    try {
        youtube.search.list({
            auth: gkey,
            part: 'snippet',
            q: title,
        }, (err, res) => {
            if (err) {
                console.log('The API returned an error: ' + err);
            }
            results = res.data.items;
            if (!results[0]) {
                console.log('No channel found i search.');
            } else {
                pfp_url = results[0]['snippet']['thumbnails']['high']['url']; 
                // save session storage /////////////////////////////////////////////////////////////
                channelId = String(results[0]['snippet']['channelId']); 
                googleTitle = results[0]['snippet']['channelTitle']

                // youtube.channels.list({
                //     auth: gkey,
                //     part: 'statistics',
                //     id: channelId
                // },  (err2, res2) => {
                //     if (err2) {
                //         console.log('The API returned an error: ' + err2);
                //         return ;
                //     }
                //     const bigResults = res2.data.items;
                //     if (!bigResults) {
                //         console.log('No channel found.');
                //         return ;
                //     } else {
                //         if(!bigResults[0]) {
                //             return data
                //         }    

                //         data[0].video_views = bigResults[0]['statistics']['viewCount'];
                //         data[0].subscribers = bigResults[0]['statistics']['subscriberCount'];
                //         data[0].uploads = bigResults[0]['statistics']['videoCount'];  
                //         // call to backend
                //         const response = axios.get(`http://localhost:8800/google/${title}/${data[0].subscribers}/${data[0].video_views}/${data[0].uploads}`);
                                  
                //         console.log(data[0]);  
                    // }
                // })
            }    
        })
    }catch(err) {
        console.log(err);
    }
    return (
        //will return the status of the code running
        true
        );
};

// searchAPI('PTXofficial');

export default searchAPI;


