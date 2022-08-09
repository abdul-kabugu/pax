import React, {useRef, useState}from 'react'
import {Center, IconButton, Heading, Text, Button, Spinner} from '@chakra-ui/react'
import {BsUpload} from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from "react-icons/io"

export default function UploadVid({postVideo, setPostVideo, postMediaUploader, uploading }) {
  const fileRef = useRef();
  const handleSelectFile = () => {
     fileRef.current.click()
  }
  const [testing, settesting] = useState(true)

  return (
    
    <Center w="80%" h="400px"  mx="auto" flexDirection="column">
       { uploading ? <Spinner  size="xl" /> :
       
        <>
    <IconButton     icon={<BsUpload  size={80} color="gray" />}   size="500px"   mb={6}        />
     
   <Heading fontSize="lg" mb={3}>Select Video To Upload</Heading>
  
   <Text fontSize="sm" mb={2}>720 x 1280  resolution</Text>
   <Text fontSize="sm" mb={2}>Up to 10 minutes</Text>
    <input type="file" ref={fileRef}  onChange={e => setPostVideo(e.target.files[0])} multiple={false} accept="video/mp4" hidden/>
    <Text>{postVideo.name}</Text>
   <Button variant="outline" colorScheme='blue' onClick={handleSelectFile}>Select File</Button>
     <Button mt={5} py={2} px={6} colorScheme="blue" leftIcon={<BsUpload />} onClick={postMediaUploader} >Upload</Button>
     </>
       }
 </Center>
    
    
  )
}
