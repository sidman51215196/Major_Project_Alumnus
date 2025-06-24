import Salary from '../models/Salary.js'
import Employee from '../models/Employee.js'

const addSalary = async (req, res) => {
  try{
    const {
      employeeId, 
      basicSalary, 
      allowances, 
      deductions, 
      payDate
    } = req.body

    const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions)

    if (isNaN(totalSalary)) {
      return res.status(400).json({ success: false, error: 'Salary values must be numbers' })
    }

    const newSalary = new Salary({
      employeeId, 
      basicSalary, 
      allowances, 
      deductions,
      netSalary: totalSalary, 
      payDate,
    })
    await newSalary.save()

    return res.status(200).json({success: true})
  }
  catch (error){
    console.error(error)
    return res.status(500).json({success: false, error: "add salary server side error"})
  }
}

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;

    let salary = await Salary.find({ employeeId: id }).populate('employeeId', 'employeeId');

    if (!salary || salary.length < 1) {
      const employee = await Employee.findOne({ userId: id });

      if (!employee) {
        return res.status(200).json({ success: true, salary: [] });
      }

      salary = await Salary.find({ employeeId: employee._id }).populate('employeeId', 'employeeId');
    }

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get salary server side error" });
  }
};


export {addSalary, getSalary}