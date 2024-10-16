// "use client"
// import React, {useState, Dispatch,SetStateAction, ChangeEvent} from "react";
// import {ref, uploadBytes} from "firebase/storage"
// import {validateImage} from "image-validator"
// import {db, storage} from "./firebase"
// import {addDoc, collection} from "firebase/firestore"

// interface Props {
//     setTweetfig: Dispatch<SetStateAction<string>>
// }

// export const PostTweet: React.FC<Props> = ({setTweetfig}) => {
//     const [file, setFile] = useState<File | null>(null)
//     const [text, setText] = useState<string>("")
//     const [imagePreview, setImagePreview] = useState<string | null>(null)
//     const [errorMsg, setErrorMsg] = useState<string | null>(null)
//     const validateFile = async (selectedFile: File): Promise<boolean> => {
//         const limitFileSize = 3 * 1024 * 1024;
//         if (selectedFile.size > limitFileSize) {
//             setErrorMsg("File size is too large, please keep it under 3 GB.");
//             return false
//         }
//         const isValidImage = await validateImage(selectedFile)
//         if (!isValidImage) {
//             setErrorMsg("You cannot upload anything other than image files.");
//             return false
//         }
//         return true;
//     };

//     const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
//         setErrorMsg(null);
//         e.preventDefault();
//         const selectedFile = e.target.files?.[0];

//         if (selectedFile && (await validateFile(selectedFile))) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setFile(selectedFile);
//                 setImagePreview(reader.result as string);
//                 setErrorMsg(null)
//             }
//             reader.readAsDataURL(selectedFile);
//         }
//     };

//     const uploadImage = async () => {
//         try {
//             if (!file) {
//                 setErrorMsg("File not selected");
//                 return;
//             }

//             const timestamp = new Date().getTime();
//             const uniqueFilename = `${timestamp}_${file.name}`;
//             const storageRef = ref(storage, `images/${uniqueFilename}`)
//             await uploadBytes(storageRef, file);
//             // await addDoc(collection(db, "Image_profile"), {
//             //     text,
//             //     fileName: uniqueFilename,
//             //     timestamp: new Date()
//             // })
//             setErrorMsg("Submission completed!")
//             setTweetfig(uniqueFilename)
//         } catch (e) {
//             setErrorMsg(`Error: ${e}`)
//         }
//     }
//     return (
//         <div>
//             <form>
//                 <input type="file" onChange={handleImageSelect} />
//                 <br />
//                 <a
//                     style={{cursor: "pointer", border: "1px solid gray"}}
//                     onClick={uploadImage}
//                 >
//                     upload
//                 </a>
//             </form>
//             <p style={{ color: "red" }}>{errorMsg && errorMsg}</p>
//             {imagePreview && (
//                 <img
//                 src={imagePreview}
//                 style={{
//                     width: "auto",
//                     height: 200,
//                     objectFit: "cover",
//                 }}
//                 alt="preview"
//                 />
//             )}
//         </div>
//     )
// }
// export default PostTweet