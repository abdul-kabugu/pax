import React,{useState, useRef} from 'react'
import { Box, Center, color, Flex, Heading, Input, Spacer, Stack, Text, VStack, Button, Textarea, } from "@chakra-ui/react"
import { FaFileUpload, FaUpload } from 'react-icons/fa'
import {  IPFSInput } from 'web3uikit'
import { Upload } from 'antd'
export default function CreatePost() {
  const [uploadFile, setuploadFile] = useState([])
  const [caption, setCaption] = useState()
  const [description, setDescription] = useState()
   
  const fileInput = useRef();
    const selectFile = () => {
      fileInput.current.click();
  }
   
  return (
   <Stack>
    <Flex w="80%" h="100vh" align="center" style={{margin : "0 auto"}} >
      <Box  w="280px" h="70vh" >  
        <Heading size="md">Upload Video </Heading>
        <Text>Post a video to your account</Text>
          <Center w="100%" h="90%" border="1px" borderColor="black">
            
             
          <VStack onClick={selectFile} cursor="pointer">
                <input type="file"  onChange={e => setuploadFile(e.target.files[0])} style={{display: "none"}}  ref={fileInput}/>
                <FaUpload style={{fontSize: "34px", color: "gray"}}/> 
                <Text fontSize="lg">Select Video to Upload</Text>
                   
                  <Text fontSize="xs">MP4 or  WebM</Text>
                  <Text fontSize="xs" mb="30px">720 x 1280 resolution or  higher</Text>
                  <Text fontSize="xs">Up to 180 seconds</Text>
                  <Text fontSize="xs">Less than 1GB</Text>
                  
                    <Text fontSize="sm">selected file : {uploadFile.name}</Text>
                   {/*<button onClick={selectFile}>select file</button>*/ }
                  
                  
              
              
               
               
             </VStack>
          </Center>
          <Center w="100%">
          <Button w="100%" colorScheme="blue">Upload </Button>
          </Center>
      </Box>
      <Spacer />
      <Box  w="700px" h="70vh">
        <Input placeholder='Caption' value={caption}  onChange={e => setCaption(e.target.value)}            />

        <Textarea   placeholder='description'   value={description} onChange= {e => setDescription(e.target.value)}  mt="20px" />

      </Box>
      

    </Flex>
   </Stack>
  )
}
