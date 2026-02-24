import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

export const me = asyncHandler(async(req:Request,res:Response)=>{
    
    return res.status(200).json({
        success:"true",
        data:{
            name:req.session.name,
            email:req.session.email
        }
    })
})