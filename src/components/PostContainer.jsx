import { Box, Text, Button, Avatar, IconButton, Heading} from '@chakra-ui/react'
import React, {useEffect, useState, useRef} from 'react'
import VideoSidebar from './VideoSidebar'
import { FaPause, FaPlay } from 'react-icons/fa'
import {useMoralis} from 'react-moralis'
import  useCollectors from '../helper/useCollectors'
import {follow} from '../GRAPHQL/Profile/createFollowTypedData'
import { useQuery } from '@apollo/client'
import {GET_PROFILE} from '../GRAPHQL/Profile/getProfile'
import {RECOMMENDED_PROFILES} from '../GRAPHQL/Profile/getRecommendedProfiles'
import {Link} from 'react-router-dom'
import moment from 'moment'
export default function PostContainer({data}) {
    const [isPlaying, setisPlaying] = useState(false)
    const [userRunnes, setUserRunnes] = useState(0)
    const [daysStreak, setDaysStreak] = useState(-1)
    const [isHolder, setisHolder] = useState(false)
     const [accountToFollow, setAccountToFollow] = useState()
   
    const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
    const {getUser} = useCollectors();
    //const  thePrfId = user?.attributes.lensProfileId
    const itemsRef = useRef([]);

    useEffect(() => {
        itemsRef.current = itemsRef.current.slice(0, data?.explorePublications.length);
        // for  gamification 
        if( isAuthenticated && isInitialized) {
          const fetch = async () => {
            const data = await getUser()
            const {daysInArow, lastCollected, runes} = data.attributes;
             //console.log(data.attributes)
             setUserRunnes(runes)
             setDaysStreak(daysInArow)
             console.log("this  is  user  runes", userRunnes)
            
  
          }
          fetch()
      }else {
          setUserRunnes(0)
      }

        // end  of  for  gamification
     }, [data?.explorePublications.items, isAuthenticated, isInitialized, userRunnes])
         
      // get  your  coins 
    const getCoins = async () => {
      const users = Moralis.Object.extend("runeCollectors")
      const query = new Moralis.Query(users)
      query.equalTo("ethAddress", account)
      const data = await query.first();
      const {daysInArow, lastCollected, runes} = data?.attributes;
      if(moment(lastCollected).isBefore(moment.utc(), "minutes")){
          if(isHolder){
              data.increment("runes", holders[daysInArow])
              data.set("lastCollected", moment.utc().format())
              setUserRunnes(runes + days[daysInArow]);
          } else {
          data.increment("runes", days[daysInArow])
          data.set("lastCollected", moment.utc().format())
          setUserRunnes(runes + days[daysInArow]);
          }
          if(daysInArow === 6){
              data.set("daysInArow", 0)
              setDaysStreak(0)
          }else {
              data.increment("daysInArow")
              setDaysStreak(daysInArow +1)
          }
         await data.save()

      }
  }

  const days = [1, 1, 1, 1, 1,1, 1]
  const holders = [20, 20, 20, 20, 20, 20, 40]

   // handle  user  follow 
  
  const profileId = accountToFollow?.profile?.id
   const handleFollow = async (profile) => {
    setAccountToFollow(profile)
   
     if(accountToFollow?.followModule == null){
       await  follow(account, profileId)
     }else if(accountToFollow?.followModule !== null){
      alert("you  need  to  pass follow  module")
     }
     console.log("this is  account  to  follow  from postContainer", profileId )
  }
  
   

     const onVideoPlay = async (index) =>  {
     if(isPlaying) {
        itemsRef.current[index].pause()
            setisPlaying(false)
           
            
          } else {
        itemsRef.current[index].play()
           setisPlaying(true)
           await getCoins()
           
          } 
          //console.log("this  is  my id", index) 
        }

        const  {data: myProfile,loading, error} = useQuery(GET_PROFILE)
        //  console.log("this  is  my  profile  data  from post container ",  myProfile)
  return (
    <Box ml={10}>
        
     {data?.explorePublications.items.map((post, i) => {
  
        return(
            <div key={i}>
              <Box w="100%"  display="flex">
              <Box py={3}> <Avatar   src={post.profile.picture?.original.url}  name={post.profile.handle}   size="lg"/> </Box>
              <Box ml={5} width="90%" py={3}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" mb={0}>
           <Text fontWeight="black" mr={5}>{post.profile.handle} </Text>  <Text as="u"><Link to={`/${post.profile.id}`}> {post.profile.handle} </Link></Text> 
           </Box>
            <Box pr={3} mb={0}>
              <Button colorScheme="blue" onClick={() =>  handleFollow(post)}>Follow</Button>
            </Box>
           </Box>
        <Box w="70%" mt={0}>
          <Text>{post.metadata.content}</Text>
        </Box>
        </Box>
      </Box>
     
     
        {post.metadata.media?.map((media, index) => {
            return(
                <div key={index}>
                <Box w="370px"  ml={24} display="flex" justifyContent="space-between" style={{position: "relative"}}  >
                    <Box w="270px" h="480px" bgColor="black" style={{borderRadius: "14px"}}>
                <video src={media.original.url}  loop style = {{width: "270px", height: "480px", borderRadius:"14px"}}
                ref={el =>  itemsRef.current[i] = el} 
            ></video>
            </Box>
             <VideoSidebar post ={post} postComment = {post.stats.totalAmountOfComments} 
             postCollects = {post.stats.totalAmountOfCollects}
             postMirrors = {post.stats.totalAmountOfMirrors}
             
             />

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
        })}
      
              
            </div>
        )
     })}

    </Box>
  )
}
