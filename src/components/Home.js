import React from 'react'
import { HomeContainer } from '../Styles'
import CreateHandle from './CreateHandle'
import { useColorModeValue, useColorMode, Button, Text } from '@chakra-ui/react'
import {FaFacebook} from 'react-icons/fa'
export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <HomeContainer>
      <Button colorScheme='facebook' leftIcon={<FaFacebook />}>
    Facebook
  </Button>
      <Button colorScheme="blue" >hellow  world </Button>
     <button onClick={ toggleColorMode} > toggle  colo</button>
    </HomeContainer> 
  )
}

