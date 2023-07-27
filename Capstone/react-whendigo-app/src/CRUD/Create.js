import React from 'react'
import { useState } from 'react';

const Create = () => {
    const [date, setDate] = useState('');
    const [body, setBody] = useState('');
    const [img, setImg] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const create = {
        postDate: date,
        postBody: body,
        postImg: img
      };
  
      fetch('http://localhost:3666/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(create)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setDate('');
          setBody('');
          setImg('');
        })
        .catch(error => {
          console.error(error);
        });
    };
  
    return (
      <div className='Row'>
        <h2>Post:</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <br />
          <label>
            Post Body:
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <br />
          <label>
            Img:
            <input
              type="text"
              value={img}
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
