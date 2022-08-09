import React, {useState} from 'react'
import {lensAuthenticate, generateChallenge}  from '../GRAPHQL/Authentication/appoloClient'
import { useAccount, useSignMessage } from 'wagmi';
import {MoralisContext, useMoralis} from 'react-moralis'
import { Blockie, ConnectButton, ENSAvatar, Notification, useNotification } from 'web3uikit'
import { ethers } from 'ethers';
import { Box, Button , Center, Circle, Container, Flex, Heading, Highlight, IconButton, Input,
   InputGroup, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Tag, 
   Text, useDisclosure, Image, useColorMode} from '@chakra-ui/react';
   import {useNavigate, Link} from 'react-router-dom'
import { FaAndroid, FaAppStore, FaChevronDown, FaGooglePlay, FaSearch } from 'react-icons/fa'
import { AiOutlinePlus } from 'react-icons/ai'
import {  useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {ethersProvider, signText} from '../ether-service'

export default function TopNav() {
const [searchInput, setSearchInput] = useState("")
const [isLensConnected, setIsLensConnected] = useState(false)
const LENS_ACCESS_TOKEN = sessionStorage.getItem('accessToken')
const { colorMode, toggleColorMode } = useColorMode()
    const {onOpen : onSignInOpen, onClose: onSignInClose, isOpen: isSignInOpen}  = useDisclosure()
    const {authenticate, account, isAuthenticated, Moralis, web3} = useMoralis()
    const navigate = useNavigate()
    // `signMessageAsync` lets us programatically request a message signature from the user's wallet
   const { signMessageAsync } = useSignMessage();
   const handleNotifications = useNotification();
     //  Sign-in function
    const signIn = async () => {
      // check  if  user is  authenticated
      try {
        if (!isAuthenticated || !account) {
          return alert('Please connect your wallet first');
        }
        // generate  challenge 
        const challenge = await generateChallenge(account);
        //  sign  genereted  challenge
        const signature = await signText(challenge);
        // Get  access Token 
        const accessToken = await lensAuthenticate(account, signature);
        console.log({accessToken});
        // Store  access token  sessionStorage
        window.sessionStorage.setItem('accessToken', accessToken);
          setIsLensConnected(true)
      } catch (error) {
        console.error(error);
        alert('Error signing in');
      }
    };

    //  function for  conditiaonally  reandering

     function getAuthBtn () {
        if(!isAuthenticated && !account || !web3){
          return <ConnectButton />
        } else if (isAuthenticated && LENS_ACCESS_TOKEN == null){
          return ( 
             <Button onClick={onSignInOpen} colorScheme="blue">Login </Button>
          )
        }else if (isAuthenticated && account && LENS_ACCESS_TOKEN !== null){
          return  <IconButton icon={<Blockie  size={10} seed={account}/>}     /> 
        }
    
     }

     // Upload  function
     const handleUploadBtn = () => {
        if(isAuthenticated && LENS_ACCESS_TOKEN !== null){
          navigate("/upload")
        } else if(LENS_ACCESS_TOKEN == null ){
          handleNotifications({
            type:"error",
            title:"Auth Error",
            message: "connect your  wallet  and  sign in with lens to upload",
            
            position: 'topR',
    
          })
        }
     }

     const fireNotification = () => {
     
      
        
     }
    return (
     <Flex py={3}>
      <Center w="90%" h="60px" px={5} mx="auto">
      <Stack direction="row" spacing={4}>
       <Link to="/"> <Text fontSize="md">Pax</Text> </Link>
       <InputGroup w='358px'>
        <InputRightElement 
          pointerEvents="none"
          children={<FaSearch style={{color: "gray"}}/>}

         />
         <Input  type="text"   placeholder='Videos,#Hashtags Users Musics And More' 
          value={searchInput}   onChange={e => setSearchInput(e.target.value)}      
          />
       </InputGroup>

       <Menu>
        <MenuButton as={Button}
          rightIcon={<FaChevronDown />}
        >  Get App</MenuButton>
        <MenuList>
          <MenuItem><FaAndroid  style={{borderRadius: "50%",  marginRight: "5px"}}/>          Download Android APK  <Tag colorScheme="red" px={2}>coming soon</Tag> </MenuItem>
          <MenuItem><FaGooglePlay     style={{borderRadius: "50%",  marginRight: "5px"}} /> Get the Android App <Tag colorScheme="red" px={2}>coming soon</Tag> </MenuItem>
          <MenuItem><FaAppStore      style={{borderRadius: "50%",  marginRight: "5px"}}/> Get the Iphone App <Tag colorScheme="red" px={2}>coming soon</Tag>  </MenuItem>
          
        </MenuList>
       </Menu>
       </Stack>
       <Spacer />
      <Stack direction="row" spacing={3}>
      <Button onClick={toggleColorMode}>change color mode</Button>
        <Button leftIcon={<AiOutlinePlus /> } onClick={handleUploadBtn}>Upload Video</Button>
        
      {getAuthBtn()}
         <Modal isOpen={isSignInOpen} onClose={onSignInClose} isCentered p>
          <ModalOverlay  />
            <ModalContent>
              <ModalHeader>
                <Text fontSize='md'>  Login</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Heading fontSize="lg">Please sign the message.</Heading>
                <Text fontSize="md"> Lenster uses this signature to verify that you’re the owner of this address. </Text>
                <Button colorScheme="blue" mt={15} onClick={signIn}>Sign-In With Lens</Button>
              </ModalBody>
            </ModalContent>
         </Modal>
        
        </Stack>
        </Center>
        </Flex> 
      
    );
}
