import {apolloClient} from '../Authentication/appoloClient'
import {gql} from '@apollo/client'
import {lensHub} from '../../lens-hub'
import {signedTypeData, splitSignature} from '../../ether-service'
import { useMoralis } from 'react-moralis'
const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`;

// TODO sort typed!
const createFollowTypedData = (followRequestInfo) => {
    return apolloClient.mutate({
      mutation: gql(CREATE_FOLLOW_TYPED_DATA),
      variables: {
        request: {
          follow: followRequestInfo,
        },
      },
    });
  };

  export const follow = async (account, profileId,  followModule) => {
    const followRequest = [
        {
            profile:  profileId , //"0x41cd",
        },
         
      ];
      const result = await createFollowTypedData(followRequest);
      const typedData = result.data.createFollowTypedData.typedData;
      const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
      const { v, r, s } = splitSignature(signature)

      const tx = await lensHub.followWithSig({
        follower: account,
        profileIds: typedData.value.profileIds,
        datas: typedData.value.datas,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });
      console.log('follow: tx hash', tx.hash);
      return tx.hash;
    
  }