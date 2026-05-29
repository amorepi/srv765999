const nodemailer = require('nodemailer');

/**
 * Invia una mail di servizio in modalità totalmente agnostica.
 * @param {Object} params - Oggetto JSON unico con i dettagli della mail.
 * @param {string} params.subject - L'oggetto del messaggio.
 * @param {string} params.text - Il contenuto testuale o HTML della mail.
 * @returns {Promise<Object>} Risultato dell'invio SMTP.
 */
async function mailer(params) {
  // Validazione rigorosa del parametro JSON unico
  if (!params || !params.subject || !params.text) {
    throw new Error("Parametri 'subject' o 'text' mancanti nell'oggetto JSON.");
  }

  // Configurazione dinamica tramite le variabili d'ambiente del file .env
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_PORT == '465', // true solo se la porta è la 465 (SSL)
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: process.env.MAIL_TO,
    subject: `[${process.env.MY_VPS || 'SERVER'}] ${params.subject}`,
    html: params.text.trim().startsWith('<') ? params.text : undefined,
    text: params.text.trim().startsWith('<') ? undefined : params.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[mailer] Email di servizio inviata con successo. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("[mailer] Errore critico durante l'invio della mail:", error);
    throw error; 
  }
}

module.exports = { mailer };
