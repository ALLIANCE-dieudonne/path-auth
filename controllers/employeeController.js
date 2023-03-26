const { result } = require('lodash');
const { deleteOne } = require('../model/Employee');
const Employee = require('../model/Employee');
const User = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) {
        return res.status(204).json({ "message": `There are no employees found` });
    }
    res.json(employees);
};

const addEmployee = async (req, res) => {
    if (!req?.body?.firstName || !req?.body?.lastName) {
        return res.status(400).json({ "message": "first name and last name are required" });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstName,
            lastname: req.body.lastName
        });

        res.status(201).json(result);
    } catch (err) { console.error(err); }


};

const updateEmployee = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({"messsage":"ID is required"});
    }

    const employee = await Employee.findOne({ _id: req.body.id}).exec();

    if (!employee) {
        return res.status(204).json({ "message": `Employee id  ${req.body.id} not found` })
    }
    if (req.body?.firstName) employee.firstname = req.body.firstName;
    if (req.body?.lastName) employee.lastname = req.body.lastName;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if(!req?.body?.id)
    {return res.status(400).json({"message":"Employee ID is required"})}
    const employee = await Employee.findOne({ _id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `Employee id  ${req.body.id} not found` })
    }
    const result = await employee.deleteOne({ _id: req.body.id});
    res.json(result);
};

const getEmployee = async (req, res) => {
    if(!req?.params?.id){return res.status(400).json({"message":"Employee ID is required"})}
    const employee  = await Employee.findOne({_id:req.params.id}).exec()
    if (!employee) {
        res.status(400).json({ "message": `Employee ${req.params.id} doesn't exist` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    deleteEmployee,
    getEmployee,
    updateEmployee,
    addEmployee
}