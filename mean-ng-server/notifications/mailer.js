let nodemailer = require('nodemailer');

module.exports.sendMail = (from, to, subject, body, bodyPlainTxt = null, cc = null, bcc = null) => new Promise((resolve, reject) => {
    if (!from) reject(new Error('Parameter "from" must have a value'));
    if (!to) reject(new Error('Parameter "to" must have a value'));
    if (!subject) reject(new Error('Parameter "subject" must have a value'));
    if (!body) reject(new Error('Parameter "body" must have a value'));

    const transport = {
        host: process.env.EMAIL_HOST || '[YOUR EMAIL HOST]',
        port: parseInt(process.env.EMAIL_PORT || '[YOUR EMAIL PORT]'),
        secure: process.env.EMAIL_SECURE ? true : false,
        auth: {
            user: process.env.EMAIL_USERNAME || '[YOUR EMAIL USERNAME]',
            pass: process.env.EMAIL_PASSWORD || '[YOUR EMAIL PASSWORD]'
        }
    };

    let smtpTransport = nodemailer.createTransport(transport);

    let mailOptions = {
        from: from,
        to: to,
        cc: cc || '',
        bcc: bcc || '',
        subject: subject,
        text: bodyPlainTxt || body,
        html: body
    };

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) reject(new Error('Failed to send email.'));
        else resolve(info);
    });
});