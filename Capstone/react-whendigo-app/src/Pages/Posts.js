import React, { useEffect, useState } from "react";
import Nav from "./Nav";

const Posts = ({ userId }) => {
  const [items, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3666/post")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((data) => {
        const postsWithArrays = data.map((item) => ({
          ...item,
          likes: item.likes || [],
          dislikes: item.dislikes || [],
        }));
        setPosts(postsWithArrays);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLikeDislike = (postId, likeStatus) => {
    if (!userId) {
      alert("Please log in to like or dislike posts.");
      return;
    }

    const newStatus = likeStatus === "liked" ? null : "liked";

    fetch(`http://localhost:3666/post/${postId}/${likeStatus}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
      setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, likeStatus: data.post.likeStatus } : post));
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleBookmark = (postId) => {
    if (!userId) {
      alert("Please log in to bookmark posts.");
      return;
    }
  
    const newBookmarkedStatus = !items.find((item) => item.id === postId).bookmarked;
  
    fetch(`http://localhost:3666/post/${postId}/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookmarked: newBookmarkedStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, bookmarked: data.bookmarked } : post
          )
        );
      })
      .catch((error) => {
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
            {items.map((item) => (
              <div key={item.id}>
                <h3>{item.postDate}</h3>
                <p>{item.postImg}</p>
                <p>{item.postBody}</p>
                <p>Likes: {item.likes.length}</p>
                <p>Dislikes: {item.dislikes.length}</p>
                {userId && (
                  <>
                    <button
                      onClick={() => handleLikeDislike(item.id, item.likeStatus)}
                      disabled={
                        item.likeStatus === "disliked" || item.likes.includes(userId)
                      }
                    >
                      {item.likeStatus === "liked" ? "Unlike" : "Like"}
                    </button>
                    <button
                      onClick={() => handleLikeDislike(item.id, item.likeStatus)}
                      disabled={
                        item.likeStatus === "liked" || item.dislikes.includes(userId)
                      }
                    >
                      {item.likeStatus === "disliked" ? "Undislike" : "Dislike"}
                    </button>
                  </>
                )}
                {userId && (
                  <button onClick={() => handleBookmark(item.id)} disabled={item.bookmarked}>
                    {item.bookmarked ? "Bookmarked" : "Bookmark"}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="spacer"></div>
        </div>
      </div>
    );
  };

export default Posts;