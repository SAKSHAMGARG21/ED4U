import React, { useState, useEffect } from "react";

function VideoBox({videos}) {
    return (
        <>
            {
                videos.map((video, idx) => {
                    return (
                        <div key={idx} className="block h-52">
                            <video
                                controls
                                className="h-full w-full"
                                preload="auto"
                                src={video} >
                            </video>
                        </div>
                    )
                })
            }
        </>
    )
}
export default VideoBox;
