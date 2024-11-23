import React from 'react'

const HighlightText3 = ({children}) => {
  return (
    <span className='bg-gradient-to-b from-[#E65C00] to-[#F9D423] 
    text-transparent bg-clip-text font-bold'>
        {" "}
        {children}
    </span>
  )
}

export default HighlightText3
