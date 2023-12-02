import * as React from 'react';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './card.css';

export default function MediaCard(size, title, ...data) {
    const labels = ['Subscribers: ', 'Views: ','Uploads: ', 'Country Rank: ','Channel Type: ', 'Year Created: ', 'Highest Yearly Earnings: ', 'Highest Monthly Earnings: '] 

    const listItems = data.map( function(x, i){
        if(labels[i])
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