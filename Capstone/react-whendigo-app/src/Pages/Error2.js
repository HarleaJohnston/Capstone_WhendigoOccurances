import React from 'react';
import './DistoredError.css';

const Error2 = () => {

  return (
    <body className='background'>
            <div className='TV' >
        <img className="TVsize" src={process.env.PUBLIC_URL + './ErrorTV.gif'}></img>
      </div>
    </body>

  );
};


export default Error2;