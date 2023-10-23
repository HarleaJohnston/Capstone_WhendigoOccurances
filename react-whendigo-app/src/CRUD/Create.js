import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Create = () => {
  const [date, setDate] = useState('');
  const [body, setBody] = useState('');
  const [img, setImg] = useState(null); 
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    setImg(imageFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postDate', date);
    formData.append('postBody', body);
    formData.append('postImg', img);

    fetch('http://localhost:3666/post/create', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDate('');
        setBody('');
        setImg(null);
        navigate('/UserProfile');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
  <div className='SignLogBox'>
    <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className='Column2'>

            <ol>
            <label>
                Date:
                <input type='text' value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </ol>
            <ol>
              <label>
                Post Body:
                <input type='text' value={body} onChange={(e) => setBody(e.target.value)} />
              </label>
            </ol>
            <ol>
              <label>
                Img:
                <input type='file' accept='image/*' onChange={handleImageUpload} />
              </label>
            </ol>
        <button class="btn btn-primary w-100 py-2" type="submit">Create</button>
        <p class="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
        </div>
      </form>
</div>
  );
};

export default Create;