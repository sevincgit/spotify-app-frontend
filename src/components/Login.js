import { useEffect, useState } from 'react';

const SpotifyLogin = () => {
    const authPath = process.env.REACT_APP_AUTH_ENDPOINT
    console.log(authPath);
    const mainPath = process.env.REACT_APP_REDIRECT_URI
    const clientId = process.env.REACT_APP_CLIENT_ID
    const RESPONSE_TYPE = 'token'
    const authLink = `${authPath}?client_id=${clientId}&redirect_uri=${mainPath}&response_type=${RESPONSE_TYPE}`
    console.log(authLink);
    const [token, setToken] = useState('');
  
    useEffect(() => {
      const hash = window.location.hash;
      let token = window.localStorage.getItem('token');
      if (!token && hash) {
        token = hash
          .substring(1)
          .split('&')
          .find((element) => element.startsWith('access_token'))
          .split('=')[1];
        console.log(token);
  
        // window.location.hash = '';
        window.localStorage.setItem('token', token);
      }
      setToken(token);
    }, []);
  
return (
    <div>
        <h2> Logo </h2>
        <p> Short description </p>
        <a href={authLink}>Login to Spotify</a> 
    </div>
)
}

export default SpotifyLogin;