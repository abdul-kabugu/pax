import React,{useRef, useState} from 'react'
import { IconButton, Text,useDisclosure, Button, Drawer, DrawerFooter,Input,
  DrawerBody,DrawerHeader,DrawerCloseButton,DrawerContent,DrawerOverlay, Textarea,Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Heading, ModalFooter, Tooltip
  } from '@chakra-ui/react'
import { BsFillHeartFill, BsSuitHeart } from 'react-icons/bs'
import { TbMessageDots } from 'react-icons/tb'
import { FaCommentDollar, FaCommentDots, FaShare } from 'react-icons/fa'
import {FaRetweet} from 'react-icons/fa'
import { HiCollection } from 'react-icons/hi'
import CreateComment from './CreateComment'
import CreateMirror from './CreateMirror'
import FullPost from './FullPost'
import CollectPosts from './CollectPosts'

export default function VideoSidebar({post, postComment,  postCollects,  postMirrors}) {
  //const { isOpen, onOpen, onClose,  } = useDisclosure()
  const [postOpen, setPostOpen] = useState()
  const [postToMirror, setpostToMirror] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [commentTxt, setCommentTxt] = useState("")
  const [isCollectModal, setIsCollectModal] = useState(false)
    const [isMirrorModal, setisMirrorModal] = useState(false)
    const [postToCollect, setpostToCollect] = useState()
  const handleOpen = (post) =>  {
    setPostOpen(post)
    console.log(post)
    isOpen ? setIsOpen(false) : setIsOpen (true)
  }
     
    const toggleMirrorModal = (post) =>  {
      isMirrorModal ? setisMirrorModal(false) : setisMirrorModal(true)
       setpostToMirror(post)
    }

     const toggleCollectModal =(post) => {
      setpostToCollect(post)
      isCollectModal ?  setIsCollectModal(false) : setIsCollectModal(true)
     }
   
   console.log("this is post to collect id", postToCollect)
    const handleClose = () => {
      setIsOpen(false)
    }
  const btnRef = useRef()
  return (
    <div className='video_sidebar_container'>
       
      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={handleClose} finalFocusRef={btnRef}
        
      >
      <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your comment</DrawerHeader>

          <DrawerBody>
            <FullPost postId = {postOpen?.id}/>
           
          </DrawerBody>

          <DrawerFooter>
            <CreateComment commentTxt = {commentTxt} setCommentTxt = {setCommentTxt} 
            postId = {postOpen?.id}
            
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={isMirrorModal} onClose={toggleMirrorModal} isCentered>
       <ModalOverlay />
         <ModalContent>
          <ModalHeader>Mirror Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <CreateMirror postId = {postToMirror?.id} totalMirror  = {postToMirror?.stats.totalAmountOfMirrors}
            postCaption = {postToMirror?.metadata.content} creatorHandle = {postToMirror?.profile.handle}
            

           />
          </ModalBody>
          
         </ModalContent>
      </Modal>
   
      <Modal isOpen={isCollectModal} onClose={toggleCollectModal} isCentered>
      <ModalOverlay />
         <ModalContent>
          <ModalHeader>Collect Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           
            <CollectPosts  postId = {postToCollect?.id} 
            collectModule = {postToCollect?.collectModule.__typename}
              creatorHandle = {postToCollect?.profile.handle}
              postCaption = {postToCollect?.metadata.content}
              totalCollectors  = {postToCollect?.stats.totalAmountOfCollects}
            
            />
          </ModalBody>
          
         </ModalContent>
      </Modal>
      <div className='side_bar_button'>
   <IconButton    icon={<HiCollection size={30}/>}  onClick={() => toggleCollectModal(post)} 
       
       />
          <Text textAlign="center">{postCollects}</Text>
       </div>
       <div className='side_bar_button'>
       <IconButton    icon={<FaRetweet  size={30}/>} onClick={() => toggleMirrorModal(post)} 
       
       />
          <Text textAlign="center">{postMirrors}</Text>
       </div>
       <div className='side_bar_button'>
         <IconButton   icon={<FaCommentDots size={30}/>} onClick={() =>handleOpen(post)} ref={btnRef} />
          <Text textAlign="center">{postComment}</Text>
       </div>
       <div className='side_bar_button'>
        <IconButton    icon={<FaShare  size={30}/>}  />
          <Text textAlign="center">745</Text>
       </div>
       
    </div>
  )
}
