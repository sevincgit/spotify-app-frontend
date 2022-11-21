import { Link } from 'react-router-dom';
import SpotifyLogout from './Logout';
import SpotifyUserProfile from './SpotifyUserProfile';

const Header = (props) => {
  return (
    <nav className='navbar d-flex space-between px-3 bg-light'>
      <ul className='nav nav-group-1'>
        <li className='nav-item'>
          <p>LOGO</p>
        </li>

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
          <SpotifyUserProfile token={props.token} />
        </li>
        <li className='logout-button px-3'>
          <SpotifyLogout setLoggedIn={props.setLoggedIn} setToken={props.setToken} />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
