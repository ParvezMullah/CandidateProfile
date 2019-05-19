var express = require('express');
var router = express.Router();
const candidatesController = require('../controllers/candidate')
const utilityFunctions = require('../utilities/utility')

router.post('/upload',  utilityFunctions.upload.single('file'), utilityFunctions.validate, candidatesController.candidates_upload);
router.get('/download', candidatesController.candidates_download);
module.exports = router;
