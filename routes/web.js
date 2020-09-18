const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customer/cartController')
const guest = require('../app/http/middlewares/guest')


function initRoutes(app){
    
    app.get('/', homeController().index)

    app.get('/login', guest,authController().login)
    app.post('/login', authController().postlogin)

    app.get('/register', guest,authController().register)
    app.post('/register', authController().postregister)

    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    
}

module.exports = initRoutes