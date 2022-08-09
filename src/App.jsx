import React from 'react'
import CreatePost from './components/CreatePost'
import PostModules from './components/PostModules'
import TopNav from './components/TopNav'
import UploadVid from './components/UploadVid'
import {}  from './GRAPHQL/Authentication/appoloClient'
import {Route, Routes} from 'react-router-dom'
export default function App() {
  return (
   <div>
    <TopNav />
    <Routes>
      <Route  path='/upload'  element={<CreatePost  />}            />
    </Routes>
   
   </div>
  )
}
