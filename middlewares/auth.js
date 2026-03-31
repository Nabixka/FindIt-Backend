const pool = require("../database/db")

const auth = async (req, res, next) => {
    if(!req.token){
        return res.status(401).json({
            status: 401,
            message: "Token Tidak Ada"
        })
    }

    const result = await pool.query(`
        SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.role,
        COUNT(CASE WHEN i.status = 'found' THEN 1 END) AS found_item,
        COUNT(CASE WHEN i.status = 'lost' THEN 1 END) AS lost_item
        FROM users u 
        LEFT JOIN items i ON i.user_id = u.id
        WHERE u.token = $1
        GROUP BY u.id, u.username`,
    [req.token])

    if(result.rows.length === 0){
        return res.status(401).json({
            status: 401,
            message: "Token Tidak Valid"
        })
    }

    req.user = result.rows[0]
    next()
}

module.exports = auth