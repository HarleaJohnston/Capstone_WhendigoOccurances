import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateUser() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [updatedUser, setUpdatedUser] = useState({
    Bio: '',
    UserName: '',
    Img: null,
    Name: '',
  });

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    fetch(`http://localhost:3666/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setUpdatedUser(data); 
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUpdatedUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageUpload = e => {
    const imageFile = e.target.files[0];
    setUpdatedUser(prevUser => ({
      ...prevUser,
      Img: imageFile,
    }));
  };

  const handleUpdateClick = () => {
    const userId = sessionStorage.getItem('userId');
    const formData = new FormData();
    formData.append('Bio', updatedUser.Bio);
    formData.append('UserName', updatedUser.UserName);
    formData.append('Name', updatedUser.Name);
    formData.append('Img', updatedUser.Img); 

    fetch(`http://localhost:3666/user/${userId}`, {
      method: 'PUT',
      body: formData, 
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Updated user data:', data);
        setUser(data);
        navigate('/UserProfile');
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });

  };

  return (
    <div className='Row'>
      {user ? (
        <div>
          <h2>Update User</h2>
          <label>
            Username:
          <input type='text' name='UserName' value={updatedUser.UserName} onChange={handleInputChange}/>
          </label>
          <label>
            Bio:
          <input type='text' name='Bio' value={updatedUser.Bio} onChange={handleInputChange}/>
          </label>
          <label>
            Profile Pic:
            <input type='file' accept='image/*' onChange={handleImageUpload} />
          </label>
          <label>
            Pronouns:
          <input type='text' name='Name' value={updatedUser.Name} onChange={handleInputChange}/>
          </label>
          <button onClick={handleUpdateClick}>Update</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UpdateUser;