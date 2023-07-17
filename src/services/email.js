const path = require('path');
const fsPromises = require('fs').promises;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data = {}, attachmentFile) => {
  try {
    if (attachmentFile) {
      const filepath = path.join(__dirname, attachmentFile);
      const file = {
        filename: attachmentFile,
        data: await fsPromises.readFile(filepath),
      };
      const attachment = [file];

      data.attachment = attachment;
    }
   const response = await sgMail.send(data)

    if (response[0].statusCode === 202) {
      return {
        status:  true,
        message: 'Email sent successfully' 
      };
    }
    return {
      status:  false,
      message: 'Something is wrong' 
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: 'oops something went wrong',
    };
  }
};

module.exports = {
  sendEmail,
};
