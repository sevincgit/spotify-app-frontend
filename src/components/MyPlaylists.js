import axios from 'axios';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link, useParams } from 'react-router-dom';
import background from '../background.jpg';
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
        //   TODO: BONUS: Find a way to retrieve all playlists by using offset parameter
        const totalNumberOfPlaylists = playlistResponse.data.total;
        console.log('playlistResponse: ', playlistResponse);
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
              <tr key={`playlist-${index}`}>
                <td>
                  {playlist.tracks.total === 0 ? (
                    <p>No Image</p>
                  ) : (
                    <img src={playlist.images[0].url} style={{ width: '60px' }} alt='playlist cover' />
                  )}
                </td>
                <td>
                  <Link to={`/my-playlists/${playlist.id}/${playlist.name}`}>{playlist.name}</Link>
                </td>
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
