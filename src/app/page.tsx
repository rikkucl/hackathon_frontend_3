"use client"
import "./App.css";
import { useEffect, useState } from "react";
//import { Form } from "./Tweet"
import { isAwaitExpression } from "typescript";
//import { LoginForm } from './FirebaseLogin';
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth, db } from "./firebase";
import React from 'react';
import { collection } from "firebase/firestore";
//import Post from "./PostFigure"
import PreviewImage from "./PreviewImage";
import Link from "next/link"
import { useAppContext } from "./context";

interface Tweet {
  id: string;
  name: string;
  date: string;
  liked: number;
  content: string;
  retweet: number;
  figid: string
}

function App() {
  // dataの状態をstateで記憶
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  // const [Tweets, setTweets] = useState<Tweet[]>([]);
  // const [displayname, setDisplayname] = useState<string>("")
  // const [displayfig, setDisplayfig] = useState<string>("")
  const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig} = useAppContext()
  //起動時に一回だけ実行
  useEffect(() =>{
    fetchTweet()
  }
  )
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });
  //データをデータベースからとって来る
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

  return (
    //<Router>
      <div>
      <div className="app">
        {/* <div className="title">
          <h1 style={{color:"white"}}>User Register</h1>
        </div> */}
        <div className="form">
          {/* fetchusersを引数にForm関数を呼ぶ。Userのstateをmain関数側で保持したく、fetchusersをmain関数に置きたいためこのようにした */}
          {/* <Form fetch_tweet={fetchTweet} displayname={displayname} /> */}
        </div>
      <div className="user_container">
      {/* {Object.values(Users).map(user =>
        <div className="user">
          <h5>{user.name},  {user.age}</h5>
        </div>
        )
      } */}
      <div className="status">
        <h3>Hello {displayname}</h3>
        <PreviewImage imagename={displayfig} />
      </div>
      {Object.values(Tweets).map(tweet =>
        <div className="tweet">
          <div className="tweetcontent">
          <h5>{tweet.name}, {tweet.content}, {tweet.date}, {tweet.liked}</h5>  
          </div>
          <div className="tweetlike">
          <button onClick={() => handlelike(tweet.id)}>いいね{tweet.liked}</button>
          </div>
          <PreviewImage imagename={tweet.figid}/>
        </div>
      )}
      <Link href={{ pathname: "/login"}}>
      ログイン画面
      </Link>
      <Link href="./post">
      投稿
      </Link>
      </div>
      {/* <div className="App"> */}
      {/* <header className="App-header"> */}
        {/* <div className='title'><h1>Firebase</h1></div> */}
        {/* {loginUser ? <h3>you are log in {displayname}</h3>: <h3>Now you are not in firebase</h3>} */}
        {/* <PreviewImage  imagename={displayfig}/> */}
        {/* <LoginForm setDisplayname={setDisplayname} setDisplayfig={setDisplayfig} /> */}
      {/* </header> */}
    </div>
    {/* <Post /> */}
    </div>
    // </div>
    //   {/* <Routes>
    //     <Route path="/" element={<Home />} />
    //   </Routes>
    // </div>
    // </Router>
    //  */}
  );
}

export default App;
