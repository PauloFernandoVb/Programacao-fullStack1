const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");

class PedidosController {
    async gravar(req, res) {
        console.log(req.body);//ver se as informaçoes chegam pelo botao gravar
        let ok = false;
        let msg = "";

        if (req.body.length > 0) {
            //para testar as validaçoes do corpo se esta vindo alguma coisa se o id esta correto eesa variavel ja retona oque contem no carrinho 
            let itensPedido = req.body;
            let pedidoModel = new PedidoModel();
            let pedidoId = await pedidoModel.gravar();
            if (pedidoId > 0) {//aqui nao é o tamanho é o numero do id que o banco gerou no auto-increment
                //se o pedido deu certo fazer a Iinserçao dos itens percorrendo pelo array de itens q veio da interface com o id e a quantidade para validalos no banco e a quantidade
                let produtoModel = new ProdutoModel();
                //para validar item a item
                for (let i = 0; i < itensPedido.length; i++) {
                    let produtoId = itensPedido[i].id;
                    let produtoEncontrado = await produtoModel.buscarProduto(produtoId);//busca o id
                    if (produtoEncontrado != null) {
                        //o produto existe
                        let itemPedidoModel = new PedidoItemModel();
                        itemPedidoModel.produtoId = produtoId;
                        itemPedidoModel.pedidoId = pedidoId;
                        itemPedidoModel.pedidoItemValor = produtoEncontrado.produtoPreco;
                        itemPedidoModel.pedidoItemQuantidade = itensPedido[i].quantidade;
                        itemPedidoModel.pedidoItemValorTotal = produtoEncontrado.produtoPreco * itensPedido[i].quantidade;

                        await itemPedidoModel.gravar();
                        //gera o pedido e o item 
                        
                    }
                }
                ok=true;
                msg="pedido gravado!";

            } else {
                ok = false;
                msg = "erro ao gerar pedido!";
            }

        } else {
            ok = false;
            msg = "nao ha produtos no carrinho"
        }

        res.send({ ok: ok, msg: msg });
    }
}
module.exports = PedidosController;