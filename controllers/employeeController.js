
const data = {
    employee: require('../model/employees.json'),
    setEmployees: function (data) { this.employee = data }

}

const getAllEmployees = (req, res) => {
    res.json(data.employee);
};

const addEmployee = (req, res) => {

    const newEmployee = {
        id: data.employee[data.employee.length - 1].id + 1 || 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
    if (!newEmployee.firstName || !newEmployee.lastName) {
        return res.status(400).json({ "message": "firt name and last name are required" })
    }
   
    data.setEmployees([...data.employee, newEmployee])
    res.json(data.employee)
};

const updateEmployee = (req, res) => {
    const employee = data.employee.find(emp => emp.id === parseInt(req.body.id));

    if (!employee) {
        return res.status(400).json({ "message": `Employee id  ${req.body.id} not found` })
    }
    if (req.body.firstName) employee.firstName = req.body.firstName;
    if (req.body.lastName) employee.lastName = req.body.lastName;
    const filtteredArray = data.employee.filter(emp => emp.id !== parseInt(req.body.id));
    const unsorttedArray = [...filtteredArray, employee];
    data.setEmployees(unsorttedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employee);
}

const deleteEmployee = (req, res) => {
    const employee = data.employee.find(emp => emp.id === parseInt(req.body.id));

    if (!employee) {
        return res.status(400).json({ "message": `Employee id  ${req.body.id} not found` })
    }
    const filtteredArray = data.employee.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filtteredArray]);
    res.json(data.employee);
};

const getEmployee = (req, res) => {
    const employee = data.employee.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        res.status(400).json({ "message": `Employee ${req.body.id} doesn't exist` });
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