import { Avatar, Box, Button, Container, IconButton, Text } from '@chakra-ui/react'
import React, {useRef, useState, useEffect} from 'react'
import '../global-style.css'
import VideoFooter from './VideoFooter'
import VideoHeader from './VideoHeader'
import VideoSidebar from './VideoSidebar'
import {fakeVideoData} from '../fakeVideos'
import ReactPlayer from 'react-player/lazy'
import { FaPause, FaPlay } from 'react-icons/fa'
export default function Video({data}) {
  const [isPlaying, setisPlaying] = useState(false)
  
  
 const videoRef = useRef([]);
 useEffect(() => {
  videoRef.current = videoRef.current.slice(0, fakeVideoData.length);
    
}, [data]);
  
  
const onVideoPlay = (i) =>  {
    
    if(isPlaying) {
        videoRef.current[i].pause()
        setisPlaying(false)
        
      } else {
        
        setisPlaying(false)
        videoRef.current[i].play()
        
        setisPlaying(true)
       
      } 
      console.log("this  is  my id", i) 
    }
   
  return (
    <Box ml={10}>
     
      {fakeVideoData.map((post, i) => {
       // const mediaUrl = post.metadata.media.map((post, i))
       // console.log("this is post url", mediaUrl)
      return(
        <div key={i}>
      <Box w="100%"   display="flex">
        
        <Box py={3}> <Avatar     name='abdul'   size="lg"/> </Box>
        <Box ml={5} width="90%" py={3}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" mb={0}>
           <Text fontWeight="black" mr={5}>{post.creatorHandle} </Text> <Text as="u">{post.creator}</Text> 
           </Box>
            <Box pr={3} mb={0}>
              <Button colorScheme="blue">Follow</Button>
            </Box>
           </Box>
        <Box w="70%" mt={0}>
          <Text>{post.caption}</Text>
        </Box>
        </Box>
      </Box>
     

        
        
          <Box w="370px"  ml={24} display="flex" justifyContent="space-between" style={{position: "relative"}} >
           
            <video src={post.media}  loop style = {{width: "270px", height: "480px", borderRadius:"14px"}}
                ref={el => videoRef.current[i] = el} 
            ></video>
             <VideoSidebar  />
            
             </Box>
          <Box style={{position : "relative", bottom: "80px", left: "120px"}}> 
             {isPlaying ? (
              <IconButton       icon={<FaPause color='white'/>}  onClick={() => onVideoPlay(i)}  colorScheme="blackAlpha"/>
             ):
             <IconButton   icon={<FaPlay color='white'/>}   onClick={() => onVideoPlay(i)}  colorScheme="blackAlpha"/>
             }
          
          </Box>
          
      
      </div>
      )
      })
        
}
    </Box>
  )
}

/*<div className='postContainer'>
  
  {data?.explorePublications.items.map((post, i) => (
    <div key={i}>
       <VideoHeader profilePic = {post.profile.picture.original.url}
         profileHandle = {post.profile.handle} postCaptions ={post.metadata.content}
       />
    {post.metadata.media.map((media, i) => {
      
        
        return(
          <div className='video_container' key={i}>
          <div className='video'>
           
             <video key={i} src={media.original.url} className='video_player'
             loop
             ref={(element) => videoRef.current.push(element)}
             
             onClick={onVideoPlay}
           ></video>
     <VideoFooter isPlaying = {isPlaying} setisPlaying = {setisPlaying} togglePlay ={onVideoPlay}/>
         </div>
         <VideoSidebar post ={post}/>
         </div> 
        )
      })}
          
        
    </div>
  ))}
  
   </div>*/
          