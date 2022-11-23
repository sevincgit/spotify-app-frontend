import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Slider } from '@mui/material';

const SPOTIFY_API = 'https://api.spotify.com';
const RECOMMENDATIONS_ENDPOINT = `${SPOTIFY_API}/v1/recommendations`;

const CreatePlaylist = (props) => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [newPlaylistId, setNewPlaylistId] = useState('');
  const [addedSongsId, setAddedSongsId] = useState('');
  const [energyValue, setEnergyValue] = useState([0.3, 0.5]);
  const [tempoValue, setTempoValue] = useState([90, 120]);
  const [popularityValue, setPopularityValue] = useState([50, 80])
  const [danceabilityValue, setDanceabilityValue] = useState ([0.3, 0.5])

  const createNewPlaylist = async () => {
    if (!props.spotifyUserID || !props.token) {
      return;
    }
    let userId = props.spotifyUserID;
    console.log(userId);
    try {
      console.log('create new playlist', props.token);
      const NEWPLAYLIST_ENDPOINT = `${SPOTIFY_API}/v1/users/${userId}/playlists`;
      const { data } = await axios.post(
        NEWPLAYLIST_ENDPOINT,
        {
          name: 'New Playlist',
          description: 'New playlist description',
          public: false,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + props.token,
          },
        }
      );
      console.log(NEWPLAYLIST_ENDPOINT);
      console.log('token received', props.token);
      console.log('playlist data', data);
      setNewPlaylistId(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  const listOfSongs = async () => {
    // if (!props.spotifyUserID || !newPlaylistId) {
    //   return;
    // }
    console.log(energyValue);
    console.log(tempoValue);
    try {
      // let tracks = `seed_tracks=0c6xIDDpzE81m2q797ordA`;
      let genres = `seed_genres=country`;
      let minPopularity = `min_popularity=${popularityValue[0]}`;
      let maxPopularity = `max_popularity=${popularityValue[1]}`;
      let minEnergy = `min_energy=${energyValue[0]}`;
      let maxEnergy = `max_energy=${energyValue[1]}`;
      let minTempoValue = `min_tempo=${tempoValue[0]}`;
      let maxTempoValue = `max_tempo=${tempoValue[1]}`;
      let minDanceability = `min_danceability=${danceabilityValue[0]}`;
      let maxDanceability = `max_danceability=${danceabilityValue[1]}`;

      let recommendationPath = `${RECOMMENDATIONS_ENDPOINT}?${genres}&${minDanceability}&${maxDanceability}&${minPopularity}&${maxPopularity}&${minEnergy}&${maxEnergy}&${minTempoValue}&${maxTempoValue}`;
      console.log(recommendationPath);

      const { data } = await axios.get(recommendationPath, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      });
      console.log(RECOMMENDATIONS_ENDPOINT);
      console.log('token received for playlist', props.token);
      console.log('listOfSongs', data);
      setRecommendedSongs(data.tracks[0].uri);
    } catch (error) {
      console.log(error);
    }
  };
  // listOfSongs();
  // }, [props.token, props.spotifyUserID, newPlaylistId, energyValue]);

  //TODO Figure out why we are getting following status: 401, message: 'No token provided'}
  useEffect(() => {
    const addSongsToPlaylist = async () => {
      //   if (!props.token || !props.spotifyUserID || !recommendedSongs)  {
      //     return;
      //   }
      try {
        let songsaddedtoplaylisttoken = props.token;
        console.log('addsongs function', songsaddedtoplaylisttoken);
        let playlistId = newPlaylistId;
        let trackUri = recommendedSongs;
        const SONGSADDEDTONEWPLAYLIST_ENDPOINT = `${SPOTIFY_API}/v1/playlists/${playlistId}/tracks?position=0&uris=${trackUri}`;
        const { data } = await axios.post('https://api.spotify.com/v1/playlists/5FNTx6USaRqBjL9T3G4z04/tracks', '', {
          params: {
            uris: 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS',
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + props.token,
          },
        });
        console.log(SONGSADDEDTONEWPLAYLIST_ENDPOINT);
        console.log('Songs added to new playlist', data);
        setAddedSongsId(data.snapshot_id);
      } catch (error) {
        console.log(error);
      }
    };
    addSongsToPlaylist();
  }, [props.token, props.spotifyUserID, newPlaylistId, recommendedSongs]);

  return (
    <div>
      <Box sx={{ width: 300 }}>
       <Slider
          getAriaLabel={() => 'Danceability range'} 
          value={danceabilityValue}
          onChange={(e) => setDanceabilityValue(e.target.value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay='auto'
        />
        <Slider
          getAriaLabel={() => 'Popularity range'} 
          value={popularityValue}
          onChange={(e) => setPopularityValue(e.target.value)}
          min={0}
          max={100}
          step={10}
          valueLabelDisplay='auto'
        />
        <Slider
          getAriaLabel={() => 'Energy range'}        //aria-label='Energy'
          value={energyValue}
          onChange={(e) => setEnergyValue(e.target.value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay='auto'
        />
        <Slider
          getAriaLabel={() => 'Tempo range'}
          value={tempoValue}
          //aria-label='Tempo'
          onChange={(e) => setTempoValue(e.target.value)}
          valueLabelDisplay='auto'
          min={50}
          max={250}
          step={10}
        />
      </Box>
      <button
        onClick={() => {
          listOfSongs();
          console.log('Click on button');
        }}
      >
        Get recommended songs
      </button>
      <button variant={'contained'} onClick={createNewPlaylist}>
        Create new playlist
      </button>
      <p>{recommendedSongs}</p>
      <p>{newPlaylistId}</p>
      <p>{addedSongsId}</p>
    </div>
  );
};

export default CreatePlaylist;
