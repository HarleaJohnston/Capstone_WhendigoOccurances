import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3666/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.key) {
        // Save the key in the session storage or local storage for later use
        sessionStorage.setItem('sessionKey', data.key);

        // Navigate to the home page after successful signup
        history.push('/'); // Navigate to the home page without page reload
      } else {
        console.log('Signup failed:', data.Message);
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <div className='Row'>
      <h2>Sign-Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Username:</label>
          <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;