import { useMoralis } from "react-moralis";
const useConnectProfile = () =>  {
  const {user} = useMoralis()
     const isProfileConnected = async ( ) => {
        if(user?.attributes.lensProfileId !== undefined && user?.attributes.lensHandle !== undefined) {
           return true
        }else {
         return false
        }
     };
    return {isProfileConnected}

}
export default useConnectProfile