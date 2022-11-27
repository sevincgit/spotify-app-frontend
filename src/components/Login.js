import { Button } from '@mui/material';
import { textAlign } from '@mui/system';
import { useEffect, useState } from 'react';
import background from '../Login_page_bg.jpg';
import logo from '../Tune_Salad_Logo.svg';

const SpotifyLogin = (props) => {
  const authPath = process.env.REACT_APP_AUTH_ENDPOINT;
  console.log(authPath);
  const mainPath = process.env.REACT_APP_REDIRECT_URI;
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const scope = 'playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative user-read-private';
  const RESPONSE_TYPE = 'token';
  const authLink = `${authPath}?client_id=${clientId}&scope=${scope}&redirect_uri=${mainPath}&response_type=${RESPONSE_TYPE}`;
  console.log(authLink);

  useEffect(() => {
    const hash = window.location.hash;
    let localToken = window.localStorage.getItem('spotifyToken');
    if (!localToken && hash) {
      localToken = hash
        .substring(1)
        .split('&')
        .find((element) => element.startsWith('access_token'))
        .split('=')[1];
      console.log(localToken);

      window.location.hash = '';
      window.localStorage.setItem('spotifyToken', localToken);
    }
    if (localToken) {
      props.setToken(localToken);
      props.setLoggedIn(true);
    }
  }, [props]);

  return (
    <div>
      <div
        className='d-flex flex-column justify-content-center align-items-start'
        style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          height: '100vh',
          padding: '5rem',
        }}
      >
        <img src={logo} alt='Logo' className='p-0 m-0' style={{ height: '50px' }} />
        <p className='text-start my-3' style={{ color: 'white', width: '40vw', fontSize: '1.5rem' }}>
          Tune Salad is a Spotify playlist generator based on your preferences. Just login with your Spotify credentials to use it!
        </p>
        <a href={authLink}>
          <button
            className='btn my-3 px-3 border-0 fw-bold'
            style={{ color: 'white', backgroundColor: '#1ed760', borderRadius: 20, width: '18rem', fontSize: '1.5rem' }}
          >
            Login to Spotify
          </button>
        </a>
      </div>
    </div>
  );
};

export default SpotifyLogin;
