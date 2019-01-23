const Message = require('./model/messageModel');
const User = require('./model/userModel');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

// function auth (socket, next) {
//     // Parse cookie
//     cookieParser()(socket.request, socket.request.res, () => {});

//     // JWT authenticate
//     passport.authenticate('jwt', {session: false}, function (error, decryptToken, jwtError) {
//         if(!error && !jwtError && decryptToken) {
//             next(false, {username: decryptToken.username, id: decryptToken.id});
//         } else {
//             next('guest');
//         }
//     })(socket.request, socket.request.res);

// }

let message = {};
let online = 0;
let usersOnline = [];

function createToken (body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        {expiresIn: config.expiresIn}
    );
}

function checkAuth (client, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
        if (jwtError != void(0) || err != void(0)) {
            return 'Some error!';
        };
        client.user.decryptToken = decryptToken;
        next();
    })(client, next);
}

module.exports = io => {
    io.on('connection', (client) => {

        client.on('new-user', (user) => {
            console.log("User connected");
            console.log(++online); 
            client.broadcast.emit("change-online", online)
            // console.log(user);
            let allMes = Message.find().sort({ addAt: 1}).lean();
            
            allMes.exec(function(err,docs){   // sort('-time').limit(30)
                if (err) throw err;
                console.log('Send message from DB');
                let obj ={
                        docs: docs,
                        online: online,
                        usersOnline: usersOnline,
                        clientId: client.id,
                    }
                // client.to('general').emit('all-messages', obj);
                client.emit('all-messages', obj);
                console.log(obj);
            })  
        })

        client.on('register', async (user) => {
            client.username = user.username;
            try {
                let userDB = await User.findOne({email: user.email}).lean().exec();
                if (userDB != void(0)) {
                    message = {message: "User already exist"};
                }
                else {
                    userDB = await User.create({
                        username: user.username,
                        password: user.password,
                        email: user.email,
                    });
        
                    // const token = createToken({id: userDB._id, username: userDB.username});
        
                    // client.cookie('token', token, {
                    //     httpOnly: true
                    // });
        
                    message = {message: "User created.", currentUser: userDB};
                }
                client.emit('register-on-DB', message);
            } catch (e) {
                console.error("E, register,", e);
                message = {message: "some error"};
                client.emit('register-on-DB', message);
            }
        });

        client.on('login', async (user) => {
            try {
                let userDb = await User.findOne({email: user.email}).lean().exec();
                if (userDb != void(0) && bcrypt.compareSync(user.password, userDb.password)) {
                    const token = createToken({id: userDb._id, username: userDb.username});

                    // res.cookie('token', token, {
                    //     httpOnly: true
                    // });

                    message = {message: "User login success!", currentUser: userDb};
                    client.emit('login-done', message);
                } else {
                    if (userDb == void(0)) {
                        message = {message: "User not exist, enter correct email."};
                    } else if (!bcrypt.compareSync(user.password, userDb.password)) {
                        message = {message: "Password not correct."};
                    } else {
                        message = {message: "User not exist or password not correct."};
                    }
                    client.emit('login-done', message);
                }
            } catch (e) {
                console.error("E, login,", e);
                // res.status(500).send({message: "some error"});
                message = {message: "Some error in login."};
                    client.emit('login-done', message);
            }
        });

        client.on("disconnect", () => {
            // console.log("its work")
            // console.log(client.id)
            let a = usersOnline.filter(el => el.userId !== client.id)
            usersOnline = a
            // console.log(usersOnline)
            console.log(online > 0 ? --online : null);
            console.log(`Now in chat ${online} users.`); 
            client.broadcast.emit("change-online", online);
            io.emit('get-user-name', usersOnline)
        });

        client.on("message", (message) => {
            // console.log(message);
            Message.create(message, err => {
                if(err) return console.error(err);
                client.broadcast.emit("new-message", message);
            }); 
        });
        client.on("typing", (data) => {
            console.log(data)
            client.broadcast.emit("somebody-typing", data);
        })
        client.on('deleteMessage', (id) => {
            Message.findOneAndRemove({messageId: id}, err => {
                if (err) throw err
                console.log('Message succsessfully delete!')
                client.broadcast.emit("message-was-deleted", id);
            })
        })
        client.on("editMessage", (id, editMess) => {
            Message.findOneAndUpdate({messageId: id}, editMess, err => {
                if (err) throw err
                console.log('Message succsessfully edit!')
                client.broadcast.emit("message-was-edited", editMess);
            })
        })
    });
};