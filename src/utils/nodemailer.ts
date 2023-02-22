import config from "config";
import nodemailer from "nodemailer";

const nodemailerEmail = config.get<string>("nodemailerEmail");
const nodemailerPassword = config.get<string>("nodemailerPassword");

export const sendEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: nodemailerEmail,
      pass: nodemailerPassword,
    },
  });

  const options = {
    from: nodemailerEmail,
    to: `${email}`,
    subject: "Email sent using NodeJs",
    text: "Hello World !",
  };

  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error(error);
  }
};
