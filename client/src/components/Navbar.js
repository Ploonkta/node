import './Navbar.css'
import {Link} from 'react-router-dom'

export default function Navbar(props) {
  return (
    <nav className='navbar'>
      <ul className='left'>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/'>[]</Link></li>
        <li><Link to='/'>[]</Link></li>
      </ul>
      <ul className='right'>
        <li><Link to='/signup'>Sign Up</Link></li>
        <li><Link to='/login'>Login</Link></li>
      </ul>
    </nav>
  )

}