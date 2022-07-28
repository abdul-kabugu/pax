import React, {useState} from 'react'
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Spacer, Stack, Wrap, WrapItem,Text, Menu, MenuButton, MenuList, MenuItem,  Badge } from '@chakra-ui/react'
import { FaChevronDown, FaSearch, FaAndroid, FaGooglePlay, FaAppStore, } from "react-icons/fa"
import { ConnectButton } from  "web3uikit"
import {useMoralis}  from 'react-moralis'
import {useAccount, useSignMessage} from 'wagmi'
import {} from  "../utils/appolo-client"
import  {generateChallenge, authenticate} from "../utils/appolo-client"


export default function TopNav() {
  const [search, setsearch] = useState()
  const [isLensConnected, setIsLensConnected] = useState(false)
  const {authenticate, isAuthenticated, isAuthenticating, authError, hasAuthError, account} = useMoralis()
  const { data } = useAccount();
  const address = data?.address;
  const connected = !!data?.address;
  const {signMessageAsync} = useSignMessage()
  // SIGN IN TO  LENS PROTOCOL

  const signIn = async () => {
   

    try {
      if (!isAuthenticated) {
        return alert('Please connect your wallet first');
      }
      const challenge = await generateChallenge(account);
      const signature = await signMessageAsync({ message: challenge });
      const accessToken = await authenticate(account, signature);
      console.log({ accessToken });
      window.sessionStorage.setItem('accessToken', accessToken);
      console.log({ signature });
      setIsLensConnected(true)

    } catch (error) {
      console.error(error);
      alert('Error signing in');
    }
  };
  return (
     <Stack px={5} py={5} >
      <Flex alignItems="center" justifyContent="center">
        <Box >
            <Wrap >
              <WrapItem>
           <Text mr={25}>Pax</Text> 
           </WrapItem>
           <WrapItem>
          <InputGroup>
          <InputRightElement children={<FaSearch  style={{color : "gray", cursor: "pointer"}}/>}  />
          <Input  placeholder='videos #hashtags users ' value={search} onChange={e => setsearch(e.target.value)} size="md" w="sm" />
          </InputGroup>
          </WrapItem>
          <Menu>
            <MenuButton as={Button } rightIcon = {<FaChevronDown />}>
              Get App
            </MenuButton>
            <MenuList>
              <MenuItem>
               <FaAndroid style={{marginRight : "5px", fontSize: "20px"}}/> Download Android APK 
                <Badge colorScheme="red">coming soon</Badge>
              </MenuItem>
     
              <MenuItem>
               <FaGooglePlay style={{marginRight : "5px", fontSize: "20px"}}/> Get The Android App 
               <Badge colorScheme="red">coming soon</Badge>
              </MenuItem>
              <MenuItem>
               <FaAppStore style={{marginRight : "5px", fontSize: "20px"}}/> Get The Iphone App 
               <Badge colorScheme="red">coming soon</Badge>

              </MenuItem>
            </MenuList>
          </Menu>
          </Wrap>
        </Box>

        <Spacer />
        
        <Wrap>
            <Button colorScheme="blue" onClick={signIn}>Sign-In with Lens</Button> 
              <ConnectButton  signingMessage='sign-in to Pax'  />
         
        </Wrap>
        
        </Flex>
    </Stack>
    
  )
}
