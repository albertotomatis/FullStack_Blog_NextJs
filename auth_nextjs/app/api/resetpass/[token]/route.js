import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectMongoDB();

  try {
    const { token, newPassword } = await req.json();

    // Verifica se il token è valido nel database
    const decodedToken = jwt.decode(token);

    try {
      // Verifica del token e ottenimento delle informazioni
      const tokenInfo = jwt.verify(token, process.env.SECRET_KEY_WITH_SALT);
      const tokenExpirationLocal = new Date(tokenInfo.exp * 1000);

      // Verifica se il token è presente nel database
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpiry: { $gt: tokenExpirationLocal }
      });

      // Controlla se l'utente non è presente nel database
      if (!user) {
        return NextResponse.json({ message: "TokenNotFoundOrExpired" }, { status: 400 });
      }

      // Controlla se il token fornito nell'URL è diverso da quello nel database
      if (user.passwordResetToken !== token) {
        return NextResponse.json({ message: "InvalidToken" }, { status: 400 });
      }

      // Controlla se il token è scaduto per l'utente nel database
      if (user.passwordResetTokenExpiry <= new Date()) {
        return NextResponse.json({ message: "TokenExpiredForUser" }, { status: 401 });
      }

      // Hash della nuova password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Aggiorna la password dell'utente
      user.password = hashedPassword;

      // Cancella il token di reset
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;

      await user.save();

      // Genera un nuovo token di sessione JWT dopo la reimpostazione della password
      const newToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY_WITH_SALT, {
        expiresIn: '1h', // Scadenza del token 
      });

      // Invia il nuovo token con la risposta
      return NextResponse.json({ message: "Password reset successful", token: newToken }, { status: 200 });

    } catch (tokenError) {
      console.error("Errore durante la verifica del token:", tokenError);

      if (tokenError instanceof jwt.TokenExpiredError) {
        // Gestisci specificamente l'errore di token scaduto
        return NextResponse.json({ message: "TokenExpiredError", error: tokenError.message }, { status: 401 });
      } else if (tokenError instanceof jwt.JsonWebTokenError) {
        // Gestisci specificamente l'errore di firma del token
        return NextResponse.json({ message: "InvalidTokenError", error: tokenError.message }, { status: 401 });
      }

      // Gestisci altri errori di verifica del token
      return NextResponse.json({ message: "TokenVerificationError", error: tokenError.message }, { status: 401 });
    }
  } catch (error) {
    console.error("Errore generale:", error);
    // Gestisci gli errori al di fuori del blocco try interno
    return NextResponse.json(
      { message: "Si è verificato un errore durante la reimpostazione della password.", error: error.message },
      { status: 500 }
    );
  }
}
