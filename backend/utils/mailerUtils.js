import nodemailer from "nodemailer";

// Recupero e validazione base dei parametri dal file .env
const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';
const mailPort = parseInt(process.env.MAIL_PORT, 10) || 465;
const mailUser = process.env.MAIL_USER || 'piero@ingamore.it';
const mailPass = process.env.MAIL_PASS;

if (!mailPass) {
  // Sostituito il vecchio console.warn con console.error: l'assenza di credenziali 
  // è un blocco critico e deve comparire immediatamente nel log
  console.error("[Mailer Error]: Variabile MAIL_PASS mancante nel file .env");
}

// Creazione del trasportatore unico persistente e centralizzato
const transporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort,
  secure: mailPort === 465, // true per porta 465, false per la 587 (STARTTLS)
  auth: {
    user: mailUser,
    pass: mailPass
  }
});

/**
 * Trasportatore unico persistente per l'invio delle email di sistema
 * @param {Object} context - Parametro unico in modalità oggetto JSON
 * @param {string} [context.to] - Destinatario dell'email (Se omesso, invia all'amministratore configurato)
 * @param {string} context.subject - Oggetto del messaggio
 * @param {string} [context.text] - Testo del messaggio in chiaro
 * @param {string} [context.html] - Testo del messaggio in formato HTML
 * @returns {Promise<Object>} Esito dell'invio con informazioni di tracciamento
 */
export async function mailer(context) {
  // Se 'to' viene omesso, l'allerta di sistema viene recapitata in automatico all'amministratore del .env
  const to = context.to || mailUser;
  const { subject, text, html } = context;

  if (!subject || (!text && !html)) {
    throw new Error('[Mailer Error]: Parametri obbligatori (subject e contenuto) mancanti.');
  }

  const mailOptions = {
    // Stringa di fallback sicura nel caso in cui process.env.PROJECT non sia popolata,
    // evitando che il client di posta visualizzi un mittente come "System undefined"
    from: `"System ${process.env.PROJECT}" <${mailUser}>`,
    to,
    subject,
    text: text || "Visualizza questa mail con un client che supporta l'HTML.",
    html: html || text // Se passiamo la struttura nel campo text per errore, la mappa su html
  };

  try {
    // Avvolgiamo la Promise di Nodemailer in un blocco try/catch per isolare i fallimenti di rete o SMTP
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Messaggio inviato con successo a ${to}. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    // Intercettazione esplicita dell'errore asincrono per evitare crash da UnhandledPromiseRejection
    // e per marcare in modo univoco l'anomalia nel file di log di PM2
    console.error(`[Mailer Error] Fallimento invio email a ${to}:`, error.message);
    throw error;
  }
}

/**
 * Verifica lo stato di salute e l'autenticazione del pool SMTP
 * @returns {Promise<boolean>} True se il server risponde correttamente, altrimenti False
 */
export async function verifyConnection() {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("[Mailer Diagnostic Error]: Connessione SMTP fallita:", error.message);
    return false;
  }
}

