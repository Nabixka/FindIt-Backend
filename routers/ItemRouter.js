const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/ItemController")
const auth = require("../middlewares/auth")
const { uploadItems } = require("../multer")

// GetAll
router.get("/", auth, ItemController.getItem)

// Create Item
router.post("/", auth, uploadItems.single("image"), ItemController.createItem)

// Get Item User
router.get('/user', auth, ItemController.getItemUser)

// Item By Id
router.get("/:id", auth, ItemController.getItemById)
router.delete("/:id", auth, ItemController.deleteItem)

module.exports = router