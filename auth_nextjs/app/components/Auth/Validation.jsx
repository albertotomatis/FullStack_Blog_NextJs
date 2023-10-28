export const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

// validazioni all'invio del form
export const validateFormData = (formData) => {
    const errors = {};
  
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 4 || formData.name.length > 19) {
      errors.name = 'Name must be between 4 and 19 characters';
    }
  
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
  
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  
    return errors;
};

// validazioni mentre l'utente digita input
export const handleInputChange = (e, formData, setFormData, errors, setErrors, validateEmail) => {
  const { name, value } = e.target;
  const newFormData = { ...formData, [name]: value };
  setFormData(newFormData);

  const newErrors = { ...errors };

  if (name === 'name') {
    if (!value) {
      newErrors.name = 'Name is required';
    } else if (value.length < 4 || value.length > 19) {
      newErrors.name = 'Name must be between 4 and 19 characters';
    } else {
      newErrors.name = '';
    }
  }

  if (name === 'email') {
    if (!value) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(value)) {
      newErrors.email = 'Invalid email format';
    } else {
      newErrors.email = '';
    }
  }

  if (name === 'password') {
    if (!value) {
      newErrors.password = 'Password is required';
    } else if (value.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else {
      newErrors.password = '';
    }
  }

  setErrors(newErrors);
};


 