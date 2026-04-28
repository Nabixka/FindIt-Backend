const pool = require("../database/db")
const bcrypt = require("bcrypt")

// Get User
const getUser = async () => {
    const result = await pool.query(`
        SELECT * FROM users
    `)

    return result.rows
}

// Get User ById
const getUserById = async (id) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1`,
    [id])

    if(result.rows.length == 0){
        return null
    }

    const user =  result.rows[0]
    delete user.password
    return user
}


// Get By Email
const getUserByEmail = async (email) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email = $1`,
    [email])

    return result.rows[0]
}


// Delete Account
const deleteUser = async (id) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id = $1`, 
    [id])
}

// Get All Report
const getReport = async () => {
    const result = await pool.query(`
        SELECT 
        r.id,

        json_build_object(
        'id', u.id,
        'username', ru.username,
        'email', ru.email
        ) AS user_report,

        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,

        json_build_object(
        'id', i.id,
        'title', i.title,
        'image', i.image
        ) AS item,
         
        r.proof,
        r.reason
        
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN users ru ON r.report_user_id = ru.id
        LEFT JOIN items i ON r.item_id = i.id
        `)

    return result.rows
}

// Get Report ById
const getReportById = async (id) => {
    const result = await pool.query(`
        SELECT 
        r.id,

        json_build_object(
        'id', u.id,
        'username', ru.username,
        'email', ru.email
        ) AS user_report,

        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,
         
        json_build_object(
        'id', i.id,
        'title', i.title,
        'image', i.image
        ) AS item,

        r.proof,
        r.reason
        
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN users ru ON r.report_user_id = ru.id
        LEFT JOIN items i ON r.item_id = i.id
        WHERE r.id = $1`, [id])

    return result.rows[0]
}

// Create Report
const createReport = async (data) => {
    const { item_id, report_user_id, user_id, reason, proof } = data

    const create = await pool.query(`
        INSERT INTO report (item_id, report_user_id, user_id, reason, proof) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [item_id, report_user_id, user_id, reason, proof])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT 
        r.id,

        json_build_object(
        'id', u.id,
        'username', ru.username,
        'email', ru.email
        ) AS user_report,

        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,

        json_build_object(
        'id', i.id,
        'title', i.title,
        'image', i.image
        ) AS item,
         
        r.proof,
        r.reason
        
        FROM report r
        
        LEFT JOIN users ru ON r.report_user_id = ru.id
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN items i ON r.item_id = i.id
        WHERE r.id = $1`, [newId])
    
    return result.rows[0]   
}

const getReportByUser = async (id) => {
    const result  = await pool.query(`
        SELECT
        r.id,

        json_build_object(
        'id', u.id,
        'username', ru.username,
        'email', ru.email
        ) AS user_report,
        
        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,

        json_build_object(
        'id', i.id,
        'title', i.title,
        'image', i.image
        ) AS item,

        r.proof,
        r.reason

        FROM report r
        
        LEFT JOIN users ru ON r.report_user_id = ru.id
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN items i ON r.item_id = i.id
        WHERE ru.id = $1
        `, [id])

        return result.rows
}

const deleteReport = async (id) => {
    const result = await pool.query(`
        DELETE FROM report WHERE user_id = $1`,
    [id])
}

// Update Status User
const updateStatusUser = async (data) => {
    const { id, status} = data
    const update = await pool.query(`
        UPDATE users SET status = $1 WHERE id = $2 RETURNING id`,
    [status, id])

    const newId = update.rows[0].id
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1`,
    [newId])

    return result.rows[0]
}

module.exports = { 
    getUser,
    getUserById,
    getUserByEmail,
    deleteUser,
    getReport,
    getReportById,
    createReport,
    updateStatusUser,
    deleteReport,
    getReportByUser
}