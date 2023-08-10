import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState('');
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
          adminKey: adminKey,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('sessionKey', data.key);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('adminKey', data.adminKey);
        navigate('/');
      } else {
        console.log('Login failed:', data.Message);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div className='Row'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <label>Admin Key:</label>
        <input type="text" value={adminKey} onChange={(e) => setAdminKey(e.target.value)}/>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;