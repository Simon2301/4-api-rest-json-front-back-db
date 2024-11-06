//modulos
const express = require('express');
const db = require('./db/conexion');
const fs = require('fs') //Permite trabajar con archivos (file system) incluida con node, no se instala
const cors = require('cors');
const app = express();
const port = 3000;


//Middleware
app.use(express.json())
app.use(express.static('./public')) //Ejecuta directamente el front al correr el servidor
app.use(cors())


app.get('/productos', (req, res) => {
    // res.send('Listado de productos')

    const sql = "SELECT * FROM productos"
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error de lectura")
            return
        }
        console.log(result)
        res.json(result)
    })

    //    const datos= leerDatos();
    //    res.json(datos.productos);
})

app.get('/productos/:id', (req, res) => {
    //res.send('Buscar producto por ID')
    const datos = leerDatos();
    const prodEncontrado = datos.productos.find((p) => p.id == req.params.id)
    if (!prodEncontrado) { // ! (no) o diferente
        return res.status(404).json(`No se encuentra el producto`)
    }
    res.json({
        mensaje: "producto encontrado",
        producto: prodEncontrado
    })
})

app.post('/productos', (req, res) => {
    //res.send('Guardando nuevo producto')
    console.log(req.body)
    console.log(Object.values(req.body))
    const values = Object.values(req.body)
    const sql = "INSERT INTO productos (imagen, titulo, descripcion, precio) VALUES (?,?,?,?)"

    db.query(sql, values, (err, result)=>{
        if(err){
            console.error('Error al guardar')
            return
        }
        res.json({mensaje: "Nuevo producto agregado"})
    })
})

app.put('/productos/:id', (req, res) => {
    // res.send('Actualizar producto por id')
    const id = req.params.id;
    const nuevosDatos = req.body;
    const datos = leerDatos()
    const prodEncontrado = datos.productos.find((p) => p.id == req.params.id)
    console.log(prodEncontrado)
    if (!prodEncontrado) {
        return res.status(404).json({ "Mensaje": "No se encontró el producto" })
    }
    datos.productos = datos.productos.map(p => p.id == req.params.id ? { ...p, ...nuevosDatos } : p)
    escribirDatos(datos)
    res.json({ "Mensaje": "Producto Actualizado" })
})

app.delete('/productos/:id', (req, res) => {
    // res.send('Eliminando Producto')
    const id = req.params.id;
    const datos = leerDatos()
    const prodEncontrado = datos.productos.find((p) => p.id == req.params.id)
    if (!prodEncontrado) {
        return res.status(404).json(`No se encuentra el producto`)
    }
    datos.productos = datos.productos.filter((p) => p.id != req.params.id)
    let indice = 1
    datos.productos.map((p) => {
        p.id = indice
        indice++
    })
    escribirDatos(datos)
    res.json({ "Mensaje": "Producto Eliminado" })
})

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});