// Validazione nome
export function isValidName(name) {
    // Il nome deve contenere solo lettere maiuscole o minuscole e il carattere speciale _
    const nameRegex = /^[A-Za-z_]+$/;
    return nameRegex.test(name);
}

// validazione email
export function isValidEmail(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

// validazione password
export function isValidPassword(password) {
    // Assicurati che la password abbia almeno 8 caratteri
    if (password.length < 8) {
      return false;
    }
  
    // Verifica se la password contiene almeno un carattere maiuscolo
    if (!/[A-Z]/.test(password)) {
      return false;
    }
  
    // Verifica se la password contiene almeno un carattere minuscolo
    if (!/[a-z]/.test(password)) {
      return false;
    }
  
    // Verifica se la password contiene almeno un numero
    if (!/\d/.test(password)) {
      return false;
    }
  
    // Verifica se la password contiene almeno un carattere speciale
    if (!/[^A-Za-z0-9]/.test(password)) {
      return false;
    }
  
    // Se tutti i criteri sono soddisfatti, la password è valida
    return true;
  }
  