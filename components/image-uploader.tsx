"use client";
 
import { useState } from "react";
import { UploadButton } from "../src/utils/uploadthing";
import Image from "next/image";
 
export default function ImageUpload() {
  const [image,setImage]=useState("")
  return (
    <main className="flex flex-col items-center justify-between p-2">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          setImage(res[0].url)
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      {image.length?<div> <Image src={image} alt="image url" width={500} height={500}/> </div>:null}
    </main>
  );
}