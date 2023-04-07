import React from 'react';
import './CardSlider.css';
import {Card, CardActionArea, CardMedia, Typography, CardContent} from '@material-ui/core'
import { useEffect, useState, useContext} from 'react';
import { AppContext } from '../../context/AppContext';

function CardSlider({items, handleClick}){

    const[cardItems, setCardItems] = useState();
    const [context, dispatch] = useContext(AppContext);

    useEffect(() => {
          console.log("card slider effect")
        //   console.log(items)
          setCardItems(items);
      }, [items])

    return(
        <div className="silderContainer">
            {
                
            cardItems?.map((item) =>{
                return (
            <Card key={item?.videoId} style={{'display' : 'inline-block', 'whiteSpace': 'pre-line' ,'width': '50%', 'height': '30vh', 'margin': '2.5%'}} >
            <CardActionArea onClick={(e) => {handleClick(e, {videoId: item?.videoId, title: item?.title, imageUrl: item?.imageUrl})}}>
                <CardMedia
                component="img"
                height="140"
                image={item?.imageUrl}
                alt="album art"
                style={{objectFit: 'fill'}}
                />
                <CardContent>
                    {item?.title}
                </CardContent>
            </CardActionArea>
            </Card>
        )})
        }
        </div>
        
    )
}

export default CardSlider;