"use client"
import Link from "next/link";
import React from "react";
import PreviewImage from "../lib/PreviewImage";
import { useAppContext } from "../context";
import Tweet from "./Tweet";
import { useRouter } from "next/navigation";

const PostPage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    const router = useRouter();
    return (
        <div className="App">
        <Tweet router={router} displayname={displayname} />
        <Link href={{pathname: "../view"}}>
        閲覧画面
        </Link>
      </div>
    )
}
export default PostPage