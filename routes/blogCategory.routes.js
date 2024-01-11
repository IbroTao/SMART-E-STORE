const {Router} = require('express');
const router = Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.get('/', authMiddleware, isAdmin, getCategories);
router.get('/:id', authMiddleware, isAdmin, getCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;