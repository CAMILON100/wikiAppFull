import React, { useState, useEffect, useContext } from "react";
import logo from "./logoWiki.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import Moment from "react-moment";
import "moment/locale/es";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#228B22",
    marginTop: "8%",
    marginLeft: "7.8%",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#2E8B57",
    },
  },
})(Button);

const BootstrapButton2 = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#FF0000",
    marginTop: "8%",
    marginLeft: "7.8%",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#B22222",
    },
  },
})(Button);

const BootstrapButton3 = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#FFA500",
    marginTop: "10%",
    marginLeft: "2%",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#FF8C00",
    },
  },
})(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 100,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Conductor = () => {
  document.title = "Wiki App - Panel Administrativo";

  const idConductor = useParams();

  const classes = useStyles();

  const [cargando, guardarCargando] = useState(true);
  const { firebase } = useContext(FirebaseContext);

  const [conductoresData, guardarConductoresData] = useState({});

  const [activadoBoton, guardarActivadoBoton] = useState(false);

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("tokenAdmin");
    //console.log(tokenAdmin);
    if (tokenAdmin === null || tokenAdmin === undefined) {
      navigate("/");
    }

    firebase.db
      .collection("datosGenerales")
      .where("tokenAdmin", "==", tokenAdmin)
      .get()
      .then(function (querySnapshot) {
        let flagDocs = false;
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots

          flagDocs = true;
        });

        if (flagDocs) {
        } else {
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        navigate("/");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let usuariosRef = firebase.db
      .collection("usuarios")
      .doc(idConductor.idConductor);

    usuariosRef
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          guardarCargando(false);
          navigate("/");
        } else {
          let finalCond = { id: idConductor.idConductor, ...snapshot.data() };
          guardarConductoresData(finalCond);
          guardarActivadoBoton(finalCond.activado);
          guardarCargando(false);
        }
      })
      .catch((error) => {
        guardarCargando(false);
        navigate("/");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useNavigate();

  const desactivarConductor = (
    estadoB,
    idConductor,
    primeraVez,
    fechaInicioDes,
    fechaFinDes,
    emailDes,
    claveDes,
    e
  ) => {
    // console.log(estadoB);
    //console.log(idConductor);
    guardarActivadoBoton(estadoB);
    guardarCargando(true);

    let usuariosRef = firebase.db.collection("usuarios");

    var updateDoc = {};

    if (estadoB === true && primeraVez === false) {
      updateDoc = { activado: estadoB, creado: true };
    } else {
      updateDoc = { activado: estadoB };
    }

    usuariosRef
      .doc(idConductor)
      .update(updateDoc)
      .then(() => {
        axios
          .post(
            "https://us-central1-wikiapplogin.cloudfunctions.net/sendMailDesactivar",
            {
              estadoB: estadoB,
              primeraVez: !primeraVez,
              idConductor: idConductor,
              emailDes: emailDes,
              claveDes: claveDes,
              fechaInicioDes: fechaInicioDes,
              fechaFinDes: fechaFinDes,
            }
          )
          .then((res) => {
            console.log("res");
            console.log(res);
            console.log(res.data);
            guardarCargando(false);
          });
      })
      .catch((error) => {
        console.log(error);
        alert(
          "Hubo un error en la conexión, verifique el internet y vuelva a intentarlo"
        );
        guardarCargando(false);
      });
  };

  const guardarFechaFin = (idConductor, e) => {
    let usuariosRef = firebase.db.collection("usuarios");

    usuariosRef
      .doc(idConductor)
      .update({ fechaFin: e.target.value })
      .then(() => {})
      .catch((error) => {
        alert(
          "Hubo un error en la conexión, verifique el internet y vuelva a intentarlo"
        );
      });
  };

  const guardarFechaInicio = (idConductor, e) => {
    let usuariosRef = firebase.db.collection("usuarios");

    usuariosRef
      .doc(idConductor)
      .update({ fechaInicio: e.target.value })
      .then(() => {})
      .catch((error) => {
        alert(
          "Hubo un error en la conexión, verifique el internet y vuelva a intentarlo"
        );
      });
  };

  return (
    <>
      {cargando ? (
        <div className="flex justify-center mt-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="h-1/5 w-full bg-fondo  ">
            <div className="flex flex-row">
              <div className="w-1/3">
                <img src={logo} alt="Logo" />;
              </div>

              <div className=" w-full max-w-3xl self-center ">
                <input
                  className=" h-20 w-full shadow appearance-none text-2xl font-bold placeholder-black border  rounded-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Buscar:"
                  id="buscar"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className=" text-white flex justify-end -mt-10 mr-10">
            <Moment format="LL" locale="es">
              {new Date()}
            </Moment>
          </div>

          <div className={classes.root}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Card className="max-w-md ml-64">
                  <div className="text-center text-xl">Conductor</div>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={conductoresData.conductor}
                      title="Foto del conductor"
                    />
                    <CardContent>
                      <Typography
                        className="text-center"
                        gutterBottom
                        variant="h5"
                        component="h2"
                      >
                        {conductoresData.nombre}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Código: {conductoresData.codigo}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Placas: {conductoresData.placas}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Correo: {conductoresData.email}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Teléfono: {conductoresData.telefono}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <div style={{ marginLeft: "90%" }} className="-mt-12">
                    <CancelPresentationIcon
                      style={{ fontSize: 40 }}
                      onClick={() => {
                        navigate("/panelPrincipal");
                      }}
                    />
                  </div>

                  <div>
                    <BootstrapButton3
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        navigate(
                          `/conductorListaViajes/${idConductor.idConductor}`
                        );
                      }}
                    >
                      Listado de viajes realizados
                    </BootstrapButton3>
                  </div>

                  <div style={{ marginLeft: "12%" }} className="mt-5">
                    Inicio
                  </div>

                  <div>
                    {conductoresData.fechaInicio === undefined ? (
                      <TextField
                        id="date"
                        type="date"
                        style={{ marginLeft: "8.5%" }}
                        className="mt-3"
                        onChange={(e) =>
                          guardarFechaInicio(conductoresData.id, e)
                        }
                      />
                    ) : (
                      <TextField
                        id="date"
                        type="date"
                        style={{ marginLeft: "8.5%" }}
                        className="mt-3"
                        defaultValue={conductoresData.fechaInicio}
                        onChange={(e) =>
                          guardarFechaInicio(conductoresData.id, e)
                        }
                      />
                    )}
                  </div>

                  <div style={{ marginLeft: "9%" }} className="mt-5">
                    Fin de servicio
                  </div>

                  <div>
                    {conductoresData.fechaInicio === undefined ? (
                      <TextField
                        id="date2"
                        type="date"
                        style={{ marginLeft: "8.5%" }}
                        className="mt-3"
                        onChange={(e) => guardarFechaFin(conductoresData.id, e)}
                      />
                    ) : (
                      <TextField
                        id="date2"
                        type="date"
                        style={{ marginLeft: "8.5%" }}
                        className="mt-3"
                        defaultValue={conductoresData.fechaFin}
                        onChange={(e) => guardarFechaFin(conductoresData.id, e)}
                      />
                    )}
                  </div>

                  <div>
                    {activadoBoton === true ? (
                      <BootstrapButton
                        variant="contained"
                        color="primary"
                        onClick={(e) =>
                          desactivarConductor(
                            false,
                            conductoresData.id,
                            conductoresData.creado,
                            conductoresData.fechaInicio,
                            conductoresData.fechaFin,
                            conductoresData.email,
                            conductoresData.clave,
                            e
                          )
                        }
                      >
                        ACTIVADO
                      </BootstrapButton>
                    ) : (
                      <BootstrapButton2
                        variant="contained"
                        color="primary"
                        onClick={(e) =>
                          desactivarConductor(
                            true,
                            conductoresData.id,
                            conductoresData.creado,
                            conductoresData.fechaInicio,
                            conductoresData.fechaFin,
                            conductoresData.email,
                            conductoresData.clave,
                            e
                          )
                        }
                      >
                        DESACTIVADO
                      </BootstrapButton2>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </>
  );
};

export default Conductor;
