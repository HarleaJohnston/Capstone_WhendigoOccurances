import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, NavLink } from 'react-router-dom';


function UserProfile() {
  const [user, setUser] = useState(null);
  const [userImg, setUserImg] = useState("");
  const [notebookText, setNotebookText] = useState('');
  const [items, setItems] = useState([]);
  const userId = sessionStorage.getItem('userId');
  const isAdmin = user && user.Key === 'a84640d6-1c42-41aa-a53f-783edd2b4e64'; 
  const [allUsers, setAllUsers] = useState([]);
  const [loggedInUserFriendedBy, setLoggedInUserFriendedBy] = useState([]);
  const loggedInUserId = sessionStorage.getItem('userId');

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

  // useEffect(() => {
  //   setUserImg(`http://localhost:3666${user.Img}`);
  // }, [user]);

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
  

  return (
    <div className='Column'>
      <div>
        <Nav/>
      </div>
      <div className='ContentBox2'>
        {user ? (
          <div>
            <div className='Row3'>
              <div className='Center'>
                <div>
                <img className='ImgSize2' src={userImg} alt="Profile" />
                </div>
                <div className='Profile'>
                  <h3>Username: {user.UserName}</h3>
                  <p>Pronouns: {user.Name}</p>
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
            {isAdmin && (
              <div>
                <NavLink to='/create' className={({isActive, isPending}) => isPending ? "Pending" : isActive ? "Active" : ""}>
                        <button>Create</button>
                    </NavLink>

                    {items.map((item) => (
                  <div key={item.id} className="PostBox">
                    <h3>{item.postDate}</h3>
                    <p>{item.postImg}</p>
                    <p>{item.postBody}</p>
                    <p>Likes: {item.likes.length}</p>
                    <p>Dislikes: {item.dislikes.length}</p>
                  </div>
                ))}
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