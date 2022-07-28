import logo from './logo.svg';
import './App.css';
import CreateHandle from './components/CreateHandle';
import TopNav from './components/TopNav';
import Home from './components/Home';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <div className="App">
     <TopNav/>
     <CreatePost />
     <Home />
    </div>
  );
}

export default App;
