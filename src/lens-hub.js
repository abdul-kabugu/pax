import {getSigner}  from './ether-service'
import {MUMBAI_CONTRACT_ADDRESS} from "./constants"
import { ethers, utils } from 'ethers';
import LENS_HUB  from './Abi/LENS_HUB.json'
 
export const lensHub = new ethers.Contract(
    MUMBAI_CONTRACT_ADDRESS,
    LENS_HUB,
    getSigner()
  )