import { Link } from 'react-router-dom';
import SpotifyLogout from './Logout';

const Header = (props) => {
  return (
    <nav className='navbar d-flex space-between  bg-light'>
      <ul className='nav nav-group-1'>
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
      <ul className='nav nav-group-1'>
        <li>
          <SpotifyLogout setLoggedIn={props.setLoggedIn} setToken={props.setToken} />
        </li>
        <li>
          <p>User Info</p>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
