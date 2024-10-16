"use client"
import React from "react";
import { useState } from "react";
import { useAppContext } from "../context";
import path from "path";
import Link from "next/link";

interface Tweet {
    id: string;
    name: string;
    date: string;
    liked: number;
    content: string;
    retweet: number;
    figid: string
}
const SearchPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const [searchtext, setSearchtext] = useState("")
    const filteredTweets = Tweets.filter(tweet => {
        const regex = new RegExp(searchtext, 'i');
        return regex.test(tweet.content) || regex.test(tweet.name)
    })
    return (
        <div>
        <input type="text" value={searchtext} onChange={(e) => setSearchtext(e.target.value)} placeholder="検索ワードを記入"></input>
        {/* // {filteredTweets.length ===  0 ?
        //     filteredTweets.map(tweet => (
        //         <div className="tweet">
        //             <div className="tweetcontent">
        //             <h5>{tweet.name}, {tweet.content}, {tweet.date}, {tweet.liked}</h5>  
        //             </div>
        //             <div className="tweetlike">
        //             <button onClick={() => handlelike(tweet.id)}>いいね{tweet.liked}</button>
        //             </div>
        //             <PreviewImage imagename={tweet.figid}/>
        //         </div>
        //     )
        // ) : (
        //     <h5>一致するものはありません</h5>
        // )} */}

        {Object.values(filteredTweets).map(tweet => (
            <div className="tweet">
                <div className="tweetcontent">
                <h5>{tweet.name}, {tweet.content}, {tweet.date}, {tweet.liked}</h5>  
                </div>
                <div className="tweetlike">
                {/* <button onClick={() => handlelike(tweet.id)}>いいね{tweet.liked}</button> */}
                </div>
                {/* <PreviewImage imagename={tweet.figid}/> */}
            </div>
        )
    )}
    <Link href={{pathname: "../"}}>
    投稿
    </Link>
    </div>
    )
}
export default SearchPage