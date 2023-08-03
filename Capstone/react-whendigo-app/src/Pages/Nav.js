import React from 'react'
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <div>
            <div class="navColor">
              <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <div class="col-md-3 mb-2 mb-md-0">
                <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                  <svg className="bi" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                </Link>
                </div>

                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                  <li><Link to="/" className="nav-link px-2 link-secondary">Home</Link></li>
                  <li><Link to="/posts" className="nav-link px-2 link-secondary">Post Feed</Link></li>
                  <li><Link to="/collections" className="nav-link px-2 link-secondary">Collections</Link></li>
                </ul>

                <div class="col-md-3 text-end">
                <ul className="nav col-12">
                  <li><Link to="/login" className="nav-link px-2 link-secondary">Login</Link></li>
                  <li><Link to="/signup" className="nav-link px-2 link-secondary">Signup</Link></li>
                </ul>
                  {/* <button href="/login" class="btn btn-primary">Login</button>
                  <button href="/signup" class="btn btn-primary">Sign-up</button> */}
                </div>
              </header>
            </div> 
    </div>
  )
}

export default Nav