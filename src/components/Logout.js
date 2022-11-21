const SpotifyLogout = (props) => {
  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem('spotifyToken');
          props.setToken('');
          props.setLoggedIn(false);
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default SpotifyLogout;
