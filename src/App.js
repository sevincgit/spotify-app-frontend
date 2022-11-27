import './App.css';
import SpotifyLogin from './components/Login';
import CreatePlaylist from './components/CreatePlaylist';
import { useState } from 'react';
import Header from './components/Header';
import MyPlaylists from './components/MyPlaylists';
import Playlist from './components/Playlist';
import About from './components/About';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  // adding a state for logged in
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [spotifyUserID, setSpotifyUserID] = useState('');

  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(30, 215, 96)',
      },
      secondary: {
        main: '#f44336',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className='App'>
          {loggedIn ? (
            <>
              <Header setLoggedIn={setLoggedIn} token={token} setToken={setToken} spotifyUserID={spotifyUserID} setSpotifyUserID={setSpotifyUserID} />
              <Routes>
                <Route path='/' element={<CreatePlaylist token={token} spotifyUserID={spotifyUserID} />} />
                <Route path='/my-playlists' element={<MyPlaylists spotifyUserID={spotifyUserID} token={token} />} />
                <Route path='/my-playlists/:id/:playlistName' element={<Playlist spotifyUserID={spotifyUserID} token={token} />} />
                <Route path='/about' element={<About />} />
                <Route path='*' element={<div>Pag not found</div>} />
              </Routes>
            </>
          ) : (
            <SpotifyLogin setLoggedIn={setLoggedIn} token={token} setToken={setToken} />
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
