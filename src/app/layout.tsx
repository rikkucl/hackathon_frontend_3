
// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import React from "react";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }



// app/layout.tsx
import React, { Children } from 'react';
import { AppProvider } from './context';
import { useAppContext } from './context';
import PreviewImage from './PreviewImage';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <AppProvider>
      <html lang="en">
        <head>
          <title>Assembly For Engineer</title>
        </head>
        <body>
          <header>
            <h1>Welcome</h1>
          </header>
          <main>{children}</main>
          <footer>
            <p>© 2024 My Next.js App</p>
          </footer>
        </body>
      </html>
    </AppProvider>
  );
}

// const Layout = ({children}: {children: React.ReactNode}) => {
//   const {Tweets, setTweets, displayname, setDisplayname, displayfig, setDisplayfig} = useAppContext()
//   return (
//     <AppProvider>
//       <html lang="en">
//         <head>
//           <title>Assembly For Engineer</title>
//         </head>
//         <body>
//           <header>
//             <PreviewImage imagename={displayfig}/>
//             <h1>Welcome {displayname}</h1>
//           </header>
//           <main>{children}</main>
//           <footer>
//             <p>© 2024 My Next.js App</p>
//           </footer>
//         </body>
//       </html>
//     </AppProvider>
//   );
// }
// export default Layout
