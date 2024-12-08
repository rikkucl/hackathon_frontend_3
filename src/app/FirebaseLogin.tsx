"use client"
import { signInWithPopup, GoogleAuthProvider, signOut, getAuth } from "firebase/auth";
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
function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}

export const LoginForm: React.FC<Props> = ({router, setDisplayname, setDisplayfig, setStatus}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginemail, setLoginemail] = useState("")
  const [loginpassword, setLoginpassword] = useState("")
  const [registername, setRegistername] = useState("")
  const [figure_id, setFigure_id] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  /**
   * googleでログインする
   */
  const signInWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
      alert("認証されました. ホーム画面へ移動します")
      handleNavigation("/view")
    } catch (error) {
      alert(`エラー`)
    }
  }
  const signInfire = async (e:React.FormEvent<HTMLFormElement>) => {
    //setUser_name("riku")
    e.preventDefault()
    try {
      setIsLoading(true)
        const userCredential =  await signInWithEmailAndPassword(fireAuth, loginemail, loginpassword)
        const user = userCredential.user
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayname(userData.registername || "未設定")
          setDisplayfig(userData.figid || "未設定")
          setStatus(userData.status || "未設定")
        }
        alert("認証されました. ホーム画面へ移動します")
        handleNavigation("/view")
    } catch(error){
        alert("間違ったメールアドレスまたはパスワード")
        setIsLoading(false)
    }
  }

  const handleNavigation = async (url: string) => {
    setIsLoading(true);
    await router.push(url)
    setIsLoading(false)
  }
  const signOutfromfire = (): void => {
    signOut(fireAuth).then(() => {
      alert("ログアウトしました");
      //setUser_name("")
    }).catch(err => {
      alert(err);
    });
  };
  return (
    <div>
      <div>
        {isLoading && <LoadingScreen />}
      </div>
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
      <button onClick={signInWithGoogle}>Google アカウントでログイン</button>
      </div>
      <div className="login_option">
      <Link href={{pathname: "/register"}} className="register_page">
      ユーザー登録
      </Link>
      <Link href={{pathname: "/view"}} className="view_page_log">
      ログインせずに閲覧
      </Link>
      </div>
    </div>
  );
};
export default LoginForm;