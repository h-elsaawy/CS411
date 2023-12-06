import * as React from 'react';
import { Link } from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import Button from '@mui/material/Button';
import Follow from "../functions/follow.jsx"

import Chart from 'chart.js/auto'


import './card.css';
import { red } from '@mui/material/colors';

export function smallCard(size, channel_title, num_videos, num_views){

  return (
    <Card sx={{ width: size, minHeight:size}} className="cards">
      <CardMedia
        component="img"
        width={100}
        image="/yt_image.png"
        alt="Profile Picture" 
      /> 
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {channel_title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {num_videos} videos<br/>
          {num_views} views
        </Typography>
        <Button variant="outlined">{sessionStorage.getItem("username") ? (<Link to=".">Follow</Link>) : (<Link to="/login">Follow</Link>)}</Button>
      </CardContent>
    </Card>
  );
}

export function RankCard(size, title, ...data) {
  const labels = ['Country Rank: ','Channel type Rank: ', 'Video Views Rank: '] 

  const listItems = data.map( function(x, i){
      if(labels[i])
          return <li key={(x,i)}><strong>{labels[i]}</strong>{x}</li>        
  }.bind());

return (
  <Card sx={{ maxWidth: size }}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <ul>
      <Typography variant="body2" color="text.secondary">
          {listItems}
      </Typography>
      </ul>
    </CardContent>
  </Card>
);
}

export function graphCard(lp,size, title, label1, label2, ...stats) {
return (
  <Card sx={{ maxWidth: size}}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <BarChart
          xAxis={[
            {
              id: 'earnings',
              data: [label1,label2],
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: stats,
            },
          ]}
          width={size}
          height={300}
          margin={{top: 50, right: 50, bottom: 50, left: lp}}
          colors={['#ff0000']}
        />
    </CardContent>
  </Card>
);
}

export function StatsCard(size, title, label1, label2, label3,...stats) {

return (
  <Card sx={{ maxWidth: size }}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <BarChart
          xAxis={[
            {
              id: 'earnings',
              data: [label1,label2,label3],
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: stats,
            },
          ]}
          width={size}
          height={300}
          margin={{top: 50, right: 50, bottom: 50, left: 90}}
          colors={['#ff0000']}
        />
    </CardContent>
  </Card>
);
}






export function MediaCard(size, channel_title, ...data) {
    const labels = ['Subscribers: ', 'Views: ','Uploads: ','Type: ', 'Region: ',  'Created Date: ', 'Created Month: ', 'Created Year: ' ] 

    const listItems = data.map( function(x, i){
        if(labels[i])
            return <li key={(x,i)}><strong >{labels[i]}</strong>{x}</li>        
    }.bind());
  
  return (
    <Card sx={{ maxWidth: size }}>
      <CardMedia
        component="img"
        width={100}
        image="/yt_image.png"
        alt="Profile Picture" 
      /> 
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {channel_title}
        </Typography>
        <ul>
        <Typography variant="body2" color="text.secondary">
            {listItems}
        </Typography>
        </ul>
      </CardContent>
      <CardActions>
        </CardActions>
    </Card>
  );
}