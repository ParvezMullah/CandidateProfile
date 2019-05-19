const express = require('express')
const app = express()
const candidateRoutes = require('./routes/candidate');

app.use('/candidate', candidateRoutes);

//PORT 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});