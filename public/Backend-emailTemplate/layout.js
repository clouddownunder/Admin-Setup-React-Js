export function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function renderEmailLayout({ title, contentHtml, logoUrl }) {
    const safeTitle = escapeHtml(title ?? 'TruckMatch');

    const appBaseUrl = process.env.API_BASE_URL;

    const logoPath = '/media/email/logo.png';
    const bgPath = '/media/email/email-bg.png';

    const normalizedLogoPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
    const normalizedBgPath = bgPath.startsWith('/') ? bgPath : `/${bgPath}`;

    const defaultLogoUrl = appBaseUrl ? `${appBaseUrl}${normalizedLogoPath}` : '';
    const bgUrl = appBaseUrl ? `${appBaseUrl}${normalizedBgPath}` : '';

    const resolvedLogoUrl = logoUrl || defaultLogoUrl;
    const safeLogoUrl = resolvedLogoUrl ? escapeHtml(resolvedLogoUrl) : '';
    const safeBgUrl = bgUrl ? escapeHtml(bgUrl) : '';
    const logoBlock = safeLogoUrl
        ? `
        <tr>
          <td class="esd-block-image es-p20b" align="center" style="font-size:0">
            <a href="#" target="_blank">
              <img src="${safeLogoUrl}" alt="TruckMatch" style="display:block; max-width:180px; height:auto;" width="180" />
            </a>
          </td>
        </tr>
      `
        : '';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='robots' content='noindex, nofollow' />
    <title>${safeTitle}</title>
    <style type="text/css">
          html, body {
            width: 100%;
            font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0px;
            padding: 0px;
            background-color: #ffffff !important;
            color: #000000 !important;
        }
        /* Force light mode - override any dark mode */
        :root {
            color-scheme: light only;
        }
        * {
            -webkit-color-scheme: light;
            color-scheme: light;
        }
    </style>
</head>
<body style="background-color: #ffffff;">
<div class="es-wrapper-color">
    <table class="es-wrapper" style="background-position: center top;padding: 0px 10px" width="100%" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
            <td class="esd-email-paddings" valign="top">

                <table width="100%" cellpadding="0" cellspacing="0" class="es-content esd-header-popover" align="center" style="padding: 20px 0px; background-image: url('${safeBgUrl}'); background-repeat: no-repeat; background-position: center;background-size: cover;">
                    <tbody>
                    <tr>
                        <td class="es-adaptive esd-stripe" align="center">
                            <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                <tr>
                                    <td class="esd-structure es-p10" width="600" align="center" valign="center">
                                        <table class="es-left" width="100%" cellspacing="0" cellpadding="0" align="center">
                                            <tbody>
                                            <tr>
                                                <td class="esd-structure" align="center">
                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                        <tr>
                                                            <td class="esd-container-frame"  valign="top" align="center">
                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                                                                        ${logoBlock}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                    <tr>
                        <td class="esd-stripe" align="center">
                            <table class="es-content-body" style="background-color: #fff; padding: 15px; border: 1px solid #707070;" width="600" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                <tr>
                                    <td class="esd-structure" align="left">
                                        <table width="100%" cellspacing="0" cellpadding="0">
                                            <tbody>
                                            <tr>
                                                <td class="esd-container-frame" width="600" valign="top" align="center">
                                                    <table style="padding: 0px 0px;" width="100%" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                        ${contentHtml}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <table width="100%" class="es-content" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                    <tr>
                        <td class="esd-stripe" align="center">
                            <table class="es-content-body" style="background-color: #fff;" width="600" cellspacing="0" cellpadding="0"  align="center">
                                <tbody>
                                <tr>
                                    <td class="esd-structure es-p40t" width="600" esd-custom-block-id="15790" align="left">
 
                                        <table class="es-left" width="100%" cellspacing="0" cellpadding="0" align="center" style="padding: 30px 0px;">
                                            <tbody>
                                            <tr>
                                                <td width="100%" align="center">
                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                        <tr>
                                                            <td align="center">
                                                                <p style="color: #A0A0A0; font-size: 14px; margin:0px; font-weight: normal;text-align: center;">© ${new Date().getFullYear()} TruckMatch | Australia</p>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </td>
        </tr>
        </tbody>
    </table>
</div>
</body>
</html>`;
}
