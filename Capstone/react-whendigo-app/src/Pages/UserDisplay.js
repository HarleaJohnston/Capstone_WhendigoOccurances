import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

const UserDisplay = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const userId = sessionStorage.getItem('userId');
  const [isFriend, setIsFriend] = useState(false);
  const [notebookText, setNotebookText] = useState('');
  const [posts, setPosts] = useState([]);
  const adminKey = 'a84640d6-1c42-41aa-a53f-783edd2b4e64';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3666/user/${id}`);
        const userData = await response.json();
        setUser(userData);
        setNotebookText(userData.NoteBook || '');
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFriendStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3666/user/${userId}/friends/${id}`);
        const friendData = await response.json();
        setIsFriend(friendData.isFriend);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPosts = async () => {
        try {
          const response = await fetch(`http://localhost:3666/post`);
          const postData = await response.json();
          setPosts(postData);
        } catch (error) {
          console.error(error);
        }
      };

  
      fetchUser();
      if (user && user.Key === adminKey) {
        fetchPosts();
      }
      if (userId) {
        fetchFriendStatus();
      }
    }, [id, userId, user, adminKey]);

  const handleFriendship = () => {
    fetch(`http://localhost:3666/user/${userId}/friends/${id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsFriend(true);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        <Nav />
      </div>
        <div className='Profile'>
        <h2>User Profile</h2>
        <p>Email: {user.Gmail}</p>
        <p>Username: {user.UserName}</p>
        <p>Bio: {user.Bio}</p>
        <p>Name: {user.Name}</p>
        <p>Img: {user.Img}</p>
        {userId && userId !== id && !isFriend && (
            <button onClick={handleFriendship}>Add Friend</button>
        )}
        {isFriend && user.NoteBook && ( 
            <div>
            <h3>Notebook</h3>
            <p>{notebookText}</p>
            </div>
        )}
        </div>
        {user.Key === adminKey && (
        <div>
          <h3>Posts</h3>
          {posts.map((post) => (
            <div key={post._id} className="PostBox">
              <h3>{post.postDate}</h3>
              <p>{post.postImg}</p>
              <p>{post.postBody}</p>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default UserDisplay;