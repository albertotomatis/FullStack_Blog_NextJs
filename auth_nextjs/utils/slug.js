// genera uno slug dal titolo
export default function createSlug (title) {
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-') // Sostituisci spazi con trattini
      .replace(/[^a-z0-9-]/g, '') // Rimuovi caratteri non validi
      .replace(/-+$/, '') // Rimuovi eventuali trattini finali
      .substring(0, 100); // Limita la lunghezza del `slug` se necessario
    console.log("Slug generato:", slug); // Stampa il slug generato
    return slug;
  };
  