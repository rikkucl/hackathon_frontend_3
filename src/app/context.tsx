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
}
const defaultContextValue: AppContextType = {
    Tweets: [],
    setTweets: (Tweets: Tweet[]) => {},
    displayname: "",
    setDisplayname: (displayname: string) => {},
    displayfig: "",
    setDisplayfig: (displayfig: string) => {},
    status: "",
    setStatus: (status: string) => {}
}

const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({children}: {children: ReactNode }) => {
    const [Tweets, setTweets] = useState<Tweet[]>([]);
    const [displayname, setDisplayname] = useState<string>("")
    const [displayfig, setDisplayfig] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    return (
        <AppContext.Provider value={{Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig, status, setStatus}}>
        {children}
        </AppContext.Provider>
    )
}