const admin = require('firebase-admin');

module.exports = function(req, res){
  if(!req.body.phone || !req.body.code){
      return res.status(422).send({ error: 'Phone and code must be provided!'});
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseint(req.body.code);

  admin.auth().getUser(phone)
       .then(() => {
         const ref = admin.ref('/users' + phone);
         ref.on('value', snapshot => {
            const user = snapshot.val();

            if(user.code !== code || !user.codeValid){
                return res.status(422).send({ error: 'Code not valid'});
            }

            ref.update({ codeValid: false });
         });
          return res.send({ success: true });
       })
       .catch(err => res.status(422).send({
           error: err
       }));


};