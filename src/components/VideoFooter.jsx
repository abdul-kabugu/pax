import { Button, IconButton } from '@chakra-ui/react'
import React from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
export default function VideoFooter({isPlaying, setIsPlaying, togglePlay}) {
  return (
    <div className='video_footer'>
      {isPlaying ? (
        <IconButton   icon={<FaPause />}   colorScheme="blackAlpha"  onClick={togglePlay}/>
      

     ) : (
      <IconButton   icon={<FaPlay  />}   colorScheme="blackAlpha"     onClick={togglePlay} />
     )}
     
    </div>
  )
}
