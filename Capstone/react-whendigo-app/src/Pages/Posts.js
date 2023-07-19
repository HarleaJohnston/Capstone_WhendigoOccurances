import React, { useEffect, useState } from "react";
import Nav from "./Nav";


const Posts = () => {

  const [items, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:666/post')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
        <div>
            <Nav/>
        </div>

            <div className="box">
          <h2>Post Feed:</h2>
          {items.map(item => (
            <div key={item.id}>
              <p>{item.postDate}</p>
              <p>{item.postBody}</p>
              <p>{item.postImg}</p>
            </div>
          ))}
        </div>

    </div>
  )
}

export default Posts