import React from "react";
import Videoitem from "./Videoitem";
const VideoList = ({ data }) => {
    return (
        <div >
            <h2>Upload List</h2>
            <div className="listbox grid grid-cols-3">
                {
                    data.map((item, index) => (
                        <Videoitem key={index} item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default VideoList;


