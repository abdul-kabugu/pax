import React, {useState, useEffect} from 'react'
import {lensAuthenticate, generateChallenge}  from '../GRAPHQL/Authentication/appoloClient'
import { useAccount, useSignMessage } from 'wagmi';
import {MoralisContext, useMoralis, useMoralisQuery} from 'react-moralis'
import {  Blockie, ConnectButton, ENSAvatar, Notification, useNotification } from 'web3uikit'
import { ethers } from 'ethers';
import useCollectors from '../helper/useCollectors';
import {} from 'react-icons/im'
import { RiMenu2Line } from 'react-icons/ri'
import { MdOutlineEdit } from 'react-icons/md'
import { useQuery } from '@apollo/client';
import {GET_USER_PROFILES} from "../GRAPHQL/Profile/getUserProfile"
import {CgProfile} from 'react-icons/cg'
import { GiWaterDrop } from 'react-icons/gi'
import { Box, Button , Center, Circle, Container, Flex, Heading, Highlight, IconButton, Input,
   InputGroup, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Tag, 
   Text, useDisclosure, Image, useColorMode, ModalFooter, InputLeftElement, Avatar, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter} from '@chakra-ui/react';
   import {useNavigate, Link} from 'react-router-dom'
import { FaAndroid, FaAppStore, FaChevronDown, FaGooglePlay, FaSearch } from 'react-icons/fa'
import { AiOutlinePlus } from 'react-icons/ai'
import {  useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {ethersProvider, signText} from '../ether-service'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

export default function TopNav({collectedTokens}) {
const [searchInput, setSearchInput] = useState("")
const [isLensConnected, setIsLensConnected] = useState(false)
const [isConnectProfile, setisConnectProfile] = useState(false)
const [lensPrId, setLensPrId] = useState("")
 const [lensHande, setlensHande] = useState("")
 const [userRunnes, setUserRunnes] = useState(0)
 const [daysStreak, setDaysStreak] = useState(-1)
 const [isHolder, setisHolder] = useState(false)
const LENS_ACCESS_TOKEN = sessionStorage.getItem('accessToken')
const { colorMode, toggleColorMode } = useColorMode()
    const {onOpen : onSignInOpen, onClose: onSignInClose, isOpen: isSignInOpen}  = useDisclosure()
    const {authenticate, account, isAuthenticated, Moralis, web3, user,
      setUserData, login, logout, authError, isLoggingOut
    } = useMoralis()
    const {getUser} = useCollectors();
    const navigate = useNavigate()
   // const lensProfileId = user.attributes?.lensProfileId
   // const lensProfileHandle = user.attributes?.lensHandle

     console.log("the  user infos  from top nav", user)
    // `signMessageAsync` lets us programatically request a message signature from the user's wallet
   const { signMessageAsync } = useSignMessage();
   const handleNotifications = useNotification();

     //  Sign-in function
    const signIn = async () => {
      // check  if  user is  authenticateds
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
       

        handleNotifications({
          type:"error",
          title:"Auth Error",
          message: "connect your  wallet  and  sign in with lens to upload",
          
          position: 'topR',
  
        })
      }
    };
      
     const  clearSession  = ()  => {
       sessionStorage.clear("accessToken")  
     }
        
    const {data: userProfile, loading : isUserProfileLoading, error: isUserProfileError} = useQuery(GET_USER_PROFILES, {
      variables : {
        request : {
          profileId : user?.attributes?.lensProfileId                 //userId
        }
      }
    }) 
      
   // console.log("the  user lens prof from top nav", userProfile)
       
     /*function getAuthBtn () {
        if(!isAuthenticated && !account || !web3 && !user){
          return <ConnectButton />
        } else if (isAuthenticated && LENS_ACCESS_TOKEN == null){
          return ( 
             <Button onClick={onSignInOpen} colorScheme="blue">Login </Button>
          )
        }else if (isAuthenticated && account && LENS_ACCESS_TOKEN !== null){
          return  <IconButton icon={<Blockie  size={10} seed={account}/>}     /> 
        }
    
     }*/
       // save  your  lens profile 
       const addLensPrf = async () => {
        setUserData({
          lensProfileId : lensPrId,
          lensHande: lensHande
        })
     }
     const {isOpen : isProfileSideOpen, onOpen : onOpenProfileSide, onClose: onCloseProfileSide}  = useDisclosure()

     const toggleOpen = () =>  {
      isConnectProfile ? setisConnectProfile(false) : setisConnectProfile(true)
      
       onCloseProfileSide()
   }

       // check  if  user  connected  lens  profile
        const isThisUserConnected =  async() =>  {
            if(user.attributes.lensHandle !== undefined 
              && user.attributes.lensProfileId !== undefined){
              setisConnectProfile(false)
             }else{
              
             }

            // console.log("the console of attributes", user.attributes.lensHandle)
        }




     // Upload  function
     const handleUploadBtn = () => {
      //LENS_ACCESS_TOKEN !== null    commented  it  will be  retuned
        if(isAuthenticated && LENS_ACCESS_TOKEN !== null  ){
         
          navigate("/upload")
          onCloseProfileSide()
        } else if(LENS_ACCESS_TOKEN == null ){
          onCloseProfileSide()
          handleNotifications({
            type:"error",
            title:"Auth Error",
            message: "connect your  wallet  and  sign in with lens to upload",
            
            position: 'topR',
    
          })
        }
     }

    
    return (
     <Flex py={3}>
      <Drawer isOpen={isProfileSideOpen} placement="right" onClose={onCloseProfileSide}>
       <DrawerOverlay   />
       <DrawerContent>
        <DrawerCloseButton   />
         <DrawerHeader> 
          <Box>
            <Avatar  name='user' src='https://nftcoders.com/avatar/avatar-cool.svg'  mr={4}   cursor="pointer"   />
          {user?.attributes?.lensHande}
          </Box>
          <Box pt={4} display="flex" justifyContent="space-between" w="90%">
           {userProfile?.profile.stats.totalFollowers ? (
             <Text>{userProfile?.profile.stats.totalFollowers} Followers</Text>
           ) : (
            <Text>0  Followers</Text>
           )}

            {userProfile?.profile.stats.totalFollowing ? (
             <Text>{userProfile?.profile.stats.totalFollowing} Following</Text>
           ) : (
            <Text>0  Following</Text>
           )}
           </Box>
          <Box>
         
          </Box>
          <Box display="flex" alignItems="center" pt={2} > 
            <IconButton    icon={<GiWaterDrop  size={25} color="gray"/> }   mr={5}     />
             <Box display="flex">
             <Text mr={1}>{collectedTokens}</Text>
                <Text fontWeight="black" mr={1}>$RNT</Text>
             </Box>
            
              </Box>
          </DrawerHeader>
         <DrawerBody>
        
          <Box ml={2} display="flex" alignItems="center" cursor="pointer" onClick={toggleOpen} mb={5}>
            <IconButton    icon={<MdOutlineEdit size={25}  mr={4} color="gray" />} mr={4}          />
             <Text>Edit my profile</Text>
          </Box>
          <Button leftIcon={<AiOutlinePlus /> } colorScheme="blue" variant="outline" ml={6} onClick={ handleUploadBtn}>Upload Video</Button> 
         </DrawerBody>
         <DrawerFooter>
          <Button w="100%" colorScheme="blue" disabled >Log out</Button>
         </DrawerFooter>
       </DrawerContent>
      </Drawer>
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



      <Center w="90%" h="60px" px={5} mx="auto" maxWidth="1200px"  borderBottomColor="blackAlpha.500" pb={10} pt={3} mt={5}>
      <Stack direction="row" spacing={4}>
       <Link to="/"> {<GiWaterDrop size={50} color="blue"/>}       </Link>
       <InputGroup w='220px'>
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
       {/*<Link to="/gamification"> <Text>gamification</Text>  </Link>*/}
      
      
      <Box  display="flex" padding={4}>
      
         {colorMode  === "light"  ? (
          <IconButton     icon={<MdDarkMode size={30}/>}     onClick={toggleColorMode}  mr={5}/>
         ): (
          <IconButton  icon={<MdLightMode  size={30}/>}  onClick={toggleColorMode} mr={5}/>
         )}
      
      
       <ConnectButton   />
         {isAuthenticated && LENS_ACCESS_TOKEN == null ? (
          <Button onClick={onSignInOpen} colorScheme="blue">Sign-In Lens </Button>
         ) : (
         
          <Avatar  name='user' src='https://nftcoders.com/avatar/avatar-cool.svg'  mr={4} onClick={clearSession} cursor="pointer"/>
          
         )}
      {/*getAuthBtn()*/}
    <IconButton   icon={<RiMenu2Line size={30}/>} ml={5}  onClick={onOpenProfileSide} />
      </Box>
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
