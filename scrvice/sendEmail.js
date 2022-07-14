const nodemailer = require("nodemailer");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const sgMail = require("@sendgrid/mail");
// async function sendEmail(dest, message) {
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.senderEmail, // generated ethereal user
//       pass: process.env.senderPassword, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: `"Fred Foo 👻" <${process.env.senderEmail}>`, // sender address
//     to: dest, // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: message, // html body
//   });
// }
async function sendEmail(dest, message, attachment) {
  if (!attachment) {
    attachment = [];
  }
  nodeoutlook.sendEmail({
    auth: {
      user: process.env.senderEmail,
      pass: process.env.senderPassword,
    },
    from: process.env.senderEmail,
    to: dest,
    subject: "Hey you, awesome!",
    html: message,
    text: "This is text version!",
    attachments: attachment,

    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
  });
}

// async function sendEmail(dest, message, attachment) {
//   try {
//     if (!attachment) {
//       attachment = [];
//     }
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//       to: dest,
//       from: process.env.senderEmail, // Use the email address or domain you verified above
//       subject: "Sending with Twilio SendGrid is Fun",
//       text: "and easy to do anywhere, even with Node.js",
//       html: message,
//       attachments: attachment,
//     };
//     (async () => {
//       try {
//         await sgMail.send(msg);
//       } catch (error) {
//         console.error(error);

//         if (error.response) {
//           console.error(error.response.body);
//         }
//       }
//     })();
//   } catch (error) {
//     console.error("catch error email", error);
//   }
// }

module.exports = sendEmail;
