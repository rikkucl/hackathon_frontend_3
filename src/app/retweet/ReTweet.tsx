"use client"
import { useState } from "react";
import "../App.css"
import React from 'react';
import PostTweet  from "./Tweetfig";
import { text } from "stream/consumers";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAppContext } from "../context";
import Link from "next/link";
import PreviewImageFromUser from "../lib/PreviewImageFromUser";
import PreviewImage from "../lib/PreviewImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse} from "@fortawesome/free-solid-svg-icons";



//Formの引数はfetch usersなので引数なし→void
type FormProps = {
  router: any
  retweetto: string;
}

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
  retweetcomment: string
}
export const ReTweet: React.FC<FormProps> = ({router, retweetto}) => {
  const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
  //name, ageをstateで管理
  //const [name, setName] = useState("");
  //const [age, setAge] = useState(0)
  const [tweet, setTweet] = useState("")
  //送る時は app 関数になくても問題ない
  const [tweetfig, setTweetfig] = useState("") 
  const [code, setCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [lang, setLang]= useState("")
  const [retweetcomment, setRetweetcomment] = useState("")
  const [user_id, setUser_id] = useState<string>("")
  const [tweetto, setTweetto] = useState<Tweet>({id: "", name: "", date: "", liked: 0, content: "", retweet: 0, figid: "", code: "", errormessage: "", lang: "", replyto: "", replynumber: 0, retweetto: "", retweetcomment: ""})
  //Formをsubmitしたら発火する関数
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser
    if (user) {
      const uid = user.uid
      // fetchUser(uid)
      setUser_id(uid)
    } else {
      console.log("cannot find user")
    }
  })
  useEffect (() => {
    findTweet(retweetto)
  })
  
  const findTweet = (id: string) => {
    const foundTweet: Tweet|undefined = Tweets.find(tweet => tweet.id === id)
    if (foundTweet !== undefined) {
      // console.log("found tweet")
      setTweetto(foundTweet)
    } else {
      console.log("error")
    }
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
            user_id: user_id,
          }),
        })
        // fetchTweet()
    }catch (err){
      console.log(err)
    }
  }


  const RetweetWithComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const RetweetTo: Tweet| undefined = Tweets.find(tweet => tweet.id === retweetto)
    if (RetweetTo !== undefined) {
      try {
        const result = await fetch(
          "https://hackathon-backend-1012715555694.us-central1.run.app/tweet",
          {
          method: "POST",
          body: JSON.stringify({
            name: user_id,
            content: RetweetTo.content,
            like: 0,
            retweet: 0,
            figid: RetweetTo.figid,
            code: RetweetTo.code,
            errormessage: RetweetTo.errormessage,
            lang: RetweetTo.lang,
            replyto: "",
            replynumber: 0,
            retweetto: retweetto,
            retweetcomment: retweetcomment
            //age: age,
          }),
        });
        if (!result.ok) {
          throw Error(`Failed to create user: ${result.status}`);
        }
        //フォームの初期化
        // setName("");
        // setAge(0);
        setTweet("")
        setTweetfig("")
        router.push("../view")
        //fetchUsersを呼ぶ
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Tweet not found")
    }
  };

  return (
    <div className="post_retweet">
      <div className="retweet_title">
        Retweet
      </div>
    <div className="tweet">
          <div className="user_fig">
            <Link href={{pathname: "/profile", query: {text: tweetto?.name} }} className="twitter_profile">
            <PreviewImageFromUser tweetname={tweetto.name} />
            </Link>
          </div>
          <div className="tweet_all">
            <div className="tweet_user">
              <Link href={{pathname: "/profile", query: {text: tweetto?.name} }} className="twitter_profile">
              {tweetto?.name}              
              </Link>
              <div className="tweetdate">
              {tweetto.date}
            </div>
            </div> 
          <Link href={{pathname: "replysite", query: {text: tweetto.id}}} className="customLink">
            <div className="tweetcontent">
            <h5>{tweetto.content}</h5>  
            </div>
            </Link> 
            <div className="tweetoption">
            <div className="tweetlike">
                <button onClick={() => handlelike(tweetto.id)} className="tweet_like">
                  <div className="like_icon">
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </div>
                  <div className="like_number">
                  {tweetto.liked}
                  </div>
                  </button>
                </div>
              <div className="tweetreply">
              <Link href={{pathname: '/reply', query: { text: tweetto.id } }} className="customLink">
              <div>
                <FontAwesomeIcon icon={faComment} />
              </div>
              <div>
                {tweetto.replynumber}
              </div>
              </Link>
              </div>
              <div className="tweetretweet">
              <Link href={{pathname: '/retweet', query: { text: tweetto.id } }} className="customLink">
              <div>
               <FontAwesomeIcon icon={faRetweet}/>
              </div>
              <div>
                {tweetto.retweet}
              </div>
              </Link>
              </div>
              <div className="tweetreply">
              </div>
            </div>
            <PreviewImage imagename={tweetto.figid}/>
            </div>
        </div>
        <form style={{ display: "flex", flexDirection: "column" , alignItems: "center"}} onSubmit={RetweetWithComment}>
        <div className="retweeet_comment">
        <label><h3>comment: </h3></label>
        <input
          //type="text"
          value={retweetcomment}
          onChange={(e) => setRetweetcomment(e.target.value)}
          style={{color: "black", border: "1px solid black"}}
        ></input></div>
        <div className="form_group">
        <button className="button" type={"submit"}><h3>Retweet</h3></button></div>
      </form>
    </div>
  );
};

export default ReTweet;