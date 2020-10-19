import React, { useState, useEffect, useContext } from "react";
import logo from "./logoWiki.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import Moment from "react-moment";
import "moment/locale/es";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const ConductorListaViajes = () => {
  document.title = "Wiki App - Panel Administrativo";

  const navigate = useNavigate();

  const idConductor = useParams();

  const [cargando, guardarCargando] = useState(true);
  const { firebase } = useContext(FirebaseContext);

  const [conductoresData, guardarConductoresData] = useState([]);

  const [conductorDa, guardarConductorDa] = useState({});

  const [fechaDatos, guardarfechaDatos] = useState({});

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
      .collection("solicitudes")
      .where("idConductor", "==", idConductor.idConductor)
      .orderBy("creado", "desc")
      .onSnapshot(manejarSnapshot);
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

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
          guardarConductorDa(finalCond);
        }
      })
      .catch((error) => {
        navigate("/");
      });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

  function manejarSnapshot(snapshot) {
    const conductoresF = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    let dataRows = [];

    let inicioFechaC = new Date(conductoresF[0].creado.seconds * 1000),
      mesInicio = inicioFechaC.getMonth(),
      finFechaC = new Date(inicioFechaC.getFullYear(), mesInicio + 1, 0);

    //console.log(mesInicio);
    guardarfechaDatos({ inicioFechaC: inicioFechaC, finFechaC: finFechaC });

    for (let i = 0; i < conductoresF.length; i++) {
      let conductorElement = conductoresF[i];

      //console.log(conductorElement.creado.seconds);

      var dateCond = new Date(conductorElement.creado.seconds * 1000);

      if (dateCond.getMonth() < mesInicio) {
        break;
      }
      var estadoF;
      if (conductorElement.estado === 2) {
        estadoF = (
          <div>
            ACEPTÓ/ <div className="text-green-500"> REALIZÓ </div>
          </div>
        );
      } else {
        estadoF = (
          <div>
            ACEPTÓ/ <div className="text-red-600"> CANCELÓ </div>
          </div>
        );
      }

      dataRows.push(
        createData(
          <Moment format="DD/MM/YY" locale="es" unix>
            {conductorElement.creado.seconds}
          </Moment>,
          conductorElement.direccionOrigen,
          conductorElement.direccion,
          estadoF,
          conductorElement.valor,
          i
        )
      );
    }

    guardarConductoresData(dataRows);

    //console.log(conductoresF);
  }

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  function createData(fecha, recogida, destino, estado, valor, key) {
    return { fecha, recogida, destino, estado, valor, key };
  }

  const classes = useStyles();

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

          <div className="mt-8 ml-4 flex-col">
            <Grid container>
              <Grid item xs={6}>
                <div className="text-lg">Conductor: {conductorDa.nombre}</div>
              </Grid>
              <Grid item xs={6}>
                Fecha de los datos:{" "}
                <Moment format="DD/MM/YY" locale="es">
                  {fechaDatos.inicioFechaC}
                </Moment>{" "}
                -{" "}
                <Moment format="DD/MM/YY" locale="es">
                  {fechaDatos.finFechaC}
                </Moment>
                <CancelPresentationIcon
                  style={{ fontSize: 40, marginLeft: "60%" }}
                  onClick={() => {
                    navigate("/panelPrincipal");
                  }}
                />
              </Grid>
            </Grid>
          </div>

          <TableContainer component={Paper} className="mt-8">
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div className="font-bold">Fecha</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Recogida</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Destino</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Estado</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">Valor</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conductoresData.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell component="th" scope="row">
                      {row.fecha}
                    </TableCell>
                    <TableCell>{row.recogida}</TableCell>
                    <TableCell>{row.destino}</TableCell>
                    <TableCell>{row.estado}</TableCell>
                    <TableCell>{row.valor}</TableCell>
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

export default ConductorListaViajes;
