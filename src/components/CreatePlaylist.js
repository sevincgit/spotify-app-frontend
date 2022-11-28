import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material';
import { borders } from '@mui/system';
import { spotifyGenres } from './SpotifyGenres';
import { Link } from 'react-router-dom';

const SPOTIFY_API = 'https://api.spotify.com';
const RECOMMENDATIONS_ENDPOINT = `${SPOTIFY_API}/v1/recommendations`;

const CreatePlaylist = (props) => {
  const [recommendedSongs, setRecommendedSongs] = useState('');
  const [newPlaylistId, setNewPlaylistId] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [addedSongsId, setAddedSongsId] = useState('');
  const [energyValue, setEnergyValue] = useState(props.energyValue ? props.energyValue : [0.4, 0.8]);
  const [tempoValue, setTempoValue] = useState(props.tempoValue ? props.tempoValue : [100, 140]);
  const [popularityValue, setPopularityValue] = useState(props.popularityValue ? props.popularityValue : [60, 100]);
  const [danceabilityValue, setDanceabilityValue] = useState(props.danceabilityValue ? props.danceabilityValue : [0.4, 0.8]);
  const [genre, setGenre] = useState(props.genre ? props.genre : '');
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  console.log('energyValue', energyValue);
  console.log('popularityValue', popularityValue);

  const listOfSongs = async () => {
    if (!props.spotifyUserID || !props.token) {
      return;
    }
    setAddedSongsId('');
    setError(null);
    setErrorMessage('');
    if (!genre) {
      setError(true);
      setErrorMessage('Please select a genre.');
      setAddedSongsId('');
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
      console.log(RECOMMENDATIONS_ENDPOINT);
      console.log(recommendationPath);
      console.log('token received for playlist', props.token);

      const recommendationResponse = await axios.get(recommendationPath, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      });
      if (recommendationResponse.status === 200) {
        const recommendationData = recommendationResponse.data;
        if (recommendationData.tracks.length === 0) {
          setError(true);
          setErrorMessage('Spotify could not find any song with these audio features. Please try again.');
          setAddedSongsId('');
          return;
        }
        console.log('recommendationResponse', recommendationResponse);
        console.log('recommendedData', recommendationData);
        console.log('recommendedTracks', recommendationData.tracks);

        const songsArray = recommendationData.tracks.map((track) => track.uri);
        console.log(songsArray);
        setRecommendedSongs(songsArray.join(','));
      } else {
        setError(true);
        setErrorMessage('Sorry, the songs could not be fetched');
        setAddedSongsId('');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const createNewPlaylist = async () => {
      if (!props.spotifyUserID || !recommendedSongs) {
        return;
      }
      // setAddedSongsId('');
      // setError(null);
      // setErrorMessage('');
      // if (!genre) {
      //   setError(true);
      //   setErrorMessage('Please select a genre.');
      //   setAddedSongsId('');
      //   return;
      // }
      let userId = props.spotifyUserID;
      console.log(userId);
      try {
        console.log('create new playlist', props.token);
        const NEWPLAYLIST_ENDPOINT = `${SPOTIFY_API}/v1/users/${userId}/playlists`;
        const { data } = await axios.post(
          NEWPLAYLIST_ENDPOINT,
          {
            name: 'Your Tune Salad playlist',
            description: 'Playlist description',
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
        setNewPlaylistName(data.name);
        console.log('NewPlaylistId: ', newPlaylistId);
        console.log('NewPlaylistName: ', newPlaylistName);
      } catch (error) {
        console.log(error);
      }
    };
    createNewPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedSongs]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPlaylistId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedSongsId]);

  return (
    <div className='d-flex justify-content-center'>
      <Box
        sx={{
          width: '40vw',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          border: 3,
          padding: 3,
          margin: 2,
          borderRadius: '12px',
        }}
      >
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2, fontWeight: 'bold' }}>
          Danceability
        </Typography>
        <Slider
          getAriaLabel={() => 'Danceability range'}
          value={danceabilityValue}
          onChange={(e) => setDanceabilityValue(e.target.value)}
          min={0}
          max={1}
          step={0.2}
          valueLabelDisplay='auto'
          sx={{ color: '#1ed760' }}
        />
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2, fontWeight: 'bold' }}>
          Popularity
        </Typography>
        <Slider
          getAriaLabel={() => 'Popularity range'}
          value={popularityValue}
          onChange={(e) => setPopularityValue(e.target.value)}
          min={0}
          max={100}
          step={20}
          valueLabelDisplay='auto'
          sx={{ color: '#1ed760' }}
        />
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2, fontWeight: 'bold' }}>
          Energy
        </Typography>
        <Slider
          getAriaLabel={() => 'Energy range'}
          value={energyValue}
          onChange={(e) => setEnergyValue(e.target.value)}
          min={0}
          max={1}
          step={0.2}
          valueLabelDisplay='auto'
          sx={{ color: '#1ed760' }}
        />
        <Typography gutterBottom sx={{ textAlign: 'left', py: 2, fontWeight: 'bold' }}>
          Tempo
        </Typography>
        <Slider
          getAriaLabel={() => 'Tempo range'}
          value={tempoValue}
          onChange={(e) => setTempoValue(e.target.value)}
          valueLabelDisplay='auto'
          min={50}
          max={250}
          step={20}
          sx={{ color: '#1ed760' }}
        />
        <FormControl required fullWidth sx={{ py: 2 }}>
          <InputLabel id='genre-label' sx={{ py: 1, fontWeight: 'bold' }}>
            Genre
          </InputLabel>
          <Select labelId='genre-label' id='genre-select' value={genre} label='Age' onChange={(e) => setGenre(e.target.value)}>
            {spotifyGenres.map((genre, index) => {
              return (
                <MenuItem value={genre} key={index}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <button variant={'contained'} onClick={listOfSongs} className='btn my-3 px-3 border-0 fw-bold' style={{ backgroundColor: '#1ed760' }}>
          Create new playlist
        </button>
        {error ? <p>{errorMessage}</p> : null}
        {addedSongsId ? <Link to={`/my-playlists/${newPlaylistId}/${newPlaylistName}`}>Go to your playlist!</Link> : null}
      </Box>
    </div>
  );
};

export default CreatePlaylist;
