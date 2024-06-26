var express = require('express');
var router = express.Router();
var initializeConnection = require('../config/db'); // Asegúrate de que la ruta es correcta
var cors = require('cors');
var bcrypt = require('bcrypt');

router.use(express.json());
router.use(cors());
// Middleware para analizar solicitudes URL-encoded
router.use(express.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Us', async function(req, res, next) {
  try {
    const connection = await initializeConnection();
    const [rows] = await connection.query("SELECT * FROM Usuarios");
    if (rows.length === 0) {
      return res.status(204).json({ status: 204, message: "No items found" });
    }
    return res.status(200).json({ status: 200, data: rows });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
});

router.get('/Recolectores', async function(req, res, next) {
  try {
    const connection = await initializeConnection();
    const [rows] = await connection.query("SELECT * FROM Recolectores");
    if (rows.length === 0) {
      return res.status(204).json({ status: 204, message: "No items found" });
    }
    return res.status(200).json({ status: 200, data: rows });
    
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
    
  }
});


router.get('/Plantas', async function(req, res, next) {
  try {
    const connection = await initializeConnection();
    const [rows] = await connection.query("SELECT * FROM Plantas");
    if (rows.length === 0) {
      return res.status(204).json({ status: 204, message: "No items found" });
    }
    return res.status(200).json({ status: 200, data: rows });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
});



router.get("/Plantas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await initializeConnection();
    const [result] = await connection.query('SELECT * FROM Plantas WHERE id = ?', [id]);
    
    if (result.length > 0) {
      res.send(result[0]); 
    } else {
      res.status(404).send('Planta no encontrada'); 
    }
  } catch (err) {
    console.log('Error:', err);
    res.status(500).send('Error al obtener la planta');
  }
});

//borrar plantas

router.delete("/borrarPlanta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await initializeConnection();
    const [result] = await connection.query('DELETE FROM Plantas WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.send('Planta borrada exitosamente');
    } else {
      res.status(404).send('Planta no encontrada');
    }
  } catch (err) {
    console.log('Error al borrar la planta:', err);
    res.status(500).send('Error al borrar la planta');
  }
});


router.post('/create', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Encriptar la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const connection = await initializeConnection();
    const [result] = await connection.query(
      'INSERT INTO Usuarios (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );

    res.status(201).json({ status: 201, message: 'Usuario registrado exitosamente', data: result });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ status: 500, message: 'Error al registrar el usuario', error: err.message });
  }
});

//Inicio de sesion

router.post('/Login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // busqueda del email
    const connection = await initializeConnection();
    const [results] = await connection.query('SELECT * FROM Usuarios WHERE email = ?', [email]);

    if (results.length === 0) {
      res.status(401).send('Usuario no encontrado');
      return;
    }

    const user = results[0];

    // comparacion de contra encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send('Contraseña incorrecta');
      return;
    }

    res.send('Inicio de sesión exitoso');
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});






//Registrar Recolectores


router.post("/regR", async (req, res) => {
  const { name, state, country, city } = req.body;

  try {
    const connection = await initializeConnection();
    const query = 'INSERT INTO Recolectores (name, state, country, city) VALUES (?, ?, ?, ?)';
    const values = [name, state, country, city];

    const [result] = await connection.query(query, values);
    res.send('Recolector registrado exitosamente');
  } catch (err) {
    console.log('Error al insertar datos:', err);
    res.status(500).send('Error al registrar recolector');
  }
});


//registrar Planta

router.post("/regP", async (req, res) => {
  const {
    scientific_name,
    common_name,
    family,
    genus,
    species,
    description,
    habitat,
    location,
    image,
    collection_date,
    recolector_id
  } = req.body;

  try {
    const connection = await initializeConnection();
    const query = 'INSERT INTO Plantas (scientific_name, common_name, family, genus, species, description, habitat, location, image, collection_date, recolector_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [scientific_name, common_name, family, genus, species, description, habitat, location, image, collection_date, recolector_id];

    const [result] = await connection.query(query, values);
    res.send('Planta registrada exitosamente');
  } catch (err) {
    console.log('Error al insertar datos:', err);
    res.status(500).send('Error al registrar planta');
  }
});


//Actualizar planta
router.post("/PlantasUp/:id", async (req, res) => {
  const { id } = req.params;
  const {
    scientific_name,
    common_name,
    family,
    genus,
    species,
    description,
    habitat,
    location,
    image,
    collection_date,
    recolector_id
  } = req.body;

  const query = `UPDATE Plantas SET scientific_name = ?, common_name = ?, family = ?, genus = ?, species = ?, description = ?, habitat = ?, location = ?, image = ?, collection_date = ?, recolector_id = ? WHERE id = ?`;

  try {
    const connection = await initializeConnection();
    const [result] = await connection.query(query, [scientific_name, common_name, family, genus, species, description, habitat, location, image, collection_date, recolector_id, id]);
    res.send('Planta actualizada exitosamente');
  } catch (err) {
    console.log('Error al actualizar datos:', err);
    res.status(500).send('Error al actualizar la planta');
  }
});

router.get("/Recolectores/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await initializeConnection();
    const [result] = await connection.query('SELECT * FROM Recolectores WHERE id = ?', [id]);
    
    if (result.length > 0) {
      res.send(result[0]); 
    } else {
      res.status(404).send('Recolectores no encontrada'); 
    }
  } catch (err) {
    console.log('Error:', err);
    res.status(500).send('Error al obtener la Recolector');
  }
});

module.exports = router;