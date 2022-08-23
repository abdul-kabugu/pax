import React, {useState, useEffect} from 'react'
import {useQuery, gql} from '@apollo/client'
import {EXPLORE_PUBLICATIONS} from '../GRAPHQL/Publications/expolorePublications'
import {GET_PROFILE} from '../GRAPHQL/Profile/getProfile'
//import {} from '../GRAPHQL/Publications/getPublications'

import '../global-style.css'
import { Avatar, Box, Button, Center, Heading, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
Skeleton, SkeletonText, SkeletonCircle

} from '@chakra-ui/react'
import {RECOMMENDED_PROFILES} from "../GRAPHQL/Profile/getRecommendedProfiles"
import { BsEmojiWink } from 'react-icons/bs'
import HomeSidebar from '../components/HomeSidebar'
import Hashtags from '../components/Hashtags'
import PostContainer from '../components/PostContainer'
import TopNav from '../components/TopNav'
import { CgProfile } from 'react-icons/cg'
import {useMoralis, useMoralisQuery} from 'react-moralis'
import useConnectProfile from '../helper/useConnectProfile'
import useCollectors from '../helper/useCollectors'
import { ConnectButton } from 'web3uikit'
export default function Home() {
 const [isConnectProfile, setisConnectProfile] = useState(false)
 const [lensPrId, setLensPrId] = useState("")
 const [lensHande, setlensHande] = useState("")
 const [stateTest, setstateTest] = useState(true)
 const [userRunnes, setUserRunnes] = useState(0)
    const [daysStreak, setDaysStreak] = useState(-1)
    const [isHolder, setisHolder] = useState(false)
  const  {account, user, setUserData, userError, isUserUpdating, isAuthenticated, isInitialized } =  useMoralis()
  const {getUser} = useCollectors();
  
 /* useEffect(() => {
    if( isAuthenticated ) {
        const fetch = async () => {
          const data = await getUser()
          const {daysInArow, lastCollected, runes} = data.attributes;
           console.log(data.attributes)
           setUserRunnes(runes)
           setDaysStreak(daysInArow)
           console.log(runes)
           console.log("this  is  user  runes", userRunnes)
           console.log("last runees collected", lastCollected)

        }
        fetch()
    }else {
        setUserRunnes(0)
    }
  }, [isAuthenticated, isInitialized, userRunnes])*/




   const {isProfileConnected} = useConnectProfile()
     const addLensPrf = async () => {
        setUserData({
          lensProfileId : lensPrId,
          lensHande: lensHande
        })
     }
      /*const removeProfile = async () =>  {
          user.unset("lensProfileId")
      }*/

     
      //end of  setting
          
       //end  of  check  if  lens profile  is  connected
     // console.log("this  is  user  data infos", user?.attributes.lensProfileId)
      const toggleOpen = () =>  {
         isConnectProfile ? setisConnectProfile(false) : setisConnectProfile(true)
       
        
      }
       //console.log(user)
       // get  runes
       const {data: runesData , error: runesError, isLoading: isRunesLoading} = useMoralisQuery("runeCollectors", query =>
        query
        .equalTo("ethAddress", account),
        [],
        { autoFetch: true },
        
       )
       console.log("this  is data from runees", runesData)
  const {data : recommendedProfiles, loading: isRecommendedProfilesLoading, error: isRecommendedProfilesError} = useQuery(RECOMMENDED_PROFILES)
   const {data, loading, error} = useQuery(EXPLORE_PUBLICATIONS)
       
     //loading || isRecommendedProfilesLoading
   /* if (loading || isRecommendedProfilesLoading){
        return <Center w="100vw" h="100vh">
            <Heading mb={20}>my logo  here</Heading>
            <Text>this is web name</Text>
        </Center>
    }*/
  
      // get and  set  users
      useEffect(() => {
        if(isAuthenticated){
         const fetch = async () => {
           const data = await getUser()
           const {daysInArow, lastCollected, runes} = data.attributes;
           // console.log(data.attributes)
            setUserRunnes(runes)
            setDaysStreak(daysInArow)
          /*  console.log("this  is  user  runes", userRunnes)
            console.log("last runees collected", lastCollected)
            console.log("this  is  user  runes from home page", userRunnes)*/
 
         }
         fetch()
     }else {
         setUserRunnes(0)
     
        }
     }, [data?.explorePublications.items, isAuthenticated, isInitialized, userRunnes ])
     

   //end of  setting




   
    if(loading || isRecommendedProfilesLoading){
     return(
      <div>
         <TopNav />
        
         <div className='home-container' style={{marginTop : "10px"}}>
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
  
  <SkeletonText mt='3' noOfLines={3} spacing='4' />
</Box>

  <Box ml={20} pt={3}>
    <Skeleton h="480px" w="270px"  borderRadius={12} />
  </Box>
       </div>
         </div>
      </div>
      
     )
    }
  if (error) return `Error! ${error.message}`;
  //console.log("home  data ", data)
  return (
    <div>
  <TopNav collectedTokens = {userRunnes}/>
    
  
    <div className='home-container'>
     
     <Modal isOpen={isConnectProfile} onClose={toggleOpen} isCentered
      >
        <ModalOverlay   />
        <ModalContent>
          <ModalHeader >Connect Your  Profile</ModalHeader>
          <ModalCloseButton  />
          <ModalBody> 
            <Heading color="blackAlpha" size="lg" textAlign="center" mb={5}>Connect  Your Lens Profile</Heading>
              <InputGroup>
                <InputLeftElement  
                  
                  children={<CgProfile />}
                />
                <Input   placeholder='Enter Your Lens Handle'  onChange={e => setlensHande(e.target.value)}   mb={5} border/>
                
              </InputGroup>
              <InputGroup>
                <InputLeftElement  
                  
                  children={<CgProfile />}
                />
                <Input   placeholder='Enter Your Lens Profile Id'  onChange={e => setLensPrId(e.target.value)}   mb={5} />
              </InputGroup>
              
               
             </ModalBody>
          <ModalFooter>
         <Button w="200px"  colorScheme="blue" onClick={() => addLensPrf() }>
              Save
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className='home-left'>
      <HomeSidebar data = {recommendedProfiles} loading ={isRecommendedProfilesLoading} error ={isRecommendedProfilesError}/>
       <Hashtags />
       </div>
        <div className='app_vidos'>
       {/*} <Video data = {data}/>*/}
        <PostContainer   data={data} />
        
        
        </div>
    </div>
    </div>
  )
}
