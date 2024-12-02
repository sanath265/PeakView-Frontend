import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from './images/background.jpg'; // Local image path

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const styles = {
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
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
    scrollContainer: {
      position: 'absolute',
      top: '100px', // Below the title
      left: '0',
      right: '0',
      bottom: '0',
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
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
      color: '#1a73e8',
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
    passwordStrength: {
      fontSize: '12px',
      marginTop: '-10px',
      marginBottom: '15px',
      color: '#888',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#1a73e8',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    link: {
      color: '#1a73e8',
      textDecoration: 'none',
    },
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? '' : 'Invalid email format';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/; // International format, 10-15 digits
    return phoneRegex.test(phone)
      ? ''
      : 'Invalid phone number format. Include country code and 10-15 digits.';
  };

  const validatePasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength('Weak');
    } else if (password.length < 10) {
      setPasswordStrength('Moderate');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let error = '';
    if (name === 'email') error = validateEmail(value);
    if (name === 'phone') error = validatePhone(value);
    setErrors({ ...errors, [name]: error });

    if (name === 'password') validatePasswordStrength(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);

    if (!emailError && !phoneError) {
      alert('Form submitted successfully!');
    } else {
      setErrors({
        email: emailError,
        phone: phoneError,
      });
    }
  };

  return (
    <div style={styles.background}>
      <h1 style={styles.websiteTitle}>PeakView</h1>
      <div style={styles.scrollContainer}>
        <div style={styles.container}>
          <h2 style={styles.title}>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              style={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              style={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
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
              type="tel"
              name="phone"
              placeholder="Phone Number (Include country code, e.g., +1)"
              style={styles.input}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p style={styles.errorMessage}>{errors.phone}</p>}
            <select style={styles.input} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p style={styles.passwordStrength}>Password strength: {passwordStrength}</p>
            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account? <Link to="/" style={styles.link}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
