import {React, useEffect} from 'react'
import Nav from '../Pages/Nav'

const CookieClicker = () => {
    useEffect(() => {
        require('./Clicker.css');
      })

  return (
    <div>
      <div className='ContentBox'>
        <p>ContentBox</p>
      </div>

    </div>
  )
}

export default CookieClicker