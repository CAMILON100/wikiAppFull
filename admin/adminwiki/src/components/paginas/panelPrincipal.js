import React, { useState, useEffect, useContext } from "react";
import logo from "./logoWiki.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import Moment from "react-moment";
import "moment/locale/es";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Link } from "react-router-dom";

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#228B22",
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

const PanelPrincipal = () => {
  document.title = "Wiki App - Panel Administrativo";

  const navigate = useNavigate();

  const [cargando, guardarCargando] = useState(true);
  const { firebase } = useContext(FirebaseContext);

  const [conductoresData, guardarConductoresData] = useState([]);

  const [conductoresDataTemp, guardarconductoresDataTemp] = useState([]);

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
          guardarCargando(false);
        } else {
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        navigate("/");
      });
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    firebase.db
      .collection("usuarios")
      .where("tipo", "==", 1)
      .onSnapshot(manejarSnapshot);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  function manejarSnapshot(snapshot) {
    const conductoresF = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    let dataRows = [];

    for (let i = 0; i < conductoresF.length; i++) {
      let conductorElement = conductoresF[i];

      let codigoi = conductorElement.codigo,
        placasi = conductorElement.placas;

      let conductori = (
        <Link to={`/conductor/${conductorElement.id}`}>
          {conductorElement.nombre}
        </Link>
      );
      var fechaInicioi;
      if (conductorElement.fechaInicio === undefined) {
        fechaInicioi = (
          <TextField
            id="date"
            type="date"
            onChange={(e) => guardarFechaInicio(conductorElement.id, e)}
          />
        );
      } else {
        fechaInicioi = (
          <TextField
            id="date"
            type="date"
            defaultValue={conductorElement.fechaInicio}
            onChange={(e) => guardarFechaInicio(conductorElement.id, e)}
          />
        );
      }
      var fechaFini;
      if (conductorElement.fechaFin === undefined) {
        fechaFini = (
          <TextField
            id="date2"
            type="date"
            onChange={(e) => guardarFechaFin(conductorElement.id, e)}
          />
        );
      } else {
        fechaFini = (
          <TextField
            id="date2"
            type="date"
            defaultValue={conductorElement.fechaFin}
            onChange={(e) => guardarFechaFin(conductorElement.id, e)}
          />
        );
      }
      var activadoi;
      if (conductorElement.activado) {
        activadoi = (
          <BootstrapButton
            variant="contained"
            color="primary"
            onClick={(e) =>
              desactivarConductor(
                false,
                conductorElement.id,
                conductorElement.creado,
                conductorElement.fechaInicio,
                conductorElement.fechaFin,
                conductorElement.email,
                conductorElement.clave,
                e
              )
            }
          >
            ACTIVADO
          </BootstrapButton>
        );
      } else {
        activadoi = (
          <BootstrapButton2
            variant="contained"
            color="primary"
            onClick={(e) =>
              desactivarConductor(
                true,
                conductorElement.id,
                conductorElement.creado,
                conductorElement.fechaInicio,
                conductorElement.fechaFin,
                conductorElement.email,
                conductorElement.clave,
                e
              )
            }
          >
            DESACTIVADO
          </BootstrapButton2>
        );
      }

      dataRows.push(
        createData(
          codigoi,
          conductori,
          placasi,
          fechaInicioi,
          fechaFini,
          activadoi
        )
      );
    }

    guardarConductoresData(dataRows);
    guardarconductoresDataTemp(dataRows);

    //console.log(conductoresF);
  }

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  function createData(
    codigo,
    conductor,
    placas,
    inicio,
    finServicio,
    Activacion
  ) {
    return { codigo, conductor, placas, inicio, finServicio, Activacion };
  }

  const classes = useStyles();

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
    /*console.log(estadoB);
    console.log(idConductor);*/

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

  const filtrarConductores = (e) => {
    console.log(e.target.value);

    if (e.target.value === "<empty string>") {
      guardarConductoresData(conductoresDataTemp);
    } else {
      let filtradoConductores = [];

      for (let i = 0; i < conductoresDataTemp.length; i++) {
        const element = conductoresDataTemp[i];

        if (
          element.codigo.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          filtradoConductores.push(element);
        }
      }

      guardarConductoresData(filtradoConductores);
    }
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
                  onChange={filtrarConductores}
                />
              </div>
            </div>
          </div>
          <div className=" text-white flex justify-end -mt-10 mr-10">
            <Moment format="LL" locale="es">
              {new Date()}
            </Moment>
          </div>
          <TableContainer component={Paper} className="mt-10">
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div className="font-bold">Código</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Conductor</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Placas</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Inicio</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Fin de Servicio</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Activación</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conductoresData.map((row) => (
                  <TableRow key={row.codigo}>
                    <TableCell component="th" scope="row">
                      {row.codigo}
                    </TableCell>
                    <TableCell>{row.conductor}</TableCell>
                    <TableCell>{row.placas}</TableCell>
                    <TableCell>{row.inicio}</TableCell>
                    <TableCell>{row.finServicio}</TableCell>
                    <TableCell>{row.Activacion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default PanelPrincipal;
