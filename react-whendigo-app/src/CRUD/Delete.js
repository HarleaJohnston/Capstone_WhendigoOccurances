import React from 'react'
import {useState} from 'react'

const Delete = () => {
    const [itemId, setItemId] = useState('');

    const handleInputChange = (e) => {
      setItemId(e.target.value);
    };
  
    const handleDelete = (e) => {
      e.preventDefault();
      fetch(`http://localhost:3666/post/delete/${itemId}`, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete item');
          }
          console.log('Item deleted successfully');
          setItemId('');
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    return (
      <div>
        <h2>Delete Item</h2>
        <form onSubmit={handleDelete}>
          <label>
            Item ID:
            <input
              type="text"
              name="itemId"
              value={itemId}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="submit">Delete Item</button>
        </form>
      </div>
    );
  }


export default Delete