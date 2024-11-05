"use client"
import Link from "next/link";
import React from "react";
import PreviewImage from "../lib/PreviewImage";
import { useAppContext } from "../context";
import ReTweet from "./ReTweet";
import { useRouter } from "next/navigation";
import { fireAuth, db } from "../lib//firebase";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, namedQuery } from "firebase/firestore";
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

interface QueryParams {
  text: string;
}
const PostPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
    const [tweet_id, setTweet_id] = useState<string>("")
    const [displayid, setDisplayid] = useState<string>()
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
      const user = auth.currentUser
      if (user) {
        const uid = user.uid
        fetchUser(uid)
        setDisplayid(uid)
      } else {
        console.log("cannot find user")
      }
    })
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

    return (
        <div className="App">
        <ReTweet router={router} retweetto={tweet_id} />
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
        Profile
      </div>
      </Link>
      </div>
    )
}
export default PostPage