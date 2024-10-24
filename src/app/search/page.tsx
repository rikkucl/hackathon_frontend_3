"use client"
import React from "react";
import { useState } from "react";
import { useAppContext } from "../context";
import path from "path";
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
const SearchPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const [searchtext, setSearchtext] = useState("")
    const [visibleItems, setVisibleItems] = useState<number[]>([]);

    const filteredTweets = Tweets.filter(tweet => {
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
        <div className="user_container">
        <input type="text" value={searchtext} onChange={(e) => setSearchtext(e.target.value)} placeholder="検索ワードを記入"></input>
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
              {/* {FetchProfileFig tweet.name} */}
              <Link href={{pathname: "/profile", query: {text: tweet.name} }} className="twitter_profile">
              {tweet.name}              
              </Link>
              {/* <div>
              </div> */}
              <div className="tweetdate">
              {tweet.date}
            </div>
            </div> 
          
            {/* <div>
            <PreviewImage imagename={tweet.figid} />
            </div> */}
          {/* </div>
          <div className="tweet_all"> */}
          <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
            <div className="tweetcontent">
            <h5>{tweet.content}</h5>  
            </div>
            </Link> 
            <div className="tweetoption">
              <div className="tweetlike">
              <button onClick={() => handlelike(tweet.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0'}} className="tweet_like">
                <div>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </div>
                <div>
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
              リツイート
              </div>
              <div>
                {tweet.retweet}
              </div>
              </Link>
              </div>
              
              <div className="tweetreply">
              {/* <Link href={{pathname: '/replysite', query: { text: tweet.id}}}>
              リプライ一覧
              </Link> */}
              </div>
            </div>
            <div>
              <button onClick={() => handleClick(index)}>code</button>
            </div>
            <div>
              {visibleItems.includes(index) && <div>{tweet.code}</div>}
            </div>
            {/* <button onClick={() => handleNavigation(tweet.id)}>リプライ</button> */}
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
                    {/* {FetchProfileFig tweet.name} */}
                    <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                    {/* {tweet.name} */}
                    {ConvertFromIdToName(tweet.retweetto)}
                    </Link>
                    {/* <div>
                    </div> */}
                    <div className="tweetdate">
                    {tweet.date}
                  </div>
                  </div> 
                
                  {/* <div>
                  <PreviewImage imagename={tweet.figid} />
                  </div> */}
                {/* </div>
                <div className="tweet_all"> */}
                <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
                  <div className="tweetcontent">
                  <h5>{tweet.content}</h5>  
                  </div>
                  </Link> 
                  <div className="tweetoption">
                    <div className="tweetlike">
                    <button onClick={() => handlelike(tweet.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0'}} className="tweet_like">
                      <div>
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </div>
                      <div>
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
                    リツイート
                    </div>
                    <div>
                      {tweet.retweet}
                    </div>
                    </Link>
                    </div>
                    
                    <div className="tweetreply">
                    {/* <Link href={{pathname: '/replysite', query: { text: tweet.id}}}>
                    リプライ一覧
                    </Link> */}
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleClick(index)}>code</button>
                  </div>
                  <div>
                    {visibleItems.includes(index) && <div>{tweet.code}</div>}
                  </div>
                {/* <button onClick={() => handleNavigation(tweet.id)}>リプライ</button> */}
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
                    {/* {FetchProfileFig tweet.name} */}
                    <Link href={{pathname: "/profile", query: {text: ConvertFromIdToName(tweet.retweetto)} }} className="twitter_profile">
                    {/* {tweet.name} */}
                    {ConvertFromIdToName(tweet.retweetto)}
                    </Link>
                    {/* <div>
                    </div> */}
                    <div className="tweetdate">
                    {tweet.date}
                  </div>
                  </div> 
                
                  {/* <div>
                  <PreviewImage imagename={tweet.figid} />
                  </div> */}
                {/* </div>
                <div className="tweet_all"> */}
                <Link href={{pathname: "replysite", query: {text: tweet.id}}} className="customLink">
                  <div className="tweetcontent">
                  <h5>{tweet.content}</h5>  
                  </div>
                  </Link> 
                  <div className="tweetoption">
                    <div className="tweetlike">
                    <button onClick={() => handlelike(tweet.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0'}} className="tweet_like">
                      <div>
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </div>
                      <div>
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
                    リツイート
                    </div>
                    <div>
                      {tweet.retweet}
                    </div>
                    </Link>
                    </div>
                    
                    <div className="tweetreply">
                    {/* <Link href={{pathname: '/replysite', query: { text: tweet.id}}}>
                    リプライ一覧
                    </Link> */}
                    </div>
                  </div>
                  <div>
                    <button onClick={() => handleClick(index)}>code</button>
                  </div>
                  <div>
                    {visibleItems.includes(index) && <div>{tweet.code}</div>}
                  </div>
                {/* <button onClick={() => handleNavigation(tweet.id)}>リプライ</button> */}
                <PreviewImage imagename={tweet.figid}/>
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
    )
}
export default SearchPage