import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Text, Box, Avatar, Button, StatNumber, HStack, Container, Flex, Spacer, ScaleFade, useDisclosure, Stack, Skeleton,
SkeletonText, SkeletonCircle
} from '@chakra-ui/react'
import TopNav from '../components/TopNav'
import HomeSidebar from '../components/HomeSidebar'
import Hashtags from '../components/Hashtags'
import {RECOMMENDED_PROFILES} from '../GRAPHQL/Profile/getRecommendedProfiles'
import {GET_USER_PUBLICATIONS} from '../GRAPHQL/Publications/getUserPublications'
import {GET_USER_PROFILES} from '../GRAPHQL/Profile/getUserProfile'
import { useMoralis, useMoralisQuery } from 'react-moralis'

import { useQuery } from '@apollo/client'
export default function UserPage() {
  const {isOpen, onToggle, onClose, onOpen} = useDisclosure()
    const {userId}  =  useParams()
    const [stateTest, setstateTest] = useState(true)
    const {account} = useMoralis()

    const {data: runesData , error: runesError, isLoading: isRunesLoading} = useMoralisQuery("runeCollectors", query =>
    query
    .equalTo("ethAddress", account),
    [],
    { autoFetch: true },
    
   )

   console.log("the information of runees from user page", runesData)

    const {data : recommendedProfiles, loading: isRecommendedProfilesLoading, error: isRecommendedProfilesError} = useQuery(RECOMMENDED_PROFILES)
    const {data: userProfile, loading : isUserProfileLoading, error: isUserProfileError} = useQuery(GET_USER_PROFILES, {
      variables : {
        request : {
          profileId : userId
        }
      }
    })
     const {data :userPubs, error : userPubsError, loading : pubsLoading} = useQuery(GET_USER_PUBLICATIONS, {
      variables : {
        request : {
          profileId : userId,
          publicationTypes :  ["POST",  "MIRROR"],
          sources : ["pax423"]
        }
      }
     })
      console.log(userPubs)
 
      // isRecommendedProfilesLoading  ||  isUserProfileLoading

  if(isRecommendedProfilesLoading  ||  isUserProfileLoading){

    return<div>
    <TopNav />
    <div className='home-container' style={{marginTop : "50px"}}>
      
      <div className='user_page_left'>
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
      <div className='app_vidos'>

      
         <Box padding='6' boxShadow='lg'  w="100%">
         <Box display="flex" justifyContent="space-between"> <SkeletonCircle size='60px' />   <Skeleton h="40px" w="120px"  borderRadius="10px"/>   </Box>
  
  <SkeletonText mt='4' noOfLines={4} spacing='4' />
</Box>

 <Box ml={6} pt={5} display="flex" justifyContent="space-between">
  <Skeleton    h="312px" w="235px"   borderRadius={8} />
  <Skeleton    h="312px" w="235px"   borderRadius={8} />
  <Skeleton    h="312px" w="235px"   borderRadius={8} />
  
 </Box>
</div>
      </div>
   </div>
  }
  return (
   <Box w="90%" mx="auto">
    <TopNav />
    <div className='user_page_container'>
    <div className='user_page_left'>
      <HomeSidebar  data = {recommendedProfiles} loading ={isRecommendedProfilesLoading} error ={isRecommendedProfilesError} />
      <Hashtags />
  </div>
    <div className='app_vidos'>
 

    <Box w="100%" pb={4}  ml={6} display= "flex" >
      <Box py={4} px={1}>
        <Avatar  name='Abdul kabugu' src={userProfile?.profile.picture?.original.url} size="2xl"  />
      </Box>
      <Box w="100%" ml={5} py={5}  px={2}>
        <Box display="flex" justifyContent="space-between" w='90%'>
          <Box>
            <Text fontWeight="black" fontSize="2xl" textTransform='capitalize'>{userProfile?.profile.handle} </Text> 
             <Text color='gray.800'>@{userProfile?.profile.name  || userProfile?.profile.handle}</Text>
            </Box>
            <Button colorScheme="blue" variant="outline" w="120px" >Follow</Button>
        </Box>
        <Box mt={3} w="80%">
          <Box>
          <Container> {userProfile?.profile.bio ||  <Text>BIO SPACE |  User  is not  added A BIO </Text> }</Container>
          </Box>
          <Box mt={4}>
            <HStack spacing={4}>
            <Text fontWeight="black" fontSize="lg">{userProfile?.profile.stats.totalFollowers} Followers</Text>
            <Text  fontWeight="black"  fontSize="lg">{userProfile?.profile.stats.totalFollowing} Following</Text>
            <Text  fontWeight="black"  fontSize="lg">{userProfile?.profile.stats.totalMirrors} Mirrors</Text>
           
            </HStack>
          </Box>
        </Box>
      </Box>
    </Box>
    <Flex ml={10} pt={3} justify="space-between" wrap="wrap" mb={3} direction="row">
       {userPubs?.publications.items.map((item, i) => {
         
        return(
       
          <Box w="235px" h="312px" bgColor="black" borderRadius={10} mb={3} key={i}
           onMouseEnter={onOpen}
           
          >
            {item.metadata.media?.map((media, index) => {

              return(
                <div className="video-element">
                <video src={media.original.url} key={i}  style={{width: "235px",  height: "312px", borderRadius: "14px", minWidth : "235px", objectFit : "cover" 
              }}
               
                ></video>
                </div>
              )
            })}
          </Box>
         
         
        )
       })}
       </Flex>
     
    </div>
    </div>
 
    </Box>
  )
}
