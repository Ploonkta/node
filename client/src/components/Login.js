import Navbar from './Navbar'
import './Login.css'
import { useState } from 'react'

export default function Login () {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json()
      
      if (result.success) {
        console.log('Success')
        window.location.href = '/'
      } else {
        console.log(result)
        console.log('Login Failed')
      }
    } catch (error) {
      console.log('Error, ', error)
    }
  }

  return (
    <div className='login'>
      <Navbar />
      <div className='spacer'>
        <div className='signup-wrapper'>
          <div className='form-box singup'>
            <h2>Login</h2>
            <form className='input-form' onSubmit={handleSubmit}>
              <div className='input-box'>
                <input
                 id='1'
                 value={formData.username}
                 name='username'
                 onChange={handleChange}
                 required
                 />
                <label htmlFor='1'>Username</label>
              </div>
              <div className='input-box'>
                <input 
                id='2'
                value={formData.password}
                type='password'
                name='password'
                onChange={handleChange}
                required
                />
                <label htmlFor='2'>Password</label>
              </div>
              <div className='btn-holder'>
                <button type='submit' className='submit-btn'>Submit</button>
                <button 
                type='button' 
                className='submit-btn' 
                onClick={() => {
                  window.location.href='/signup'
                }}
                >Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
