import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, NavLink } from 'react-router-dom';


function UserProfile() {
  const [user, setUser] = useState(null);
  const [userImg, setUserImg] = useState("");
  const [notebookText, setNotebookText] = useState('');
  const [items, setItems] = useState([]);
  const [itemImg, setItemImg] = useState("");
  const userId = sessionStorage.getItem('userId');
  const isAdmin = user && user.Key === 'a84640d6-1c42-41aa-a53f-783edd2b4e64'; 
  const [allUsers, setAllUsers] = useState([]);
  const [loggedInUserFriendedBy, setLoggedInUserFriendedBy] = useState([]);
  const loggedInUserId = sessionStorage.getItem('userId');
  const [bookmarkDropdownOpen, setBookmarkDropdownOpen] = useState(false);


  useEffect(() => {
    console.log('Fetching user data...');
    fetch(`http://localhost:3666/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('User data:', data);
        setUser(data);
        setNotebookText(data.NoteBook || ''); 
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  useEffect(() => {
    if (user && user.Img) {
      setUserImg(`http://localhost:3666${user.Img}`);
    }
  }, [user]);


  useEffect(() => {
    console.log('Fetching post data...');
    fetch("http://localhost:3666/post")
      .then(response => response.json())
      .then(data => {
        console.log('Post data:', data);
        setItems(data);
      })
      .catch(error => {
        console.error('Error fetching post data:', error);
      });
  }, []);

  useEffect(() => {
    if (items && items.postImg) {
      setItemImg(`http://localhost:3666${items.postImg}`);
    }
  }, [items]);

  const handleNotebookChange = (event) => {
    setNotebookText(event.target.value);
  };

  const handleSaveNotebook = async () => {
    try {
      const response = await fetch(`http://localhost:3666/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NoteBook: notebookText }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Notebook saved successfully');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:3666/users");
        const usersData = await response.json();
        return usersData; 
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllUsers().then(usersData => {
      setAllUsers(usersData);
    });
  }, []);

  useEffect(() => {
    if (loggedInUserId && allUsers && allUsers.length > 0) {
      const friendedBy = [];
      for (const user of allUsers) {
        if (user.Friends.includes(loggedInUserId)) {
          friendedBy.push(user.UserName);
        }
      }
      setLoggedInUserFriendedBy(friendedBy);
    }
  }, [loggedInUserId, allUsers]);
  
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      fetch(`http://localhost:3666/post/delete/${postId}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          console.log('Post deleted successfully:', data);
          setItems(items.filter(item => item._id !== postId));
        })
        .catch(error => {
          console.error('Error deleting post:', error);
        });
    }
  };

  
  return (
    <div className=''>
      <div>
        <Nav/>
      </div>
      <div className='ContentBox2'>
        {user ? (
          <div>
            <div className='ProfileInfo'>
              <div className='Center'>
              <div id="gradient2"></div>
              <div className='CenteredCard'>
              <div id="card2">
                <img src={userImg} alt="Profile" />
                <h3>{user.UserName}</h3>
                <p>Pronouns: {user.Name}</p>
                <p>Location: {isAdmin ? user.Location : isAdmin}</p>
                <p>Bio: {user.Bio}</p>
                <Link to='/updateUser'>
                    <button>Edit Profile</button>
                  </Link>
                  <div>
                  {loggedInUserFriendedBy.length > 0 && (
                    <div>
                      <h3>Friended By:</h3>
                        {loggedInUserFriendedBy.map((username, index) => {
                          const user = allUsers.find(user => user.UserName === username);
                          if (user) {
                            return (
                              <li key={index}>
                                <Link to={`/user/${user._id}`}>{username}</Link>
                              </li>
                            );
                          } else {
                            return null; 
                          }
                        })}
                    </div>
                  )}
                  </div>
                </div>
                </div>
              </div>
              </div>
              <div className='spacer5'></div>


            {isAdmin && (
              <div>
                <NavLink to='/create' className={({isActive, isPending}) => isPending ? "Pending" : isActive ? "Active" : ""}>
                        <button>Create</button>
                    </NavLink>
                  <div className='Center2'>
                    <div className='Column'>
                    <div className='spacer'></div>

                    {items.map((item) => (
                        <div key={item.id} className="PostBox2">
                          <h3 className='Left'>{item.postDate}</h3>
                          <img  src={itemImg} alt="PostImg" />
                          <p>{item.postBody}</p>
                          <span>Likes: {item.likes.length}</span>
                          <span>Dislikes: {item.dislikes.length}</span>
                          {isAdmin && (
                            <div>
                              <NavLink to={`/update/${item._id}`} className={({isActive, isPending}) => isPending ? "Pending" : isActive ? "Active" : ""}>
                                <button>Update</button>
                              </NavLink>
                              <button onClick={() => handleDeletePost(item._id)}>Delete</button>
                            </div>
                          )}
                        </div>
                      ))}
                      </div>
                  </div>

              </div>
            )}
            {!isAdmin && ( 
              <div>
                <textarea
                  value={notebookText}
                  onChange={handleNotebookChange}
                  placeholder="Write your notes here..."
                />
                <button onClick={handleSaveNotebook}>Save Notebook</button>
              </div>
            )}
            {user.NoteBook && ( 
              <div>
                <h2>Notebook</h2>
                <p>{user.NoteBook}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;