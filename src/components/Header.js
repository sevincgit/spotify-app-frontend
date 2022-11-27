import { Link } from 'react-router-dom';
import SpotifyLogout from './Logout';
import SpotifyUserProfile from './SpotifyUserProfile';
import logo from '../Tune_Salad_Logo.svg';

const Header = (props) => {
  return (
    <div className='d-flex flex-row  align-items-center' style={{ backgroundColor: '#212529' }}>
      <img src={logo} alt='Logo' className='p-0 ms-3' style={{ height: '25px' }} />
      <nav className='navbar d-flex align-items-center flex-grow-1 px-3 navbar-dark bg-dark'>
        <ul className='nav nav-group-1'>
          <li className='nav-item'></li>

          <li className='nav-item'>
            <Link className='navbar-brand mb-0 h1' aria-current='page' to='/'>
              Create Playlist
            </Link>
          </li>
          <li>
            <Link className='navbar-brand mb-0 h2' to='/my-playlists'>
              My Playlists
            </Link>
          </li>
          <li>
            <Link className='navbar-brand mb-0 h2' to='/about'>
              About
            </Link>
          </li>
        </ul>
        <ul className='nav nav-group-1 align-items-center'>
          <li>
            <SpotifyUserProfile token={props.token} spotifyUserID={props.spotifyUserID} setSpotifyUserID={props.setSpotifyUserID} />
          </li>
          <li className='logout-button px-3'>
            <SpotifyLogout setLoggedIn={props.setLoggedIn} setToken={props.setToken} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
