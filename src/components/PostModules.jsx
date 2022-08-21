import React, {useState} from 'react'
import {Center, Textarea, Button, Box, Text} from '@chakra-ui/react'
export default function PostModules({caption, createPost, setCaption, userBalance}) {
   
  return (
    <Box mt={10}>
      <Text>user balance : {userBalance}</Text>
    <Center w="80%" height="400px" flexDirection="column" mx="auto">
      <Text textAlign="start" mx="auto">Caption</Text>
    <Textarea  value={caption}   onChange={e => setCaption(e.target.value)} size="sm"  w="50%"
     placeholder='Caption' mb={4}
    />
    
    <Button colorScheme="blue" size="lg" py={5} px={150}  onClick={createPost}>Post</Button>
    
  </Center>
  </Box>
  )
}
