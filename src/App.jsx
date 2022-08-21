import React, {useEffect, useState} from 'react'
import CreatePost from './components/CreatePost'
import PostModules from './components/PostModules'
import TopNav from './components/TopNav'
import UploadVid from './components/UploadVid'
import {}  from './GRAPHQL/Authentication/appoloClient'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Gamification from './pages/Gamification'
import useCollectors from './helper/useCollectors'
import UserPage from './pages/UserPage'
import { useMoralisQuery, useMoralis } from 'react-moralis'
export default function App() {
  const {account} = useMoralis()
    const {data, isLoading, error} = useMoralisQuery("runeCollectors", query => 
      query.equalTo("ethAddress", account)
    )

    console.log("the data  of  runnes  from app page ", data)
  return (
   <div>
   
    <Routes>
      <Route  path='/upload'  element={<CreatePost  />}            />
      <Route path='/gamification' element={<Gamification />} />
      <Route  path='/'  element={<Home />}     />
      <Route  path='/:userId' element={<UserPage  />}          />
   
    </Routes>
   
   </div>
  )
}
