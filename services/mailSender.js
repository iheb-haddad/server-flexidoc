const nodemailer = require("nodemailer");
const SmtpConfiguration = require("../models/SmtpConfiguration.model");
const SupportEmail = require("../models/SupportEmail.model");

const sendMail = async (req, res) => {
  const smtpConfiguration = await SmtpConfiguration.findOne({
    idProject: req.body.idProject,
  });
  if (!smtpConfiguration) {
    return res.status(404).json({ message: "Smtp Configuration not found" });
  }
  const supportEmail = await SupportEmail.findOne({
    idSubProject: req.body.idSubProject,
  });
  if (!supportEmail) {
    return res.status(404).json({ message: "Support Email not found" });
  }

  const file = req.file;
  const screenshot = req.screenshot;
  console.log(screenshot);

  const transporter = nodemailer.createTransport({
    host: smtpConfiguration.host,
    port: smtpConfiguration.port,
    secure: smtpConfiguration.type, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: smtpConfiguration.user,
      pass: smtpConfiguration.pass,
    },
  });
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: smtpConfiguration.user, // sender address
      to: supportEmail.email, // list of receivers
      subject: "Problème Flexidoc", // Subject line
      text: req.body.message, // plain text body
      attachments: [
        file && {
          filename: file.originalname,
          content: file.buffer,
        },
        screenshot && {
          filename: screenshot.originalname,
          content: screenshot.buffer,
        },
      ],
    });
    res.json({ message: "Email sent successfully", info: info });

    const valid = await transporter.sendMail({
      from: smtpConfiguration.user, // sender address
      to: req.body.email, // list of receivers
      subject: "Problème Flexidoc", // Subject line
      text: "Votre problème a bien été pris en compte , Vous recevez bientôt une réponse.",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = sendMail;
