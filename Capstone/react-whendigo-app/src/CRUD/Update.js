import React, { useState } from 'react';

function Update() {
  const [itemId, setItemId] = useState('');
  const [updatedItem, setUpdatedItem] = useState({
    postDate: '',
    postBody: '',
    postImg: ''
  });

  const handleInputChange = (e) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:6666/post/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update item');
        }
        console.log('Item updated successfully');
        setUpdatedItem({
          postDate: '',
          postBody: '',
          postImg: ''
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Update Item</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Item ID:
          <input
            type="text"
            name="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="text"
            name="postDate"
            value={updatedItem.postDate}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Post:
          <input
            type="text"
            name="postBody"
            value={updatedItem.postBody}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Img:
          <input
            type="text"
            name="postImg"
            value={updatedItem.postImg}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
}

export default Update;