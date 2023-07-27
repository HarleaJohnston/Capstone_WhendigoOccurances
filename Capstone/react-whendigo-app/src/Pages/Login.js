import React from 'react';

const Login = () => {

  return (
    <div className='Row'>
      <h2>Login</h2>
      <form >
        <div>
          <label>Email:</label>
          <input type="email"  />
        </div>
        <div>
          <label>Username:</label>
          <input type="username"  />
        </div>
        <div>
          <label>Password:</label>
          <input type="password"  />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};


export default Login;