import React, { useState } from 'react';
import { ListItem, ListItemText,  CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Link
} from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';



const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));


export default function BoardListItem({ id, board_uid, board_name, boardImg }) {
   
    const classes = useStyles();
    const [clickBoard, setClickBoard] = useState('');
    console.log(id, board_name, boardImg);
    
    
    return (
      
      <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="board_image"
          height="100"
          image= 'https://source.unsplash.com/random'
          title={board_name}
        />
        <CardContent>
          <h1>{board_name}</h1>
          <Link to={{pathname:`/chat/${board_name}`, state:{board_name, board_uid}}}>Click to Send Message in this Board </Link>
        </CardContent>
      </CardActionArea>

    </Card>
        
    );
}

