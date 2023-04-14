import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
const FileUpload = ({ contract, account, provider }) => {
  const [file, setfile] = useState(null);
  const [fileName, setfileName] = useState(" No Image Selected");
  const handleSubmit = async (e) => {
    e.preventDefault(); //so that the page doesnt reload all over
    if (file) {
      try {
        const formData = new FormData(); //getting data from form
        formData.append("file", file);
        console.log(formData);
        // const metadata = JSON.stringify({
        //   name: "File name",
        // });
        // formData.append("pinataMetadata", metadata);
        // const options = JSON.stringify({
        //   cidVersion: 0,
        // });
        // formData.append("pinataOptions", options);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "e09356d1301401520140",
            pinata_secret_api_key:
              "417673e6ffb3f6186e00834c7feeb71ab27675cd29b568f627c2e8078aff9a1a",
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(resFile);
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`; //generating ImgUrl from ipfs
        console.log(ImgHash);
        contract.add(account, ImgHash); //using functions so easy with signers declared in app.js
        alert("Image Uploaded Successfully");
        setfileName(" No image selected");
        setfile(null);
      } catch (e) {
        alert("Unable to upload Image to PINATA");
        console.log(e);
      }
    }
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader(); //This is to read file data
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setfile(e.target.files[0]);
    };
    setfileName(e.target.files[0].name);
    e.preventDefault();
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <div>
          <span className="textArea">Image:{fileName} </span>
          <button type="submit" className="upload" disabled={!file}>
            Upload File
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;