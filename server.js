//importando os packages instalados
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const homeRoute = require('./routes/homeRoute');
const produtoRoute = require('./routes/produtoRoute');
const marcaRoute = require('./routes/marcaRoute');
const categoriaRoute = require('./routes/categoriaRoute');
const usuarioRoute = require("./routes/usuarioRoute");
const perfilRoute = require('./routes/perfilRoute');
const loginRoute = require("./routes/loginRoute");
const pedido=require("./routes/pedidosRoute");
const cookieParser = require("cookie-parser");
const AuthMiddleware = require('./middlewares/authMiddleware');
const app = express();
//configurando a nossa pasta public como o nosso repositorio de arquivos estáticos (css, js, imagens)
app.use(express.static(__dirname + "/public"))
//configuração das nossas views para utilizar a ferramenta EJS
app.set('view engine', 'ejs');
//Configuração de onde ficará nossas views
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//configuração da nossa página de layout
app.set('layout', './layout');
app.use(expressLayouts);
app.use(cookieParser());

//definindo as rotas que o nosso sistema vai reconhecer através da url do navegador
app.use("/login", loginRoute);
app.use('/', homeRoute);
app.use('/produto', produtoRoute);
app.use('/pedido',pedido);

let auth = new AuthMiddleware();

app.use(auth.verificarUsuarioLogado);


app.use("/marcas", marcaRoute);
app.use("/categorias", categoriaRoute);
app.use("/usuarios", usuarioRoute);
app.use("/perfis", perfilRoute);

global.CAMINHO_IMG = "/img/produtos/";
global.CAMINHO_IMG_ABS = __dirname + "/public/img/produtos/";

//ponto de inicio do nosso servidor web
const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});
