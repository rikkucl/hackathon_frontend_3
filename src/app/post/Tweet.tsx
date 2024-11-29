"use client"
import { useState } from "react";
import "../App.css"
import React from 'react';
import PostTweet  from "./Tweetfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { text } from "stream/consumers";
import ReTweet from "../reply/ReTweet";


//Formの引数はfetch usersなので引数なし→void
type FormProps = {
  router: any;
}

function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}

export const Tweet: React.FC<FormProps> = ({router}) => {
  //name, ageをstateで管理
  //const [name, setName] = useState("");
  //const [age, setAge] = useState(0)
  const [tweet, setTweet] = useState("")
  //送る時は app 関数になくても問題ない
  const [tweetfig, setTweetfig] = useState("") 
  const [code, setCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [lang, setLang]= useState("")
  const [userid, setUserid] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)


  //Formをsubmitしたら発火する関数
  // useEffect(() => {
  //   const auth = getAuth();
  //   const user = auth.currentUser
  //   if (user) {
  //     const uid = user.uid
  //     setUserid(uid)
  //     console.log("userid id", uid)
  //   } else {
  //     console.log("cannot find user")
  //   }
  // },[])
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserid(user.uid);
        console.log("userid id", user.uid);
      } else {
        console.log("cannot find user");
      }
    });
  
    // クリーンアップ関数を返す
    return () => unsubscribe();
  }, []);

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
      setIsLoading(true)
      const result = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/tweet",
        {
        method: "POST",
        body: JSON.stringify({
          id: "",
          name: userid,
          date: "",
          liked: 0,
          content: tweet,
          retweet: 0,
          figid: tweetfig,
          code: code,
          errormessage: errorMessage,
          lang: lang,
          replyto: "",
          replynumber:0,
          retweetto: "",
          retweetcomment: ""
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
      alert("Posted")
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


  return (
    <div className="post">
      <div>
        {isLoading && <LoadingScreen />}
      </div>
      <div className="tweet_title">
        Post
        {/* user id is{userid} */}
      </div>
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
    </div>
  );
};

export default Tweet;