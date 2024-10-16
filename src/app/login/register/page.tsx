"use client"
import React from "react";
import { useState } from "react";
import { setDoc, doc, serverTimestamp, addDoc, collection, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth, db } from "../../firebase";
import Post from "./ProfileFigure";
import Link from "next/link";
import { useAppContext } from "../../context";

const RegisterPage = () => {
  const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus} = useAppContext()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registername, setRegistername] = useState("")
  const [figure_id, setFigure_id] = useState("")
  const [email_p, setEmail_p] = useState("");
  const [password_p, setPassword_p] = useState("");
  const [registername_p, setRegistername_p] = useState("")
  const [figure_id_p, setFigure_id_p] = useState("")

  const signUpStandard = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
          const userCredential = await createUserWithEmailAndPassword(fireAuth,email,password)
          const user = userCredential.user
          await setDoc(doc(db, "users", user.uid), {
            registername: registername,
            email: email,
            createdAt: serverTimestamp(),
            figid: figure_id,
            status: "standard"
          }).catch((error) => {
            console.error("Error writting docment ", error)
          })
          alert("登録しました")
      } catch (err) {
          alert(err);
      }
    }

  const signUpPremium = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
        const userCredential = await createUserWithEmailAndPassword(fireAuth,email,password)
        const user = userCredential.user
        await setDoc(doc(db, "users", user.uid), {
          registername: registername,
          email: email,
          createdAt: serverTimestamp(),
          figid: figure_id,
          status: "premium"
        }).catch((error) => {
          console.error("Error writting docment ", error)
        })
        alert("登録しました")
      } catch (err) {
          alert(err);
      }
    }
return (
  <div>
    <div className="register">
      <h5 className="action">ユーザー登録 Standard Plan</h5>
      <form onSubmit={signUpStandard}>
      <div className="form_block">
      <label>ユーザー名</label>
      <input name="displayname" value={registername} type="text" onChange={(e) => setRegistername(e.target.value)} style={{color: "black"}}></input>
      </div>
      <div className="form_block">
      <label>メールアドレス:</label>
      <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{color: "black"}}></input>
      </div>
      <div className="form_block">
      <label>パスワード:</label>
      <input name="password" type="password" value={password} onChange={(e => setPassword(e.target.value))} style={{color: "black"}}></input>
      </div>
      <div>
        <label>ユーザー画像</label>
        <Post setFigure_id={setFigure_id} />
      </div>
      <button>ユーザー登録</button>
      </form>
      <Link href={{pathname: "../../"}}>
      閲覧画面
      </Link>
  </div>
  <div className="register">
  <h5 className="action">ユーザー登録 Premium Plan</h5>
    <form onSubmit={signUpPremium}>
    <div className="form_block">
    <label>ユーザー名</label>
    <input name="displayname" value={registername_p} type="text" onChange={(e) => setRegistername_p(e.target.value)} style={{color: "black"}}></input>
    </div>
    <div className="form_block">
    <label>メールアドレス:</label>
    <input name="email" type="email" value={email_p} onChange={(e) => setEmail_p(e.target.value)} style={{color: "black"}}></input>
    </div>
    <div className="form_block">
    <label>パスワード:</label>
    <input name="password" type="password" value={password_p} onChange={(e => setPassword_p(e.target.value))} style={{color: "black"}}></input>
    </div>
    <div>
      <label>ユーザー画像</label>
      <Post setFigure_id={setFigure_id_p} />
    </div>
    <button>ユーザー登録</button>
    </form>
    </div>
  </div>
  ) 
}
export default RegisterPage;