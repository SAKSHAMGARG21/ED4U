import React from "react";
import "./messagetost.css";
const Tost = ({ data }) => {
    const showTost = () => {
        const toastElement = document.getElementById('viewtost');
        toastElement.style.right = ".5rem";
        setTimeout(()=>{
            toastElement.style.right="-250px";
        },4000);
        data.status = false;
    }
    if (data.status == true) {
        showTost();
    }
    return (
        <>
            <div className="msgbox w-[250px] px-4 py-2 rounded-lg text-black" id="viewtost">
                <div className="msgbox__header">
                    <h3 className="msgbox__title text-base font-semibold">{data.head}</h3>
                    <p>{data.msg}</p>
                </div>
            </div>
        </>
    )
}

export default Tost;
