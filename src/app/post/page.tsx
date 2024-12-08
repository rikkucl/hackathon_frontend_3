"use client"
import Link from "next/link";
import React, { useState } from "react";
import PreviewImage from "../lib/PreviewImage";
import { useAppContext } from "../context";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { fireAuth } from "../lib/firebase";
import Tweet from "./Tweet";
import { useRouter } from "next/navigation";
import { getDoc } from "firebase/firestore";
import { db} from "../lib/firebase";
import { doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse} from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

const PostPage = () => {
  const [userid, setUserid] = useState<string>("")
  const [isLoggin, setIsLoggin] = useState(false);
  const [isvisible, setIsvisible] = useState(false) 



  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggin(true);
      } else {
        setIsLoggin(false)
      }
    }, )
    const user = auth.currentUser
    if (user) {
      const uid = user.uid
      // fetchUser(uid)
      setUserid(uid)
      // console.log("userid id", userid)
    } else {
      console.log("cannot find user")
    }
  }, [])
  const signOutfromfire = (): void => {
    signOut(fireAuth).then(() => {
      setDisplayname("")
      setUserid("")
      setDisplayfig("")
      alert("ログアウトしました");
    }).catch(err => {
      alert(err);
    });
  };
  const toggleSidebar = () => {
    setIsvisible(!isvisible)
  }
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const router = useRouter();
    return (
        <div className="App">
          <div
        className={`content ${isvisible ? "no-click" : ""}`}
        onClick={() => isvisible && setIsvisible(false)}
      >
        <Tweet router={router}/>
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
      <Link href={{pathname: '/profile', query: { text: userid } }} className="profile_page">
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