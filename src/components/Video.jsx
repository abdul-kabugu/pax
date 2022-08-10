import React, {useRef, useState} from 'react'
import '../global-style.css'
import VideoFooter from './VideoFooter'
import VideoHeader from './VideoHeader'
import VideoSidebar from './VideoSidebar'
export default function Video() {
  const [isPlaying, setisPlaying] = useState(false)
  const videoRef = useRef(null)
  const onVideoPlay = () =>  {
    if(isPlaying){
      videoRef.current.pause()
      setisPlaying(false)
    } else {
     videoRef.current.play()
     setisPlaying(true)
    }
    
  }
  return (
    <div className='postContainer'>
    
      {/*<div className='video-header'>this  is  the  video  header components</div>*/}
      <VideoHeader />
      <div className='video_container'>
      <div className='video'>
      
      <video src='https://v16-webapp.tiktok.com/591f49a804570e57811059c3977e8ccd/62f41a98/video/tos/useast2a/tos-useast2a-pve-0068/ff9f282540c84e0287e1a35a1e820e99/?a=1988&ch=0&cr=0&dr=0&lr=tiktok_m&cd=0%7C0%7C1%7C0&cv=1&br=1036&bt=518&btag=80000&cs=0&ds=3&ft=gKSYZ8peo0PD11E3-sg9wtX2O5LiaQ2D~g4&mime_type=video_mp4&qs=0&rc=Zjw7Mzo1NTY5N2U4ZzU6aUBpM3NzZzo6ZjloZTMzNzczM0BfNTY0Xi1jNTYxMC40Yy9eYSNhLW9scjRnZF9gLS1kMTZzcw%3D%3D&l=202208101449370102230731460021023D' className='video_player'
        loop
        ref={videoRef}
        onClick={onVideoPlay}
      ></video>
      <VideoFooter isPlaying = {isPlaying} setisPlaying = {setisPlaying} togglePlay ={onVideoPlay}/>
     </div>
     <VideoSidebar />
    </div>
    </div>
  )
}
