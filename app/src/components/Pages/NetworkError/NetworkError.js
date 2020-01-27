import React from 'react'
import { Link } from 'react-router-dom'
import networkError from 'statics/network.png'
const NetworkError = () => (
  <div>
    <img
      src={networkError}
      alt='Network-error'
      style={{
        width: '85%',
        height: '500px',
        display: 'block',
        margin: 'auto',
        position: 'relative'
      }}
    />
    <center>
      <Link to='/'>Refresh</Link>
    </center>
  </div>
)
export default NetworkError
