const User = require('../models/Usuarios');

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, rows) => {
        if (err){
            res.status(500).json({
                error: 'Error to get all users'
            });
          };
       return res.json(rows);
    });
};

exports.createUser = (req, res) => {
    const { name, age, email, phone, address, city, country, occupation, company } = req.body;
    User.createUser({ name, age, email, phone, address, city, country, occupation, company }, (err, result) => {
        if (err){
            res.status(500).json({
                error: 'Error to create a new user'
            });
          };
       return res.status(201).json(result);
    });
};
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, age, email, phone, address, city, country, occupation, company } = req.body;
    User.updateUser(id, { name, age, email, phone, address, city, country, occupation, company }, (err, result) => {
        if (err){
            res.status(500).json({
                error: 'Error to update a user'
            });
          };
       return res.json(result);
    });
};