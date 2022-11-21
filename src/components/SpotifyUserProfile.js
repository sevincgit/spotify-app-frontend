import { useEffect, useState } from 'react';
import axios from 'axios';

const SPOTIFY_API = 'https://api.spotify.com';
const USERPROFILE_ENDPOINT = `${SPOTIFY_API}/v1/me`;

const SpotifyUserProfile = (props) => {
  const [spotifyProfileName, setSpotifyProfileName] = useState('');
  const [spotifyUserID, setSpotifyUserID] = useState('');
  const [spotifyUserImageUrl, setSpotifyUserImageUrl] = useState('');

  const myProfile = async () => {
    try {
      const { data } = await axios.get(USERPROFILE_ENDPOINT, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      });
      console.log(USERPROFILE_ENDPOINT);
      console.log('token received', props.token);
      console.log('data', data);
      setSpotifyProfileName(data.display_name);
      setSpotifyUserID(data.id);
      setSpotifyUserImageUrl(data.images[0].url);
    } catch (error) {
      console.log(error);
    }
  };

  myProfile();

  return (
    <div>
      <img src={spotifyUserImageUrl} className='rounded-circle' style={{ height: '50px', width: '50px' }} alt='Avatar' />
      {/* <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' sx={{ width: 24, height: 24 }} /> */}
      <p>{spotifyProfileName}</p>
    </div>
  );
};

export default SpotifyUserProfile;
