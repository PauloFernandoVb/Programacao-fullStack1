const express = require("express");
const PedidosController = require("../controllers/pedidosController");
const authMidleware = require("../middlewares/authMiddleware")

const router = express.Router();

let ctrl = new PedidosController();
let auth = new authMidleware();
router.get("/", auth.verificarUsuarioLogado, ctrl.pedidosView);//deve estar autenticado
router.get("/listar", auth.verificarUsuarioLogado, ctrl.listarPedidos);
router.post("/gravar", ctrl.gravar);
module.exports = router;