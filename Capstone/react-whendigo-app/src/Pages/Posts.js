import React, { useEffect, useState } from "react";
import Nav from "./Nav";

const Posts = () => {
  const [items, setPosts] = useState([]);
  const [itemImg, setItemImg] = useState("");
  const userId = sessionStorage.getItem('userId');
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});

  useEffect(() => {
    console.log(items);
  }, [items]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3666/user/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
  
    if (userId) {
      fetchUser();
    }
  }, [userId]);

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
          bookmarked: item.bookmarked || []
        }));
        setPosts(postsWithArrays);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchCommentsForPosts = async () => {
      try {
        const updatedCommentsMap = {};

        await Promise.all(
          items.map(async (item) => {
            const response = await fetch(`http://localhost:3666/post/${item._id}/comments`);
            const commentsData = await response.json();
            updatedCommentsMap[item._id] = commentsData;
          })
        );

        setCommentsMap(updatedCommentsMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommentsForPosts();
  }, [items]);


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
              console.log(postId)
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

  const handleBookmark = async (postId, bookmarkedStatus) => {
    if (!userId) {
      alert("Please log in to bookmark posts.");
      return;
    }
  
    const updatedPosts = items.map((post) => {
      if (post._id === postId) {
        return { ...post, bookmarked: bookmarkedStatus };
      }
      return post;
    });
    setPosts(updatedPosts);
  
    try {
      fetch(`http://localhost:3666/post/${postId}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId, bookmarked: bookmarkedStatus }),
      })

    } catch (error) {
      console.error("Error while toggling bookmark:", error);
      const revertedPosts = items.map((post) => {
        if (post._id === postId) {
          return { ...post, bookmarked: !bookmarkedStatus };
        }
        return post;
      });
      setPosts(revertedPosts);
    }
  };

  const handleComment = async (postId) => {
    if (!userId) {
      alert("Please log in to comment.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3666/post/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, userName: user.UserName, text: comment, postId }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const updatedPosts = items.map((post) => {
          if (post._id === postId) { 
            const updatedComments = [...post.comments, { userId, userName: user.UserName, text: comment }];
            return { ...post, comments: updatedComments };
          }
          return post;
        });
  
        setPosts(updatedPosts);
        setComment("");
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (items && items.postImg) {
      setItemImg(`http://localhost:3666${items.postImg}`);
    }
  }, [items]);


  return (
    <div>
      <div>
        <Nav />
      </div>

      <div className="ContentBox">
        <div className="spacer"></div>
        <div id="gradient"></div>
          <div className="CenteredCard">
            <div id="card">
            <div className='spacer3'></div>
            <h1>Post Feed</h1>
          </div>
        </div>
        <div className="spacer4"></div>
        {items.map((item) => {
          console.log("Comments:", item.comments);
          const likeStatus = item.likes.includes(userId) ? "liked" : item.dislikes.includes(userId) ? "disliked" : null;
          return (
            <div key={item.id} className="PostBox">
                <p>
                  <strong>
                  {userId === '64de519894f9c85149d2b773' ? (
                      <a href={`/userProfile`}>Quillian Renae</a>
                    ) : (
                      <a href={`/user/64de519894f9c85149d2b773`}>Quillian Renae</a>
                    )}
                  </strong>
                </p>
              <h3>{item.postDate}</h3>
              <img  src={itemImg} alt="PostImg" />
              <p>{item.postBody}</p>
              <p>Likes: {item.likes.length}</p>
              <p>Dislikes: {item.dislikes.length}</p>
              {userId && (
                <>
                  <button
                    onClick={() => handleLike(item._id, likeStatus)}
                    disabled={!userId}
                  >
                    {likeStatus === "liked" ? "Unlike" : "Like"}
                  </button>
                  <button
                    onClick={() => handleDislike(item._id, likeStatus)}
                    disabled={!userId}
                  >
                    {likeStatus === "disliked" ? "Undislike" : "Dislike" }
                  </button>
                </>
              )}
              {userId && (
                <button onClick={() => handleBookmark(item._id, item.bookmarked)} disabled={!userId}>
                  {item.bookmarked ? "Bookmark" : "Bookmarked"}
                </button>
              )}
                <div className="spacer"></div>
                <input type="text" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <button onClick={() => handleComment(item._id, user.UserName)} disabled={!userId}>
                  Add Comment
                </button>
                <div className="Comments">
                {commentsMap[item._id] && commentsMap[item._id].length > 0 ? (
                  commentsMap[item._id].map((comment) => (
                    <div key={comment._id} className="Comment">
                      <p>
                        <strong>
                          {comment.userId === userId ? (
                            <a href={`/userProfile`}>{comment.userName}</a>
                          ) : (
                            <a href={`/user/${comment.userId}`}>{comment.userName}</a>
                          )}
                        </strong>
                        : {comment.text}
                        </p>
                      </div>
                    ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
            </div>
          );
        })}
        <div className="spacer"></div>
      </div>
    </div>
  );
};

export default Posts;