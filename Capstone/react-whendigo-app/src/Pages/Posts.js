import React, { useEffect, useState } from "react";
import Nav from "./Nav";

const Posts = () => {
  const [items, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3666/post')
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

  const handleLikeDislike = (postId, likeStatus) => {
    const newStatus = likeStatus === "liked" ? null : "liked";
    fetch(`http://localhost:3666/post/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likeStatus: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
      setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, likeStatus: data.post.likeStatus } : post));
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div>
      <div>
        <Nav />
      </div>

      <div className="ContentBox">
        <h2 className="right">Post Feed:</h2>
        <div className="spacer"></div>
        <div className="PostBox">
          {items.map(item => (
            <div key={item.id}>
              <h3>{item.postDate}</h3>
              <p>{item.postImg}</p>
              <p>{item.postBody}</p>
              <p>Likes: {item.likes}</p>
              <p>Dislikes: {item.dislikes}</p>
              <button onClick={() => handleLikeDislike(item.id, item.likeStatus)} disabled={item.likeStatus === "disliked"}>
                {item.likeStatus === "liked" ? "Unlike" : "Like"}
              </button>
              <button onClick={() => handleLikeDislike(item.id, item.likeStatus)} disabled={item.likeStatus === "liked"}>
                {item.likeStatus === "disliked" ? "Undislike" : "Dislike"}
              </button>
            </div>
          ))}
        </div>
        <div className="spacer"></div>
      </div>

    </div>
  )
}

export default Posts;