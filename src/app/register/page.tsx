"use client"
import React from "react";
import { useState } from "react";
import { setDoc, doc, serverTimestamp, addDoc, collection, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth, db } from "../lib/firebase";
import Post from "./ProfileFigure";
import Link from "next/link";
import { useAppContext } from "../context";
import { useRouter } from "next/navigation"
import { register } from "module";

const RegisterPage = () => {
  const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows} = useAppContext()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registername, setRegistername] = useState("")
  const [figure_id, setFigure_id] = useState("")
  const [email_p, setEmail_p] = useState("");
  const [password_p, setPassword_p] = useState("");
  const [registername_p, setRegistername_p] = useState("")
  const [figure_id_p, setFigure_id_p] = useState("")
  const router = useRouter();


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
          setDisplayname(registername)
          setDisplayfig(figure_id)
          router.push('../view')
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
  <div className="App">
    <div className="register">
      <h5 className="login_title">ユーザー登録</h5>
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
  </div>
  </div>
  ) 
}
export default RegisterPage;