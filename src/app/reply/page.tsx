"use client"
import Link from "next/link";
import React from "react";
import PreviewImage from "../PreviewImage";
import { useAppContext } from "../context";
import ReTweet from "./ReTweet";
import { useRouter } from "next/router";
import { useState, useEffect} from "react"

interface QueryParams {
  text: string;
}
const PostPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const [tweet_id, setTweet_id] = useState<string>("")

    useEffect(() => {
      const querystring = window.location.search;
      const params = new URLSearchParams(querystring)
      const id = params.get("text")
      setTweet_id(id)
      console.log(id)
    })
    return (
        <div className="App">
        <ReTweet displayname={displayname} replyto={tweet_id} />
        <Link href={{pathname: "../"}}>
        閲覧画面
        </Link>
      </div>
    )
}
export default PostPage