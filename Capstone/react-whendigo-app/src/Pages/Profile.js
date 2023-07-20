import React from 'react'
import Nav from './Nav'
import { NavLink } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='Column'>
        <div>
          <div className='Center'>
            <Nav/>
                <NavLink to='/update'
                  className={({isActive, isPending}) => isPending ? "Pending" : isActive ? "Active" : ""}>
                    Update
                </NavLink>
                <NavLink to='/delete'
                  className={({isActive, isPending}) => isPending ? "Pending" : isActive ? "Active" : ""}>
                    Delete
              </NavLink>
                <NavLink to='/create'
                  className={({isActive, isPending}) => isPending ? "Pending" : isActive ? "Active" : ""}>
                    Create
                </NavLink>
          </div>
                <div>
                  <div>
                    <img></img>
                  </div>
                  <div>
                    <div className='Row'>
                      <h4>
                        Quillians Renae
                      </h4>
                      <p>
                      Posts:
                      </p>
                      <p>
                      Followers:
                      </p>
                      <p>
                      Following:
                      </p>
                    </div>
                    <div className=''>
                      <p>
                      Location:
                      </p>
                      <p>
                      Bio:
                      </p>
                    </div>
                  </div>
                </div>
        </div> 
    </div>
  )
}

export default Profile