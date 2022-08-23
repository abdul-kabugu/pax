import React, {useEffect, useState} from 'react'
import {Box, Button, Text, Textarea} from '@chakra-ui/react'
import {lensHub} from '../lens-hub'
import  {signedTypeData, splitSignature} from "../ether-service"
import {createCommentTypedData} from '../GRAPHQL/Publications/createCommentTypedData'
import {useMoralis, useMoralisFile} from 'react-moralis'
import {v4 as uuidv4} from 'uuid'
import {useNotification} from "web3uikit"
import moment from 'moment'
import useCollectors from '../helper/useCollectors'
export default function CreateComment({commentTxt, setCommentTxt, postId}) {
  const [userRunnes, setUserRunnes] = useState(0)
    const [daysStreak, setDaysStreak] = useState(-1)
    const [isHolder, setisHolder] = useState(false)
    const {account, isAuthenticated, isInitialized, Moralis, user} = useMoralis()
    const {saveFile, isUploading, moralisFile, error: uploadingError, } = useMoralisFile()
    const handleNotifications = useNotification();
    const {getUser} = useCollectors();
    const  thePrfId = user?.attributes.lensProfileId
    useEffect(() => {
      if( isAuthenticated && isInitialized) {
          const fetch = async () => {
            const data = await getUser()
            const {daysInArow, lastCollected, runes} = data.attributes;
           //  console.log(data.attributes)
             setUserRunnes(runes)
             setDaysStreak(daysInArow)
            // console.log("this  is  user  runes", userRunnes)
           //  console.log("last runees collected", lastCollected)
  
          }
          fetch()
      }else {
          setUserRunnes(0)
      }
    }, [isAuthenticated, isInitialized, userRunnes])

    const PostMetada = async () => {
        const metadata = {
          version: '1.0.0',
          metadata_id: uuidv4(),
          description: commentTxt,
          content: commentTxt,
          external_url: null,
          image: null,
          imageMimeType: null,
          name: commentTxt,
          attributes: [],
          media: [],
          appId: 'pax423',
        }

        try{
          const  result = await saveFile(
            "mypost.json",
            {base64: btoa(JSON.stringify(metadata))},
            {
              type : "base64",
              saveIPFS : true
            }
          )
           
           return result
          
        }catch (error){
          alert(error.message)
        }
       }
         
          // start  of  create  gamification
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
                } else if(isAuthenticated) {
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
         const days = [1, 1, 1, 1, 1,1, 1]
         const holders = [20, 20, 20, 20, 20, 20, 40]
          // end  of create  gamification
        const createNewComment  = async  () => {
            const ipfsResult = await PostMetada()

            //console.log("comment ipfs result", ipfsResult._ipfs)

            const createCommentRequest = {
                profileId:  thePrfId,
                publicationId: postId,
                contentURI: ipfsResult._ipfs,
                collectModule : {
                    freeCollectModule : {
                       followerOnly : false
                    }
                    },
                    referenceModule: {
                       followerOnlyReferenceModule: false,
                     },

            }
          try{
            const result = await createCommentTypedData(createCommentRequest)
            const typedData = result.data.createCommentTypedData.typedData;

            const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
            const { v, r, s } = splitSignature(signature);

            const tx = await lensHub.commentWithSig({
                profileId: typedData.value.profileId,
                contentURI: typedData.value.contentURI,
                profileIdPointed: typedData.value.profileIdPointed,
                pubIdPointed: typedData.value.pubIdPointed,
                referenceModuleData: typedData.value.referenceModuleData,
                collectModule: typedData.value.collectModule,
                collectModuleInitData: typedData.value.collectModuleInitData,
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
            } catch (erro) {
               /* handleNotifications({
                    type:"error",
                    title:"Posting Error ",
                    message: "The  comment  is  failed  please check your  network and  try  again",
                    
                    position: 'topR',
            
                  })*/
                  alert("for  some  reason  your  post  not  posted")
            } 
        }
  return (
    <div>
        <Box>
           
           <Textarea placeholder='Write Your  Comment Here ' onChange={e => setCommentTxt(e.target.value)} w="400px" />
            <Button colorScheme="blue" mt={3} ml="70%" onClick={createNewComment}>Comment</Button>
            </Box>
    </div>
  )
}
