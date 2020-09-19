const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

     return {
         login(req, res) {
             res.render('auth/login')
         },

         postlogin(req, res, next){

             const {email,password} = req.body
             // Vaidate Request
             if (!email || !password) {
                 req.flash('error', 'All Fields are Required')
                 return res.redirect('/register')
             }
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.logIn(user,(err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req,res,next)
         },
         
         register(req, res) {
             res.render('auth/register')
         },
         async postregister(req, res) {
            const {name, email, password} = req.body
            // Vaidate Request
            if(!name || !email || !password){
                req.flash('error', 'All Fields are Required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // Check if user exists
            User.exists({  email: email}, (err,result) => {
                if(result){
                    req.flash('error', 'email already exists')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            // Hash Password
            const hashPassword = await bcrypt.hash(password, 10)
            // create user
            const user = new User({
                name,
                email,
                password: hashPassword
            })

            user.save().then(() => {
                // Login
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}


module.exports = authController