"use client"
import Link from "next/link";
import React from "react";
import PreviewImage from "../lib/PreviewImage";
import { useAppContext } from "../context";
import ReTweet from "./ReTweet";
import { useRouter } from "next/navigation";
import { useState, useEffect} from "react"

interface QueryParams {
  text: string;
}
const PostPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
    const [tweet_id, setTweet_id] = useState<string>("")
    const router = useRouter();

    useEffect(() => {
      const querystring = window.location.search;
      const params = new URLSearchParams(querystring)
      const id= params.get("text")
      if (id) {
        setTweet_id(String(id))
      }
    }, [])
    return (
        <div className="App">
        <ReTweet router={router} retweetto={tweet_id} />
        <Link href={{pathname: "../"}}>
        閲覧画面
        </Link>
      </div>
    )
}
export default PostPage