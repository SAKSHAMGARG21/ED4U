import React from 'react'

const HiglightText2 = ({children}) => {
  return (
    <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] 
    text-transparent bg-clip-text font-bold'>
        {children}
    </span>
  )
}

export default HiglightText2