import { useState } from 'react';


export const useValidation = () => {
  const [errors, setErrors] = useState({});


  const validate = (formData) => {
    let tempErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if(formData.name.length < 3 ) tempErrors.name = 'name must be 3 charactor'
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) tempErrors.password = 'Password is required';
    if (formData.password.length < 6)
      tempErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword.trim())
      tempErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = 'Passwords do not match';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; 
  };

  return { errors, validate };
};
