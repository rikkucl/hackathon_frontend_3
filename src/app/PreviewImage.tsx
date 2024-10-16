"use client"
import { getDownloadURL, ref, StorageReference } from "firebase/storage";
import React, { useState, useEffect} from "react";
import { storage } from "./firebase"


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

export const PreviewImage: React.FC<{ imagename: string }> = ({ imagename }) => {
    const [prevUrl, setPrevUrl] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [imageLoaded, setImageLoaded] = useState(false)
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
    return (
        <div>
            {imageLoaded ? (
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
                        style={{ height: 200, width: 300, objectFit: "cover"}}
                        />
                        ) :(
                            <p>No image</p>
                        )}
                    </p>
                </div>
            ) : (
                null
            )}
        
    </div>
    )
}
export default PreviewImage;