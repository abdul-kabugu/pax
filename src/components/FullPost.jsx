import { Avatar, Box, Container, Text } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import {getPublications} from '../GRAPHQL/Publications/getPublications'
export default function FullPost({postId}) {
 const [data, setData] = useState()
 const [error, seterror] = useState()
 const [loading, setLoading] = useState(false)

 useEffect(() => {
    getPublications(postId).then(setData);
  }, [data]);

  console.log("this  is  is  data  from  data  responsese  of full post", data)
  return (
    <div>
       
        {data?.publications.items.map((post, i) => {
          
          return(
           <>
            <Box display="flex" mb={5}>
               <Box display="flex"> <Avatar src={post.profile.picture.original.url}  name="abdul"  />
            </Box> 
             <Box>
             <Text ml={5} fontWeight="black">{post?.profile.handle}</Text>
             <Container ml={3}>{post?.metadata.content}</Container>
             </Box>
               
            </Box>

           
            </>
          )
        })}
    </div>
  )
}
