const express=require('express');
const cookieParser=require('cookie-parser');
const ctoken = require('./jwt'); 
const passport = require('passport')
const chash = require('./chash')
const app=express();
const nunjucks = require('nunjucks')
const passportConfig = require('./passport')
const bodyParser = require('body-parser')
const auth = require('./middleware/auth')
const {sequelize, User} = require('./models')
const socket = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socket(server)
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})
passportConfig()
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

app.set('view engine', 'html')

app.use(express.static('public'));
// app.use(express.static('node_modules/socket.io/client-dist'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

nunjucks.configure('views',{
    express: app,
})

app.get('/auth/kakao',(req,res)=>{
    const kakaoAuthURL =
    `https://kauth.kakao.com/oauth/authorize?
    client_id=${kakao.clientID}
    &redirect_uri=${kakao.redirectUri}
    &response_type=code`;
    res.redirect(kakaoAuthURL);
});
app.get('/auth/kakao',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
    res.redirect(kakaoAuthURL);
});
app.use(cookieParser());

sequelize.sync({force:true})
.then(()=>{ // resolve
    console.log('DB접속이 완료되었습니다.')
})
.catch((err)=>{ // reject
    console.log(err)
})

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/user/info',auth, (req,res)=>{
    res.send(`Hello ${req.userid}`)
})

app.get('/user/join',(req,res)=>{
    res.render('join')
})

app.get('/user/userid_check',async (req,res)=>{
    userid = req.query.userid
    result = await User.findOne({
        where:{userid}
    })
    if (result == undefined){
        check = true;
    } else{
        check = false;
    }
    res.json({check})
})


app.post('/user/join_success',upload.single('image'),async (req,res)=>{
    let userimage = req.file.path
    let{userid, userpw, username, gender,  useremail} = req.body
    console.log(userimage)
    let token = chash(userpw)
    let result = await User.create({
        userid, token, username, gender, useremail, userimage 
    })
    res.json({result})
})


app.post('/auth/local/login',async (req,res)=>{
    let {userid, userpw} = req.body
    // let {userid2, userpw2} = JSON.parse(req.get('data'))
    console.log('body req :',userid, userpw)
    // console.log('data req :',userid2, userpw2)
    let result = {}
    let token = chash(userpw)
    let check = await User.findOne({
        where : {userid, token}
    })
    let token2 = ctoken(userid)
    if(check== null){
        result = {
            result:false,
            msg:'아이디와 패스워드를 확인해주세요'
        }
    }else{
        result = {
            result:true,
            msg:'로그인에 성공하셨습니다.'
        }
        res.cookie('AccessToken',token2,{httpOnly:true,secure:true,})
    }
    res.json(result)
})


app.get('/chat',auth,(req,res)=>{
    res.render('chat')
})


io.sockets.on('connection',socket=>{
    
    let cookie = socket.handshake.headers.cookie
    
    if(cookie != undefined){
        let cookie_array = cookie.split('; ')
        let obj = new Object
        cookie_array.forEach(v=>{
            [name, value] = v.split('=')
            obj[name] = value
        })
        let {AccessToken} = obj
        let payload = Buffer.from(AccessToken.split('.')[1],'base64').toString();
        var {userid} = JSON.parse(payload)
    }
    socket.emit('userid',userid)

    socket.on('send',data=>{
        socket.broadcast.emit('msg',{userid:data.userid,data:data.msg})
    })
})

app.use(passport.initialize());
app.use(passport.session());

server.listen(3000,()=>{
    console.log('server start port: 3000');
})

// npx sequelize-auto -o "./models" -d class -h localhost -u root -p 3306 -x sksskdia -e mysqln 
// npm install -g sequelize-auto
// sequelize-auto -o -d -h -u -p -x -e
// -o "경로"
// -d "데이터베이스"
// -h "url -> localhost"
// -u "root"
// -p "port"
// -x "password"
// -e "mysql"