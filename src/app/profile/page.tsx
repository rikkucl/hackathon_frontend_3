"use client"
import { useAppContext } from "../context"
import React from "react"
import PreviewImage from "../lib/PreviewImage"
import "../App.css"
import { useEffect } from "react"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useState } from "react"
import { getAuth } from "firebase/auth"
import PreviewImageFromUser from "../lib/PreviewImageFromUser"
import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

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
interface Followreq {
    followerreq: string;
    followedreq: string
}
interface Follow {
    follower: string;
    followed: string
}

const ProfilePage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
    const [user_name, setUser_name] = useState<string>("")
    const [user_fig, setUserfig] = useState<string>("")
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
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

    useEffect(() => {
        const querystring = window.location.search;
        const params = new URLSearchParams(querystring)
        const id = params.get("text")
        // setUser_name(id)
        if (id) {
            setUser_name(id)
        }
      }, [])
    const filteredTweets = Tweets.filter(tweet => {
        const regex = new RegExp(user_name, 'i');
        return regex.test(tweet.name)
    })
    useEffect(() => {
        fetchFollow()
    })
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
        try {
            const res = await fetch(
                "https://hackathon-backend-1012715555694.us-central1.run.app/followreq",
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
            const data:Followreq[] = await res.json();
            setFollowreqs(data)
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
    const filteredFollows = follows.filter(follow => {
        const regex = new RegExp(user_name, 'i');
        return regex.test(follow.follower)
    })
    const filteredFollowreqs = followreqs.filter(followreq => {
        const regex = new RegExp(displayname, 'i');
        return regex.test(followreq.followedreq)
    })

    const followrequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
;        try {
            const result = await fetch(
                "https://hackathon-backend-1012715555694.us-central1.run.app/followreq",
                {
                    method: "POST",
                    body: JSON.stringify({
                        followerreq: displayname,
                        followedreq: user_name
                    }),
                });
                if (!result.ok) {
                    throw Error("Failed to send followreqest")
                }
            } catch (err) {
                console.log(err);
        }
    }

    const acceptfollow = async (followerreq: string) => {
        try {
            const result = await fetch(
                "https://hackathon-backend-1012715555694.us-central1.run.app/follow",
                {
                    method: "POST",
                    body: JSON.stringify({
                        followed: displayname,
                        follower: followerreq
                    }),
                });
                if (!result.ok) {
                    throw Error("Failed to send accept")
                }
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
    const isfollowreq = (follower:string, followed:string) => {
        const foundItem = followreqs.find(follow => follow.followerreq === follower &&  follow.followedreq === followed)
        if (foundItem) {
            return true;
        } else {
            return false
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
      const ConvertFromIdToName = (id: string) => {
        const TweetFiltered: Tweet| undefined = Tweets.find(tweet => tweet.id === id)
        if (TweetFiltered !== undefined) {
          return TweetFiltered.name
        } else {
          return ""
        }
      }
    
    return (
        <div className="app">
        <div className="profile">
            <div className="profileheader">
                <div className="profilename">
                <div>
                <PreviewImageFromUser tweetname={user_name} />
                </div>
                <div>
                {user_name}
                </div>
                </div>
                <div className="profilefollow">
                    <div>
                        <div>フォローしている人</div>
                        {Object.values(filteredFollows).map((follow) => 
                        <div className="follow">
                            {follow.followed}
                        </div>
                        )}
                    </div>
                    
                    {displayname !== user_name ? (
                        <div>
                        {isfollow(displayname, user_name) ? (
                            <div>フォロー済</div>
                        ) : (
                            <div>
                                {isfollowreq(displayname, user_name) ? (
                                    <div>フォローリクエスト済</div>
                                ) : (
                                    <div>
                                    <form onSubmit={followrequest} >
                                    <div>
                                    <button type="submit">フォローリクエスト</button>
                                    </div>
                                    </form>
                                    </div>
                                )}
                        </div>
                        )}
                        </div>
                    ) : (
                        Object.values(filteredFollowreqs).map((followreq) => 
                        <div className="followrequest">
                            <div>{followreq.followerreq}</div>
                            <button onClick={() => acceptfollow(followreq.followerreq)} type="submit">フォローを受け入れる</button>
                        </div>
                        )
                    )}
                </div>    
            </div>
            <div className="profilecontent">
              {/* {Object.values(filteredTweets).map((tweet, index) => 
                tweet.retweetto === "" ? (
                <div className="tweet">
                    <div className="tweetcontent">
                    <h5>{tweet.name}, {tweet.content}, {tweet.date}, {tweet.liked}</h5>  
                    </div>
                    <div className="tweetlike">
                    </div>
                </div>
                )
                )} */}
                <div>ポスト一覧</div>
                <div>
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
            </div>
        </div>
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

export default ProfilePage