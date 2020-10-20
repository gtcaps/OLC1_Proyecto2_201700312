const {Router} = require('express');
const router = Router();

let file = {
    name: "",
    content: "",
    type: ""
}

router.get('/', (req, res) => {
    res.json(file);
});

router.post('/', (req, res) => {
    const {name, content} = req.body;
    if (name && content) {
        file = {...req.body};
        res.json({...file, "tokens": []});
    }
})

module.exports = router;