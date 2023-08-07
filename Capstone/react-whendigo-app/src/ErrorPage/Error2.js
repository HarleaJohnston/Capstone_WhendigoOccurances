import {React, useEffect} from 'react';

const Error2 = () => {

  useEffect(() => {
    require('./DistoredError.css');
  })

  return (
        <div className='TV' >
        <img className="TVsize" src={process.env.PUBLIC_URL + './ErrorTV.gif'}></img>
      </div>

  );
};


export default Error2;