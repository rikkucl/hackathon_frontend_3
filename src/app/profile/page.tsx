"use client"
import { useAppContext } from "../context"
import React from "react"
import PreviewImage from "../lib/PreviewImage"
import "../App.css"
import { useEffect } from "react"
import { db } from "../lib/firebase"
import { useState } from "react"
import { getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth"
import PreviewImageFromUser from "../lib/PreviewImageFromUser"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import Link from "next/link"
import Modal from "./Modal"
import Post from "../register/ProfileFigure"
import { fireAuth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { getFirestore, collection, query, where, getDocs, getDoc, doc, namedQuery } from "firebase/firestore";
import { updateDoc } from "firebase/firestore"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { text } from "stream/consumers"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { EmailAuthProvider } from "firebase/auth/web-extension"

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import PreviewImage_square from "../lib/PreviewImage_square"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
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
    username?: string;
    retweettoname?: string
  }
interface Followreq {
    followerreq: string;
    followedreq: string
    followerreqname?: string;
    followedreqname?: string;
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
interface Follow {
  follower: string;
  followed: string;
  followername?: string;
  followedname?: string;
}

const ProfilePage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
    const [user_name, setUser_name] = useState<string>("")
    const [user_fig, setUserfig] = useState<string>("")
    const [displayId, setDisplayId] = useState<string>("")
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const [isModalOpen, setModalOpen] = useState<string>("")
    const [fig_changed, setFig_change] = useState<string>("")
    const [statusmessage, setStatusmessage] = useState<string>("")
    const [statusmessage_changed, setStatusmessage_changed] = useState<string>("")
    const [name_changed, setName_changed] = useState<string>("")
    const [usernames, setUsernames] = useState<Tweet[]>([])
    const [follows_, setFollows_] = useState<Follow[]>([])
    const [followreqs_, setFollowreqs_] = useState<Followreq[]>([])
    const [username, setUsername] = useState<string>("")
    const [isLoggin, setIsLoggin] = useState(false);
    const [likes, setLikes] = useState<Like[]>([]);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [pub, setPub] = useState<string>("")
    const [pub_changed, setPub_changed] = useState<string>("")
    const [privateIds, setPrivateIds] = useState<string[]>([])
    const [isvisible, setIsvisible] = useState(false) 





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
        setDisplayId(uid)
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

    useEffect(() => {
      fetchUser_(user_name)
    }, [user_name])
    
    const fetchUser_ = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().registername)
          const userPublicity = userDoc.data()?.publicity;
          if (userPublicity !== undefined) {
            setPub(userPublicity);
          }
        } else {
          setDisplayfig("")
        }
      } catch (err) {
        console.log("error happened", err)
      }
    }
    
  const fetchFavorite = async () => {
    try{
      const res = await fetch(
        "https://hackathon-backend-1012715555694.us-central1.run.app/getfavorite",
        {
            method: "POST",
            body: JSON.stringify({
              user_id: displayId
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
  
    const signOutfromfire = (): void => {
      signOut(fireAuth).then(() => {
        setDisplayname("")
        setDisplayId("")
        setDisplayfig("")
        alert("ログアウトしました");
      }).catch(err => {
        alert(err);
      });
    };
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
        // console.log(uid)
        if (userDoc.exists()) {
          return userDoc.data().registername
        } else {
          console.log("userfigid is not defined")
          return ""
        }
      } catch (err) {
        // console.log(uid)
        console.log("error happened", err)
        return ""
      }
    }

    useEffect(() => {
        fetchFollow()
    })
    useEffect(() => {
      // console.log("getlike")
      if (displayId !== ""){
        fetchLike()
        fetchFavorite()
      }
    })
  
    const fetchLike = async () => {
      try{
        const res = await fetch(
          "https://hackathon-backend-1012715555694.us-central1.run.app/getlike",
          {
              method: "POST",
              body: JSON.stringify({
                user_id: displayId
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

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const auth = getAuth();
      const user = auth.currentUser
      if (!user) {
        alert("ログインしてください")
        return;
      } else {
        try {
          if (typeof user.email === "string") {
            const credential = EmailAuthProvider.credential(
              user.email,
              currentPassword
            );
            await reauthenticateWithCredential(user, credential)

            await updatePassword(user, newPassword);

            alert("パスワードが変更されました")
          }
        } catch (error) {
          alert(`エラー`)
        }
      }
    }
  

    
    const fetchUser = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setDisplayfig(userDoc.data().figid)
          setDisplayname(userDoc.data().registername)
          setStatusmessage(userDoc.data()?.statusmessage || "")
        } else {
          // console.log("userfigid is not defined")
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



    useEffect(() => {
      const getUserData = async () => {
        const data = await fetchNamesFromFollows(follows)
        setFollows_(data)
      }
      getUserData();
    }, [follows])
  
  

    const fetchNamesFromFollows = async (follows: Follow[]) => {
      const names = await Promise.all(
        follows.map(async (follow) => {
          const followername = await fetchName(follow.follower)
          const followedname = await fetchName(follow.followed)
          return { ...follow, followername: followername, followedname: followedname}
        })
      )
      return names;
    }


    useEffect(() => {
      const getUserData = async () => {
        const data = await fetchNamesFromFollowreqs(followreqs)
        setFollowreqs_(data)
      }
      getUserData();
    }, [followreqs])

    const fetchNamesFromFollowreqs = async (followreqs: Followreq[]) => {
      const names = await Promise.all(
        followreqs.map(async (followreq) => {
          const followerreqname = await fetchName(followreq.followerreq)
          const followedreqname = await fetchName(followreq.followedreq)
          return { ...followreq, followerreqname: followerreqname, followedname: followedreqname}
        })
      )
      return names;
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
    const filteredFollows = follows_.filter(follow => {
        const regex = new RegExp(user_name, 'i');
        return regex.test(follow.follower)
    })
    const filteredFollowreqs = followreqs_.filter(followreq => {
        const regex = new RegExp(displayId, 'i');
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
                        followerreq: displayId,
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
                        followed: displayId,
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

    const publicTweets = usernames.filter(tweet => privateIds?.every(id => id !== tweet.name) || isfollow(displayId, tweet.name) || displayId === tweet.name);
    const filteredTweets = publicTweets.filter(tweet => {
      const regex = new RegExp(user_name, 'i');
      return regex.test(tweet.name)
  })
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

    // const toggleModal = () => {
    //   setModalOpen(!isModalOpen)
    // }
    const selectChangedString = (oldstring: string, newstring: string) => {
      return newstring !== "" ? newstring:oldstring;
    }
    const updateData = async (id:string, newData:any) => {
      const docRef = doc(db, "users", id);

      try {
        await updateDoc(docRef, newData);
        // console.log("Document successfully updated")
      } catch(error) {
        console.log("Error updating document", error)
      }
    }

    const changeprofile = async (e:any) => {
      e.preventDefault()
      const name = selectChangedString(displayname, name_changed)
      const figid = selectChangedString(displayfig, fig_changed)
      const message = selectChangedString(statusmessage, statusmessage_changed)
      const publicity = selectChangedString(pub, pub_changed)
      await updateData(displayId, {registername: name, figid:figid, statusmessage: message, publicity: publicity})
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
                user_id: displayId,
              }),
            })
            fetchTweet()
        } catch (err) {
          console.log(err)
        }
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
      const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPub_changed(event.target.value);
      };
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
      <div className="app">
        {/* <div className="app_profile"> */}
        <div
        className={`content ${isvisible ? "no-click" : ""}`}
        onClick={() => isvisible && setIsvisible(false)}
      >
        <div className="profile">
            <div className="profileheader">
                <div className="profilename">
                <div>
                <PreviewImageFromUser tweetname={user_name} />
                </div>
                <div>
                {username}
                </div>
                </div>
                <div className="profilemessage">
                  <div>{statusmessage}</div>
                </div>
                {displayId === user_name ? (
                  <div>
                  <button onClick={() => setModalOpen("modal_change")}>ユーザープロファイルの変更</button>
                  </div>
                ):(
                  null
                )}

                <div className="profilefollow">
                  <div>
                  <button onClick={() => setModalOpen("modal_follow")}>フォロー</button>
                  </div>
                    <div>
                    {displayId !== user_name ? (
                      <div>
                        {isfollow(displayId, user_name) ? (
                            <div>フォロー済</div>
                        ) : (
                            <div>
                                {isfollowreq(displayId, user_name) ? (
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
                    <button onClick={() => setModalOpen("modal_followreq")}>フォローリクエスト</button>
                    )}
                    </div>
                </div>    
            </div>
            <div className="profilecontent">
                <div>ポスト一覧</div>
                <div>
                <div className="user_container_pro">
                <div className="scroll">
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
            {displayId === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {displayId === tweet.name ? (
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
            {displayId === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {displayId === tweet.name ? (
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
            {displayId === tweet.name ? (
              <div>
              <button onClick={() => handlegemini(tweet.id)}>ask gemini</button>
              </div>
            ):(
              null
            )}
            {displayId === tweet.name ? (
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
      </div>
            </div>
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
      <Link href={{pathname: '/profile', query: { text: displayId } }} className="profile_page">
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
        
    {/* </div> */}
    <Modal isOpen={isModalOpen === "modal_change"} onClose={() => setModalOpen("")}>
        <div>プロフィールの変更</div>
          <div className="register">
            <form onSubmit={changeprofile}>
            <label>ユーザー名</label>
            <input
            name="displayname"
            type="text"
            value={name_changed}
            onChange={(e) => setName_changed(e.target.value)}
            >
            </input>
              <div>
                <label>ユーザー画像</label>
                <Post setFigure_id={setFig_change}/>
              </div>
              <label>ステータスメッセージ</label>
              <input
              name="status_message"
              type="text"
              value={statusmessage_changed}
              onChange={(e) => setStatusmessage_changed(e.target.value)}
            >
              </input>
              <label>公開設定</label>
              <select value={pub_changed} onChange={handleSelectChange}>
                <option value={pub}>変更しない</option>
                <option value="public">public</option>
                <option value="private">private</option>
              </select>
              <button>ユーザー情報変更</button>                      
            </form>
            <button onClick={() => setModalOpen("modal_pass")} className="button_pass">パスワード変更</button>
          </div>
          <button onClick={() => setModalOpen("")}>閉じる</button>
    </Modal>
    <Modal isOpen={isModalOpen === "modal_follow"} onClose={() => setModalOpen("")}>
      <div>フォロー</div>
      {Object.values(filteredFollows).map((follow) => 
        <Link href={{pathname: '/profile', query: {text: follow.followed}}} className="link">{follow.followedname}</Link>
        )}
    </Modal>
    <Modal isOpen={isModalOpen === "modal_followreq"} onClose={() => setModalOpen("")}>
      <div>フォローリクエスト</div>
      {Object.values(filteredFollowreqs).map((followreq) => 
        <div className="followrequest">
            <Link href={{pathname: '/profile', query: {text: followreq.followerreq}}} className="link">{followreq.followerreqname}</Link>
            <button onClick={() => acceptfollow(followreq.followerreq)} type="submit">フォローを受け入れる</button>
        </div>
        )}
    </Modal>
    <Modal isOpen={isModalOpen === "modal_pass"} onClose={() => setModalOpen("")}>
      <div>パスワード変更</div>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>現在のパスワード: </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>新しいパスワード: </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">変更</button>
      </form>
    </Modal>
    </div>
    )
}

export default ProfilePage