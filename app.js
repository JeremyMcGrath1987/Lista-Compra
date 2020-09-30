const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

//conexión a mongoDB
mongoose.connect('mongodb+srv://<insertar url MongoDB>', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Conexión a la BD éxitosa...');
});

connection.on('error', (err) => {
    console.log('Error en la conexón a la BD: ', err);
});

//modelo
const ListaCompra = mongoose.model('listaCompra', { text: String, completed: Boolean });

app.post('/add', (req, res) => {
    const listaCompra = new ListaCompra({ text: req.body.text, completed: false });

    listaCompra.save().then(doc => {
        console.log('Dato insertado con éxito...', doc);
        res.json({ response: 'success' });
    })
        .catch(err => {
            console.log('Error al insertar ', err.message);
            res.status(400).json({ response: 'failed' });
        });
        

});

app.get('/get-all', (req, res) => {
    ListaCompra.find({}, 'text completed')
        .then(doc => {
            res.json({ response: 'success', list: doc })
        })
        .catch(err => {
            console.log('Error al consultar elementos...', err.message);
            res.status(400).json({ response: 'failed' });
        });

});

app.get('/complete/:id/:status', (req, res) => {
    const id = req.params.id;
    const status = req.params.status == 'true';

    ListaCompra.findByIdAndUpdate({ _id: id }, { $set: { completed: status } })
        .then(doc => {
            res.json({ response: 'success' });
        })
        .catch(err => {
            console.log('Error al actualizar dato...', err.message);
            res.status(400).json({ response: 'failed' });
        });
});

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    ListaCompra.findByIdAndDelete({_id: id})
    .then(doc => {
        /* res.json({ response: 'success' }); */
        res.redirect('/');
    })
    .catch(err =>{
        console.log('Error al eliminar dato...', err.message);
        res.status(400).json({ response: 'failed' });
    })
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor iniciado...');
})