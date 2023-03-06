const { createTransport } = require('nodemailer');

async function sendMail(argumento) {
  const TEST_MAIL = argumento;
  console.log('testMail:', TEST_MAIL);

  const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'carla.ricciardi95@gmail.com',
      pass: 'ekvrsgoreorafyfd', //https://myaccount.google.com/apppasswords?rapt=AEjHL4Mexrh2seb871wE67oTEkj8oQZXJorURPaaEnVAPVkvSfG4N4F30O6jnMuf4DMoCol27mx2thQ1gen_tid3IsctUxVWLQ
    },
  });

  const mailOptions = {
    from: 'carlasigmaalarmas@gmail.com',
    to: TEST_MAIL,
    attachments: [{ path: './views/mail.hbs' }],
    subject: 'Nuevo Registro',
    //   html: '<h1 style="color: blue;">Contenido de prueba desde <span style="color: green;">Node.js con Nodemailer</span></h1> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png" >',
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendMail;
