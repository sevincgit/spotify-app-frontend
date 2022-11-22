import { useEffect, useState } from 'react';
import axios from 'axios';

const SPOTIFY_API = 'https://api.spotify.com';
const USERPROFILE_ENDPOINT = `${SPOTIFY_API}/v1/me`;

const SpotifyUserProfile = (props) => {
  const [spotifyProfileName, setSpotifyProfileName] = useState('');
  const [spotifyUserID, setSpotifyUserID] = useState('');
  const [spotifyUserImageUrl, setSpotifyUserImageUrl] = useState('');

  useEffect(() => {
    const myProfile = async () => {
      if (!props.token) {
        return;
      }
      console.log('getting spotify profile');
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
  }, [props.token]);

  useEffect(() => {
    const saveUserData = async () => {
      if (!spotifyUserID || !spotifyProfileName) {
        return;
      }
      console.log('saving user to db');
      const currentUserData = {
        id: spotifyUserID,
        username: spotifyProfileName,
      };
      let usersPath = `${process.env.REACT_APP_SPOTIFYAPP_API}/users`;
      try {
        let response = await fetch(usersPath, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(currentUserData),
        });
        console.log('response', response);
        let responseData = await response.json();
        console.log('responseData', responseData);
        if (response.status === 201) {
          console.log('new user saved');
        }
      } catch (error) {
        console.log(error);
      }
    };
    saveUserData();
  }, [spotifyProfileName, spotifyUserID]);

  return (
    <div>
      <img src={spotifyUserImageUrl} className='rounded-circle' style={{ height: '40px', width: '50px' }} alt='Avatar' />
      {/* <Avatar alt='User image' src={spotifyUserImageUrl} sx={{ width: 24, height: 24 }} /> */}
      <p>{spotifyProfileName}</p>
    </div>
  );
};

export default SpotifyUserProfile;
