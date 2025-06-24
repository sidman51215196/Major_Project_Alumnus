import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'

const addLeave = async (req, res) => {
  try{
    const {
      userId, 
      leaveType, 
      startDate, 
      endDate, 
      reason
    } = req.body

    const employee = await Employee.findOne({userId})

    const newLeave = new Leave({
      employeeId :employee._id, 
      leaveType, 
      startDate, 
      endDate, 
      reason
    })

    await newLeave.save()

    return res.status(200).json({success: true})
  }
  catch (error){
    console.error(error)
    return res.status(500).json({success: false, error: "add leave server error"})
  }
}

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;

    let leave = await Leave.find({ employeeId: id });

    if (!leave || leave.length === 0) {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }
      leave = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({ success: true, leaves: leave });

  } catch (error) {
    console.error("getLeave error:", error.message);
    return res.status(500).json({ success: false, error: "get leaves server error" });
  }
};


const getLeaves = async (req, res) => {
  try{
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name'
        }
      ]
    })
    return res.status(200).json({success: true, leaves})
  }
  catch(error){
    return res.status(500).json({success: false, error: "get leaves server error"})
  }
}

const getLeaveDetail = async (req, res) => {
  try{
    const {id} = req.params;
    const leave = await Leave.findById({_id: id}).populate({
      path: "employeeId",
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name profileImage'
        }
      ]
    })
    return res.status(200).json({success: true, leave})
  }
  catch(error){
    return res.status(500).json({success: false, error: "get leaves server error"})
  }
}

const updateLeave = async (req, res) => {
  try{
    const {id}= req.params;
    const leave = await Leave.findByIdAndUpdate({_id: id}, {status:req.body.status})
    if(!leave){
      return res.status(404).json({success: false, error: "leave not found"})
    }
    return res.status(200).json({success: true, leave})
  }
  catch(error){
    return res.status(500).json({success: false, error: "leaves update server error"})
  }
}

export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave }