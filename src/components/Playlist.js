import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CreatePlaylist from './CreatePlaylist';

const Playlist = (props) => {
  const [isPlaylistInDB, setIsPlaylistInDB] = useState(null);
  let params = useParams();
  let playlistId = params.id;
  let playlistName = params.playlistName;
  console.log(params);

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
        let playlistData = await playlistResponse.json();
        setIsPlaylistInDB(true);
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

  //   TODO: the function to get playlist data from backend.
  //TODO: send the playlist settings to createplaylist component as initial value. If not possible then display parameters as text
  return (
    <div>
      <div className='embedded-playlist'>
        <p>{playlistName}</p>
        <iframe
          title={playlistName}
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
          width='40%'
          height='380'
          frameBorder='0'
          allowfullscreen=''
          allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
          loading='lazy'
        ></iframe>
      </div>
      <div>
        {isPlaylistInDB ? (
          <>
            <h3>Your playlist settings</h3>
            <p>Danceability: 0.3-0.5</p>
            <CreatePlaylist token={props.token} spotifyUserID={props.spotifyUserID} />
          </>
        ) : (
          <p>Playlist not created by our app</p>
        )}
      </div>
    </div>
  );
};

export default Playlist;
