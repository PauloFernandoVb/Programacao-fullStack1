const express=require("express");
const PedidosController=require("../controllers/pedidosController");

const router=express.Router();

let ctrl=new PedidosController();
router.post("/gravar",ctrl.gravar);

module.exports=router;