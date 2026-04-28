const user = require("../models/UserModel")
const item = require("../models/ItemModel")

// Get User
exports.getUser = async (req, res) => {
    try{
        const result = await user.getUser()
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Get User ById
exports.getUserById = async (req, res) => {
    try{
        const { id } = req.params
        const result = await user.getUserById(id)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getProfil = async (req, res) => {
    try{
        res.status(200).json({
            status: 200,
            message: "success",
            data: req.user
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Delete User
exports.deleteUser = async (req, res) => {
    try{
        const { id } = req.params
        
        const result = await user.deleteUser(id)
        res.status(200).json({
            status: 200,
            message: "success"
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Get All Report
exports.getReport = async (req, res) => {
    try{
        const result = await user.getReport()

        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Get Report By Id
exports.getReportById = async (req, res) => {
    try{
        const { id } = req.params
        const result = await user.getReportById(id)

        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Tidak Ada"
            })
        }

        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Create Report
exports.createReport = async (req, res) => {
    try{
        const { item_id, user_id, reason } = req.body
        const imageUrl = req.file ? `/uploads/report/${req.file.filename}` : null

        if(!item_id || !user_id || !reason || !imageUrl){
            return res.status(400).json({
                status: 400,
                message: "Isi yang Benar Wok"
            })
        }
        const itemExist = await item.getItemById(item_id)
        if(!itemExist){
            return res.status(404).json({
                status: 404,
                message: "Tidak Ada Item"
            })
        }

        const exist = await user.getUserById(user_id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Tidak Ada User"
            })
        }

        const result = await user.createReport({item_id, user_id, reason, proof: imageUrl})
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Get Report User
exports.getReportByUser = async (req, res) => {
    try{
        const { id } = req.params
        
        const exist = await user.getUserById(id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            })
        }

        const result = await user.getReportByUser(id)
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.updateStatusUser = async (req, res) => {
    try{
        const { id } = req.params
        const { status } = req.body

        const exist = await user.getUserById(id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "User Tidak Ada"
            })
        }

        const result = await user.updateStatusUser({id, status})
        const deleteItem = await item.deleteItemUser(id)
        const deleteReport = await user.deleteReport(id)
        res.status(200).json({
            status: 200,
            message: "Success",
            data: result
        })

    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}