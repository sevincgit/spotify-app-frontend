import { useState } from 'react';

const SpotifyLogout = (props) => {
  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          props.setLoggedIn(false);
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default SpotifyLogout;
