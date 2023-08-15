import React, { useState, useEffect } from 'react';
import Nav from './Nav';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userIdFromStorage = sessionStorage.getItem('userId'); 
    console.log('Fetching user data...');
    fetch(`http://localhost:3666/user/${userIdFromStorage}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('User data:', data);
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div>
      <div>
        <Nav/>
      </div>
      <div>
        {user ? (
          <div>
            <h1>User Profile</h1>
            <p>Email: {user.Gmail}</p>
            <p>Username: {user.UserName}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;