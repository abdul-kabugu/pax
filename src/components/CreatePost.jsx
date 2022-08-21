import React, {useState, useRef, useEffect} from 'react'
import {lensHub} from '../lens-hub'
import  {signedTypeData, splitSignature} from "../ether-service"
import {createPostTypedData} from '../GRAPHQL/Publications/createPostTypedDta'
import { Box, Button, Center, Flex, Heading, IconButton, Input, InputGroup, Stack, Text, Textarea, useColorMode } from '@chakra-ui/react'
import {useMoralis, useMoralisFile} from 'react-moralis'
import {v4 as uuidv4} from 'uuid'
import {uploadIpfs} from '../ipfs'
import { RiVideoUploadLine } from 'react-icons/ri'
import { BsUpload } from 'react-icons/bs'
import { FaUbuntu } from 'react-icons/fa'
import {Step, Steps, useSteps} from 'chakra-ui-steps'
import   UploadVid from './UploadVid'
import PostModules from './PostModules'
import {useNotification} from 'web3uikit'
import  useCollectors from '../helper/useCollectors'
import  moment from 'moment'
import TopNav from './TopNav'

export default function CreatePost() {
  const { colorMode, toggleColorMode } = useColorMode()
  const {saveFile, isUploading, moralisFile, error: uploadingError} = useMoralisFile()
  const {account, isInitialized, isAuthenticated, Moralis, user} = useMoralis()
  const [userRunnes, setUserRunnes] = useState(0)
  const [daysStreak, setDaysStreak] = useState(-1)
  const [isHolder, setisHolder] = useState(false)
  const [caption, setCaption] = useState("")
  const [mediaURI, setMediaURI] = useState(null)
  const [postVideo, setPostVideo] = useState([])
  const [postMetadataURI, setPostMetadaURI] = useState("")
  const [isVideoUploading, setIsVideoUploading] = useState(false)
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const {getUser} = useCollectors();
  const  thePrfId = user?.attributes.lensProfileId
  
  console.log("this  is  the  id  of profile", thePrfId)
  //const  {lensProfileId} = user()
 // console.log("the console of  profile id  from DB ", lensProfileId)

  useEffect(() => {
    if( isAuthenticated && isInitialized) {
        const fetch = async () => {
          const data = await getUser()
          const {daysInArow, lastCollected, runes} = data.attributes;
           console.log(data.attributes)
           setUserRunnes(runes)
           setDaysStreak(daysInArow)
           console.log("this  is  user  runes", userRunnes)
           console.log("last runees collected", lastCollected)

        }
        fetch()
    }else {
        setUserRunnes(0)
    }
  }, [isAuthenticated, isInitialized, userRunnes])

  // get coins
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
 const days = [3, 3, 3, 3, 3,3, 3]
 const holders = [20, 20, 20, 20, 20, 20, 40]
  //end  of  get coins
  
     const  postMediaUploader = async () => {
     setIsVideoUploading(true)
  // const result = await uploadIpfs(postVideo)
  const result = await saveFile("postMedia", postVideo, { saveIPFS: true });
     setMediaURI(result.ipfs())
     console.log(result.ipfs())
    
       return result
    }

    const handleNotifications = useNotification(); 
      //Initialize  post  metadata
      const PostMetada = async () => {
        const metadata = {
          version: '1.0.0',
          metadata_id: uuidv4(),
          description: caption,
          content: caption,
          external_url: null,
          image: null,
          imageMimeType: null,
          name: caption,
          attributes: [],
          media: [
             {
            item:mediaURI,
             type: 'video/mp4',
            },
          ],
         
          animation_url : mediaURI,
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
           setPostMetadaURI(result.ipfs())
           return result
          
        }catch (error){
          alert(error.message)
        }
       }

          
    const createNewPost = async () => {
         
         // UPLOAD_POST_METADATA TO IPFS
          const ipfRsult = await  PostMetada()
          console.log(ipfRsult._ipfs)
           
           /*const ipfsResult = await uploadIpfs({
            version: '1.0.0',
          metadata_id: uuidv4(),
          description: caption,
          content: caption,
          external_url: null,
          image: null,
          imageMimeType: null,
          name: "post by @",
          attributes: [],
          media: [
             {
            item:mediaURI,
             type: 'video/mp4',
            },
          ],
         
          animation_url : mediaURI,
          appId: 'pax423',
           })*/
         //Create new post  function
        const createPostRequest = {
            profileId: thePrfId,
            contentURI: ipfRsult._ipfs, //'ipfs://' + ipfsResult.path,
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
        const result = await createPostTypedData(createPostRequest);
        const typedData = result.data.createPostTypedData.typedData;

        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
        const { v, r, s } = splitSignature(signature);
  
        const tx = await lensHub.postWithSig({
            profileId: typedData.value.profileId,
            contentURI:typedData.value.contentURI,
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
          console.log(tx.hash);
          // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
          // you can look at how to know when its been indexed here: 
          //   - https://docs.lens.dev/docs/has-transaction-been-indexed

          await getCoins()
        } catch (error) {
          alert("this  occured", error)
        }
    }
    
      
  return (
    <Box>
      <TopNav />
      <Center width="100%" flexDirection="column">
         <Text></Text>
        <Heading fontSize="xl" mb={4}>Upload video</Heading>
        <Text fontSize="lg">Post a video to your account</Text>
        </Center >
      
         <Flex flexDirection="column" w="80%" mx="auto">
          
          <Steps activeStep={activeStep}>
            <Step label='Upload video'>
              <UploadVid    postVideo={postVideo}   setPostVideo={setPostVideo}   postMediaUploader ={postMediaUploader}  
              mediaURI={mediaURI}  setMediaURI={setMediaURI}  uploading ={isVideoUploading} setIsUploading = {setIsVideoUploading}/>
            </Step>
            <Step label="create post">
              <PostModules   caption={caption}  setCaption ={setCaption}  createPost = {createNewPost}     
                getTokens = {getCoins}  userBalance = {userRunnes}
              
              />
            </Step>
          </Steps>
           { (
            <Flex width="100%" justify="flex-end">
            <Button
              isDisabled={activeStep === 0}
              mr={4}
              onClick={prevStep}
              size="sm"
              variant="ghost"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {activeStep === 1 ? 'Finish' : 'Next'}
            </Button>
          </Flex>
           )}
         </Flex>
       
       
      
         
        
        </Box>
  )
}
