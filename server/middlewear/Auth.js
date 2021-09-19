const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const authenticateEmployee = async function (req, res, next) {

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = await jwt.verify(token, process.env.secret);

        const employee = await Employee.findOne({ _id: decode._id, 'tokens.token': token});
        if (!employee) {
            throw new Error();
        }

        req.token = token;
        req.employee = employee;
        next();
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' });
    }
}


module.exports = { authenticateEmployee };