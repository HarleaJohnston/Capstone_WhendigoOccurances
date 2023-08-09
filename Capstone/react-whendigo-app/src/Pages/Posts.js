import React, { useEffect, useState } from "react";
import Nav from "./Nav";

const Posts = () => {
  const [items, setPosts] = useState([]);
  const userId = sessionStorage.getItem('sessionKey');

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

  const handleLike = (postId, likeStatus) => {
    if (!userId) {
      alert("Please log in to like posts.");
      return;
    }
  
    let newStatus;
    if (likeStatus === "liked") {
      newStatus = "unlike";
    } else {
      newStatus = "like";
    }
  
    fetch(`http://localhost:3666/post/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedPosts = items.map(post => {
            if (post.id === postId) {
              return { ...post, likeStatus: newStatus };
            }
            return post;
          });
          setPosts(updatedPosts);
        } else {
          console.error(data.error);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const handleDislike = (postId, likeStatus) => {
    if (!userId) {
      alert("Please log in to dislike posts.");
      return;
    }
  
    let newStatus;
    if (likeStatus === "disliked") {
      newStatus = "undislike";
    } else {
      newStatus = "dislike";
    }
  
    fetch(`http://localhost:3666/post/${postId}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedPosts = items.map(post => {
            if (post.id === postId) {
              return { ...post, likeStatus: newStatus };
            }
            return post;
          });
          setPosts(updatedPosts);
        } else {
          console.error(data.error);
        }
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
    .then(response => response.json())
    .then(data => {
      setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, bookmarked: data.bookmarked } : post));
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
        <div className="spacer"></div>
        <h2 className="right">Post Feed:</h2>
        <div className="spacer"></div>
        {items.map((item) => {
          const likeStatus = item.likes.includes(userId) ? "liked" : item.dislikes.includes(userId) ? "disliked" : null;

          return (
            <div key={item.id} className="PostBox">
              <h3>{item.postDate}</h3>
              <p>{item.postImg}</p>
              <p>{item.postBody}</p>
              <p>Likes: {item.likes.length}</p>
              <p>Dislikes: {item.dislikes.length}</p>
              {userId && (
                <>
                  <button
                    onClick={() => handleLike(item.id, likeStatus)}
                    disabled={!userId}
                  >
                    {likeStatus === "liked" ? "Unlike" : "Like"}
                  </button>
                  <button
                    onClick={() => handleDislike(item.id, likeStatus)}
                    disabled={!userId}
                  >
                    {likeStatus === "disliked" ? "Undislike" : "Dislike"}
                  </button>
                </>
              )}
              {userId && (
                <button
                  onClick={() => handleBookmark(item.id)}
                  disabled={item.bookmarked}
                >
                  {item.bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              )}
            </div>
          );
        })}
        <div className="spacer"></div>
      </div>
    </div>
  );
};

export default Posts;