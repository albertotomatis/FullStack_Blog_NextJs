import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
      
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
      
          if (!user) {
            throw new Error("InvalidCredentials"); // L'utente non esiste
          }
      
          const passwordsMatch = await bcrypt.compare(password, user.password);
      
          if (!passwordsMatch) {
            throw new Error("InvalidCredentials"); // Password non corretta
          }
      
          if (!user.emailVerified) {
            throw new Error("EmailNotVerified"); // Email non verificata
          }
 
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, 
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Error: ", error);
          throw error; // Rilancia l'errore per ottenere un messaggio di errore dettagliato
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
    // DEBUG
    //console.log("Session data:", session);
      return session;
    },
    async jwt({ token, user }) {
      try {
        await connectMongoDB();
        // Cerca l'utente nel database MongoDB
        const dbUser = await User.findOne({ email: token.email });

        if (!dbUser) {
          token.id = user.id;
          return token;
        }
        // DEBUG
        //console.log("User data from JWT callback:", dbUser);
        return {
          id: dbUser._id.toString(), // Converte l'ObjectId in una stringa
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          emailVerified: dbUser.emailVerified,
        };
      } catch (error) {
        console.error("Error in JWT callback:", error);
        return null;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
