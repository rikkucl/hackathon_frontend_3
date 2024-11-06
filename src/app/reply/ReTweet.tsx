"use client"
import { useState } from "react";
import "../App.css"
import React from 'react';
import PostTweet  from "./Tweetfig";
import { text } from "stream/consumers";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useAppContext } from "../context";
import PreviewImage from "../lib/PreviewImage";
import PreviewImageFromUser from "../lib/PreviewImageFromUser";
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
  tweetto_id: string;
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
  retweetcomment: string;
}

function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}

export const ReTweet: React.FC<FormProps> = ({router, tweetto_id}: FormProps) => {
  //name, ageをstateで管理
  //const [name, setName] = useState("");
  //const [age, setAge] = useState(0)
  const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
  const [tweet, setTweet] = useState("")
  //送る時は app 関数になくても問題ない
  const [tweetfig, setTweetfig] = useState("") 
  const [code, setCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [lang, setLang]= useState("")
  const [displayId, setDisplayId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const [tweetto, setTweetto] = useState<Tweet>({id: "", name: "", date: "", liked: 0, content: "", retweet: 0, figid: "", code: "", errormessage: "", lang: "", replyto: "", replynumber: 0, retweetto: "", retweetcomment: ""})
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser
    if (user) {
      const uid = user.uid
      fetchUser(uid)
      setDisplayId(uid)
    } else {
      console.log("cannot find user")
    }
  })
  useEffect (() => {
    findTweet(tweetto_id)
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
  //Formをsubmitしたら発火する関数
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tweet) {
      alert("tweet is empty");
      return;
    }
    else if (tweet.length > 140) {
     alert("too long") 
    }
    try {
      setIsLoading(true)
      const result = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/tweet",
        {
        method: "POST",
        body: JSON.stringify({
          id: "",
          name: displayId,
          date: "",
          liked: 0,
          content: tweet,
          retweet: 0,
          figid: tweetfig,
          code: code,
          errormessage: errorMessage,
          lang: lang,
          replyto: tweetto_id,
          replynumber: 0,
          retweetto: "",
          retweetcomment:""
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
      alert("reply is posted")
      handleNavigation("/view")
      //fetchUsersを呼ぶ
    } catch (err) {
      console.error(err);
      setIsLoading(false)
    }
  };

  const handleNavigation = async (url: string) => {
    setIsLoading(true);
    await router.push(url)
    setIsLoading(false)
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
            user_id: displayId,
          }),
        })
        // fetchTweet()
    }catch (err){
      console.log(err)
    }
  }


  return (
    <div>
      <div>
        {isLoading && <LoadingScreen />}
      </div>
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

    {/* <div className="post"> */}
    <form onSubmit={onSubmit} className="tweet_post">
      <div className="tweet_submit">
      <label><h3>tweet: </h3></label>
      <textarea
        //type="text"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="Hello neko!!"
        style={{color: "black", border: "1px solid black", width: "300px", height:"100px"}}
      ></textarea></div>
      <div className="post_code">
        <label><h3>code: </h3></label>
        <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="print('Hello World!')"
        style={{color: "black", border: "1px solid black", width: "300px", height:"80px"}}
        >
        </textarea>
        <label><h3>error message:</h3></label>
        <textarea
        value={errorMessage}
        onChange={(e) => setErrorMessage(e.target.value)}
        style={{color: "black", border: "1px solid black", width: "300px", height:"80px"}}
        ></textarea>
      </div>
      <div className="tweet_submit">
        <label><h3>language</h3></label>
        <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Go">Go</option>
        </select>
      </div>
      <label>Picture</label>
      <PostTweet setTweetfig={setTweetfig} />
      
      {/* <div className="form_group">
      <label><h3>Age: </h3></label>
      <input
        type={"number"}
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
        ></input></div> */}
      <div className="form_group">
      <button className="submit-button" type={"submit"}><h3>POST</h3></button></div>
    </form>
    {/* </div> */}
    </div>
    </div>
  );
};

export default ReTweet;