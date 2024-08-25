import Navbar from './Navbar'
import './Signup.css'

export default function Signup () {
  return (
    <div className='signup'>
      <Navbar />
      <div className='spacer'>
        <div className='signup-wrapper'>
          <div className='form-box singup'>
            <h2>Signup</h2>
            <form className='input-form' action='http://localhost:3001/signup' method='POST'>
              <div className='input-box'>
                <input id='1' name='create_username'required></input>
                <label for='1'>Username</label>
              </div>
              <div className='input-box'>
                <input id='2' name='create_password' required></input>
                <label for='2'>Password</label>
              </div>
              <button type='submit' className='submit-btn'>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}