"use client"
import Link from "next/link";
import React from "react";
import PreviewImage from "../lib/PreviewImage";
import { useAppContext } from "../context";
import ReTweet from "./ReTweet";
import { useRouter } from "next/navigation";
import { fireAuth, db } from "../lib//firebase";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, namedQuery } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useState, useEffect} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

interface QueryParams {
  text: string;
}
interface Like {
  tweet_id: string
}

const PostPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
    const [tweet_id, setTweet_id] = useState<string>("")
    const [displayid, setDisplayid] = useState<string>()
    const [isLoggin, setIsLoggin] = useState(false);
    const [likes, setLikes] = useState<Like[]>([])
    const [isvisible, setIsvisible] = useState(false) 



    const router = useRouter();

    useEffect(() => {
      const querystring = window.location.search;
      const params = new URLSearchParams(querystring)
      const id= params.get("text")
      if (id) {
        setTweet_id(String(id))
      }
    }, [])
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
        setDisplayid(uid)
      } else {
        console.log("cannot find user")
      }
    }, [])
    useEffect(() => {
      // console.log("getlike")
      if (displayid !== ""){
        fetchLike()
      }
    }, [displayid])
  
    const fetchLike = async () => {
      try{
        const res = await fetch(
          "https://hackathon-backend-1012715555694.us-central1.run.app/getlike",
          {
              method: "POST",
              body: JSON.stringify({
                user_id: displayid
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
  
    const signOutfromfire = (): void => {
      signOut(fireAuth).then(() => {
        setDisplayname("")
        setDisplayid("")
        setDisplayfig("")
        alert("ログアウトしました");
      }).catch(err => {
        alert(err);
      });
    };
    const toggleSidebar = () => {
      setIsvisible(!isvisible)
    }

    return (
        <div className="App">
        <div
        className={`content ${isvisible ? "no-click" : ""}`}
        onClick={() => isvisible && setIsvisible(false)}
      >
        <ReTweet router={router} retweetto={tweet_id} />
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
      <Link href={{pathname: '/profile', query: { text: displayid } }} className="profile_page">
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
    )
}
export default PostPage