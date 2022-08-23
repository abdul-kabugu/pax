import { Button, IconButton, Text,Box, HStack } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import {lensHub} from '../lens-hub'
import  {signedTypeData, splitSignature} from "../ether-service"
import {createMirrorTypedData } from '../GRAPHQL/Publications/createMirrorTypedData'
import { FaRetweet } from 'react-icons/fa'
import { TiGroupOutline } from 'react-icons/ti'
import {truncateString} from '../helper/substringTxt'
import useConnectProfile from '../helper/useConnectProfile'
import   {useMoralis} from 'react-moralis'
import moment from 'moment'
import useCollectors from '../helper/useCollectors'
export default function CreateMirror({postId, totalMirror ,  postCaption, creatorHandle}) {
  const [userRunnes, setUserRunnes] = useState(0)
    const [daysStreak, setDaysStreak] = useState(-1)
    const [isHolder, setisHolder] = useState(false)
     const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
    const {getUser} = useCollectors();
    const {isProfileConnected} = useConnectProfile()
    const  thePrfId = user?.attributes.lensProfileId
    useEffect(() => {
      if( isAuthenticated && isInitialized) {
          const fetch = async () => {
            const data = await getUser()
            const {daysInArow, lastCollected, runes} = data.attributes;
           //  console.log(data.attributes)
           //  setUserRunnes(runes)
           //  setDaysStreak(daysInArow)
            // console.log("this  is  user  runes", userRunnes)
            // console.log("last runees collected", lastCollected)
  
          }
          fetch()
      }else {
          setUserRunnes(0)
      }
    }, [isAuthenticated, isInitialized, userRunnes])
     // start  of  get  coins  function  
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
          data.save()

      }
  }
   const days = [2, 2, 2, 2, 2,2, 2]
   const holders = [20, 20, 20, 20, 20, 20, 40]
     // end  of  get  coins function 
    const createNewMirror  =  async () =>  {

        const createMirrorRequest = {
            profileId: thePrfId, //"0x41cd",
            // remember it has to be indexed and follow metadata standards to be traceable!
            publicationId: postId,
            referenceModule: {
              followerOnlyReferenceModule: false,
            },
          };

         try{
            const result = await createMirrorTypedData(createMirrorRequest);
            const typedData = result.data.createMirrorTypedData.typedData;
            const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
            const { v, r, s } = splitSignature(signature);

            const tx = await lensHub.mirrorWithSig({
                profileId: typedData.value.profileId,
                profileIdPointed: typedData.value.profileIdPointed,
                pubIdPointed: typedData.value.pubIdPointed,
                referenceModuleData: typedData.value.referenceModuleData,
                referenceModule: typedData.value.referenceModule,
                referenceModuleInitData: typedData.value.referenceModuleInitData,
                sig: {
                  v,
                  r,
                  s,
                  deadline: typedData.value.deadline,
                },
              });
             // console.log(tx.hash);
              // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
              // you can look at how to know when its been indexed here: 
              //   - https://docs.lens.dev/docs/has-transaction-been-indexed

              await getCoins()
         } catch (error) {
           alert("for  some reason  something went  wrong")
         }

    }
  return (
   <Box>
        <Text fontSize="lg" fontWeight="bold">Post by {creatorHandle} </Text>
        <Text color="gray" textTransform="capitalize" mb={2}>{truncateString(postCaption, 30)}</Text>
         <HStack direction="row"><TiGroupOutline size={20} color="gray"/><Text>{totalMirror} Mirrors</Text>  </HStack>
      <Button colorScheme="blue" mt={3} variant="outline" onClick={createNewMirror}>Mirror Post</Button>
   </Box>
  )
}
