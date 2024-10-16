"use client"
import { AppProvider } from "./context";
import React from "react"
import { AppProps } from "next/app";
export default function App({ Component, pageProps}: AppProps) {
    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    )
}