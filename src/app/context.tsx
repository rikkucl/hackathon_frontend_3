"use client";

import React, {createContext, useState, useContext, ReactNode, Children } from "react";

interface Tweet {
    id: string;
    name: string;
    date: string;
    liked: number;
    content: string;
    retweet: number;
    figid: string;
    code: string;
    errormessage: string;
    lang: string;
    replyto: string;
    replynumber: number;
    retweetto: string;
    retweetcomment: string
}
interface Followreq {
    followerreq: string;
    followedreq: string;
    followerreqname?: string;
    followedreqname?: string
}
interface Follow {
    follower: string;
    followed: string;
    folowername?: string;
    followedname?: string
}
interface AppContextType {
    Tweets: Tweet[];
    setTweets: (Tweets: Tweet[]) => void;
    displayname: string;
    setDisplayname: (displayname: string) => void;
    displayfig: string;
    setDisplayfig: (displayfig: string) => void;
    status: string;
    setStatus: (status: string) => void;
    followreqs: Followreq[];
    setFollowreqs: (followreqs: Followreq[]) => void;
    follows: Follow[];
    setFollows: (follows: Follow[]) => void
}
const defaultContextValue: AppContextType = {
    Tweets: [],
    setTweets: (Tweets: Tweet[]) => {},
    displayname: "",
    setDisplayname: (displayname: string) => {},
    displayfig: "",
    setDisplayfig: (displayfig: string) => {},
    status: "",
    setStatus: (status: string) => {},
    followreqs: [],
    setFollowreqs: (followreqs: Followreq[]) => {},
    follows: [],
    setFollows: (follows: Follow[]) => {}
}

const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({children}: {children: ReactNode }) => {
    const [Tweets, setTweets] = useState<Tweet[]>([]);
    const [displayname, setDisplayname] = useState<string>("Anonymous")
    const [displayfig, setDisplayfig] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    const [followreqs, setFollowreqs] = useState<Followreq[]>([])
    const [follows, setFollows] = useState<Follow[]>([])
    return (
        <AppContext.Provider value={{Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus, followreqs, setFollowreqs, follows, setFollows}}>
        {children}
        </AppContext.Provider>
    )
}