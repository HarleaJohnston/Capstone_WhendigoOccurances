import React from 'react'
import { useState } from 'react';

const Create = () => {
    const [postDate, setPostDate] = useState('');
    const [postBody, setPostBody] = useState('');
    const [postImg, setImg] = useState('');
    const [type, setType] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const create = {
        postDate: postDate,
        postBody: postBody,
        postImg: postImg
      };
  
      fetch('http://localhost:666/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(create)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Clear the form fields
          setPostDate('');
          setPostBody('');
          setImg('');
          setType('');
        })
        .catch(error => {
          console.error(error);
        });
    };
  
    return (
      <div>
        <h2>Create Gay Item</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Post Date:
            <input
              type="text"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
            />
          </label>
          <br />
          <label>
            Body:
            <input
              type="text"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
            />
          </label>
          <br />
          <label>
            Image(Optional):
            <input
              type="text"
              value={postImg}
              onChange={(e) => setImg(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
export default Create;
