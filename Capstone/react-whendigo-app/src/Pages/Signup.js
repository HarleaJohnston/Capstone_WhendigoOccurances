import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
        sessionStorage.setItem('sessionKey', data.key);
        navigate('/');
      } else {
        console.log('Signup failed:', data.Message);
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <div className='SignLogBox'>
      <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div class="form-floating">
            <input type="email" class="form-control" id="floatingInput" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"/>
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating">
            <input type="username" class="form-control" id="floatingPassword" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
            <label for="floatingPassword">Username</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Password"/>
            <label for="floatingPassword">Password</label>
          </div>
          <button class="btn btn-primary w-100 py-2" type="submit">Sign Up</button>
          <p class="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
        </form>
    </div>
  );
};

export default Signup;