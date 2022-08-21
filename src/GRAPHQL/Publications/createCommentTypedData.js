import {apolloClient}  from '../Authentication/appoloClient'
import {gql} from '@apollo/client'

const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        profileIdPointed
        pubIdPointed
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
        referenceModuleData
      }
     }
   }
 }
`;


export const createCommentTypedData = (createCommentTypedDataRequest) => {
    return apolloClient.mutate({
     mutation: gql(CREATE_COMMENT_TYPED_DATA),
     variables: {
       request: createCommentTypedDataRequest
     },
   })
 }