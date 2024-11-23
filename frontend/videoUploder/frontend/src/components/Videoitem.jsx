import React from "react";
import VideoBox from "./VideoBox";
import "./Videoitem.css"

const Videoitem = ({ item }) => {
    return (
        <div className="listbox flex flex-col gap-1 relative m-4">
            <div className="videobox cursor-pointer">
                <img src={item.image} alt="not found" className="absolute z-[1] w-full h-52 rounded-lg border border-white" />
                <VideoBox videos={item.videos}></VideoBox>
            </div>
            <section className="content">
                <h3 className="titlename text-lg font-medium m-2">{item.title}</h3>
                <p className="descriptiontext m-2">{item.description}</p>
            </section>
        </div>
    )
}

export default Videoitem;


