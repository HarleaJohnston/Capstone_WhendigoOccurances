import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3666/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('sessionKey', data.key);
        sessionStorage.setItem('userId', data.userId);
        navigate('/');
      } else {
        console.log('Login failed:', data.Message);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div className='SignLogBox'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div class="form-floating">
              <input type="email" class="form-control" id="floatingInput" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"/>
              <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
              <input type="password" class="form-control" id="floatingPassword" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Password"/>
              <label for="floatingPassword">Password</label>
            </div>
            <button class="btn btn-primary w-100 py-2" type="submit">Login</button>
            <p class="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
          </form>
    </div>
  );
};

export default Login;