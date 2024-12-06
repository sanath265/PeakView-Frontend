import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import backgroundImage from './images/background.jpg'; // Local background image

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const navigate = useNavigate();

  const styles = {
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    websiteTitle: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '48px',
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 'bold',
      color: '#ffffff',
      textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
    },
    container: {
      padding: '20px',
      maxWidth: '400px',
      width: '90%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    title: {
      textAlign: 'center',
      color: '#3f51b5',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    errorMessage: {
      color: 'red',
      fontSize: '12px',
      marginTop: '-10px',
      marginBottom: '10px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#3f51b5',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    link: {
      color: '#3f51b5',
      textDecoration: 'none',
    },
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? '' : 'Invalid email format';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      const emailError = validateEmail(value);
      setErrors({ ...errors, email: emailError });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!errors.email && formData.password) {
      // Redirect to Dashboard after successful sign-in
      navigate('/dashboard/inventory');
    } else {
      alert('Please correct the errors.');
    }
  };

  return (
    <div style={styles.background}>
      <h1 style={styles.websiteTitle}>PeakView</h1>
      <div style={styles.container}>
        <h2 style={styles.title}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p style={styles.errorMessage}>{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
