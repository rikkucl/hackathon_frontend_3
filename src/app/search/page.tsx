"use client"
import React from "react";
import { useState } from "react";
import { useAppContext } from "../context";
import path from "path";
import Link from "next/link";
import PreviewImageFromUser from "../lib/PreviewImageFromUser";
import PreviewImage from "../lib/PreviewImage";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { fireAuth, db } from "../lib//firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

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
    retweettoname?: string;
  }
const SearchPage = () => {
  
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const [searchtext, setSearchtext] = useState("")
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const [user_id, setUser_id] = useState<string>("")
    const [userNames, setUsernames] = useState<Tweet[]>([])

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
    const filteredTweets = userNames.filter(tweet => {
        const regex = new RegExp(searchtext, 'i');
        return regex.test(tweet.content) || regex.test(tweet.name)
    })
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
              console.log("tweet.retweetto is",tweet.retweetto)
              console.log("retweettoname is",retweettoname)
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
    
      const fetchName = async (uid: string) => {
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          console.log(uid)
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


    return (
        <div className="app">
        <div className="user_container">
        <input type="text" value={searchtext} onChange={(e) => setSearchtext(e.target.value)} placeholder="検索ワードを記入" className="search_word"></input>
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

        {/* {Object.values(filteredTweets).map(tweet => (
            <div className="tweet">
                <div className="tweetcontent">
                <h5>{tweet.name}, {tweet.content}, {tweet.date}, {tweet.liked}</h5>  
                </div>
                <div className="tweetlike">
                </div>
            </div>
        )
    )} */}

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
              {tweet.username}              
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
            <div className="code">
            <div>
              <button onClick={() => handleClick(index)}>code</button>
            </div>
            <div>
              {visibleItems.includes(index) && <div>{tweet.code}</div>}
            </div>
            {user_id === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {user_id === tweet.name ? (
              <div>
              <button onClick={() => executeOnGemini(tweet.id)}>execute_on_gemini</button>
              </div>
            ):(
              null
            )}
            </div>
            <PreviewImage imagename={tweet.figid}/>
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
                  <div className="code">
                  <div>
                    <button onClick={() => handleClick(index)}>code</button>
                  </div>
                  <div>
                    {visibleItems.includes(index) && <div>{tweet.code}</div>}
                  </div>
                  {user_id === tweet.name ? (
                    <div>
                    <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
                    </div>
                  ):(
                    null
                  )}
                  {user_id === tweet.name ? (
                    <div>
                    <button onClick={() => executeOnGemini(tweet.id)}>execute_on_gemini</button>
                    </div>
                  ):(
                    null
                  )}
                  </div>
                <PreviewImage imagename={tweet.figid}/>
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
                  <div className="code">
                  <div>
                    <button onClick={() => handleClick(index)}>code</button>
                  </div>
                  <div>
                    {visibleItems.includes(index) && <div>{tweet.code}</div>}
                  </div>
                  {user_id === tweet.name ? (
                    <div>
                    <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
                    </div>
                  ):(
                    null
                  )}
                  {user_id === tweet.name ? (
                    <div>
                    <button onClick={() => executeOnGemini(tweet.id)}>execute_on_gemini</button>
                    </div>
                  ):(
                    null
                  )}
                  </div>
                <PreviewImage imagename={tweet.figid}/>
              </div>
              </div>
            </div>
          </div>
          )
        )
    )}

    </div>
    {/* <Link href={{pathname: "../view"}}>
    投稿
    </Link> */}
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
      <Link href={{pathname: '/profile', query: { text: user_id } }} className="profile_page">
      <div>
        <FontAwesomeIcon icon={faUser}/>
      </div>
      <div>
        Profile
      </div>
      </Link>

    </div>
    )
}
export default SearchPage