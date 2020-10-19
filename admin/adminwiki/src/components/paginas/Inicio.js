import React, { useContext, useState } from "react";
import logo from "./logoWiki.png";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const Inicio = () => {
  const { firebase } = useContext(FirebaseContext);

  document.title = "Wiki App - Inicio";

  const [cargando, guardarCargando] = useState(false);

  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: 30,
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  }));

  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      usuario: "",
      clave: "",
    },
    validationSchema: Yup.object({
      usuario: Yup.string()
        .min(5, "El usuario debe tener mínimo 5 caracteres")
        .required("El usuario es obligatorio"),
      clave: Yup.string()
        .min(6, "La clave debe tener mínimo 6 caracteres")
        .required("La clave es obligatoria"),
    }),
    onSubmit: (datos) => {
      //console.log(datos);
      guardarCargando(true);

      firebase.auth
        .signInWithEmailAndPassword(datos.usuario, datos.clave)
        .then((authUser) => {
          console.log("Nice Login");

          firebase.auth.currentUser
            .getIdToken(true)
            .then(function (idToken) {
              localStorage.setItem("tokenAdmin", idToken);

              firebase.db
                .collection("datosGenerales")
                .doc("W2GJ2VboeSnvKRKB3rKY")
                .update({ tokenAdmin: idToken })
                .then(() => {
                  console.log("updatedToken");
                  guardarCargando(false);
                  navigate("panelPrincipal");
                })
                .catch((error) => {
                  guardarCargando(false);
                  alert("Ha ocurrido un error, inténtelo de nuevo");
                });
            })
            .catch(function (error) {
              console.log("error");
              console.log(error);
              guardarCargando(false);
              alert("Ha ocurrido un error, inténtelo de nuevo");
            });
        })
        .catch((error) => {
          console.log("error");
          console.log(error);
          guardarCargando(false);
          alert("Verifique usuario y contraseña");
        });
    },
  });

  return (
    <>
      <div className="h-full w-full bg-fondo absolute flex flex-col">
        <div className="flex justify-center mt-40">
          <img src={logo} alt="logo" />;
        </div>

        <div className="flex justify-center mt-10">
          <form className="w-1/5 h-12" onSubmit={formik.handleSubmit}>
            <input
              className=" w-full h-full shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              placeholder="USUARIO"
              id="usuario"
              type="text"
              value={formik.values.usuario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.usuario && formik.errors.usuario ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                role="alert"
              >
                <p className="font-bold"> Hubo un error:</p>
                <p>{formik.errors.usuario} </p>
              </div>
            ) : null}

            <input
              className=" w-full h-full shadow appearance-none text-center font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mt-10"
              placeholder="CLAVE"
              id="clave"
              type="password"
              value={formik.values.clave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.clave && formik.errors.clave ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2 rounded-full"
                role="alert"
              >
                <p className="font-bold"> Hubo un error:</p>
                <p>{formik.errors.clave} </p>
              </div>
            ) : null}

            <div className="flex justify-center">
              {cargando ? (
                <div className={classes.root}>
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <input
                  type="submit"
                  className="bg-boton-naranja hover:bg-gray-500 w-1/2 mt-10 p-2 text-white uppercase font-bold rounded-full"
                  value="entrar"
                />
              )}
            </div>

            <div className="flex justify-center mt-12">
              <Link to="/registroConductor">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                  REGISTRARME COMO CONDUCTOR
                </button>
              </Link>
            </div>
            <div className="text-white flex justify-center mt-12">
              Wiki App 2020
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Inicio;
