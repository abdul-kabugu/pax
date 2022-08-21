import { Box, Button, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { FaCaretUp, FaDollarSign, FaGifts } from 'react-icons/fa'
import TopNav from '../components/TopNav'
import   {useMoralis} from 'react-moralis'
import  useCollectors from '../helper/useCollectors'
import  moment from 'moment'
import { ConnectButton } from 'web3uikit'
export default function Gamification() {
    const [userRunnes, setUserRunnes] = useState(0)
    const [daysStreak, setDaysStreak] = useState(-1)
    const [isHolder, setisHolder] = useState(true)
 const {account, isInitialized, isAuthenticated, Moralis} = useMoralis()
 const {getUser} = useCollectors();
 useEffect(() => {
    if( isAuthenticated && isInitialized) {
        const fetch = async () => {
          const data = await getUser()
          const {daysInArow, lastCollected, runes} = data.attributes;
           console.log(data.attributes)
           setUserRunnes(runes)
           setDaysStreak(daysInArow)
           console.log("this  is  user  runes", userRunnes)
           console.log("last runees collected", lastCollected)

        }
        fetch()
    }else {
        setUserRunnes(0)
    }
  }, [isAuthenticated, isInitialized, userRunnes])

    const collectCoins = async () =>  {
        const users = Moralis.Object.extend("runeCollectors")
        const query = new Moralis.Query(users)
        query.equalTo("ethAddress", account)
        const data = await query.first();
        const {daysInArow, lastCollected, runes} = data?.attributes;

        if(!lastCollected || !moment(lastCollected).isSame(moment.utc(), "day")){
            data.increment("runes", days[daysInArow])
            data.set("lastCollected", moment.utc().format())
            setUserRunnes(runes + days[daysInArow]);
            if(daysInArow === 6){
                data.set("daysInArow", 0)
                setDaysStreak(0)
            }else {
                data.increment("daysInArow")
                setDaysStreak(daysInArow +1)
            }
            data.save()
        }
        console.log("clicked  this  ")
    }
    // get  your  coins 
    const getCoins = async () => {
        const users = Moralis.Object.extend("runeCollectors")
        const query = new Moralis.Query(users)
        query.equalTo("ethAddress", account)
        const data = await query.first();
        const {daysInArow, lastCollected, runes} = data?.attributes;
        if(moment(lastCollected).isBefore(moment.utc(), "minutes")){
            if(isHolder){
                data.increment("runes", holders[daysInArow])
                data.set("lastCollected", moment.utc().format())
                setUserRunnes(runes + days[daysInArow]);
            } else {
            data.increment("runes", days[daysInArow])
            data.set("lastCollected", moment.utc().format())
            setUserRunnes(runes + days[daysInArow]);
            }
            if(daysInArow === 6){
                data.set("daysInArow", 0)
                setDaysStreak(0)
            }else {
                data.increment("daysInArow")
                setDaysStreak(daysInArow +1)
            }
            data.save()

        }
    }
     const days = [1, 1, 1, 1, 1,1, 1]
     const holders = [20, 20, 20, 20, 20, 20, 40]
  return (
    <div>
        <TopNav />
    <Box w="90%" mx="auto">
        <Tabs isFitted>
            <TabList>
                <Tab>My runes <FaDollarSign /> </Tab>
                <Tab>leader board <FaCaretUp /> </Tab>
                <Tab>Rewards <FaGifts /> </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Box>
                        <Heading>let's collect  runnes</Heading>
                       
                          <Text>my runes : {userRunnes}</Text>
                         <Button onClick={() => getCoins()}>collect  today's runnee</Button>
                    </Box>
                </TabPanel>
                <TabPanel>my leader board </TabPanel>
                <TabPanel>my rewads tab</TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
    </div>
  )
}
