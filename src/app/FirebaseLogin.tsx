"use client"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
// import { auth } from "./firebase";
import { fireAuth, db } from "./lib/firebase";
import React, { useState, Dispatch, SetStateAction } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp, addDoc, collection, getDoc } from 'firebase/firestore';
import Link from "next/link";
//import Post from "./FirebaseLoginFigure"
// import { useRouter } from "next/navigation"

import { isAwaitExpression } from "typescript";
import './App.css';

// interface Props {
//     setDisplayname: Dispatch<SetStateAction<string>>
//     setDisplayfig: Dispatch<SetStateAction<string>>
// }
interface Props {
    router: any
    setDisplayname: (displayname: string) => void
    setDisplayfig: (displayfig: string) => void
    setStatus: (status: string) => void
}
export const LoginForm: React.FC<Props> = ({router, setDisplayname, setDisplayfig, setStatus}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginemail, setLoginemail] = useState("")
  const [loginpassword, setLoginpassword] = useState("")
  const [registername, setRegistername] = useState("")
  const [figure_id, setFigure_id] = useState("")

  /**
   * googleでログインする
   */
  const signInfire = async (e:React.FormEvent<HTMLFormElement>) => {
    //setUser_name("riku")
    e.preventDefault()
    try {
        const userCredential =  await signInWithEmailAndPassword(fireAuth, loginemail, loginpassword)
        const user = userCredential.user
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayname(userData.registername || "未設定")
          setDisplayfig(userData.figid || "未設定")
          setStatus(userData.status || "未設定")
        }
        router.push('./view')
        // console.log("login")
        // alert("ログインしました")
        // try {
        //   router.push('./view')
        // }
        // catch (error) {
        //   alert("cannot router")
        // }
        
        //console.log(setUser_name)
        //setUser_name(loginemail)
        //setUser_name("riku")
    } catch(error){
        alert("間違ったメールアドレスまたはパスワード")
    }
  }
  /**
   * ログアウトする
   */
  const signOutfromfire = (): void => {
    signOut(fireAuth).then(() => {
      alert("ログアウトしました");
      //setUser_name("")
    }).catch(err => {
      alert(err);
    });
  };

//   const signUpNormal = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     try {
//         const userCredential = await createUserWithEmailAndPassword(fireAuth,email,password)
//         const user = userCredential.user
//         await setDoc(doc(db, "users", user.uid), {
//           registername: registername,
//           email: email,
//           createdAt: serverTimestamp(),
//           figid: figure_id,
//           status: "standard"
//         }).catch((error) => {
//           console.error("Error writting docment ", error)
//         })
//         alert("登録しました")
//     } catch (err) {
//         alert(err);
//     }
//   }
//   const signUpPremium = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     try {
//         const userCredential = await createUserWithEmailAndPassword(fireAuth,email,password)
//         const user = userCredential.user
//         await setDoc(doc(db, "users", user.uid), {
//           registername: registername,
//           email: email,
//           createdAt: serverTimestamp(),
//           figid: figure_id,
//           status: "premium"
//         }).catch((error) => {
//           console.error("Error writting docment ", error)
//         })
//         alert("登録しました")
//     } catch (err) {
//         alert(err);
//     }
// }

  

  return (
    <div>
      <div className="login">
        <h5 className="login_title">ログイン</h5>
        <form onSubmit={signInfire}>
        <div className="form_block">
        <label>メールアドレス:</label>
          <input name="email" type="email" value={loginemail} onChange={(e) => setLoginemail(e.target.value)} style={{color: "black"}}></input>
        </div>
        <div className="form_block">
        <label>パスワード:</label>
          <input name="password" type="password" value={loginpassword} onChange={(e => setLoginpassword(e.target.value))} style={{color: "black"}}></input>
        </div>
        <button className="submit-button">ログイン</button>
      </form>
      </div>
      <Link href={{pathname: "/register"}} className="register_page">
      ユーザー登録
      </Link>

      {/* <div className="logout">
        <h5 className="action">ログアウト</h5>
      <button onClick={signOutfromfire}>
      ログアウト
      </button>
      </div>
       */}

      {/* <div className="register">
            <h5 className="action">ユーザー登録</h5>
            <form onSubmit={signUpNormal}>
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
        </div> */}
    </div>
  );
};
export default LoginForm;