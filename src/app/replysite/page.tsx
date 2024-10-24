"use client"
import { useAppContext } from "../context";
import { useState,useEffect } from "react"
import React from "react";
import Link from "next/link"
import PreviewImage from "../lib/PreviewImage"
import "../App.css";
//import { Form } from "./Tweet"
import { isAwaitExpression } from "typescript";
//import { LoginForm } from './FirebaseLogin';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { fireAuth, db } from "../lib//firebase";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, namedQuery } from "firebase/firestore";
//import Post from "./PostFigure"
import { useRouter } from "next/navigation"
import PreviewImageFromUser from "../lib/PreviewImageFromUser"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";


interface Tweet {
  id: string;
  name: string;
  date: string;
  liked: number;
  content: string;
  retweet: number;
  figid: string;
  code: string;
  errormessage: string;
  lang: string;
  replyto: string;
  replynumber: number;
  retweetto: string;
  retweetcomment: string;
}
const Replypage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext();
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
    useEffect(() => {
      const auth = getAuth();
      const user = auth.currentUser
      if (user) {
        const uid = user.uid
        fetchUser(uid)
      } else {
        console.log("cannot find user")
      }
    })
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
      const handlelike = async (id: string) => {
        try {
          const response = await fetch(
            "https://hackathon-backend-1012715555694.us-central1.run.app/like", 
            {
              method: "POST",
              // headers: {
              //   'Content-Type': "application/json",
              // },
              body: JSON.stringify({
                tweet_id: id,
                user_id: displayname,
              }),
            })
            fetchTweet()
        }catch (err){
          console.log(err)
        }
      }
      const fetchTweet = async () => {
        try {
          const res = await fetch(
            "https://hackathon-backend-1012715555694.us-central1.run.app/tweet",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            }
          );
          if (!res.ok) {
            console.log(res)
            throw Error('Failed to fetch users: {res.status}');
          }
          const data:Tweet[] = await res.json();
          setTweets(data)
          //const data:User[] = await res.json();
          //setUsers(data)
        }catch (err) {
          console.log(err)
        }
      }
      
  const fetchUser = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setDisplayfig(userDoc.data().figid)
        setDisplayname(userDoc.data().registername)
      } else {
        console.log("userfigid is not defined")
        setDisplayfig("")
      }
    } catch (err) {
      console.log("error happened", err)
    }
  }
  const ConvertFromIdToName = (id: string) => {
    const TweetFiltered: Tweet| undefined = Tweets.find(tweet => tweet.id === id)
    if (TweetFiltered !== undefined) {
      return TweetFiltered.name
    } else {
      return ""
    }
  }
    

    return (
      <div>
      <div className="app">
      <div className="user_container">
      {Object.values(filteredTweets).map((tweet, index) =>
        tweet.retweetto === "" ? (
          <div className="tweet">
          <div className="user_fig">
            <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
            <PreviewImageFromUser tweetname={tweet.name} />
            </Link>
          </div>
          <div className="tweet_all">
            <div className="tweet_user">
              <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
              {tweet.name}              
              </Link>
              <div className="tweetdate">
              {tweet.date}
            </div>
            </div> 
          <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
            <div className="tweetcontent">
            <h5>{tweet.content}</h5>  
            </div>
            </Link> 
            <div className="tweetoption">
            <div className="tweetlike">
                <button onClick={() => handlelike(tweet.id)} className="tweet_like">
                  <div className="like_icon">
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </div>
                  <div className="like_number">
                  {tweet.liked}
                  </div>
                  </button>
                </div>
              <div className="tweetreply">
              <Link href={{pathname: '/reply', query: { text: tweet.id } }} className="customLink">
              <div>
                <FontAwesomeIcon icon={faComment} />
              </div>
              <div>
                {tweet.replynumber}
              </div>
              </Link>
              </div>
              <div className="tweetretweet">
              <Link href={{pathname: '/retweet', query: { text: tweet.id } }} className="customLink">
              <div>
               <FontAwesomeIcon icon={faRetweet}/>
              </div>
              <div>
                {tweet.retweet}
              </div>
              </Link>
              </div>
              <div className="tweetreply">
              </div>
            </div>
            <div>
              <button onClick={() => handleClick(index)}>code</button>
            </div>
            <div>
              {visibleItems.includes(index) && <div>{tweet.code}</div>}
            </div>
            <PreviewImage imagename={tweet.figid}/>
            </div>
        </div>
        ) : (
          tweet.retweetcomment === "" ? (
            <div className="retweet">
              <div>{tweet.name} retweeted</div>
              <div className="tweet">
                <div className="user_fig">
                  <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                  <PreviewImageFromUser tweetname={ConvertFromIdToName(tweet.retweetto)} />
                  </Link>
                </div>
                <div className="tweet_all">
                  <div className="tweet_user">
                    <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                    {ConvertFromIdToName(tweet.retweetto)}
                    </Link>
                    <div className="tweetdate">
                    {tweet.date}
                  </div>
                  </div> 
                <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
                  <div className="tweetcontent">
                  <h5>{tweet.content}</h5>  
                  </div>
                  </Link> 
                  <div className="tweetoption">
                    <div className="tweetlike">
                    <button onClick={() => handlelike(tweet.id)} className="tweet_like">
                      <div className="like_icon">
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </div>
                      <div className="like_number">
                      {tweet.liked}
                      </div>
                      </button>
                    </div>
                    <div className="tweetreply">
                    <Link href={{pathname: '/reply', query: { text: tweet.id } }} className="customLink">
                    <div>
                      <FontAwesomeIcon icon={faComment} />
                    </div>
                    <div>
                      {tweet.replynumber}
                    </div>
                    </Link>
                    </div>
                    <div className="tweetretweet">
                    <Link href={{pathname: '/retweet', query: { text: tweet.id } }} className="customLink">
                    <div>
                    <FontAwesomeIcon icon={faRetweet} />
                    </div>
                    <div>
                      {tweet.retweet}
                    </div>
                    </Link>
                    </div>
                    <div className="tweetreply">
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleClick(index)}>code</button>
                  </div>
                  <div>
                    {visibleItems.includes(index) && <div>{tweet.code}</div>}
                  </div>
                <PreviewImage imagename={tweet.figid}/>
              </div>
              </div>
            </div>
          ) : (
            <div className="retweet">
              <div>{tweet.name}{tweet.retweetcomment}</div>
              <div className="tweet">
                <div className="user_fig">
                  <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                  <PreviewImageFromUser tweetname={ConvertFromIdToName(tweet.retweetto)} />
                  </Link>
                </div>
                <div className="tweet_all">
                  <div className="tweet_user">
                    <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                    {ConvertFromIdToName(tweet.retweetto)}
                    </Link>
                    <div className="tweetdate">
                    {tweet.date}
                  </div>
                  </div> 
                
                <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
                  <div className="tweetcontent">
                  <h5>{tweet.content}</h5>  
                  </div>
                  </Link> 
                  <div className="tweetoption">
                  <div className="tweetlike">
                    <button onClick={() => handlelike(tweet.id)} className="tweet_like">
                      <div className="like_icon">
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </div>
                      <div className="like_number">
                      {tweet.liked}
                      </div>
                      </button>
                    </div>
                    <div className="tweetreply">
                    <Link href={{pathname: '/reply', query: { text: tweet.id } }} className="customLink">
                    <div>
                      <FontAwesomeIcon icon={faComment} />
                    </div>
                    <div>
                      {tweet.replynumber}
                    </div>
                    </Link>
                    </div>
                    <div className="tweetretweet">
                    <Link href={{pathname: '/retweet', query: { text: tweet.id } }} className="customLink">
                    <div>
                      <FontAwesomeIcon icon={faRetweet}/>                    </div>
                    <div>
                      {tweet.retweet}
                    </div>
                    </Link>
                    </div>                    
                    <div className="tweetreply">
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleClick(index)}>code</button>
                  </div>
                  <div>
                    {visibleItems.includes(index) && <div>{tweet.code}</div>}
                  </div>
                <PreviewImage imagename={tweet.figid}/>
              </div>
              </div>
            </div>
          )
        )
    )}
        



      </div>
      <div className="user_profile">
        <div>
          <PreviewImage imagename={displayfig}></PreviewImage>
        </div>
        <div>
          {displayname}
        </div>
      </div>
      <Link href="./view" className="view_page">
      <div>
        <FontAwesomeIcon icon={faHouse}/>
      </div>
      <div>
        ホーム
      </div>
      </Link>
      <Link href="./post" className="post_page">
      <div>
       <FontAwesomeIcon icon={faPenToSquare} />
      </div>
      <div>
        投稿
      </div>
      </Link>
      <Link href="./search" className="search_page">
      <div>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div>
        検索
      </div>
      </Link>
      <Link href={{pathname: '/profile', query: { text: displayname } }} className="profile_page">
      <div>
        <FontAwesomeIcon icon={faUser}/>
      </div>
      <div>
        Profile
      </div>
      </Link>
    </div>
    </div>

    )
}
export default Replypage