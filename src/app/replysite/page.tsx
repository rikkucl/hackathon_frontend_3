"use client"
import { useAppContext } from "../context";
import { useState,useEffect } from "react"
import Link from "next/link"
import PreviewImage from "../PreviewImage"


interface Tweet {
    id: string;
    name: string;
    date: string;
    liked: number;
    content: string;
    retweet: number;
    figid: string
}
const Replypage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext();
    const [tweet_id, setTweet_id] = useState<string>("")
    const [visibleItems, setVisibleItems] = useState<number[]>([]);

    useEffect(() => {
      const querystring = window.location.search;
      const params = new URLSearchParams(querystring)
      const id = params.get("text")
      if (id) {
        setTweet_id(id)
      }
    }, [])
    const filteredTweets = Tweets.filter(tweet => {
        const regex = new RegExp(tweet_id, 'i');
        return regex.test(tweet.replyto)
    })
    const handleClick = (key: number) => {
        setVisibleItems((prev) =>{
          if (prev.includes(key)) {
            return prev.filter((item) => item !== key);
          } else {
            return [...prev, key]
          }
        })
      }


    return (
        <div>
            {Object.values(filteredTweets).map((tweet, index) => (
            <div className="tweet">
                <div className="tweetcontent">
                <h5>{tweet.name}, {tweet.content}, {tweet.date}, {tweet.liked}</h5>  
                </div>
                {/* <div className="tweetlike">
                <button onClick={() => handlelike(tweet.id)}>いいね{tweet.liked}</button>
                </div> */}
                <div>
                <button onClick={() => handleClick(index)}>code</button>
                </div>
                <div>
                {visibleItems.includes(index) && <div>{tweet.code}</div>}
                </div>
                <Link href={{pathname: '/reply', query: { text: tweet.id } }}>
                リプライ
                </Link>
                <Link href={{pathname: '/replysite', query: { text: tweet.id}}}>
                リプライ一覧
                </Link>
                <PreviewImage imagename={tweet.figid}/>
            </div>  
        )
    )}
    <Link href= "../">
    閲覧画面
    </Link>
    </div>
    )
}
export default Replypage