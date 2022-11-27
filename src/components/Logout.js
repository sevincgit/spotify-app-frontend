const SpotifyLogout = (props) => {
  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem('spotifyToken');
          props.setToken('');
          props.setLoggedIn(false);
        }}
        className='btn border-0 fw-bold'
        style={{ color: 'white', backgroundColor: 'grey', borderRadius: 20, width: '5rem', fontSize: '1rem' }}
      >
        Logout
      </button>
    </div>
  );
};

export default SpotifyLogout;
