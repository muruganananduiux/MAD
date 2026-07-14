const { sendMail } = require('../config/mailer.config');

const sendWelcomeEmail = async (user) => {
  const html = `<h1>Welcome to MAD!</h1><p>Hi ${user.name}, welcome to the MAD NGO Donation Platform.</p>`;
  await sendMail({ to: user.email, subject: 'Welcome to MAD', html });
};

const sendVerificationEmail = async (user, token) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `<h1>Verify Email</h1><p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`;
  await sendMail({ to: user.email, subject: 'Email Verification', html });
};

const sendDonationReceipt = async (user, donation, campaign) => {
  const html = `<h1>Donation Receipt</h1><p>Dear ${user.name},</p><p>Thank you for donating ₹${donation.amount} to ${campaign.title}.</p><p>Receipt No: ${donation.receiptNo}</p>`;
  await sendMail({ to: user.email, subject: 'Donation Receipt', html });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `<h1>Reset Password</h1><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
  await sendMail({ to: user.email, subject: 'Password Reset', html });
};

const sendCampaignApprovalEmail = async (ngo) => {
  const html = `<h1>Campaign Approved</h1><p>Hi ${ngo.ownerName}, your campaign has been approved.</p>`;
  await sendMail({ to: ngo.email, subject: 'Campaign Approved', html });
};

const sendCampaignRejectionEmail = async (ngo, reason) => {
  const html = `<h1>Campaign Rejected</h1><p>Hi ${ngo.ownerName}, your campaign has been rejected.</p><p>Reason: ${reason}</p>`;
  await sendMail({ to: ngo.email, subject: 'Campaign Rejected', html });
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendDonationReceipt,
  sendPasswordResetEmail,
  sendCampaignApprovalEmail,
  sendCampaignRejectionEmail,
};
