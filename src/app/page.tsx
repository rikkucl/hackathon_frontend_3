"use client"
import Link from "next/link";
import React from "react";
import LoginForm from "./FirebaseLogin";
import PreviewImage from "./lib/PreviewImage";
import { useAppContext } from "./context";
import { useRouter } from "next/navigation";



const Loginpage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
    const router = useRouter();
    return (
        <div className="App">
        <header className="App-header">
        <PreviewImage  imagename={displayfig}/>
        <LoginForm router={router} setDisplayname={setDisplayname} setDisplayfig={setDisplayfig} setStatus={setStatus}/>
        {/* <Link href={{pathname: "./view"}}>
        閲覧画面
        </Link> */}
        </header>
      </div>
    )
}
export default Loginpage