import React from 'react'
import Nav from './Nav'
import { NavLink } from 'react-router-dom'

const Profile = () => {
  return (
    <div className='Column'>
        <div>
            <Nav/>
            <div className='ContentBox2'>
              <div className='Center'>
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
                <div className='Row3'>
                  <div className='Center'>
                        <div>
                          <img className='ImgSize2' src={process.env.PUBLIC_URL + '/ProfileOne.jpg'}></img>
                        </div>
                        <div>
                          <div className='Row2'>
                            <h4 className='Padding'>
                              Quillians Renae
                            </h4>
                            <p className='Padding'>
                            Posts: 
                            </p>
                            <p className='Padding'>
                            Followers:
                            </p>
                            <p className='Padding'>
                            Following:
                            </p>
                          </div>
                          <div className='Profile'>
                            <p className='Padding2'>
                            Location: Whendigo, Missouri
                            </p>
                            <p className='Padding2'>
                            Bio:
                            </p>
                            <p className='Padding2'>
                            The one and only creator of the blog and website.  Fulltime Nightshift worker and college student. Working on my Web development degree. Loves to go searching for things that go bump in the night.
                            </p>
                          </div>
                        </div>
                      </div>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default Profile