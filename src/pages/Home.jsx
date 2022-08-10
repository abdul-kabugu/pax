import React from 'react'
import {useQuery, gql} from '@apollo/client'
import {EXPLORE_PUBLICATIONS} from '../GRAPHQL/Publications/expolorePublications'
import {GET_PROFILE} from '../GRAPHQL/Profile/getProfile'
import Video from '../components/Video'
import '../global-style.css'
import { Avatar, Box, Button, Heading, Text } from '@chakra-ui/react'
import {recommendedeCreators} from '../fakeData'
import { BsEmojiWink } from 'react-icons/bs'

export default function Home() {
    const {data, loading, error} = useQuery(GET_PROFILE)
    if (loading) return 'Loading..';
  if (error) return `Error! ${error.message}`;
  console.log(data)
  return (
    <div className='home-container'>
      <div className='home-left'>
      <Heading fontSize="3xl" textAlign="center" mb={10}>Creators you might like</Heading>
      {recommendedeCreators.map((data, i) => (
        <Box w="90%" display="flex" flexDirection="row" justifyContent="space-between" mb={10} mx="auto">
          <Box display="flex" alignItems="start">
        <BsEmojiWink size={30}  />
          <Box marginLeft={5}>
          <Text fontWeight="bold" fontSize={15} mb={0}>{data.nakeName}</Text>
          <Text as="u">{data.handle}</Text>
          </Box>
          </Box>
          <Box>
            <Button variant="outline" colorScheme="blue">follow</Button>
          </Box>
        </Box>
      ))}
      <Heading  fontSize="3xl" textAlign="center" >Suggested hashtags</Heading>
      <Text as='mark' textAlign="center">coming soon</Text>
      </div>
       
        <div className='app_vidos'>
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        </div>
    </div>
  )
}
