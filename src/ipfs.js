import {create} from 'ipfs-http-client'


//  PROJECT_ID
const PROJECT_ID= "2DClJGZe7gt4xvK5ptGTyyFq1pw"
// PROJECT_SECRET KEY
const PROJECT_SECRET = "e9d5f0790bcf561e07f7a4779589f4c7"

const auth = 'Basic '+ Buffer.from(PROJECT_ID + ":" + PROJECT_SECRET).toString("base64")
//const auth ='Basic ’ + Buffer.from(projectId + “:” + projectSecret).toString(‘base64’)
const client =  create ({
    host : "ipfs.infura.io",
    port : 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
    
});
  
export const uploadIpfs = async (data) => {
 
  const result = await client.add(JSON.stringify(data));
  console.log("ipfs results", result)
  return result;
  

}

// IPFS  TWO
