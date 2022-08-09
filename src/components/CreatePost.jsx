import React, {useState, useRef} from 'react'
import {lensHub} from '../lens-hub'
import  {signedTypeData, splitSignature} from "../ether-service"
import {createPostTypedData} from '../GRAPHQL/Publications/createPostTypedDta'
import { Box, Button, Center, Flex, Heading, IconButton, Input, InputGroup, Stack, Text, Textarea, useColorMode } from '@chakra-ui/react'
import {useMoralis, useMoralisFile} from 'react-moralis'
import {v4 as uuidv4} from 'uuid'
import { RiVideoUploadLine } from 'react-icons/ri'
import { BsUpload } from 'react-icons/bs'
import { FaUbuntu } from 'react-icons/fa'
import {Step, Steps, useSteps} from 'chakra-ui-steps'
import   UploadVid from './UploadVid'
import PostModules from './PostModules'
export default function CreatePost() {
  const { colorMode, toggleColorMode } = useColorMode()
  const {saveFile, isUploading, moralisFile, error: uploadingError} = useMoralisFile()
  const {account} = useMoralis()
  const [caption, setCaption] = useState("")
  const [mediaURI, setMediaURI] = useState("")
  const [postVideo, setPostVideo] = useState([])
  const [postMetadataURI, setPostMetadaURI] = useState("")
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

     const  postMediaUploader = async () => {
     const result = await saveFile("postMedia", postVideo, { saveIPFS: true });
     setMediaURI(result.ipfs())
     console.log(result.ipfs())
       return result
    }

      
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
          console.log(result.ipfs())
        }catch (error){
          alert(error.message)
        }
       }
    const createNewPost = async () => {
         
         // post metadata  
          await  PostMetada()

         //Create new post  function
        const createPostRequest = {
            profileId: "0x41cd",
            contentURI:  postMetadataURI,         //result.ipfs,
             collectModule : {
             freeCollectModule : {
                followerOnly : false
             }
             },
             referenceModule: {
                followerOnlyReferenceModule: false,
              },
        }

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
    }

      
  return (
    <Box>
      <Center width="100%" flexDirection="column">
        <Heading fontSize="xl" mb={4}>Upload video</Heading>
        <Text fontSize="lg">Post a video to your account</Text>
        </Center >
      
         <Flex flexDirection="column" w="80%" mx="auto">
          <Steps activeStep={activeStep}>
            <Step label='Upload video'>
              <UploadVid    postVideo={postVideo}   setPostVideo={setPostVideo}   postMediaUploader ={postMediaUploader}  
              mediaURI={mediaURI}  setMediaURI={setMediaURI}  uploading ={isUploading} uploadingError = {uploadingError}/>
            </Step>
            <Step label="create post">
              <PostModules   caption={caption}  setCaption ={setCaption}  createPost = {createNewPost}                    />
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
       
       
         <Text>{account}</Text>
         
        <Button onClick={toggleColorMode}>change color mode</Button>
        </Box>
  )
}
