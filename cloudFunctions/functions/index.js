const functions = require("firebase-functions");
var asyncL = require("async");
var geofirestore = require("geofirestore");
const nodemailer = require("nodemailer");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const GeoFirestore = geofirestore.initializeApp(admin.firestore());

/*exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("solicitudesActivas")
    .add({ estado: 0 });
  // Send back a message that we've succesfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});*/

exports.sendMail = functions.https.onRequest((req, res) => {
  return new Promise((resolve, reject) => {
    res.set("Access-Control-Allow-Origin", "*");

    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "*");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      resolve();
      return null;
    } else {
      let message = req.body.message,
        codigo = req.body.codigo;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "wiki.app.col.mailer@gmail.com", pass: "prototipo1" },
      });

      const mailOptions = {
        from: "wiki.app.col.mailer@gmail.com",
        to: "wiki.app.col@gmail.com",
        subject:
          "Nuevo Registro de un conductor con código " + codigo + " - WikiAPP",
        text: message,
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          functions.logger.log("error", error);
          res.status(500).send({ message: "error " + err.message });
        } else {
          console.log("correo enviado");
          res.send({ menssage: "email sent" });
          resolve();
          return null;
        }
      });
    }
  });
});

exports.sendMailDesactivar = functions.https.onRequest((req, res) => {
  return new Promise((resolve, reject) => {
    res.set("Access-Control-Allow-Origin", "*");

    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "*");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      resolve();
      return null;
    } else {
      let estadoB = req.body.estadoB,
        primeraVez = req.body.primeraVez,
        idConductor = req.body.idConductor,
        emailDes = req.body.emailDes,
        claveDes = req.body.claveDes,
        fechaInicioDes = req.body.fechaInicioDes,
        fechaFinDes = req.body.fechaFinDes;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "wiki.app.col.mailer@gmail.com", pass: "prototipo1" },
      });

      if (estadoB) {
        //para activarlo

        const mailOptions = {
          from: "wiki.app.col.mailer@gmail.com",
          to: emailDes,
          subject: "Se ha activado tu cuenta de conductor - WikiAPP",
          text:
            "Felicidades, tu cuenta con correo " +
            emailDes +
            " ha sido activada del " +
            fechaInicioDes +
            " al " +
            fechaFinDes +
            ". Ya puedes ingresar a la app WikiConductor de la playstore y comenzar",
        };

        if (primeraVez) {
          admin
            .auth()
            .createUser({
              uid: idConductor,
              email: emailDes,
              password: claveDes,
            })
            .then((userResult) => {
              transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                  functions.logger.log("error", error);
                  res.send("error");
                  throw new Error(err);
                } else {
                  console.log("correo enviado admin desactivar");
                  res.send({ menssage: "email sent admin Desactivar" });
                  resolve();
                  return null;
                }
              });
              return null;
            })
            .catch((err) => {
              functions.logger.log("error", err);
              res.send("errorExiste");
              throw new Error(err);
            });
        } else {
          admin
            .auth()
            .updateUser(idConductor, {
              disabled: false,
            })
            .then((userResult) => {
              transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                  functions.logger.log("error", error);
                  res.send("error");
                  throw new Error(err);
                } else {
                  console.log("correo enviado admin desactivar");
                  res.send({ menssage: "email sent admin Desactivar" });
                  resolve();
                  return null;
                }
              });
              return null;
            })
            .catch((err) => {
              functions.logger.log("error", err);
              res.send("error");
              throw new Error(err);
            });
        }
      } else {
        //para desactivarlo

        const mailOptions = {
          from: "wiki.app.col.mailer@gmail.com",
          to: emailDes,
          subject: "Se ha desactivado tu cuenta de conductor - WikiAPP",
          text:
            "Lo siento, tu cuenta con correo " +
            emailDes +
            " ha sido desactivada. Contactános a wiki.app.col@gmail.com  para más información.",
        };

        admin
          .auth()
          .updateUser(idConductor, {
            disabled: true,
          })
          .then((userResult) => {
            transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                functions.logger.log("error", error);
                res.status(500).send({ message: "error " + err.message });
              } else {
                console.log("correo enviado admin desactivar");
                res.send({ menssage: "email sent admin Desactivar" });
                resolve();
                return null;
              }
            });
            return null;
          })
          .catch((err) => {
            functions.logger.log("error", err);
            res.send("error");
            throw new Error(err);
          });
      }
    }
  });
});

const runtimeOpts = {
  timeoutSeconds: 90,
};

exports.pushNotification = functions.https.onRequest((req, res) => {
  return new Promise((resolve, reject) => {
    const usuarioRef = admin
      .firestore()
      .collection("usuarios")
      .doc(req.body.idUsuario)
      .get()
      .then((snapshot) => {
        let usuarioDoc = snapshot.data();

        console.log("usuarioDoc");
        console.log(usuarioDoc);

        admin
          .messaging()
          .sendToDevice(
            usuarioDoc.tokens, // ['token_1', 'token_2', ...]
            {
              notification: {
                title: req.body.titulo,
                body: req.body.mensaje,
                //image: string,
              },
            },
            {
              // Required for background/quit data-only messages on iOS
              contentAvailable: true,
              // Required for background/quit data-only messages on Android
              priority: "high",
            }
          )
          .then((result) => {
            console.log("results");
            console.log(result);
            res.send("ok");
            resolve();
            return null;
          })
          .catch((error) => {
            functions.logger.log("error", error);
            res.send("error");
            throw new Error(error);
          });
        return null;
      })
      .catch((error) => {
        functions.logger.log("error", error);
        res.send("error");
        throw new Error(error);
      });
  });
});

exports.pushNotificationConductor = functions.https.onRequest((req, res) => {
  return new Promise((resolve, reject) => {
    const geocollection = GeoFirestore.collection("usuarios");

    const query = geocollection.where("tipo", "==", 1).near({
      center: new admin.firestore.GeoPoint(req.body.lat, req.body.lon),
      radius: 1000,
    });

    query
      .get()
      .then((value) => {
        // All GeoDocument returned by GeoQuery, like the GeoDocument added above

        let solicitudActiva = admin
          .firestore()
          .collection("solicitudesActivas");
        let tokensPush = new Array();
        asyncL.each(
          value.docs,
          function (docUsuario, callback) {
            let docUsuarioData = docUsuario.data();

            solicitudActiva
              .where("idConductor", "==", docUsuarioData.id)
              .where("estado", "==", 1)
              .get()
              .then((snapshot) => {
                functions.logger.log("Consulta para push");
                if (snapshot.empty) {
                  admin
                    .messaging()
                    .sendToDevice(
                      docUsuarioData.tokens, // ['token_1', 'token_2', ...]
                      {
                        notification: {
                          title: req.body.titulo,
                          body: req.body.mensaje,
                          //image: string,
                        },
                      },
                      {
                        // Required for background/quit data-only messages on iOS
                        contentAvailable: true,
                        // Required for background/quit data-only messages on Android
                        priority: "high",
                      }
                    )
                    .then((result) => {
                      return callback();
                    })
                    .catch((error) => {
                      return callback(error);
                    });
                } else {
                  return callback();
                }
                return null;
              })
              .catch((error) => {
                functions.logger.log("error", error);
                throw new Error(error);
              });
          },
          function (err) {
            // if any of the file processing produced an error, err would equal that error
            if (err) {
              // One of the iterations produced an error.
              // All processing will now stop.
              res.send("Error");
              functions.logger.log("A file failed to process", err);
              throw new Error(err);
            } else {
              functions.logger.log(
                "All files have been processed successfully",
                err
              );
              res.send("ok");
              resolve();
            }
          }
        );
        return null;
      })
      .catch((error) => {
        functions.logger.log("error", error);
        res.send("error");
        throw new Error(error);
      });
  });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.esperandoSolicitud = functions
  .runWith(runtimeOpts)
  .firestore.document("/solicitudesActivas/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const original = snap.data();

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("interval", context.params.documentId, original);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to Cloud Firestore.
        // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
        functions.logger.log("Acabó el tiempo");

        let solicitudActiva = admin
          .firestore()
          .collection("solicitudesActivas");

        solicitudActiva
          .where("idUsuario", "==", original.idUsuario)
          .where("estado", "==", 0)
          .get()
          .then((snapshot) => {
            functions.logger.log("Consulta");
            if (!snapshot.empty) {
              functions.logger.log("va a eliminar");
              solicitudActiva
                .where("idUsuario", "==", original.idUsuario)
                .where("estado", "==", 0)
                .get()
                .then((snapshot2) => {
                  if (!snapshot2.empty) {
                    snap.ref.set({ estado: -1 }, { merge: true });
                    resolve();
                  } else {
                    functions.logger.log("No eliminó segunda comprobación");
                    resolve();
                  }
                  return null;
                })
                .catch(() => {
                  functions.logger.log("error segunda comnprobación", error);
                  throw new Error(error);
                });
            } else {
              functions.logger.log("No eliminó");
              resolve();
            }
            return null;
          })
          .catch((error) => {
            functions.logger.log("error", error);
            throw new Error(error);
          });
      }, 60000); //60000
    });
  });
