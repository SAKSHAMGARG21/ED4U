import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../services/operations/authApi'
function ProfileDropDown() {
  const ref= useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  if (!user) return null;

  const [open, setOpen] = useState(false);

  useOnClickOutside(ref, (e) => setOpen(false));
  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.avtar}
          alt={`profile-${user?.fullName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        {/* <AiOutlineCaretDown className="text-sm text-richblack-100" /> */}
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
          ref={ref}
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              {/* <VscDashboard className="text-lg" /> */}
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            {/* <VscSignOut className="text-lg" /> */}
            Logout
          </div>
        </div>
      )}
    </button>
  )
}

export default ProfileDropDown