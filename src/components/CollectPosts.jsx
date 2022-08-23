import React from 'react'
import {lensHub} from '../lens-hub'
import {signedTypeData, splitSignature} from "../ether-service"
import {createCollectTypedData} from '../GRAPHQL/Publications/createCollectTypedData'
import {useMoralis, useMoralisFile} from 'react-moralis'
import {Text, Box, HStack, Button} from '@chakra-ui/react'
import {truncateString} from '../helper/substringTxt'
import {TiGroupOutline} from 'react-icons/ti'


export default function CollectPosts({postId, collectModule, postCaption,  totalCollectors, creatorHandle}) {
    const {account, user} = useMoralis()
   // lensProfileId = user.attributes.lensProfileId
  const  thePrfId = user?.attributes.lensProfileId
  //console.log("the console of  profile id  from DB ", lensProfileId)

    const createNewColect = async () => {
        const collectRequest = {
            publicationId: postId,
          };
            try{
          const result = await createCollectTypedData(collectRequest);
         const typedData = result.data.createCollectTypedData.typedData;
  
  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  const { v, r, s } = splitSignature(signature);
  
  const tx = await lensHub.collectWithSig({
    collector: account,
    profileId: typedData.value.profileId,
    pubId: typedData.value.pubId,
    data: typedData.value.data,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  //console.log(tx.hash);
} catch (error) {
    alert(error)
  }
    }
  return (
  
    <Box>
    <Text fontSize="lg" fontWeight="bold">Post by {creatorHandle} </Text>
    <Text color="gray" textTransform="capitalize" mb={2}>{truncateString(postCaption, 30)}</Text>
     <HStack direction="row"><TiGroupOutline size={20} color="gray"/><Text>{totalCollectors} Collectors</Text>  </HStack>
  <Button colorScheme="blue" mt={3} variant="outline" onClick={createNewColect}>Collect Post</Button>
</Box>
  )
}
