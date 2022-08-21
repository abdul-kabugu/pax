import { Box, Heading, HStack, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react'
import React from 'react'
import { BsHash } from 'react-icons/bs'
export default function Hashtags() {
  return (
    <Box>
    <Heading fontSize="2xl" fontWeight="bold"  mb={10} mt={1}>Suggested hashtags</Heading>
      <HStack spacing={4}>
        <Tag   size="md"   variant="subtle"  colorScheme="cyan">
            <TagLabel>#paxusa</TagLabel>
        </Tag>
        <Tag   size="md"   variant="subtle"  colorScheme="cyan">
            <TagLabel>#paxtanzania</TagLabel>
        </Tag>
        <Tag   size="md"   variant="subtle"  colorScheme="cyan">
            <TagLabel>#paxchina</TagLabel>
        </Tag>
        
      </HStack>
 
    </Box>
  )
}
