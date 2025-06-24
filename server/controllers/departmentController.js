import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";
import User from "../models/User.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({success: true, departments})
  }catch(error){
    return res.status(500).json({success:false, error:"get department server error"})
  }
}

const addDepartment = async (req, res) => {
  try{
    const {dep_name, description}= req.body;
    const newDep= new Department({
      dep_name, 
      description
    })
    await newDep.save()
    return res.status(200).json({success : true, department : newDep})
  } catch{
    return res.status(500).json({success:false, error:"add department server error"})
  }

}

const getDepartment = async (req, res) =>{
  try{
    const {id} = req.params;
    const department = await Department.findById({_id: id})
    return res.status(200).json({success: true, department})
  } catch(error){
    return res.status(500).json({success:false, error:"get department server error"})
  }
}

const updateDepartment = async (req, res) => {
  try{
    const {id} = req.params;
    const {dep_name, description} = req.body;
    const updateDep = await Department.findByIdAndUpdate({_id: id}, {
      dep_name,
      description
    })
    return res.status(200).json({success: true, updateDep})
  } catch(error){
    return res.status(500).json({success:false, error:"edit department server error"})
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    const employees = await Employee.find({ department: id });
    const empIds = employees.map(emp => emp._id);
    const userIds = employees.map(emp => emp.userId).filter(Boolean);

    await Employee.deleteMany({ department: id });
    await Leave.deleteMany({ employeeId: { $in: empIds } });
    await Salary.deleteMany({ employeeId: { $in: empIds } });

    if (userIds.length > 0) {
      await User.deleteMany({ _id: { $in: userIds } });
    }

    await department.deleteOne();

    return res.status(200).json({ success: true, message: "Department and associated data deleted" });

  } catch (error) {
    console.error("Delete Department Error:", error);
    return res.status(500).json({ success: false, error: "delete department server error" });
  }
};

export {addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment}