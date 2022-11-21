import './App.css';
import SpotifyLogin from './components/Login';
import SpotifyLogout from './components/Logout';
import { useState } from 'react';

function App() {
  // adding a state for logged in
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  return (
    <div className='App'>
      <header className='App-header'></header>
      {loggedIn ? (
        <SpotifyLogout setLoggedIn={setLoggedIn} setToken={setToken} />
      ) : (
        <SpotifyLogin setLoggedIn={setLoggedIn} token={token} setToken={setToken} />
      )}
    </div>
  );
}

export default App;
