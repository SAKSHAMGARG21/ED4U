import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg flex gap-2 justify-center items-center ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}