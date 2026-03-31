const cekRole = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({
            status: 403,
            message: "Tidak Memiliki Izin"
        })
    }
    next()
}

module.exports = cekRole