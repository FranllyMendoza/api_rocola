const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/cancionesdb",  { useNewUrlParser: true })

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

const cancionSchema = new mongoose.Schema({
    title: String,
    artista: String,
    ruta: String
});

const Canciones = mongoose.model("cancion", cancionSchema);

const listaReproduccionSchema = new mongoose.Schema({
    titulo: String,
    canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cancion' }]
});

const ListaReproduccion = mongoose.model("listaReproduccion", listaReproduccionSchema);

app.route('/canciones')
    .get((req, res) => {
        Canciones.find({}, (err, result)=>{
            res.send(err ?  "<h1>Ha Ocurrido un Error</h1>" : result);
        });
    })
    .post((req, res) => {

        let newCancion = new Canciones({
            title: req.body.title,
            artista: req.body.artista,
            ruta: req.body.ruta,
        });

        newCancion.save((err)=>{
            res.send(err ?  "<h1>Ha Ocurrido un Error</h1>" : "<h1>Se Guardo Exitosamente</h1>");
        });
    })
    .delete((req, res) => {
        Canciones.deleteMany({}, (err) => {
            res.send(err ?  "<h1>Ha Ocurrido un Error</h1>" : "<h1>Se elimino Exitosamente</h1>");
        });
    });

app.route('/canciones/:parameter')
    .get((req, res) => {
        Canciones.findOne({_id: req.params.parameter.toLowerCase()}, (err, result)=>{
            res.send(err ?  "<h1>Articulo no encontrador</h1>" : result);
        })
    })
    .put((req, res) => {
        Canciones.updateOne(
            {_id: req.params.parameter},
            {title: req.body.title, conten: req.body.content},
            (err) => {
                res.send(err ?  "<h1>El articulo no se puedo actualizar</h1>" : "<h1>Actualizado con exito</h1>");
            }
        );
    })
    .patch((req, res) => {
        Canciones.updateOne(
            {_id: req.params.parameter},
            {$set: req.body},
            (err) => {
                res.send(err ?  "<h1>El articulo no se puedo actualizar</h1>" : "<h1>Actualizado con exito</h1>");
            }
        );
    })
    .delete((req, res) => {
        Canciones.deleteOne({_id: req.params.parameter}, (err) => {
            res.send(err ?  "<h1>El articulo no se puedo Eliminar</h1>" : "<h1>Eliminado con exito</h1>");
        })
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
    console.log("http://localhost:3000");
});