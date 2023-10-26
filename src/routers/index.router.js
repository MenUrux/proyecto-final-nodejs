const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to new server in express js' })
})

module.exports = router;