const ejs = require('ejs');
const { sendEmail } = require('../services/email');

const sendEmailVerificationCode = async (obj) => {
  const { user, code, template } = obj;
  const defaultView = template || 'verificationCode';
  try {
    const html = await ejs.renderFile(
      `${__dirname}/../views/${defaultView}.ejs`,
      {
        email: user,
        code: code,
      }
    );
    const data = await sendEmail({
      from: process.env.EMAIL_FROM || 'Bleautech<info@bleautech.com>',
      to: user,
      subject: `WorkRoom Account Verification Code`,
      html,
    });
    return {
      ...data
    }
  } catch (err) {
    return {
      status: false,
      message: 'Ooops...Something occured while sending email',
    }
  }
};
  
module.exports = {
  sendEmailVerificationCode,
};
