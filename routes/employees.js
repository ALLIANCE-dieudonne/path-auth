const express = require('express');
const router = express.Router();
const path = require('path');
const employeeController = require('../controllers/employeeController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleWare/verifyRoles')


router.route('/')
    .get(employeeController.getAllEmployees)
    .post(verifyRoles (ROLES_LIST.admin,ROLES_LIST.editor),employeeController.addEmployee)
    .put(verifyRoles(ROLES_LIST.admin,ROLES_LIST.editor),employeeController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.admin),employeeController.deleteEmployee);
router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router;