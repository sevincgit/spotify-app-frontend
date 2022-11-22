import { useEffect, useState } from 'react';

const SpotifyLogin = (props) => {
  const authPath = process.env.REACT_APP_AUTH_ENDPOINT;
  console.log(authPath);
  const mainPath = process.env.REACT_APP_REDIRECT_URI;
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const scope = 'playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative user-read-private'
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
      <h2> Logo </h2>
      <p> Short description </p>
      <a href={authLink}>
        <button className='spotify-login-button'>Login to Spotify </button>
      </a>
    </div>
  );
};

export default SpotifyLogin;
