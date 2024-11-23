import React, { useEffect, useState } from "react";
import axios from "axios";
import { MONGO_URI } from "../config/constants.js";
import { ThreeDots } from "react-loader-spinner";
import Tost from "./tost/messagetost.jsx";
const UploadForm = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tostData, setTost] = useState({});

    const tost = (head, msg) => {
        let data = {
            head: head,
            msg: msg,
            status: true
        }
        setTost(data);
    }


    const emptyValues = () => {
        setTitle("");
        setDescription("");
        setImage(null);
        setVideos([]);
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        for (let i = 0; i < videos.length; i++) {
            formData.append("videos", videos[i]);
        }

        formData.append("title", title);
        formData.append("description", description);
        formData.append("image", image);

        try {
            setLoading(true);
            const response = await axios.post(`${MONGO_URI}`, formData);
            if (response.status == 200) {
                emptyValues();
                // alert("Video uploaded successfully");
                tost("Success", "Video uploaded successfully");
                // window.location.reload();
            }
        } catch (error) {
            emptyValues();
            tost("Error", "While uploading data");
            // alert("Error while Uploading Data");
            console.log("Error -> ", error);
        }
        // console.log(MONGO_URI);
        // axios.post(`${MONGO_URI}`, formData).then((success) => {
        //     alert("Data Uploaded Successfully");
        // }).catch((err) => {
        //     alert("Error while Uploading Data");
        //     console.log("Error -> ", err);
        // })
    }

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        setVideos(files);
    }
    return (
        <div className="">
            <Tost data={tostData}></Tost>
            <div>
                <h2>Upload Form</h2>
            </div>
            <main className="m-4 p-4 bg-[#000a1a] rounded-2xl">
                <form onSubmit={handleSubmit} action="/api/media" method="post">
                    <div className="mb-4">
                        <label htmlFor="name" className="text-2xl font-normal block">Title* :</label>
                        <input
                            type="text"
                            id="name"
                            name="title"
                            value={title || ""}
                            placeholder="Give your file a title"
                            className="border-[1px] border-gray-400 p-1 my-2 rounded-md w-full"
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="desc" className="text-2xl font-normal block" >Description* : </label>
                        <input
                            type="text"
                            id="desc"
                            value={description || ""}
                            name="description"
                            placeholder="Give Description to video"
                            className="border-[1px] border-gray-400 p-1 my-2 rounded-md w-full"
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="img" className="text-2xl font-normal block" >Upload Image* : </label>
                        <input
                            type="file"
                            name="image"
                            id="img"
                            className="my-2"
                            onChange={(e) => {
                                setImage(e.target.files[0]);
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="video" className="text-2xl font-normal block" >Upload Video* : </label>
                        <input
                            type="file"
                            name="videos"
                            id="video"
                            multiple
                            className="my-2"
                            accept=".mp4, .mkv"
                            onChange={handleVideoChange}
                        />
                    </div>
                    <div className="btnbox flex gap-4">
                        <button type="submit" className="p-2 bg-blue-600 text-cyan-50 rounded-md hover:bg-blue-500">Upload Files</button>
                        {
                            loading && <ThreeDots
                                visible={true}
                                height="40"
                                width="50"
                                color="rgb(116 138 234)"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        }
                    </div>
                </form>
            </main>

        </div>
    )
}



export default UploadForm;