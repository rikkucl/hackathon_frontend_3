"use client"
import Link from "next/link";
import React, { useState } from "react";
import PreviewImage from "../lib/PreviewImage";
import { useAppContext } from "../context";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
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
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faHouse} from "@fortawesome/free-solid-svg-icons";

const PostPage = () => {
  const [userid, setUserid] = useState<string>("")
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser
    if (user) {
      const uid = user.uid
      // fetchUser(uid)
      setUserid(uid)
      console.log("userid id", userid)
    } else {
      console.log("cannot find user")
    }
  })
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const router = useRouter();
    return (
        <div className="App">
        <Tweet router={router}/>
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
        Profile
      </div>
      </Link>
      </div>
    )
}
export default PostPage