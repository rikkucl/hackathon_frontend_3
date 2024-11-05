"use client"
import { useState } from "react";
import "../App.css"
import React from 'react';
import PostTweet  from "./Tweetfig";
import { text } from "stream/consumers";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAppContext } from "../context";



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
    <div>
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
      <button className="button" type={"submit"}><h3>Retweet with comment</h3></button></div>
    </form>
    <form onSubmit={RetweetWithComment}>
      <div className="retweet">
      <button className="button" type={"submit"}><h3>Retweet with comment</h3></button>
      </div>
    </form>
    </div>
  );
};

export default ReTweet;