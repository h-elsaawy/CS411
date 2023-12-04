import { React, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'


export default async function follow(channel_title) {
    try {
    console.log("Clicked follow for channel: " + channel_title)
    let watchlist = JSON.parse(sessionStorage.getItem('watchlist'))
    watchlist.push(channel_title)
    console.log( watchlist)
    } catch(err) {
        console.log(err)
    }


}