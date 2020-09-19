var fs = require('fs')
var http = require('http')
var https = require('https')
var privateKey  = fs.readFileSync('./example.com+5-key.pem')
var certificate = fs.readFileSync('./example.com+5.pem')
var credentials = {key: privateKey, cert: certificate};

const express = require('express')
const app = express();
const server = https.createServer(credentials, app);  // запускаем сервак 
const io = require('socket.io')(server)               // сокеты к нашему серверу
const { v4: uuidV4 } = require('uuid')                // это приблуда для создания комнат

//----------------------
// Пример видеочата
//----------------------
app.set('view engine', 'ejs')                         // шаблонизатор для node
app.use(express.static('public'))                     // путь к папке с шаблоними

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)                        // перенаправляем на комнату ( уникальный id url )
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })     // создаем комнату и получаем id
})

io.on('connection', socket => {
  // Образуем комнаты для socket соединений
  socket.on('join-room', (room_id, user_id) => {
    console.log('Приконектился пользователь: ' + room_id + ', \n' + user_id)
    socket.join(room_id)
    socket.to(room_id).broadcast.emit('user-connected', user_id)

    socket.on('chat', (msg) => {
      io.emit('chat', msg, socket.id);
      console.log('message: ' + socket.id + ' => ' + msg);
    });
    // socket.on('disconnect', () => {
    //   socket.to(roomId).broadcast.emit('user-disconnected', userId)
    // })
  })
})




// server.listen(3000, () => {
//   console.log('Сервер запущен на localhost:3000')
// })

let port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('hellow world 3')                        // перенаправляем на комнату ( уникальный id url )
})

app.listen(port, () => {
  console.log('Сервер запущен на localhost:3000')
})