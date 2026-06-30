import { sendMail } from '../../../lib/mailer.js';
import {
  renderJobNotificationEmail,
  renderJobPostedEmail,
  renderJobRequestSubmittedEmail,
  renderJobAcceptedEmail,
  renderJobRejectedEmail,
  renderJobRebookedEmail,
  renderJobRescheduledEmail,
  renderJobStartedEmail,
  renderJobEndedEmail,
  renderDriverCancelledJobEmail,
  renderJobCancelledByAccepterEmail,
  renderJobCancelledByPosterEmail,
  renderJobCancelledBySystemEmail,
  renderPaymentLinkEmail,
  renderJobScheduleCompletedByAccepterEmail,
  renderJobScheduleCompletedByPosterEmail,
  renderTruckOperatorStatus,
  renderTruckDocumentStatusEmail,
  renderTruckUnblockRequestEmail
} from '../../../utils/emailTemplates/index.js';

function sendEmailBackground({ to, subject, html }) {
  if (!to) return;

  setImmediate(() => {
    void sendMail({
      from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    }).catch((e) => {
      console.error("Email failed:", {
        email: to,
        subject,
        error: e?.message || String(e),
        timestamp: new Date(),
      });
    });
  });
}

async function sendEmailBackgroundAsync({ to, subject, html }) {
  if (!to) return;

  try {
    await sendMail({
      from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error("Email failed:", {
      email: to,
      subject,
      error: e?.message || String(e),
      timestamp: new Date(),
    });
  }
}

export function sendJobPostedEmailBackground({ to, name, jobCode, actionUrl }) {
  const html = renderJobPostedEmail({ name, jobCode, actionUrl });
  return sendEmailBackground({ to, subject: 'New Job Request', html });
}

export function sendJobRequestSubmittedEmailBackground({ to, name, jobCode, actionUrl }) {
  const html = renderJobRequestSubmittedEmail({ name, jobCode, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Request Submitted', html });
}

export function sendJobAcceptedEmailBackground({ to, name, jobCode, actionUrl }) {
  const html = renderJobAcceptedEmail({ name, jobCode, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Accepted', html });
}

export function sendJobRejectedEmailBackground({ to, name, jobCode, actionUrl }) {
  const html = renderJobRejectedEmail({ name, jobCode, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Rejected', html });
}

export function sendJobRebookedEmailBackground({ to, name, jobCode, actionUrl }) {
  const html = renderJobRebookedEmail({ name, jobCode, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Rebooked', html });
}

export function sendJobRescheduledEmailBackground({ to, name, jobCode, actionUrl }) {
  const html = renderJobRescheduledEmail({ name, jobCode, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Rescheduled', html });
}

export function sendJobStartedEmailBackground({ to, name, jobCode, equipmentName, driverName, actionUrl }) {
  const html = renderJobStartedEmail({ name, jobCode, equipmentName, driverName, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Started', html });
}

export function sendJobEndedEmailBackground({ to, name, jobCode, equipmentName, driverName, actionUrl }) {
  const html = renderJobEndedEmail({ name, jobCode, equipmentName, driverName, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Completed', html });
}

export function sendDriverCancelledJobEmailBackground({ to, name, jobCode, driverName, reason, actionUrl }) {
  const html = renderDriverCancelledJobEmail({ name, jobCode, driverName, reason, actionUrl });
  return sendEmailBackground({ to, subject: 'Driver Cancelled Job', html });
}

export function sendJobCancelledByAccepterEmailBackground({ to, name, jobCode, accepterName, reason, actionUrl }) {
  const html = renderJobCancelledByAccepterEmail({ name, jobCode, accepterName, reason, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Cancelled by Accepter', html });
}

export function sendJobCancelledByPosterEmailBackground({ to, name, jobCode, posterName, reason, actionUrl }) {
  const html = renderJobCancelledByPosterEmail({ name, jobCode, posterName, reason, actionUrl });
  return sendEmailBackground({ to, subject: 'Job Cancelled by Poster', html });
}

export async function sendJobCancelledBySystemEmailBackground({ to, name, jobCode, reason, actionUrl }) {
  const html = renderJobCancelledBySystemEmail({ name, jobCode, reason, actionUrl });
  return sendEmailBackgroundAsync({ to, subject: 'Job Cancelled by System', html });
}

export async function sendPaymentLinkEmailBackground({ to, name, jobCode, paymentUrl, logoUrl, paymentWindowHours, budgetHtml }) {
  const html = renderPaymentLinkEmail({ name, jobCode, paymentUrl, logoUrl, paymentWindowHours, budgetHtml });
  return sendEmailBackgroundAsync({ to, subject: 'Action Required: Payment for Job ' + jobCode, html });
}
export async function sendTruckStatusEmailBackground({
  to,
  name,
  action,
  entityType,
  fleetNumber,
}) {
  const html = renderTruckOperatorStatus({
    name,
    action,
    entityType,
    fleetNumber,
  });

  const subject =
    entityType === "company"
      ? action === "block"
        ? "Company Account Blocked"
        : "Company Account Unblocked"
      : action === "block"
        ? "Truck Blocked"
        : "Truck Unblocked";

  return sendEmailBackgroundAsync({
    to,
    subject,
    html,
  });
}

export async function sendTruckDocumentExpiryReminderEmailBackground({
  to,
  name,
  truckNumber,
  documentName,
  expiryDate,
}) {
  const html = renderTruckDocumentStatusEmail({
    name,
    truckNumber,
    expiryDate,
    documentName,
    type: "reminder",
  });

  return sendEmailBackgroundAsync({
    to,
    subject: "Truck Document Expiry Reminder",
    html,
  });
}

export async function sendTruckBlockedDueToExpiryEmailBackground({
  to,
  name,
  truckNumber,
  documentName,
  expiryDate,
}) {
  const html = renderTruckDocumentStatusEmail({
    name,
    truckNumber,
    expiryDate,
    documentName,
    type: "blocked",
  });

  return sendEmailBackgroundAsync({
    to,
    subject: "Truck Blocked Due To Expired Document",
    html,
  });
}

export async function sendTruckUnblockRequestEmailBackground({
  to,
  adminName,
  truckNumber,
  operatorName,
  operatorEmail,
}) {
  const html = renderTruckUnblockRequestEmail({
    adminName,
    truckNumber,
    operatorName,
    operatorEmail,
  });

  return sendEmailBackgroundAsync({
    to,
    subject: "Truck Unblock Request",
    html,
  });
}

export function sendJobScheduleCompletedByAccepterEmailBackground({ to, name, jobCode, accepterName, paymentUrl, logoUrl }) {
  const html = renderJobScheduleCompletedByAccepterEmail({ name, jobCode, accepterName, paymentUrl, logoUrl });
  return sendEmailBackground({ to, subject: 'Job Schedule Completed - ' + jobCode, html });
}

export function sendJobScheduleCompletedByPosterEmailBackground({ to, name, jobCode, posterName, logoUrl }) {
  const html = renderJobScheduleCompletedByPosterEmail({ name, jobCode, posterName, logoUrl });
  return sendEmailBackground({ to, subject: 'Job Schedule Completed - ' + jobCode, html });
}

// Backward compatible helper (existing call sites)
export function sendJobNotificationEmailBackground({
  to,
  name,
  title,
  message,
  actionUrl,
  actionText,
}) {
  const html = renderJobNotificationEmail({
    name,
    title,
    message,
    actionUrl,
    actionText,
  });

  return sendEmailBackground({ to, subject: title, html });
}
