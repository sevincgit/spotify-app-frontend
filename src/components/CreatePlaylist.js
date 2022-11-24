import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material';
import { spotifyGenres } from './SpotifyGenres';

const SPOTIFY_API = 'https://api.spotify.com';
const RECOMMENDATIONS_ENDPOINT = `${SPOTIFY_API}/v1/recommendations`;

const CreatePlaylist = (props) => {
  const [recommendedSongs, setRecommendedSongs] = useState('');
  const [newPlaylistId, setNewPlaylistId] = useState('');
  const [addedSongsId, setAddedSongsId] = useState('');
  const [energyValue, setEnergyValue] = useState([0.3, 0.5]);
  const [tempoValue, setTempoValue] = useState([90, 120]);
  const [popularityValue, setPopularityValue] = useState([50, 80]);
  const [danceabilityValue, setDanceabilityValue] = useState([0.3, 0.5]);
  const [genre, setGenre] = useState('');

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
      console.log(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const listOfSongs = async () => {
      if (!props.spotifyUserID || !newPlaylistId) {
        return;
      }
      console.log(energyValue);
      console.log(tempoValue);
      try {
        let genres = `seed_genres=${genre}`;
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
        const songsArray = data.tracks.map((track) => track.uri);
        console.log(songsArray);
        setRecommendedSongs(songsArray.join(','));
      } catch (error) {
        console.log(error);
      }
    };
    listOfSongs();
  }, [props.token, props.spotifyUserID, newPlaylistId, energyValue, danceabilityValue, genre, tempoValue, popularityValue]);

  useEffect(() => {
    const addSongsToPlaylist = async () => {
      if (!props.token || !props.spotifyUserID || !recommendedSongs) {
        return;
      }
      try {
        console.log(recommendedSongs);
        const { data } = await axios.post(`https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`, '', {
          params: {
            uris: recommendedSongs,
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + props.token,
          },
        });
        console.log('Songs added to new playlist', data);
        console.log('New playlist id', newPlaylistId);
        setAddedSongsId(data.snapshot_id);
      } catch (error) {
        console.log(error);
      }
    };
    addSongsToPlaylist();
  }, [props.token, props.spotifyUserID, newPlaylistId, recommendedSongs]);

  useEffect(() => {
    const sendNewPlaylistDataToBE = async () => {
      if (!props.token || !props.spotifyUserID || !newPlaylistId || !recommendedSongs || !addedSongsId) {
        return;
      }
      let newPlaylistData = {
        id: newPlaylistId,
        mintempo: tempoValue[0],
        maxtempo: tempoValue[1],
        minpopularity: popularityValue[0],
        maxpopularity: popularityValue[1],
        minenergy: energyValue[0],
        maxenergy: energyValue[1],
        mindanceability: danceabilityValue[0],
        maxdanceability: danceabilityValue[1],
        seed_genres: genre,
        userid: props.spotifyUserID,
      };

      let playlistsPath = `${process.env.REACT_APP_SPOTIFYAPP_API}/playlists`;
      try {
        let response = await fetch(playlistsPath, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(newPlaylistData),
        });
        console.log('response', response);
        let responseData = await response.json();
        console.log('responseData', responseData);
        if (response.status === 201) {
          console.log('new playlist saved');
        }
        console.log('saving playlist to db');
      } catch (error) {
        console.log(error);
      }
    };
    sendNewPlaylistDataToBE();
  }, [
    props.token,
    props.spotifyUserID,
    newPlaylistId,
    recommendedSongs,
    addedSongsId,
    energyValue,
    danceabilityValue,
    genre,
    tempoValue,
    popularityValue,
  ]);

  return (
    //TODO:  link to our last component Individual Playlist
    //TODO: Genre border color, slider tags bold
    <div className='d-flex justify-content-center'>
      <Box sx={{ width: 500, height: 300, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2 }}>
          Danceability
        </Typography>
        <Slider
          getAriaLabel={() => 'Danceability range'}
          value={danceabilityValue}
          onChange={(e) => setDanceabilityValue(e.target.value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay='auto'
          sx={{ color: '#1ed760' }}
        />
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2 }}>
          Popularity
        </Typography>
        <Slider
          getAriaLabel={() => 'Popularity range'}
          value={popularityValue}
          onChange={(e) => setPopularityValue(e.target.value)}
          min={0}
          max={100}
          step={10}
          valueLabelDisplay='auto'
          sx={{ color: '#1ed760' }}
        />
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2 }}>
          Energy
        </Typography>
        <Slider
          getAriaLabel={() => 'Energy range'}
          value={energyValue}
          onChange={(e) => setEnergyValue(e.target.value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay='auto'
          sx={{ color: '#1ed760' }}
        />
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2 }}>
          Tempo
        </Typography>
        <Slider
          getAriaLabel={() => 'Tempo range'}
          value={tempoValue}
          onChange={(e) => setTempoValue(e.target.value)}
          valueLabelDisplay='auto'
          min={50}
          max={250}
          step={10}
          sx={{ color: '#1ed760' }}
        />
        <FormControl fullWidth sx={{ py: 2 }}>
          <InputLabel id='genre-label' sx={{ py: 1 }}>
            Genre
          </InputLabel>
          <Select labelId='genre-label' id='genre-select' value={genre} label='Age' onChange={(e) => setGenre(e.target.value)}>
            {spotifyGenres.map((genre) => {
              return <MenuItem value={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <button variant={'contained'} onClick={createNewPlaylist} className='btn my-3 px-3 border-0 fw-bold' style={{ backgroundColor: '#1ed760' }}>
          Create new playlist
        </button>
      </Box>
    </div>
  );
};

export default CreatePlaylist;
