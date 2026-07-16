const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const isPlaceholder = (v) =>
  !v || /^your_|change_me|example\.com$/i.test(String(v)) || String(v).toLowerCase().includes('placeholder');

let transporter = null;
let enabled = false;

function initTransporter() {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;
  if (isPlaceholder(MAIL_HOST) || isPlaceholder(MAIL_USER) || isPlaceholder(MAIL_PASS)) {
    logger.warn('SMTP credentials are placeholders — emails will be logged instead of sent.');
    enabled = false;
    return;
  }
  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT) || 587,
    secure: Number(MAIL_PORT) === 465,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
  enabled = true;
  logger.info('SMTP transporter initialised');
}

initTransporter();

/**
 * Send an email. Never throws — if SMTP is disabled or the send fails,
 * we log and continue so signups/donations don't get blocked.
 */
const sendMail = async ({ to, subject, html, text }) => {
  const from = process.env.MAIL_FROM || process.env.MAIL_USER || 'no-reply@mad.local';
  if (!enabled) {
    logger.info(`[mail:mock] to=${to} subject="${subject}"`);
    return { mocked: true };
  }
  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    logger.info(`[mail:sent] to=${to} id=${info.messageId}`);
    return info;
  } catch (err) {
    logger.error(`[mail:error] to=${to} subject="${subject}"`, err);
    return { error: err.message };
  }
};

module.exports = { sendMail, isMailEnabled: () => enabled };
