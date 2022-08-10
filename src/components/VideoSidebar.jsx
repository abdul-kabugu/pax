import { IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { BsFillHeartFill, BsSuitHeart } from 'react-icons/bs'
import { TbMessageDots } from 'react-icons/tb'
import { FaCommentDollar, FaCommentDots, FaShare } from 'react-icons/fa'

export default function VideoSidebar() {
  return (
    <div className='video_sidebar_container'>
       <div className='side_bar_button'>
         <IconButton  icon={<BsFillHeartFill size={30}/>}   />
          <Text textAlign="center">345</Text>
       </div>
       <div className='side_bar_button'>
         <IconButton   icon={<FaCommentDots size={30}/>}  />
          <Text textAlign="center">45</Text>
       </div>
       <div className='side_bar_button'>
        <IconButton    icon={<FaShare  size={30}/>}  />
          <Text textAlign="center">745</Text>
       </div>
       
    </div>
  )
}
