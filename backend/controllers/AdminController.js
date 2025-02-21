import User from "../models/Usermodel.js";


// Function to get  the  user
export const getUser = () =>{
  try {
    const users  = User.find();
    res
      .status(200)
      .json({ success: true, message: "User has been Find ", data: users ,count: users.length });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  
  }
}


//Function to Create Staff 

export const createStaff = async(req,res) => {
  const {name, email,password} = req.body;

  try {
    const staff = await User.create({
      name,
      email,
      password,
      role: "staff"
    })

    res.status(201).json({
      success: true,
      message: "Staff has been created",
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


//Function to create assignVendorsToStaff

export const assignVendorsToStaff = async(req,res)=>{
  const {vendorId} = req.body;
  try {
    const staff = await findOne({
      _id:req.params.staffId,
      role: "staff"
  })

  if(!staff){
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

    staff.assignedVendor = vendorId;
    await staff.save();


     res.status(200).json({
       success: true,
       data: staff,
     });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}