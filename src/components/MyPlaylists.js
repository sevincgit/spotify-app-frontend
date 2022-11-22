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
        setMyPlaylists(playlistArray);
        console.log('myPlaylists', myPlaylists);
      } catch (error) {
        console.log(error);
      }
    };
    getPlaylists();
    //TODO: check dependencies
  }, [props.token, getPlaylistsEndpoint]);

  return (
    <div className='my-playlists-container px-3'>
      <Table responsive>
        <thead>
          <tr>
            {Array.from({ length: 3 }).map((_, index) => (
              <th key={index}>{headers[index]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {myPlaylists.map((playlist, index) => {
            //TODO: solve map error in the console
            return (
              <tr>
                {/* TODO: Check why images can't be displayed. Remove playlist cover text */}
                <td key={index}>
                  <img src={playlist.images[0]} style={{ width: '60px' }} alt='playlist cover' />
                </td>
                {/* TODO: How can we make playlist names clickable? After clicking, how can we send the playlist info to the next, individual playlist page? */}
                <td key={index}>{playlist.name}</td>
                <td key={index}>{playlist.tracks.total}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default MyPlaylists;
