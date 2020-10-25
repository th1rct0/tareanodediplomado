const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database : 'tareanode'
});

//Conectarnos a la base de datos
connection.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Humbertp Ramos");
});

app.get('/comidas', (req, res) => {
  //Consultar los comidas
  connection.query('SELECT * FROM comidas', function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
    }
    //Regresar un objeto json con el listado de los comidas.
    res.status(200).json(results);
  });
});


app.get('/comidas/:id', (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) {
    res.status(400).json({ error: 'parametros no validos.'});
    return;
  }
  //Consultar los comidas
  connection.query(`SELECT * FROM comidas WHERE id=?`, [id] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    if(results.length === 0) {
      res.status(404).json({ error: 'comida no existente.'});
      return;
    }
    //Regresar un objeto json con el listado de los comidas.
    res.status(200).json(results);
  });
});

app.post('/comidas', (req, res) => {
  console.log("req", req.body);
  //se definen las cariables
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const tipo = req.body.tipo;
  connection.query(`INSERT INTO comidas (nombre, descripcion, tipo) VALUES (?,?,?)`, [nombre,descripcion,tipo] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});