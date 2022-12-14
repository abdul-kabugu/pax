import { Box, Button, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { Avatar} from 'web3uikit'
export default function VideoHeader() {
  return (
   <div className='video_header'>
        <div className='video-header-top'>
        <div className='user-data'>
          <Avatar  theme='letters'  isRounded={true}    text="Pax"  size={60}/>  
          <div style={{width :"88%", marginLeft: '10px'}}>
            <Box display="flex">
          <Heading fontSize="lg" mr={2.5}>nikename</Heading>
          <Text as='u' fontSize="md">handle.lens</Text>
          </Box>
          <div className='video-caption-container'>
            <Text>One love from Baba zahir 💖💕✨  One love from Baba zahir 💖💕✨ One love from Baba zahir 💖💕✨</Text>
            </div>
  </div>
       </div>
       <div className='follow-btn-container'>
        <Button colorScheme="blue">Follow</Button>
       </div>
        </div>
       {/*} <div className='video-caption-container'>
            <Text>One love from Baba zahir 💖💕✨</Text>
  </div>*/}
    </div>
  )
}
