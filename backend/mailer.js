const nodemailer = require('nodemailer');

// 1. Il trasportatore viene inizializzato una sola volta all'avvio del processo
// Trasformiamo i valori del .env nei tipi corretti (Numeri e Booleani puri)
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    secure: (process.env.MAIL_PORT === '465' || !process.env.MAIL_PORT), // true se 465 o assente (default Gmail)
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

/**
 * Invia una mail di servizio in modalità totalmente agnostica e portabile.
 * @param {Object} params - Oggetto JSON unico (Regola Generale).
 * @param {string} params.subject - L'oggetto del messaggio.
 * @param {string} params.text - Il contenuto testuale o HTML della mail.
 * @returns {Promise<Object>} Risultato dell'invio SMTP.
 */
async function mailer(params) {
    // Validazione rigorosa dell'oggetto JSON unico
    if (!params || !params.subject || !params.text) {
        throw new Error("Parametri 'subject' o 'text' mancanti nell'oggetto JSON.");
    }

    const mailOptions = {
        // Usa il mittente specificato o recupera l'utente Gmail di default
        from: process.env.MAIL_FROM || `"Monitor VPS" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || 'piero@ingamore.it',
        subject: `[${process.env.MY_VPS || 'SERVER'}] ${params.subject}`,
        html: params.text.trim().startsWith('<') ? params.text : undefined,
        text: params.text.trim().startsWith('<') ? undefined : params.text,
    };

    // 2. Esecuzione nativa asincrona con gestione dell'attesa
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[mailer] Notifica email inviata con successo. ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("[mailer] Errore reale intercettato durante il transito SMTP:", error);
        throw error; 
    }
}

module.exports = { mailer };
