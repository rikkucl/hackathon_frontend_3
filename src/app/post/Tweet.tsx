"use client"
import { useState } from "react";
import "../App.css"
import React from 'react';
import PostTweet  from "./Tweetfig";
import { text } from "stream/consumers";
import ReTweet from "../reply/ReTweet";


//Formの引数はfetch usersなので引数なし→void
type FormProps = {
  displayname: string;
}

export const Tweet: React.FC<FormProps> = ({displayname}) => {
  //name, ageをstateで管理
  //const [name, setName] = useState("");
  //const [age, setAge] = useState(0)
  const [tweet, setTweet] = useState("")
  //送る時は app 関数になくても問題ない
  const [tweetfig, setTweetfig] = useState("") 
  const [code, setCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [lang, setLang]= useState("")
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

    // if (name.length > 50) {
    //   alert("Please enter a name shorter than 50 characters");
    //   return;
    // }

    // if (age < 20 || age > 80) {
    //   alert("Please enter age between 20 and 80");
    //   return;
    // }

    try {
      const result = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/tweet",
        {
        method: "POST",
        body: JSON.stringify({
          name: displayname,
          content: tweet,
          like: 0,
          retweet: 0,
          figid: tweetfig,
          code: code,
          errormessage: errorMessage,
          lang: lang,
          ReTweet: ""
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
      //fetchUsersを呼ぶ
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div>
    <form style={{ display: "flex", flexDirection: "column" , alignItems: "center"}} onSubmit={onSubmit}>
      <div className="tweeet_submit">
      <label><h3>tweet: </h3></label>
      <input
        //type="text"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        style={{color: "black", border: "1px solid black"}}
      ></input></div>
      <div className="code">
        <label><h3>code: </h3></label>
        <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{color: "black", border: "1px solid black"}}
        >
        </input></div>
      <div className="tweet_submit">
        <label><h3>error message:</h3></label>
        <input
        type="text"
        value={errorMessage}
        onChange={(e) => setErrorMessage(e.target.value)}
        style={{color: "black", border: "1px solid black"}}
        ></input>
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
      <PostTweet setTweetfig={setTweetfig} />
      
      {/* <div className="form_group">
      <label><h3>Age: </h3></label>
      <input
        type={"number"}
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
        ></input></div> */}
      <div className="form_group">
      <button className="button" type={"submit"}><h3>POST</h3></button></div>
    </form>
    </div>
  );
};

export default Tweet;