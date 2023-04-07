import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom'
import './SeekBar.css';
import PlayerService from '../../services/PlayerService';

export default function SeekBar() {

    const [context, dispatch] = useContext(AppContext);
    const [mousedownFired, setMouseDownFired] = useState(false);
    var me = context.me;
    const history = useHistory()

    useEffect(() => {
        // console.log(context)
        me?.addEventListener('progress',  progress);
        progress();
        me?.addEventListener('timeupdate', timeupdate);
        timeupdate();
        document.getElementById('seekBar').addEventListener('mouseover', (e) =>{
            document.getElementById("progress-scrub").style.display = 'block'
        })

        document.getElementById('seekBar').addEventListener('mouseout', (e) =>{
            document.getElementById("progress-scrub").style.display = 'none'
        })

        return () => {

            me?.removeEventListener('progress', progress);
            me?.removeEventListener('timeupdate', timeupdate);
            // document.getElementById('seekBar').removeEventListener('mouseover')
            // document.getElementById('seekBar').removeEventListener('mouseout')
            // dispatch({type: "setPlayerState", snippet: "min"})
          }
    }, [])

    function progress(){
        console.log('add to buffer')
        var duration =  me.duration;
        if (me.duration > 0) {
          for (var i = 0; i < me.buffered.length; i++) {
                if (me.buffered.start(me.buffered.length - 1 - i) < me.currentTime) {
                    document.getElementById("buffered-amount").style.width = (me.buffered.end(me.buffered.length - 1 - i) / duration) * 100 + "%";
                    // me.play()
                    // console.clear()
                    console.log("Buffering =>" ,((me.buffered.end(me.buffered.length - 1 - i) / me.duration) * 100).toFixed(0) + "%")
                    // break;
                }
            }
        }
       }

       function timeupdate(){
        var duration =  me.duration;
        if (duration > 0) {
          document.getElementById('progress-amount').style.width = ((me.currentTime / duration)*100) + "%";
          document.getElementById('progress-scrub').style.left = (me.currentTime / duration)*100 + "%";
        }
       }

    function moveThumb(e){
        e.preventDefault();
       if (mousedownFired) {
         setMouseDownFired(false);
         return;
       }
       console.log("click")
       me.pause()
       
       console.log(document.getElementById('progress-scrub').offsetWidth)
      
       // let shiftX = e.clientX - document.getElementById('progress-scrub').getBoundingClientRect().left;
       let newLeft = e.clientX - document.getElementById('seekBar').getBoundingClientRect().left;
      
             // the pointer is out of slider => lock the thumb within the bounaries
             if (newLeft < 0) {
               newLeft = 0;
             }
             let rightEdge = document.getElementById('seekBar').offsetWidth + document.getElementById('progress-scrub').offsetWidth;
             if (newLeft > rightEdge) {
               newLeft = rightEdge;
             }
      
             document.getElementById('progress-scrub').style.left = newLeft + 'px';
             document.getElementById('progress-amount').style.width = newLeft + 'px';
             console.log(me.duration)
             console.log((newLeft/document.getElementById('seekBar').clientWidth) *me.duration)
             
      
             me.currentTime = (newLeft/document.getElementById('seekBar').clientWidth) *me.duration;
             if(context.audioState === "playing"){
               me.play()
             }
      }
  
       
    function onMouseDown(e){
        console.log("md")
        if (context.audioState === "playing"){
        me.pause()
        // setIsPlaying(false)
        }
        // me.pause()
        // e.stopPropagation();
        e.preventDefault(); // prevent selection start (browser action)
        
        let shiftX = e.clientX - document.getElementById('progress-scrub').getBoundingClientRect().left;
        // shiftY not needed, the thumb moves only horizontally
    
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    
        function onMouseMove(event) {
            let newLeft = event.clientX - shiftX - document.getElementById('seekBar').getBoundingClientRect().left;
    
            // the pointer is out of slider => lock the thumb within the bounaries
            if (newLeft < 0) {
            newLeft = 0;
            }
            let rightEdge = document.getElementById('seekBar').offsetWidth + document.getElementById('progress-scrub').offsetWidth;
            if (newLeft > rightEdge) {
            newLeft = rightEdge;
            }
    
            document.getElementById('progress-scrub').style.left = newLeft + 'px';
            document.getElementById('progress-amount').style.width = newLeft + 'px';
            console.log(document.getElementById('seekBar').offsetWidth)
            me.currentTime = (newLeft/document.getElementById('seekBar').offsetWidth) *me.duration;
        }
    
        function onMouseUp() {
            console.log("mup");
            setMouseDownFired(true);
            if(context.audioState === "playing"){
            me.play();
            }
            
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }
        
    }

    return (
        <div id="seekBar" className="seekBar" onClick={moveThumb}>
            <span id="buffered-amount"></span>
            <div id="progress-amount"></div>
            <div onDragStart={() => false} onTouchStart={onMouseDown} onMouseDown={onMouseDown} id="progress-scrub"></div>
        </div>
    );

}


