import SubCategoryModel from "../models/subCategory.model.js";
import { safeRedisDel, safeRedisGet, safeRedisSet } from "../config/redis.js";

export const AddSubCategoryController = async (request, response) => {
    try {
        const { name, image, category } = request.body;

        if (!name || !image || !category?.[0]) {
            return response.status(400).json({
                message: "Provide name, image, category",
                error: true,
                success: false
            });
        }

        const payload = {
            name,
            image,
            category
        };

        const createSubCategory = new SubCategoryModel(payload);

        const save = await createSubCategory.save();

        await safeRedisDel("subcategories");

        return response.json({
            message: "Sub Category Created",
            data: save,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getSubCategoryController = async(request,response)=>{
    try {
        const cachedSubCategories = await safeRedisGet("subcategories");

        if (cachedSubCategories) {
            try {
                return response.json({
                    message: "Sub Category data",
                    data: JSON.parse(cachedSubCategories),
                    source: "redis-cache",
                    error: false,
                    success: true
                });
            } catch (parseError) {
                console.log("Redis parse error:", parseError.message || parseError);
            }
        }

        const data = await SubCategoryModel.find().sort({ createdAt: -1 }).populate("category").lean();

        await safeRedisSet("subcategories", JSON.stringify(data));

        return response.json({
            message : "Sub Category data",
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        console.log(error);
        
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateSubCategoryController = async(request,response)=>{
    try {
        const { _id, name, image,category } = request.body 

        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            return response.status(400).json({
                message : "Check your _id",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        await safeRedisDel("subcategories");

        return response.json({
            message : 'Updated Successfully',
            data : updateSubCategory,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false 
        })
    }
}

export const deleteSubCategoryController = async(request,response)=>{
    try {
        const { _id } = request.body 
        console.log("Id",_id)
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        await safeRedisDel("subcategories");

        return response.json({
            message : "Delete successfully",
            data : deleteSub,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}