import React from 'react'
import ChangeProfilePict from "./ChangeProfilePict"
import DeleteAccount from './DeleteAccount'
function Settings() {
    return (
        <>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Profile
            </h1>
            <ChangeProfilePict />
            <DeleteAccount />
        </>
    )
}

export default Settings