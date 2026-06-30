import { escapeHtml, renderEmailLayout } from './layout.js';

export function renderResetPasswordEmail({ name, resetUrl, logoUrl }) {
  const safeName = name ? escapeHtml(name) : '';
  const safeResetUrl = escapeHtml(resetUrl);

  const contentHtml = `
<tr>
    <td class="esd-block-text" align="left">
        <p style="margin:0 0 11px; font-size:16px; line-height:25px; color:#444; font-weight:400;">
            Hello ${safeName},
        </p>
    </td>
</tr>
<tr>
    <td class="esd-block-text" align="left">
        <p style="margin:0 0 11px; font-size:16px; line-height:25px; color:#444; font-weight:400;">
            Click the button below to reset your password. This link is valid for 1 hour.
        </p>
    </td>
</tr>
<tr>
    <td align="center" style="padding: 20px 0;">
        <a href="${safeResetUrl}" style="background:#D74315;color:#fff;padding:10px 25px;border-radius:4px;text-decoration:none;">
            Reset Password
        </a>
    </td>
</tr>
<tr>
    <td class="esd-block-text" align="left">
        <p style="margin:0 0 11px; font-size:16px; line-height:25px; color:#444; font-weight:400;">
            If you did not request a password reset, you can safely ignore this email.
        </p>
    </td>
</tr>
<tr>
    <td class="esd-block-text" align="left">
        <p style="margin:0 0 11px; font-size:16px; line-height:25px; color:#444; font-weight:400;">
            Best Regards,<br>
            TruckMatch Team
        </p>
    </td>
</tr>
  `.trim();

  return renderEmailLayout({
    title: 'Reset Password',
    contentHtml,
    ...(logoUrl ? { logoUrl } : {}),
  });
}
