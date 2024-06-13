var express = require('express');
var router = express.Router();
var initializeConnection = require('../config/db'); // Asegúrate de que la ruta es correcta

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





module.exports = router;