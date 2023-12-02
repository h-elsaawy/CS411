import * as React from 'react';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './card.css';

export default function MediaCard(size, title, subs, views,uploads, channel_type,created_year, high_yr, high_mon) {
    const data = [subs, views,uploads, channel_type,created_year, high_yr, high_mon];
    const labels = ['Subscribers: ', 'Views: ','Uploads: ', 'Channel Type: ', 'Year Created: ', 'Highest Yearly Earnings: ', 'Highest Monthly Earnings: '] 

    const listItems = data.map( function(x, i){
        return <li><strong>{labels[i]}</strong>{x}</li>        
    }.bind(this));
  
  return (
    <Card sx={{ maxWidth: size }}>
      {/* <CardMedia
        sx={{ height: 140 }}
        image=""
        title="green iguana"
      /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <ul>
            {listItems}
        </ul>

        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}