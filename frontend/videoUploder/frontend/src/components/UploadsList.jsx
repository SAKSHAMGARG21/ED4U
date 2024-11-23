import React from "react";
import { MONGO_URI } from "../config/constants";
import VideoBox from "./VideoBox";

const UploadList = ({ data }) => {
    return (
        <div >
            <h2>Upload List</h2>
            <div className="listbox">
                <table className="border border-purple-400 w-[98%] mx-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border py-4 w-40 border-purple-400">Name</th>
                            <th className="border py-4 w-40 border-purple-400">Description</th>
                            <th className="border py-4 w-40 border-purple-400">Image</th>
                            <th className="border py-4 border-purple-400">Video</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="border py-4 w-40 border-purple-400">
                                            {item.title}
                                            </td>
                                        <td className="border py-4 w-40 border-purple-400">
                                            {item.description}
                                        </td>
                                        <td className="border py-4 w-40 border-purple-400">
                                            <img src={item.image} className="h-50% w-fit" alt="image not found" />
                                        </td>
                                        <VideoBox videos={item.videos}></VideoBox>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UploadList;


