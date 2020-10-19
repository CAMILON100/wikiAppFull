import React, { useState, useContext } from "react";
import logo from "./logoWiki.png";
import Grid from "@material-ui/core/Grid";
//import {Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";
import axios from "axios";

const RegistroConductor = () => {
  const [cargando, guardarCargando] = useState(false);

  document.body.style.backgroundColor = "#242021";

  document.title = "Wiki App - Registro de conductor";

  const { firebase } = useContext(FirebaseContext);

  const [subiendoPase, guardarSubiendoPase] = useState(false);

  const [subiendoSoat, guardarSubiendoSoat] = useState(false);

  const [subiendoMecanica, guardarSubiendoMecanica] = useState(false);

  const [subiendoConductor, guardarSubiendoConductor] = useState(false);

  const [progresoPase, guardarProgresoPase] = useState(0);

  const [progresoSoat, guardarProgresoSoat] = useState(0);

  const [progresoMecanica, guardarProgresoMecanica] = useState(0);

  const [progresoConductor, guardarProgresoConductor] = useState(0);

  const [urlImagenPase, guardarUrlImagenPase] = useState("");

  const [urlImagenSoat, guardarUrlImagenSoat] = useState("");

  const [urlImagenMecanica, guardarUrlImagenMecanica] = useState("");

  const [urlImagenConductor, guardarUrlImagenConductor] = useState("");

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      placas: "",
      correo: "",
      telefono: "",
      clave: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .min(2, "El nombre debe tener mínimo 2 caracteres")
        .required("El nombre es obligatorio"),
      placas: Yup.string()
        .min(6, "La placa debe tener mínimo 6 caracteres")
        .required("La placa es obligatoria"),
      correo: Yup.string()
        .email("Debe ser un formato de correo correcto")
        .min(4, "el correo debe tener mínimo 6 caracteres")
        .required("El correo es obligatorio"),
      telefono: Yup.number()
        .typeError("Debe ser de valor numérico")
        .min(
          1000000000,
          "El teléfono debe terner al menos 10 cifras y ser numérico"
        )
        .required("El teléfono es obligatorio"),
      clave: Yup.string()
        .min(6, "La clave debe tener mínimo 6 caracteres")
        .required("La clave es obligatorio"),
    }),
    onSubmit: (datos) => {
      guardarCargando(true);

      if (
        urlImagenPase === "" ||
        urlImagenSoat === "" ||
        urlImagenMecanica === "" ||
        urlImagenConductor === ""
      ) {
        alert("Debe subir todos las imágenes solicitadas");
        guardarCargando(false);
      } else {
        firebase.auth
          .signInWithEmailAndPassword(datos.correo, datos.clave)
          .then((result) => {
            console.log("Existe correo");
            guardarCargando(false);
            alert(
              "Ya existe un usuario o conductor creado con el correo ingresado"
            );
          })
          .catch((err) => {
            console.log(err);
            console.log("NO Existe correo");

            switch (err.code) {
              case "auth/wrong-password":
                alert(
                  "Ya existe un usuario o conductor creado con el correo ingresado"
                );

                guardarCargando(false);

                break;

              default:
                let datosGenerales = firebase.db
                  .collection("datosGenerales")
                  .doc("W2GJ2VboeSnvKRKB3rKY");

                firebase.db
                  .runTransaction(function (transaction) {
                    // This code may get re-run multiple times if there are conflicts.

                    return transaction
                      .get(datosGenerales)
                      .then(function (sfDoc) {
                        if (!sfDoc.exists) {
                          throw new Error("No existe doc en transacción");
                        }

                        var newCode = sfDoc.data().codigoConductor + 1;
                        var length = (Math.log(newCode) * Math.LOG10E + 1) | 0;
                        var codeF = "";

                        switch (length) {
                          case 1:
                            codeF = "col-000" + String(newCode);
                            break;

                          case 2:
                            codeF = "col-00" + String(newCode);

                            break;

                          case 3:
                            codeF = "col-0" + String(newCode);

                            break;

                          default:
                            codeF = "col-" + String(newCode);
                            break;
                        }

                        transaction.update(datosGenerales, {
                          codigoConductor: newCode,
                        });
                        const newDocRef = firebase.db
                          .collection("usuarios")
                          .doc();
                        transaction.set(newDocRef, {
                          nombre: datos.nombre,
                          placas: datos.placas,
                          email: datos.correo,
                          telefono: datos.telefono,
                          clave: datos.clave,
                          activado: false,
                          codigo: codeF,
                          primeraVez: true,
                          creado: false,
                          tipo: 1,
                          pase: urlImagenPase,
                          soat: urlImagenSoat,
                          mecanica: urlImagenMecanica,
                          conductor: urlImagenConductor,
                        });

                        return codeF;
                      });
                  })
                  .then(function (codeF) {
                    let messageFinal =
                      "Un nuevo conductor se registró en WikiApp.\n \n Nota: Las imágenes se acceden en el link que corresponde. \n Nombre: " +
                      datos.nombre +
                      "\n Placas " +
                      datos.placas +
                      "\n Email " +
                      datos.correo +
                      "\n Teléfono " +
                      datos.telefono +
                      "\n Código Asignado " +
                      codeF +
                      "\n Foto pase de conducir " +
                      urlImagenPase +
                      "\n Foto del SOAT " +
                      urlImagenSoat +
                      "\n Foto Técnico Mecánica " +
                      urlImagenMecanica +
                      "\n Foto del conductor " +
                      urlImagenConductor;

                    axios
                      .post(
                        "https://us-central1-wikiapplogin.cloudfunctions.net/sendMail",
                        {
                          message: messageFinal,
                          codigo: codeF,
                        }
                      )
                      .then((res) => {
                        console.log("res");
                        console.log(res);
                        console.log("Transaction successfully committed!");
                        navigate("/gracias");
                      });
                  })
                  .catch(function (error) {
                    alert("Hubo un error, inténtelo de nuevo");
                    guardarCargando(false);
                  });

                break;
            }
          });
      }
    },
  });

  const handleUploadStartPase = () => {
    guardarProgresoPase(0);
    guardarSubiendoPase(true);
    guardarCargando(true);
  };

  const handleUploadErrorPase = (err) => {
    guardarSubiendoPase(false);
    guardarCargando(false);
    console.log(err);
  };

  const handleUploadSucessPase = (nombre) => {
    guardarProgresoPase(100);
    guardarSubiendoPase(false);

    firebase.storage
      .ref("documentosConductor")
      .child(nombre)
      .getDownloadURL()
      .then((result) => {
        guardarUrlImagenPase(result);
        guardarCargando(false);
      })
      .catch((err) => {
        console.log("err");
        console.log(err);
        alert("Hubo un error, vuelve a intentar subir la imagen");
      });
  };

  const handledProgressPase = (progresoUpd) => {
    guardarProgresoPase(progresoUpd);
    console.log(progresoUpd);
    guardarCargando(true);
  };

  const handleUploadStartSoat = () => {
    guardarProgresoSoat(0);
    guardarSubiendoSoat(true);
    guardarCargando(true);
  };

  const handleUploadErrorSoat = (err) => {
    guardarSubiendoSoat(false);
    guardarCargando(false);
    console.log(err);
  };

  const handleUploadSucessSoat = (nombre) => {
    guardarProgresoSoat(100);
    guardarSubiendoSoat(false);

    firebase.storage
      .ref("documentosConductor")
      .child(nombre)
      .getDownloadURL()
      .then((result) => {
        guardarUrlImagenSoat(result);
        guardarCargando(false);
      })
      .catch((err) => {
        console.log("err");
        console.log(err);
        alert("Hubo un error, vuelve a intentar subir la imagen");
      });
  };

  const handledProgressSoat = (progresoUpd) => {
    guardarProgresoSoat(progresoUpd);
    console.log(progresoUpd);
    guardarCargando(true);
  };

  const handleUploadStartMecanica = () => {
    guardarProgresoMecanica(0);
    guardarSubiendoMecanica(true);
    guardarCargando(true);
  };

  const handleUploadErrorMecanica = (err) => {
    guardarSubiendoMecanica(false);
    guardarCargando(false);
    console.log(err);
  };

  const handleUploadSucessMecanica = (nombre) => {
    guardarProgresoMecanica(100);
    guardarSubiendoMecanica(false);

    firebase.storage
      .ref("documentosConductor")
      .child(nombre)
      .getDownloadURL()
      .then((result) => {
        guardarUrlImagenMecanica(result);
        guardarCargando(false);
      })
      .catch((err) => {
        console.log("err");
        console.log(err);
        alert("Hubo un error, vuelve a intentar subir la imagen");
      });
  };

  const handledProgressMecanica = (progresoUpd) => {
    guardarProgresoMecanica(progresoUpd);
    guardarCargando(true);
    console.log(progresoUpd);
  };

  const handleUploadStartConductor = () => {
    guardarProgresoConductor(0);
    guardarSubiendoConductor(true);
    guardarCargando(true);
  };

  const handleUploadErrorConductor = (err) => {
    guardarSubiendoConductor(false);
    console.log(err);
    guardarCargando(false);
  };

  const handleUploadSucessConductor = (nombre) => {
    guardarProgresoConductor(100);
    guardarSubiendoConductor(false);

    firebase.storage
      .ref("documentosConductor")
      .child(nombre)
      .getDownloadURL()
      .then((result) => {
        guardarUrlImagenConductor(result);
        guardarCargando(false);
      })
      .catch((err) => {
        console.log("err");
        console.log(err);
        alert("Hubo un error, vuelve a intentar subir la imagen");
      });
  };

  const handledProgressConductor = (progresoUpd) => {
    guardarProgresoConductor(progresoUpd);
    guardarCargando(true);
    console.log(progresoUpd);
  };

  return (
    <>
      <div className="flex justify-center mt-40">
        <img src={logo} alt="Logo" />;
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <Grid container>
            <Grid item xs={6}>
              <div className="text-white flex justify-center">
                RELLENAR INFORMACIÓN
              </div>

              <div className="flex flex-col">
                <input
                  className=" w-1/2 h-1/2 self-center shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-5"
                  placeholder="NOMBRE"
                  id="nombre"
                  type="text"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nombre && formik.errors.nombre ? (
                  <div
                    className="w-1/2 h-1/2 self-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                    role="alert"
                  >
                    <p className="font-bold"> Hubo un error:</p>
                    <p>{formik.errors.nombre} </p>
                  </div>
                ) : null}
                <input
                  className=" w-1/2 h-1/2 self-center shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-5"
                  placeholder="PlACAS"
                  id="placas"
                  type="text"
                  value={formik.values.placas}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.placas && formik.errors.placas ? (
                  <div
                    className="w-1/2 h-1/2 self-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                    role="alert"
                  >
                    <p className="font-bold"> Hubo un error:</p>
                    <p>{formik.errors.placas} </p>
                  </div>
                ) : null}
                <input
                  className=" w-1/2 h-1/2 self-center shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-5"
                  placeholder="CORREO"
                  id="correo"
                  type="text"
                  value={formik.values.correo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.correo && formik.errors.correo ? (
                  <div
                    className="w-1/2 h-1/2 self-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                    role="alert"
                  >
                    <p className="font-bold"> Hubo un error:</p>
                    <p>{formik.errors.correo} </p>
                  </div>
                ) : null}
                <input
                  className=" w-1/2 h-1/2 self-center shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-5"
                  placeholder="TELÉFONO"
                  id="telefono"
                  type="text"
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.telefono && formik.errors.telefono ? (
                  <div
                    className="w-1/2 h-1/2 self-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                    role="alert"
                  >
                    <p className="font-bold"> Hubo un error:</p>
                    <p>{formik.errors.telefono} </p>
                  </div>
                ) : null}
                <input
                  className=" w-1/2 h-1/2 self-center shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-5"
                  placeholder="CLAVE"
                  id="clave"
                  type="password"
                  value={formik.values.clave}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.clave && formik.errors.clave ? (
                  <div
                    className="w-1/2 h-1/2 self-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                    role="alert"
                  >
                    <p className="font-bold"> Hubo un error:</p>
                    <p>{formik.errors.clave} </p>
                  </div>
                ) : null}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="text-white flex justify-center">
                ADJUNTAR ARCHIVOS
              </div>

              <div className="flex flex-col">
                <label
                  className="block w-1/2 h-1/2 self-center text-white text-sm font-bold mt-5"
                  htmlFor="pase"
                >
                  {" "}
                  FOTO PASE DE CONDUCIR{" "}
                </label>

                <FileUploader
                  className="w-1/2 h-1/2 self-center bg-white shadow appearance-none text-center font-bold placeholder-black border  py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-1"
                  accept="image/*"
                  id="fotoPase"
                  name="fotoPase"
                  randomizeFilename
                  storageRef={firebase.storage.ref("documentosConductor")}
                  onUploadStart={handleUploadStartPase}
                  onUploadError={handleUploadErrorPase}
                  onUploadSuccess={handleUploadSucessPase}
                  onProgress={handledProgressPase}
                />

                {subiendoPase && (
                  <div className="h-12 self-center relative w-1/2 border mt-5">
                    <div
                      className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                      style={{ width: `${progresoPase}%` }}
                    >
                      {progresoPase}%
                    </div>
                  </div>
                )}

                {urlImagenPase && (
                  <p className=" h-12 self-center  bg-green-500 text-white p-3 text-center mt-3">
                    La imagen del pase se subió correctamente
                  </p>
                )}

                <label
                  className="block w-1/2 h-1/2 self-center text-white text-sm font-bold mt-3"
                  htmlFor="soat"
                >
                  {" "}
                  FOTO SOAT{" "}
                </label>

                <FileUploader
                  className="w-1/2 h-1/2 self-center bg-white shadow appearance-none text-center font-bold placeholder-black border  py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-1"
                  accept="image/*"
                  id="fotoSoat"
                  name="fotoSoat"
                  randomizeFilename
                  storageRef={firebase.storage.ref("documentosConductor")}
                  onUploadStart={handleUploadStartSoat}
                  onUploadError={handleUploadErrorSoat}
                  onUploadSuccess={handleUploadSucessSoat}
                  onProgress={handledProgressSoat}
                />

                {subiendoSoat && (
                  <div className="h-12 self-center relative w-1/2 border mt-5">
                    <div
                      className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                      style={{ width: `${progresoSoat}%` }}
                    >
                      {progresoSoat}%
                    </div>
                  </div>
                )}

                {urlImagenSoat && (
                  <p className=" h-12 self-center  bg-green-500 text-white p-3 text-center mt-3">
                    La imagen del pase se subió correctamente
                  </p>
                )}

                <label
                  className="block w-1/2 h-1/2 self-center text-white text-sm font-bold mt-3"
                  htmlFor="tecno"
                >
                  {" "}
                  FOTO TÉCNICO MECÁNICA{" "}
                </label>
                <FileUploader
                  className="w-1/2 h-1/2 self-center bg-white shadow appearance-none text-center font-bold placeholder-black border  py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-1"
                  accept="image/*"
                  id="fotoMecanica"
                  name="fotoMecanica"
                  randomizeFilename
                  storageRef={firebase.storage.ref("documentosConductor")}
                  onUploadStart={handleUploadStartMecanica}
                  onUploadError={handleUploadErrorMecanica}
                  onUploadSuccess={handleUploadSucessMecanica}
                  onProgress={handledProgressMecanica}
                />

                {subiendoMecanica && (
                  <div className="h-12 self-center relative w-1/2 border mt-5">
                    <div
                      className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                      style={{ width: `${progresoMecanica}%` }}
                    >
                      {progresoMecanica}%
                    </div>
                  </div>
                )}

                {urlImagenMecanica && (
                  <p className=" h-12 self-center  bg-green-500 text-white p-3 text-center mt-3">
                    La imagen del pase se subió correctamente
                  </p>
                )}
                <label
                  className="block w-1/2 h-1/2 self-center text-white text-sm font-bold mt-3"
                  htmlFor="cond"
                >
                  {" "}
                  FOTO DEL CONDUCTOR{" "}
                </label>
                <FileUploader
                  className="w-1/2 h-1/2 self-center bg-white shadow appearance-none text-center font-bold placeholder-black border  py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-1"
                  accept="image/*"
                  id="fotoConductor"
                  name="fotoConductor"
                  randomizeFilename
                  storageRef={firebase.storage.ref("documentosConductor")}
                  onUploadStart={handleUploadStartConductor}
                  onUploadError={handleUploadErrorConductor}
                  onUploadSuccess={handleUploadSucessConductor}
                  onProgress={handledProgressConductor}
                />
                {subiendoConductor && (
                  <div className="h-12 self-center relative w-1/2 border mt-5">
                    <div
                      className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                      style={{ width: `${progresoConductor}%` }}
                    >
                      {progresoConductor}%
                    </div>
                  </div>
                )}

                {urlImagenConductor && (
                  <p className=" h-12 self-center  bg-green-500 text-white p-3 text-center mt-3">
                    La imagen del pase se subió correctamente
                  </p>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="flex justify-center">
                {cargando ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <input
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    value="REGISTRAR"
                  />
                )}
              </div>
              <div className="text-white flex justify-center mt-12">
                Wiki App 2020
              </div>
            </Grid>
          </Grid>
        </div>
      </form>
    </>
  );
};

export default RegistroConductor;
