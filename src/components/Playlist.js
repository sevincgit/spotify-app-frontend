import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreatePlaylist from './CreatePlaylist';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';

const Playlist = (props) => {
  const [isPlaylistInDB, setIsPlaylistInDB] = useState(null);
  const [playlistData, setPlaylistData] = useState({});

  let params = useParams();
  let playlistId = params.id;
  let playlistName = params.playlistName;
  console.log(params);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        if (!props.token) {
          return;
        }

        let playlistPath = `${process.env.REACT_APP_SPOTIFYAPP_API}/playlists/${playlistId}`;
        console.log(playlistPath);
        let playlistResponse = await fetch(playlistPath, { mode: 'cors' });

        if (playlistResponse.status === 200) {
          setIsPlaylistInDB(false);
          console.log('fetching playlist data not possible. playlist not created by our app');
          return;
        } else if (playlistResponse.status === 201) {
          setIsPlaylistInDB(true);

          let playlistData = await playlistResponse.json();
          setPlaylistData(playlistData);

          console.log('playlistData: ', playlistData);
          console.log('fetching playlist data created by our app');
        } else {
          // deal with error
          let fetchError = new Error(`Sorry, could not fetch data`);
          throw fetchError;
        }
      } catch (error) {
        console.log('Something went wrong fetching data', error.message);
      }
    };
    fetchPlaylist();
  }, [props.token, playlistId]);

  return (
    <Grid container>
      <Grid className='embedded-playlist' item xs={4} sm={4} md={5} lg={6}>
        <h3 className='m-4'>{playlistName}</h3>
        <iframe
          title={playlistName}
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
          width='80%'
          height='85%'
          frameBorder='0'
          allowfullscreen=''
          allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
          loading='lazy'
        ></iframe>
      </Grid>
      <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
      <Grid item xs={4} sm={4} md={5} lg={4}>
        {isPlaylistInDB && playlistData.data ? (
          <>
            <h3 className='mt-4'>Your Playlist Settings</h3>
            <CreatePlaylist
              token={props.token}
              spotifyUserID={props.spotifyUserID}
              energyValue={[Number(playlistData.data.minenergy), Number(playlistData.data.maxenergy)]}
              tempoValue={[Number(playlistData.data.mintempo), Number(playlistData.data.maxtempo)]}
              danceabilityValue={[Number(playlistData.data.mindanceability), Number(playlistData.data.maxdanceability)]}
              popularityValue={[Number(playlistData.data.minpopularity), Number(playlistData.data.maxpopularity)]}
              genre={playlistData.data.seed_genres}
            />
          </>
        ) : (
          <>
            <Box
              sx={{
                width: '40vw',
                height: '80vh',
              }}
            >
              <h3 className='mt-4'>Playlist was not created by Tune Salad</h3>
            </Box>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Playlist;
