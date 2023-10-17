const validator = require('validator');

module.exports = (req, res, next) => {
  const {pseudo, tel, email, password } = req.body;
  const errors = {};
  const phoneNumberPattern = /^((\+|00)229)?(6[1245679]|5[1-4]|9[456789])\d{6}$/;

  if(!/^[a-zA-Z0-9À-ÿ_@]{4,20}$/.test(pseudo.trim())){
    errors.pseudo = 'Le pseudo doit contenir entre 4 et 15 caractères alphanumériques...';
  }
  if(!phoneNumberPattern.test(tel)){
    errors.tel = 'Numéro de téléphone incorrect...';
  }
  // Validation du champ email
  if (!validator.isEmail(email)) {
    errors.email = 'L\'adresse e-mail n\'est pas valide.';
  }
  // Validation du champ password (entre 8 et 30 caractères, avec chiffres, lettres et un caractère spécial)
  if (!validator.isLength(password, { min: 8, max: 30 })) {
    errors.password = 'Le mot de passe doit contenir entre 8 et 30 caractères, avec chiffres, lettres et au moins un caractère spécial (!@#$%^&*).';
  }
  // Vérifier s'il y a des erreurs
  if (Object.keys(errors).length > 0) {
    console.log(errors)
    return res.status(400).json("Les champs remplis ne sont pas valides");
  }
  // Si la validation réussit, passer au middleware suivant
  next();
};
