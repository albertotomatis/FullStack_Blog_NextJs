#  🚀 &nbsp;Blog 
## 🖥️ &nbsp;Tech Stack
### 
- Next.js
- MongoDB
- React
- Tailwind

## 🕹️ &nbsp;Funzionalità
### 
- Register
- Email verification
- Login
- Forgot Password
-  Autorizzazioni
-  Crud Post e Utenti
-  Categories
-  Pagination
-  Search with Filter
-  Add post to favorites
-  Dashboard

## ⚙️ &nbsp;Installazione

###  1️⃣ &nbsp;Importa i dati di default nel database
###
- Importa i file 'user.json' e 'post.json' nel tuo database MongoDB.
###  2️⃣ &nbsp; Login: Le password sono salvate con hashing + salt 
###
- Utilizza "Segreta2023!" per accedere.
###  3️⃣ &nbsp; Configurazione del file .env
###
- Crea un file chiamato '.env'.
- Aggiungi le seguenti righe al file '.env':

```bash
MONGODB_URI =
NEXTAUTH_SECRET =
SECRET_KEY_WITH_SALT = 
```

###  4️⃣ &nbsp;Installa le dipendenze

```bash
npm install
```

###  5️⃣ &nbsp;Avvia il progetto 

```bash
npm run dev
```
