"use client"
import Link from "next/link";
import React from "react";
import PreviewImage from "../PreviewImage";
import { useAppContext } from "../context";
import Tweet from "./Tweet";

const PostPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig} = useAppContext()
    return (
        <div className="App">
        <Tweet displayname={displayname} />
        <Link href={{pathname: "../"}}>
        閲覧画面
        </Link>
      </div>
    )
}
export default PostPage