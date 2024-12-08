"use client"
import "../App.css";
import { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
//import { Form } from "./Tweet"
import { isAwaitExpression } from "typescript";
//import { LoginForm } from './FirebaseLogin';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { fireAuth, db } from "../lib//firebase";
import React from 'react';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, namedQuery } from "firebase/firestore";
//import Post from "./PostFigure"
import PreviewImage from "../lib/PreviewImage";
import PreviewImage_square from "../lib/PreviewImage_square";
import Link from "next/link"
import { useAppContext } from "../context";
import { useRouter } from "next/navigation"
import PreviewImageFromUser from "../lib/PreviewImageFromUser"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import Tweet from "../post/Tweet";
import ReTweet from "../reply/ReTweet";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';


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
  username?: string;
  retweettoname?: string
}
interface Follow {
  follower: string;
  followed: string;
  followername?: string;
  followedname?: string;
}
interface Like {
  tweet_id: string
}
interface Favorite {
  tweet_id: string
}

function App() {
  // dataの状態をstateで記憶
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  // const [Tweets, setTweets] = useState<Tweet[]>([]);
  // const [displayname, setDisplayname] = useState<string>("")
  // const [displayfig, setDisplayfig] = useState<string>("")
  const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isLoggin, setIsLoggin] = useState(false);
  const [fid, setFig] = useState<string>("")
  const [user_Id, setUser_id] = useState<string>("")
  const [userNames, setUsernames] = useState<Tweet[]>([])
  const [likes, setLikes] = useState<Like[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [privateIds, setPrivateIds] = useState<string[]>([])
  const [isvisible, setIsvisible] = useState(false) 
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggin(true);
      } else {
        setIsLoggin(false)
      }
    })
    const user = auth.currentUser
    if (user) {
      const uid = user.uid
      fetchUser(uid)
      setUser_id(uid)
    } else {
      console.log("cannot find user")
    }
  })
  //起動時に一回だけ実行
  useEffect(() =>{
    fetchTweet()
  }
  )
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });
  useEffect(() => {
    // console.log("getlike")
    if (user_Id !== ""){
      fetchLike()
      fetchFavorite()
    }
  })

  useEffect(() => {
    getPrivate()
  })

  const getPrivate = async () => {
    const userCollection = collection(db, "users");
    const q = query(userCollection, where("publicity", "==", "private"))
    try {
      const querySnapshot = await getDocs(q)
      setPrivateIds(querySnapshot.docs.map(doc => doc.id))
    }catch (error) {
      console.log('Error getting documents: ', error)
    }
  }
  const fetchLike = async () => {
    try{
      const res = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/getlike",
        {
            method: "POST",
            body: JSON.stringify({
              user_id: user_Id
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    if (!res.ok) {
        console.log(res)
        throw Error("Failed to fetch follows: {res.status}");
    }
    const data:Like[] = await res.json();
    setLikes(data)
    // console.log("Likes is ", likes)
  } catch (err) {
    console.log(err)
  }}

  const fetchFavorite = async () => {
    try{
      const res = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/getfavorite",
        {
            method: "POST",
            body: JSON.stringify({
              user_id: user_Id
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    if (!res.ok) {
        console.log(res)
        throw Error("Failed to fetch follows: {res.status}");
    }
    const data:Favorite[] = await res.json();
    setFavorites(data)
    // console.log("Likes is ", likes)
  } catch (err) {
    console.log(err)
  }}

  const signOutfromfire = (): void => {
    signOut(fireAuth).then(() => {
      setDisplayname("")
      setUser_id("")
      setDisplayfig("")
      alert("ログアウトしました");
    }).catch(err => {
      alert(err);
    });
  };

  const fetchUser = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setDisplayfig(userDoc.data().figid)
        setDisplayname(userDoc.data().registername)
      } else {
        // console.log("userfigid is not defined")
        setDisplayfig("")
      }
    } catch (err) {
      console.log("error happened", err)
    }
  }
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
            user_id: user_Id,
          }),
        })
        fetchTweet()
    }catch (err){
      console.log(err)
    }
  }

  const handlefavorite = async (id: string) => {
    try {
      const res = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/favorite", 
        {
          method: "POST",
          body: JSON.stringify({
            tweet_id: id,
            user_id: user_Id,
          }),
        })
        fetchTweet()
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = (key: number) => {
    setVisibleItems((prev) =>{
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      } else {
        return [...prev, key]
      }
    })
  }

  const handlegemini = async (id: string) => {
    const tweet = Tweets.find(tweet => tweet.id === id)
    if (tweet !== undefined) {
      if (tweet.code === "" || tweet.errormessage === "" || tweet.lang === "") {
        alert("You are not post code or console or language")
        return
      }
      try {
        const response = await fetch(
          "https://hackathon-backend-1012715555694.us-central1.run.app/gemini", 
          {
            method: "POST",
            body: JSON.stringify({
              name: "",
              cotent: tweet.content,
              like: 0,
              retweet: 0,
              figid: "",
              code: tweet.code,
              errormessage: tweet.errormessage,
              lang: tweet.lang,
              replyto: tweet.id,
              replynumber: 0,
              retweetto: "",
              retweetcomment: "",
            })
          })
          if (!response.ok) {
            throw Error("Failed to POST")
          }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const executeOnGemini = async (id: string) => {
    const tweet = Tweets.find(tweet => tweet.id === id)
    if (tweet !== undefined) {
      if (tweet.code === "" || tweet.lang === "") {
        alert("You are not post code or console or language")
        return
      }
      try {
        const response = await fetch(
          "https://hackathon-backend-1012715555694.us-central1.run.app/execute",
          {
            method: "POST",
            body: JSON.stringify({
              name: "",
              cotent: tweet.content,
              like: 0,
              retweet: 0,
              figid: "",
              code: tweet.code,
              errormessage: tweet.errormessage,
              lang: tweet.lang,
              replyto: tweet.id,
              replynumber: 0,
              retweetto: "",
              retweetcomment: "",
            })
          })
          if (!response.ok) {
            throw Error("Failed to POST")
          }
      } catch (err) {
        console.log(err)
      }
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
  const fetchNamesFromTweets = async (Objects: Tweet[]) => {
    const names = await Promise.all(
      Objects.map(async (tweet) => {
        // console.log("tweet.name", tweet.name)
        if (tweet.retweetto === ""){
          const name = await fetchName(tweet.name);
          return { ...tweet, username: name}
        }
        else {
          const name = await fetchName(tweet.name);
          const retweettoname = await fetchName(ConvertFromIdToName(tweet.retweetto))
          // console.log("tweet.retweetto is",tweet.retweetto)
          // console.log("retweettoname is",retweettoname)
          return { ...tweet, username: name, retweettoname: retweettoname}
        }
      })
    )
    return names;
  }
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchNamesFromTweets(Tweets)
      setUsernames(data)
    }
    getUserData();
  }, [Tweets])

  const fetchFollow = async () => {
    try {
        const res = await fetch(
            "https://hackathon-backend-1012715555694.us-central1.run.app/follow",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        if (!res.ok) {
            console.log(res)
            throw Error("Failed to fetch follows: {res.status}");
        }
        const data:Follow[] = await res.json();
        setFollows(data)
    } catch (err) {
        console.log(err)
    }
  }
  const isfollow = (follower:string, followed:string) => {
    const foundItem = follows.find(follow => follow.follower === follower &&  follow.followed === followed)
    if (foundItem) {
        return true;
    } else {
        return false
    }
  }
  useEffect(() => {
    fetchFollow()
  })


  const filterdTweets = userNames.filter(tweet => privateIds?.every(id => id !== tweet.name) || isfollow(user_Id, tweet.name) || user_Id === tweet.name);

  const fetchName = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      // console.log(uid)
      if (userDoc.exists()) {
        return userDoc.data().registername
      } else {
        console.log("do not exists userDoc")
        return ""
      }
    } catch (err) {
      // console.log(uid)
      console.log("error happened", err)
      return ""
    }
  }

  const toggleSidebar = () => {
    setIsvisible(!isvisible)
  }

  const change_lang = (lang:string) => {
    if (lang === "Python") {
      return "python"
    } else if (lang === "JavaScript") {
      return "javascript"
    } else if (lang === "Go") {
      return "go"
    }
  }

  // SyntaxHighlighter.registerLanguage('python', python);
  // SyntaxHighlighter.registerLanguage("javaScript", javascript)
  // SyntaxHighlighter.registerLanguage("go", go)

  return (
    //<Router>
      <div className="app">
        <div
        className={`content ${isvisible ? "no-click" : ""}`}
        onClick={() => isvisible && setIsvisible(false)}
      >

      <div className="user_container">
      {Object.values(filterdTweets).map((tweet, index) =>
        tweet.retweetto === "" ? (
          <div className="tweet">
          <div className="user_fig">
            <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
            <PreviewImageFromUser tweetname={tweet.name} />
            </Link>
          </div>
          <div className="tweet_all">
            <div className="tweet_user">
              { tweet.name === "Gemini" ? (
                <div>Gemini</div>
              ) : (
                <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
                {tweet.username ?? "anonymous"}
                </Link>
              )}
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
                <div onClick={() => handlelike(tweet.id)} className="tweet_like">
                  <div className="like_icon">
                    <FontAwesomeIcon icon={faThumbsUp} className={`icon ${likes?.some((like) => like.tweet_id === tweet.id) ? "liked":""}`} />
                  </div>
                  <div className="like_number">
                  {tweet.liked}
                  </div>
                  </div>
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
              <div className="tweet_favorite">
                <div onClick={() => handlefavorite(tweet.id)} className="tweet_favorite">
                  <div className="favorite_icon">
                    <FontAwesomeIcon icon={faStar} className={`icon ${favorites?.some((favorite) => favorite.tweet_id === tweet.id) ? "favorited":""}`}/>
                  </div>
                </div>
              </div>
            </div>
            {tweet.code === "" ? (
              null
            ):(
              <div className="code">
            <div>
              <button onClick={() => handleClick(index)}>code</button>
            </div>
            <div>
              {visibleItems.includes(index) && 
              <div style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5' }}>
              <SyntaxHighlighter language={change_lang(tweet.lang)} style={docco}>
                {tweet.code}
              </SyntaxHighlighter>
              <CopyToClipboard text={tweet.code}>
                <button style={{ marginTop: '10px', padding: '5px 10px' }}>コードをコピー</button>
              </CopyToClipboard>
            </div>
              }
            </div>
            {user_Id === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {user_Id === tweet.name ? (
              <div>
              <button onClick={() => executeOnGemini(tweet.id)}>execute_on_gemini</button>
              </div>
            ):(
              null
            )}
            </div>
            )}
            <PreviewImage_square imagename={tweet.figid}/>
            </div>
        </div>
        ) : (
          tweet.retweetcomment === "" ? (
            <div className="tweet">
            <div className="user_fig">
            <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
            <PreviewImageFromUser tweetname={tweet.name} />
            </Link>
            </div>
            <div className="tweet_all">
            <div className="tweet_user">
              <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
              {tweet.username}
              </Link>
              <div className="retweet_state">
                <FontAwesomeIcon icon={faRetweet}/>
              retweeted
              </div>
              <div className="tweetdate">
              {tweet.date}
            </div>
            </div>
            <div className="retweet">
                <div className="user_fig">
                  <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                  <PreviewImageFromUser tweetname={ConvertFromIdToName(tweet.retweetto)} />
                  </Link>
                </div>
                <div className="tweet_all">
                  <div className="tweet_user">
                    <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                    {/* {ConvertFromIdToName(tweet.retweetto)} */}
                    {tweet.retweettoname}
                    </Link>
                    {/* <div className="tweetdate">
                    {tweet.date}
                  </div> */}
                  </div> 
                <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
                  <div className="tweetcontent">
                  <h5>{tweet.content}</h5>  
                  </div>
                  </Link> 
                  <div className="tweetoption">
                  <div className="tweetlike">
                    <div onClick={() => handlelike(tweet.id)} className="tweet_like">
                      <div className="like_icon">
                        <FontAwesomeIcon icon={faThumbsUp} className={`icon ${likes?.some((like) => like.tweet_id === tweet.id) ? "liked":""}`} />
                      </div>
                      <div className="like_number">
                        {tweet.liked}
                      </div>
                    </div>
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

                    <div className="tweet_favorite">
                      <div onClick={() => handlefavorite(tweet.id)} className="tweet_favorite">
                        <div className="favorite_icon">
                          <FontAwesomeIcon icon={faStar} className={`icon ${favorites?.some((favorite) => favorite.tweet_id === tweet.id) ? "favorited":""}`}/>
                        </div>
                      </div>
                    </div>
                    <div className="tweetreply">
                    </div>
                  </div>
                  {tweet.code === "" ? (
              null
            ):(
              <div className="code">
            <div>
              <button onClick={() => handleClick(index)}>code</button>
            </div>
            <div>
            {visibleItems.includes(index) && 
              <div style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5' }}>
              <SyntaxHighlighter language={change_lang(tweet.lang)} style={docco}>
                {tweet.code}
              </SyntaxHighlighter>
              <CopyToClipboard text={tweet.code}>
                <button style={{ marginTop: '10px', padding: '5px 10px' }}>コードをコピー</button>
              </CopyToClipboard>
            </div>
              }
            </div>
            {user_Id === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {user_Id === tweet.name ? (
              <div>
              <button onClick={() => executeOnGemini(tweet.id)}>execute_on_gemini</button>
              </div>
            ):(
              null
            )}
            </div>
            )}
                <PreviewImage_square imagename={tweet.figid}/>
              </div>
              </div>
              </div>
            </div>
          ) : (
            <div className="tweet">
            <div className="user_fig">
            <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
            <PreviewImageFromUser tweetname={tweet.name} />
            </Link>
            </div>
            <div className="tweet_all">
            <div className="tweet_user">
              <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
              {tweet.username}
              </Link>
              <div className="retweet_state">
                <FontAwesomeIcon icon={faRetweet}/>
              retweeted
              </div>
              <div className="tweetdate">
              {tweet.date}
            </div>
            </div>
              <div className="retweet_comment">{tweet.retweetcomment}</div>
              <div className="retweet">
                <div className="user_fig">
                  <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                  <PreviewImageFromUser tweetname={ConvertFromIdToName(tweet.retweetto)} />
                  </Link>
                </div>
                <div className="tweet_all">
                  <div className="tweet_user">
                    <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                    {tweet.retweettoname}
                    </Link>
                    {/* <div className="tweetdate">
                    {tweet.date}
                    </div> */}
                  </div>
                
                <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
                  <div className="tweetcontent">
                  <h5>{tweet.content}</h5>  
                  </div>
                  </Link> 
                  <div className="tweetoption">
                  <div className="tweetlike">
                <div onClick={() => handlelike(tweet.id)} className="tweet_like">
                  <div className="like_icon">
                    <FontAwesomeIcon icon={faThumbsUp} className={`icon ${likes?.some((like) => like.tweet_id === tweet.id) ? "liked":""}`} />
                  </div>
                  <div className="like_number">
                  {tweet.liked}
                  </div>
                  </div>
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
                    <div className="tweet_favorite">
                      <div onClick={() => handlefavorite(tweet.id)} className="tweet_favorite">
                        <div className="favorite_icon">
                          <FontAwesomeIcon icon={faStar} className={`icon ${favorites?.some((favorite) => favorite.tweet_id === tweet.id) ? "favorited":""}`}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  {tweet.code === "" ? (
              null
            ):(
              <div className="code">
            <div>
              <button onClick={() => handleClick(index)}>code</button>
            </div>
            <div>
            {visibleItems.includes(index) && 
              <div style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5' }}>
              <SyntaxHighlighter language={change_lang(tweet.lang)} style={docco}>
                {tweet.code}
              </SyntaxHighlighter>
              <CopyToClipboard text={tweet.code}>
                <button style={{ marginTop: '10px', padding: '5px 10px' }}>コードをコピー</button>
              </CopyToClipboard>
            </div>
              }
            </div>
            {user_Id === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {user_Id === tweet.name ? (
              <div>
              <button onClick={() => executeOnGemini(tweet.id)}>execute_on_gemini</button>
              </div>
            ):(
              null
            )}
            </div>
            )}
                <PreviewImage_square imagename={tweet.figid}/>
              </div>
              </div>
            </div>
          </div>
          )
        )
    )}
      </div>
      </div>
      <h1 className="app-name">
        Engineer Lounge of Innovation and Insight
      </h1>
      {!isvisible ? (
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="sidebar_button">
        ☰
       </button>
      ):(
        null
      )}
      <div className={`sidebar ${isvisible ? 'show' : 'hidden'}`}>
      {isvisible ? (
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="sidebar_button">
        x
       </button>
      ):(
        null
      )}
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
      <Link href={{pathname: '/profile', query: { text: user_Id } }} className="profile_page">
      <div>
        <FontAwesomeIcon icon={faUser}/>
      </div>
      <div>
        プロフィール
      </div>
      </Link>
      <Link href="./favorite" className="favorite_page">
        <div>
          <FontAwesomeIcon icon={faHeart}/>
        </div>
        <div>
          お気に入り
        </div>
      </Link>
      { isLoggin ? (
        <div onClick={signOutfromfire} className="logout">
        <div>
        <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
        <div>ログアウト</div>
        </div>
      ): (
        <Link href={"./"} className="login_page" >
          <div>
            <FontAwesomeIcon icon={faRightToBracket} />
          </div>
          <div>
            ログイン
          </div>
        </Link>
      )}
      </div>
    
    </div>
  );
}

export default App;
