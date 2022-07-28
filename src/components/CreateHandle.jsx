import React, {useState, useEffect} from 'react'
import { useMoralis, useWeb3ExecuteFunction, useMoralisFile } from "react-moralis";
import { Input, IPFSInput, TextArea } from "web3uikit"
import {mainNetABI, testNetABI} from '../ABIFILE'
import { CreateHandleContainer } from '../Styles';
import { ABI, ABITWO, NEWABI, contractAddress } from '../ABI';  
import {recommendProfiles, getProfile} from '../utils/lensQueries'
import {useQuery, useMutation} from "@apollo/client"
import MAINABI from '../MAINABI.json'
export default function Createname() {
  const [name, setName ] = useState()
  const [postTitle, setPostTitle ] = useState()
  const [postDescription, setPostDescription] = useState()
  const [postURI, setPostURI] = useState()
  const [postFile, setPostFile] = useState([])
  const [bio, setBio ] = useState()
  const [avatarURI, setAvatarURI ] = useState("")
  const [followURI, setFollowURI ] = useState("")
 const [imgProfile, setImgProfile] = useState([])
   const contractProccessor  =  useWeb3ExecuteFunction()
  const { authenticate, isAuthenticated, user, account, Moralis } = useMoralis();
  const {saveFile, isUploading, error: uploadingError}  = useMoralisFile()
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const contractAddress = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
  const testNetContract  =  '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
    
 
   // CREATE_PROFILE_FUNCTION
   async function createProfile () {
    
   let options = {
    contractAddress: contractAddress ,
    functionName: "createProfile",
    abi: mainNetABI,
    params: {
      vars : {
        to:  account, //"0x345fdA96178147bF5E8cdFbfBDF723d15f2973C3",
        handle: name,
        imageURI: avatarURI,  // "https://ipfs.moralis.io:2053/ipfs/QmYWtaKJRVusB3XZG2YnvrjH2Nna2nrJsd5cgrNiQqQ9LD",
        followModule: ZERO_ADDRESS,
        followModuleInitData: [],
        followNFTURI: followURI // "https://ipfs.moralis.io:2053/ipfs/QmYWtaKJRVusB3XZG2YnvrjH2Nna2nrJsd5cgrNiQqQ9LD",
         
      }
    }}

     const functionData = await contractProccessor.fetch({
      params: options,
      onSuccess : (data) => {
           console.log("on success data "  +  data)
         
         },
      
        
       
     onError : (error) => console.log(error.message)
    })
    console.log("clicked")
    console.log(functionData.name)
  }
  const imageURI = async () => {
   const imageUrl = await  saveFile("Avatar", imgProfile, { saveIPFS: true });
    setAvatarURI(imageUrl._url)
   return imageUrl._url
   console.log(imageUrl)
  }

  const followNFTURI = async (imageUrl) => {
    //const textArray = bio.split();
    const metadata = {
     name : name,
     description: bio,
     image: imageUrl,
     external_url: "lens.xyz",
     
    }
    try{
   const result =  await saveFile(
     "myprofile.json",
     {base64: btoa(JSON.stringify(metadata))},
     {
      type : "base64",
      saveIPFS : true,
     }
   );
    setFollowURI(result.ipfs())
    
   console.log(result.ipfs())
    } catch (error) {
   console.log(error.message)
    }
    
  }

  const saveProfile = async () => {
    const avatarImg = await imageURI()
    const uriMetadata = await followNFTURI(avatarImg)
     //await createProfile()
  }
   
  const postClipURI = async () => {
    const clipUrl = await  saveFile("clip", postFile, { saveIPFS: true });
     setAvatarURI(clipUrl._url)
    return clipUrl._url
   // console.log(clipUrl)
   }
  const postContent = async (postClip) => {
   let metadata = {
    name: postTitle,
    description: postDescription,
    content : postClip,
    image : postClip,
    external_url: "lens.xyz"
   }
   try{
    const result =  await saveFile(
      "myPost.json",
      {base64: btoa(JSON.stringify(metadata))},
      {
       type : "base64",
       saveIPFS : true,
      }
    );
     setPostURI(result.ipfs())
     
    console.log(result.ipfs())
     } catch (error) {
    console.log(error.message)
     }
  }

  // createPost smart contract 

  async function createPost () {
    let options = {
      contractAddress: testNetContract ,
      functionName: "post",
      abi: testNetABI,
      params: {
        vars : {
          profileId: "16845",
          contentURI: postURI,
          collectModule:"0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c",  
          collectModuleInitData: "0x0000000000000000000000000000000000000000000000000000000000000001",
          referenceModule: ZERO_ADDRESS,
          referenceModuleInitData: "0x00"
           
        }
      }}

      const functionData = await contractProccessor.fetch({
        params: options,
        onSuccess : () => {
             console.log("on success data " )
           
           },
        
       onError : (error) => console.log(error.message)
      })
      
    }
  
   const  savePost = async () => {
    const postVideo = await postClipURI()
    const uriMetadata = await postContent(postVideo)
     await createPost()
   }

    const {loading : trendingLoading, error: trendingError, data : trendingProfiles} = useQuery(getProfile);
     if(trendingLoading) return("loading data ")
     if(trendingError) return ( (error) => <h3>{error.message}</h3>)

       console.log(trendingProfiles)
  return (
    <CreateHandleContainer>
    <h2 style={{textTransform : "capitalize"}}>create  pofile in opera  </h2>
      <div>
        <Input label='name' onChange={e => setName(e.target.value)}/>
        <Input  label='Bio' onChange={e => setBio(e.target.value)}    />
        <input type='file'  
          onChange={(e) => setImgProfile(e.target.files[0])}
        
        /> <br />
        <button onClick={saveProfile}>save profile</button>
        <button onClick={createProfile}>Test Function</button>
         <h1>post  conentent</h1>
         <Input   placeholder='post title' onChange={e => setPostTitle(e.target.value)}/>
         <Input  placeholder='post description' onChange={e => setPostDescription(e.target.value)}/>
         <input type='file'  
          onChange={(e) => setPostFile(e.target.files[0])} /> <br />
          {isUploading && <h1>data is Uploading </h1>}
          <button onClick={savePost}>create post </button>
          <h5>{postTitle}</h5>
          <h5>{postDescription}</h5>
      </div>
    </CreateHandleContainer>
  )
}
