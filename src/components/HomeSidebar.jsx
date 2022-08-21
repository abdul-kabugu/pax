import React, {useState} from 'react'
import {Button, Text,Heading, Box, Avatar, Skeleton, SkeletonText, SkeletonCircle} from '@chakra-ui/react'
//import {recommendedeCreators} from '../fakeData'
import {BsEmojiWink} from 'react-icons/bs'
import {RECOMMENDED_PROFILES} from '../GRAPHQL/Profile/getRecommendedProfiles'
import {useQuery} from '@apollo/client'
import {follow } from "../GRAPHQL/Profile/createFollowTypedData"
import {useMoralis, useMoralisFile} from 'react-moralis'
export default function HomeSidebar({data, loading, error}) {
    //const {data, loading, error} = useQuery(RECOMMENDED_PROFILES)
    const {account, user} = useMoralis()
    const [accountToFollow, setAccountToFollow] = useState()
    const [stateTest, setstateTest] = useState(false)
    //const  thePrfId = user?.attributes.lensProfileId
    const profileId = accountToFollow?.id
      const handleFollow = async (profile) => {
        setAccountToFollow(profile)
        
        if(accountToFollow?.followModule == null){
           await  follow(account, profileId)
         }else if(accountToFollow?.followModule !== null){
          alert("you  need  to  pass follow  module")
         }

         
      }
      
       if(loading) { /*
        return <div>
        <Box padding='6' boxShadow='lg'  display="flex" >
          <Box display="flex">
      <SkeletonCircle size='16'  mr={5}/>
      <SkeletonText mt='2' noOfLines={1} spacing='4' w="150px" mr={5}/>
      </Box>
      <Skeleton  h="40px" width="100px" borderRadius={7}/>
</Box>
<Box padding='6' boxShadow='lg'  display="flex" >
      <Box display="flex">
      <SkeletonCircle size='16'  mr={5}/>
      <SkeletonText mt='2' noOfLines={1} spacing='4' w="150px" mr={5}/>
      </Box>
      <Skeleton  h="40px" width="100px" borderRadius={7}/>
     </Box>
      <Box padding='6' boxShadow='lg'  display="flex" >
      <Box display="flex">
      <SkeletonCircle size='16'  mr={5}/>
      <SkeletonText mt='2' noOfLines={1} spacing='4' w="150px" mr={5}/>
      </Box>
      <Skeleton  h="40px" width="100px" borderRadius={7}/>
      </Box>
     <Box padding='6' boxShadow='lg'  display="flex" >
      <Box display="flex">
      <SkeletonCircle size='16'  mr={5}/>
      <SkeletonText mt='2' noOfLines={1} spacing='4' w="150px" mr={5}/>
      </Box>
      <Skeleton  h="40px" width="100px" borderRadius={7}/>
     </Box>
    </div> 
          
    */}
       
     if(error) {
        return <Text>{error}</Text>
     }
      
  return (

         <div className='home-leftSideBar'>
      <Heading fontSize="2xl"  mb={10}>Creators you might like</Heading>
     
      {data?.recommendedProfiles.map((data, i) => {
       
        return (
        <Box w="90%" display="flex" flexDirection="row" justifyContent="space-between" mb={10} mx="auto" key={i}>
          
          <Box display="flex" alignItems="start">
         <Avatar   src={data.picture?.original?.url}   name={data?.handle}  />
          <Box marginLeft={5}>
          <Text fontWeight="bold" fontSize={15} mb={0}>{data.nakeName}</Text>
          <Text as="u">{data.handle}</Text>
          </Box>
          </Box>
          <Box>
            <Button variant="outline" colorScheme="blue" onClick={() => handleFollow(data)}>follow</Button>
          </Box>
        </Box>
)})}
    </div>
  )
}
