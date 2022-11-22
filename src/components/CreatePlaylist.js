import { useEffect, useState } from 'react';
import axios from 'axios';

const SPOTIFY_API = 'https://api.spotify.com';
const RECOMMENDATIONS_ENDPOINT = `${SPOTIFY_API}/v1/recommendations`;

const CreatePlaylist = (props) => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [newPlaylistId, setNewPlaylistId] = useState('');
  const [addedSongsId, setAddedSongsId] = useState('');

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

  useEffect(() => {
    const listOfSongs = async () => {
      if (!props.spotifyUserID || !newPlaylistId) {
        return;
      }
      try {
        //let playlistToken =  window.localStorage.getItem('spotifyToken')
        //console.log(playlistToken);
        let tracks = `seed_tracks=0c6xIDDpzE81m2q797ordA`;
        let genres = `seed_genres=country`;
        let minPopularity = `min_popularity=80`;
        let maxPopularity = `max_popularity=95`;
        const { data } = await axios.get(
          `${RECOMMENDATIONS_ENDPOINT}?${tracks}&${genres}&${minPopularity}&${maxPopularity}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + props.token,
            },
          }
        );
        console.log(RECOMMENDATIONS_ENDPOINT);
        console.log('token received for playlist', props.token);
        console.log('listOfSongs', data);
        setRecommendedSongs(data.tracks[0].uri);
      } catch (error) {
        console.log(error);
      }
    };
    listOfSongs();
  }, [props.token, props.spotifyUserID, newPlaylistId]);

  //TODO Figure out why we are getting following status: 401, message: 'No token provided'}
  useEffect(() => {
    
    const addSongsToPlaylist = async () => {
    //   if (!props.token || !props.spotifyUserID || !recommendedSongs)  {
    //     return;
    //   }
      try {
        let songsaddedtoplaylisttoken = props.token
     console.log('addsongs function', songsaddedtoplaylisttoken);
        let playlistId = newPlaylistId;
        let trackUri = recommendedSongs;
        const SONGSADDEDTONEWPLAYLIST_ENDPOINT = `${SPOTIFY_API}/v1/playlists/${playlistId}/tracks?position=0&uris=${trackUri}`;
        const { data } = await axios.post(SONGSADDEDTONEWPLAYLIST_ENDPOINT, {
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
