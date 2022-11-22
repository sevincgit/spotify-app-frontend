import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
const headers = ['Cover', 'Name', '# Tracks'];

const MyPlaylists = (props) => {
  const [myPlaylists, setMyPlaylists] = useState([]);
  const getPlaylistsEndpoint = `${process.env.REACT_APP_SPOTIFY_API}/v1/users/${props.spotifyUserID}/playlists?limit=50&offset=0`;
  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const playlistResponse = await axios.get(getPlaylistsEndpoint, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + props.token,
          },
        });
        const playlistArray = playlistResponse.data.items;
        //   TODO: Find a way to retrieve all playlists by using offset parameter
        const totalNumberOfPlaylists = playlistResponse.data.total;
        console.log('totalNumberOfPlaylists: ', totalNumberOfPlaylists);
        // Check if user has a playlist to avoid getPlaylist() to be called always
        if (totalNumberOfPlaylists > 0) {
          setMyPlaylists(playlistArray);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // Run getPlaylists() only when the state is empty
    if (myPlaylists.length === 0) {
      getPlaylists();
    }
    console.log('myPlaylists:', myPlaylists);

    //TODO: check dependencies
  }, [props.token, getPlaylistsEndpoint, setMyPlaylists, myPlaylists]);

  return (
    <div className='my-playlists-container px-3'>
      <Table responsive>
        <thead>
          <tr>
            {Array.from({ length: 3 }).map((_, index) => (
              <th key={`header-${index}`}>{headers[index]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {myPlaylists.map((playlist, index) => {
            return (
              <tr>
                <td>
                  <img src={playlist.images[0].url} style={{ width: '60px' }} alt='playlist cover' />
                </td>
                {/* TODO: How can we make playlist names clickable? After clicking, how can we send the playlist info to the next, individual playlist page? */}
                <td>{playlist.name}</td>
                <td>{playlist.tracks.total}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default MyPlaylists;
