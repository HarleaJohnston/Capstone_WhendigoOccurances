import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Update() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [updatedItem, setUpdatedItem] = useState({
    postDate: '',
    postBody: '',
    postImg: null,
  });

  useEffect(() => {
    fetch(`http://localhost:3666/post/${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatedItem({
          postDate: data.postDate,
          postBody: data.postBody,
          postImg: null,
        });
      })
      .catch((error) => {
        console.error('Error fetching item data:', error);
      });
  }, [itemId]);

  const handleInputChange = (e) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    setUpdatedItem((prevItem) => ({
      ...prevItem,
      postImg: imageFile,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('postDate', updatedItem.postDate);
    formData.append('postBody', updatedItem.postBody);
    formData.append('postImg', updatedItem.postImg);

    fetch(`http://localhost:3666/post/update/${itemId}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update item');
        }
        console.log('Item updated successfully');
        setUpdatedItem({
          postDate: '',
          postBody: '',
          postImg: null,
        });
        navigate('/UserProfile');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='Row'>
      <h2>Update Item</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Date:
          <input type='text' name='postDate' value={updatedItem.postDate} onChange={handleInputChange}/>
        </label>
        <br />
        <label>
          Post:
          <input type='text' name='postBody' value={updatedItem.postBody} onChange={handleInputChange}/>
        </label>
        <br />
        <label>
          Img:
          <input type='file' accept='image/*' onChange={handleImageUpload}/>
        </label>
        <br />
        <button type='submit'>Update Item</button>
      </form>
    </div>
  );
}

export default Update;