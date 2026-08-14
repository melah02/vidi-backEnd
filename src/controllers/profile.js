import User from  '../models/User.js'

export const getUserProfile = async (req,res,next) =>{
    const id = req.user.id;

    try{

        if(!id){
            return res.status(401).json({
                success: false,
                message: "Not a valid user"
            })
        }
    
        const user = await User.findOne({where:{id: id }, attributes:["id", "full_name","email","phone", "is_active", "is_verified", "createdAt"]})
    
        if(!user){
            return res.status(401).json({success:false,
                message: "Failed to get user",
                user:null
            })
        }
    
        return res.status(200).json({
            success: true,
            user: user,
            message: "User found successfully"
        }) 
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            user: null,
            message: "Internal server error",
            error: error
        })
    }

}