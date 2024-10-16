"use client"
import Link from "next/link";
import React from "react";
import LoginForm from "./FirebaseLogin";
import PreviewImage from "../PreviewImage";
import { useAppContext } from "../context";



const Loginpage = () => {
    const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
    return (
        <div className="App">
        <header className="App-header">
        <PreviewImage  imagename={displayfig}/>
        <LoginForm setDisplayname={setDisplayname} setDisplayfig={setDisplayfig} setStatus={setStatus}/>
        <Link href={{pathname: "../"}}>
        閲覧画面
        </Link>
        <Link href={{pathname: "/login/register"}} >
        ユーザー登録
        </Link>
        </header>
      </div>
    )
}
export default Loginpage