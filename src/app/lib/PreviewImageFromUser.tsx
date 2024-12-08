"use client"
import { getDownloadURL, ref, StorageReference } from "firebase/storage";
import React, { useState, useEffect} from "react";
import { storage } from "./firebase"
import { promises } from "dns";
import { getDoc, query, collection, where, doc } from "firebase/firestore";
import { db } from "./firebase";


// export const PreviewImage: React.FC<{ imagename: string }> = ({ imagename }) => {
//     const [prevUrl, setPrevUrl] = useState<string>("");
//     const [error, setError] = useState<string>("");
//     const [imageLoaded, setImageLoaded] = useState(false)
//     useEffect(() => {
//         if (imagename=="") {
//             setImageLoaded(false)
//         } else {
//         const getImageUrl = async (imageRef: StorageReference) => {
//             try {
//                 const url = await getDownloadURL(imageRef);
//                 setPrevUrl(url);
//             } catch (e) {
//                 setError(`${e}`);
//             }
//         };
//         //const imageRef = ref(storage, "/images/1728983020809_無題.png")
//         const imageRef = ref(storage, "images/"+imagename);
//         getImageUrl(imageRef);
//         setImageLoaded(true)
//     }
//     }, [imagename]);
//     return (
//         <div
//         style={{
//             boxShadow: "0px 4px 8px gray",
//             padding: 10,
//             margin: 10,
//             width:350,
//             height: 400,
//         }}
//         >
//             <p>
//                 {imageLoaded ? (
//                 <img
//                 src={prevUrl}
//                 alt={"error"}
//                 style={{ height: 200, width: 300, objectFit: "cover"}}
//                 />
//                 ) :(
//                     <p>No image</p>
//                 )}
//             </p>
//         </div>
//     )
// }


export const PreviewImageFromUser: React.FC<{ tweetname: string }> = ({ tweetname }) => {
    const [prevUrl, setPrevUrl] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imagename, setImagename] = useState<string>("")
    // useEffect(() => {
    //     console.log("tweetname", tweetname)
    //     FetchProfileFig(tweetname)
    //     // console.log(imagename)
    //     console.log("reading...", imagename)
    //     if (imagename=="") {
    //         setImageLoaded(false)
    //     } else {
    //     const getImageUrl = async (imageRef: StorageReference) => {
    //         try {
    //             const url = await getDownloadURL(imageRef);
    //             setPrevUrl(url);
    //         } catch (e) {
    //             setError(`${e}`);
    //         }
    //     };
    //     //const imageRef = ref(storage, "/images/1728983020809_無題.png")
    //     const imageRef = ref(storage, "images/"+imagename);
    //     getImageUrl(imageRef);
    //     setImageLoaded(true)
    // }
    // }, [tweetname]);
    useEffect(() => {
        FetchProfileFig(tweetname);
    }, [tweetname]);

    useEffect(() => {
        if (imagename=="") {
            setImageLoaded(false)
        } else {
        const getImageUrl = async (imageRef: StorageReference) => {
            try {
                const url = await getDownloadURL(imageRef);
                setPrevUrl(url);
            } catch (e) {
                setError(`${e}`);
            }
        };
        //const imageRef = ref(storage, "/images/1728983020809_無題.png")
        const imageRef = ref(storage, "images/"+imagename);
        getImageUrl(imageRef);
        setImageLoaded(true)
    }
    }, [imagename]);


    //ツイートの名前からプロフィール画像をとって来る
    const FetchProfileFig = async (tweetname: string) => {
        try {
            // console.log(tweetname)
            const userDoc = await getDoc(doc(db, "users", tweetname));
            // const userDoc = await getDocs(collection(db, "users"));
            //console.log(userDoc)
            if (userDoc.exists()) {
                //const userData = doc.data()
                //const fig: string = userDoc.data().figid
                setImagename(userDoc.data().figid)
                // setImagename(fig)
            } else {
                // console.log("userfigid is empty")
                setImagename("")
            }
            } catch(error) {
            console.error("error happened", error)
            }
        }
  
    return (
        <div >
            {/* {imageLoaded ? (
                <div
                style={{
                    boxShadow: "0px 4px 8px gray",
                    padding: 10,
                    margin: 10,
                    width:350,
                    height: 400,
                }}
                >
                    <p>
                        {imageLoaded ? (
                        <img
                        src={prevUrl}
                        alt={"error"}
                        style={{ height: 200, width: 200, borderRadius: "50%", objectFit: "cover"}}
                        />
                        ) :(
                            <p>No image</p>
                        )}
                    </p>
                </div>
            ) : (
                null
            )} */}

        {imageLoaded ? (
            <div>
                {imageLoaded ? (
                        <img
                        src={prevUrl}
                        alt={"error"}
                        style={{ height: 50, width: 50, borderRadius: "50%", border:"2px solid black", objectFit: "cover"}}
                        />
                        ) :(
                            <p>No image</p>
                        )}
            </div>
        ) : (
            <div style={{ height: 50, width: 50, borderRadius: "50%", border:"2px solid black", objectFit: "cover"}}>No image</div>
        )}
        
        
    </div>
    )
}
export default PreviewImageFromUser;