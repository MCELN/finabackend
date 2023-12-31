const app = require('./server');
const { port } = require('./config');
const realTimeServer = require('./realTimeServer');
const PORT = port || process.env.PORT || 8080

const httpServer = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

realTimeServer(httpServer);