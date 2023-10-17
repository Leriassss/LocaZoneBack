const nodemailer = require('nodemailer');

exports.mailing = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'http://localhost/',
        port: 25,
        secure: false,
        ignoreTLS: true,
        auth: {
            user: 'Jean',
            pass: 'Obitobukodai25'
          }
      });
      
    
    const mailOptions = {
        from: 'akpacalerias@gmail.com',
        to: 'akpacajean@gmail.com',
        subject: 'Test',
        text: 'Bonjour voici le message du test'
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('E-mail envoyé : ' + info.response);
        }
    });
} 

  