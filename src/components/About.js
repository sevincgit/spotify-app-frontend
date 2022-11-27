import logo from '../Tune_Salad_Logo.svg';

const About = () => {
  return (
    <div className='my-5 d-flex flex-column align-items-center'>
      <img src={logo} alt='Logo' className='p-0 m-3' style={{ height: '25px' }} />
      <p>This is our final project that we created for Fullstack Intensive Bootcamp.</p>
      <p style={{ width: '30vw' }}>
        Tune salad is a playlist generator that takes your input on audio features and genre, and create a playlist on your spotify account. Just
        login with your Spotify credentials to use it!
      </p>
      <p>Coded with love ❤️ </p>
      <p>Victoria & Sevinc</p>
    </div>
  );
};

export default About;
