const nodemailer = require('nodemailer');
const {email_settings,product_name,frontend_url} = require('../config');

const templateTags = (string, tags) => {
  for(let key in tags){
    string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), tags[key]);
  }
  return string;
}

const sendmail = (options) => {
  return new Promise( async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: email_settings.host,
        port: email_settings.port,
        auth: {
          user: email_settings.user,
          pass: email_settings.pass
        }
      });
      const template = await getTemplate({
        name: options.template,
        tags: options.tags
      });
      const sendmail_options = await transporter.sendMail({
        from: `<${email_settings.reply}>`,
        to: options.to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
      transporter.sendMail(sendmail_options, (err, response) => {
        if(err) {
          resolve({ success: false, error: err });
        } else {
          resolve({ success: true, response: response });
        }
      });
    } catch (e) {
      resolve({success: false, error: e });
    }
  });
}

const templates = [
  {
    name: 'template_user_reset_password',
    subject: 'Reset Password',
    title: 'Reset Password',
    content: `Follow the link below to reset your password. The link be valid for 24 hours.`,
    link_text: 'Reset Password',
    link_url: `${frontend_url}/resetpassword/{reset_code}`
  },
  {
    name: 'template_user_verify_email',
    subject: 'Verify Your Email',
    title: 'Verify Your Email',
    content: `Thanks for trying ${product_name}. We’re thrilled to have you on-board. Follow the link below to verify your email and activate your account.`,
    link_text: 'Verify Email',
    link_url: `${frontend_url}/activate/{activation_code}`
  },
  {
    name: 'template_user_verify_email_change',
    subject: 'Verify Email Change',
    title: 'Verify Email Change',
    content: `You requested a change to change your ${product_name} email. Follow the link below to verify your email and activate the change.`,
    link_text: 'Verify Email Change',
    link_url: `${frontend_url}/activate/email/{activation_code}`
  },
  {
    name: 'template_user_delete_account',
    subject: 'Account Deleted',
    title: 'Account Deleted',
    content: `We’re sorry to see you go. Your account and any information associated with it has been deleted.`,
  },
]

const template_html = () => {
  return `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style type="text/css" rel="stylesheet" media="all">
      body { width: 100% !important; height: 100%; margin: 0; -webkit-text-size-adjust: none; background-color: #FFF; color: #4f566b; -webkit-font-smoothing: antialiased }
      body, td, th { font-family: sans-serif; font-size: 16px; }
      h1 { margin-top: 0; font-size: 28px; }
      a { color: #0d6efd; }
      p { line-height: 1.625; }
      .action-link { font-size: 20px; }
      @media only screen and (max-width: 600px) {
        .content { width: 100% !important; }
      }
      </style>
    </head>
    <table class="content" width="500" cellpadding="35">
      <tr>
        <td>
          <h1>{title}</h1>
          <p>{content}</p>
          <p><a class="action-link" href="{link_url}" target="_blank">{link_text} →</a></p>
          <p>Our emails will always link to <b>${frontend_url}</b>. Be sure to double-check our url in your browser address bar before entering any secure information.</p>
        </td>
      </tr>
    </table>
  </html>`;
}

const template_text = () => {
  return `{title}

  {content}

  {link_url}

  Our emails will always link to ${frontend_url}. Be sure to double-check our url in your browser address bar before entering any secure information.`;
}

const getTemplate = async (options) => {
  const template = templates.find(template => template.name === options.name);
  let text = template_text();
  let html = template_html();
  const tags = {
    title: template.title,
    content: template.content,
    link_text: template.link_text,
    link_url: template.link_url,
  }
  html = await templateTags(html, tags);
  text = await templateTags(text, tags);
  if(typeof options.tags !== 'undefined'){
    html = await templateTags(html, options.tags);
    text = await templateTags(text, options.tags);
  }
  return {
    name: template.name,
    subject: template.subject,
    html: html,
    text: text
  }
}

module.exports = {
  sendmail
}
