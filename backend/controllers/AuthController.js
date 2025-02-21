import User from "../models/Usermodel.js";

// Function to register a new user
export const RegisterUser = async(req,res)=>{
 
  try {
    const { name, email, password, role } = req.body;

    //check if the role is allowed for registration
    if (["admin", "staff", "super-admin"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Role not allowed to register" });
    }
    //Create User
    const user = await User.create({
      name,
      email,
      password,
      role: role || "buyer",
    });


    //Add Business Details to Vendor 
    if(role == "vendor" && req.body.business){
        user.business = req.body.business;
        await user.save();
    }
    sendTokenResponse(user,200,res);
  } catch (error) {
     res.status(400).json({
      success: false,
      message: error.message
    });
  
  }
}


export const LoginUser = async(req,res) =>{
  //Validate email and password
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }
    const user = User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //check if the password matches

    const isPassword = await user.matchPassword(password);

    if(!isPassword){
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    sendTokenResponse(user,200,res);
  } catch (error) {
     res.status(400).json({
      success: false,
      message: error.message
    });
  
  }
}


//Get User Details  

export const getMe = async(req,res) =>{

  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  
  }


  const sendTokenResponse = (user, statuscode, res) => {
    const token = getSignedJwtToken();
    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  };
}