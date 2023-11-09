import { isValidEmail, isValidPassword, isValidName } from "@/utils/validation";

// Validazioni all'invio del form
export const validateFormData = (formData) => {
  const errors = {};

  if (!formData.name) {
    errors.name = 'Name is required';
  } else if (!isValidName(formData.name)) {
    errors.name = 'Name must contain only uppercase or lowercase letters and the special character _';
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  return errors;
};

// Validazioni mentre l'utente digita input
export const handleInputChange = (e, formData, setFormData, errors, setErrors) => {
  const { name, value } = e.target;
  const newFormData = { ...formData, [name]: value };
  setFormData(newFormData);

  const newErrors = { ...errors };

  if (name === 'name') {
    if (!value) {
      newErrors.name = 'Name is required';
    } else if (!isValidName(value)) {
      newErrors.name = 'Name must contain only uppercase or lowercase letters and the special character _';
    } else {
      newErrors.name = '';
    }
  }

  if (name === 'email') {
    if (!value) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(value)) {
      newErrors.email = 'Invalid email format';
    } else {
      newErrors.email = '';
    }
  }

  if (name === 'password') {
    if (!value) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(value)) {
      newErrors.password = 'Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character';
    } else {
      newErrors.password = '';
    }
  }

  setErrors(newErrors);
};
