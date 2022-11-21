import { useEffect, useState } from 'react';
import axios from 'axios';


function SpotifyLogin = () => {
    const authPath = process.env.AUTH_ENDPOINT
    const mainPath = process.env.REDIRECT_URI
    const RESPONSE_TYPE = 'token'
    const authLink = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`

    const [token, setToken] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [artists, setArtists] = useState([]);
  
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
        
    </div>

)
}