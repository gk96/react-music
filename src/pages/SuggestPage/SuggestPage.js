import React from 'react';
import { useEffect, useState} from 'react';
import './SuggestPage.css';
import {Link} from 'react-router-dom'

function SuggestPage(){

    const [suggestItems, setSuggestItems] = useState([]);

    return(
        <div>
            <input type="text" onKeyDown={searchSuggest}/>
            <div className="suggest-list">
                {
                    suggestItems?.map((r) => {
                        console.log(r)
                        return(
                            <Link to={{
                                pathname :"/search",
                                state : {
                                    query: r
                                }
                            }}>
                                {r}
                            </Link>
                        )
                    })
                }
            </div>
        </div>
        
    );


function searchSuggest(event){
    console.log(event.target.value)
    fetch(`${process.env.REACT_APP_API_BASE_URL}/suggest-search?q=${event.target.value}`,{
        // mode: 'no-cors',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
    .then(
        async (res) => {
            let response = await res.json()
            // console.log(response[1])
            setSuggestItems(response[1])
            // console.log(suggestItems)
        }
    )
}
}

export default SuggestPage;