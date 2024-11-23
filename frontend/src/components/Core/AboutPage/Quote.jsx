import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import HiglightText2 from '../HomePage/HiglightText2'
import HighlightText3 from '../HomePage/HighlightText3'
const Quote = () => {
  return (
    <div className=' text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white'>
      We are passionate about revolutionizing the way we learn. Our innovative platform
      <HighlightText >combines technology,</HighlightText>
      <HiglightText2 >expertise</HiglightText2>
      , and community to create an
      <HighlightText3 >unparalleled educational experience.</HighlightText3>
    </div>
  )
}

export default Quote
