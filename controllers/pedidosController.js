const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");

class PedidosController {
    async gravar(req, res) {
        console.log(req.body);//ver se as informaçoes chegam pelo botao gravar
        let ok = false;

        let mensagens = [];
        if (req.body.length > 0) {
            //para testar as validaçoes do corpo se esta vindo alguma coisa se o id esta correto eesa variavel ja retona oque contem no carrinho 
            let itensPedido = req.body;
            let pedidoModel = new PedidoModel();
            let pedidoId = await pedidoModel.gravar();
            if (pedidoId > 0) {//aqui nao é o tamanho é o numero do id que o banco gerou no auto-increment
                //se o pedido deu certo fazer a Iinserçao dos itens percorrendo pelo array de itens q veio da interface com o id e a quantidade para validalos no banco e a quantidade
                let produtoModel = new ProdutoModel();
                //para validar item a item
                //===========================================//
                //BUSCA E VALIDAÇAO DO ESTOQUE:
                let pedidoValortotal = 0;
                for (var i = 0; i < itensPedido.length; i++) {
                    let produtoId = itensPedido[i].id;
                    let produtoEncontrado = await produtoModel.buscarProduto(produtoId);

                    if (produtoEncontrado == null) {
                        mensagens.push(`produto com ID ${produtoId} nao encontrado — `);
                        continue;
                    }
                    if (produtoEncontrado != null) {
                        let quantidade = await produtoModel.buscarQuantidade(produtoId);
                        console.log(quantidade);//funcionou mostrou a quantidade do estoque

                        if (quantidade >= itensPedido[i].quantidade) {
                            //pus aqui dentro o segundo for caso as quantidades fossem iguais davaum i++
                            //for (let i = 0; i < itensPedido.length; i++) {
                            //     let produtoId = itensPedido[i].id;
                            //     let produtoEncontrado = await produtoModel.buscarProduto(produtoId);//busca o id
                            // if (produtoEncontrado != null) {
                            //o produto existe
                            let itemPedidoModel = new PedidoItemModel();
                            itemPedidoModel.produtoId = produtoId;
                            itemPedidoModel.pedidoId = pedidoId;
                            itemPedidoModel.pedidoItemValor = produtoEncontrado.produtoPreco;
                            itemPedidoModel.pedidoItemQuantidade = itensPedido[i].quantidade;
                            itemPedidoModel.pedidoItemValorTotal = produtoEncontrado.produtoPreco * itensPedido[i].quantidade;

                            await itemPedidoModel.gravar();
                            //gera o pedido e o item 
                            ok = true;
                            mensagens.push(`Item ${produtoEncontrado.produtoNome} adicionado no Pedido     `);
                            await produtoModel.atualizaEstoque(produtoId, quantidade - itensPedido[i].quantidade);

                            pedidoValortotal +=itemPedidoModel.pedidoItemValorTotal;//tem que por o itempedidomodel

                        } else {
                            ok = false;
                            mensagens.push(`a quantidade do prduto ${produtoEncontrado.produtoNome} é insulficiente  `);
                        }
                    }

                }
                await pedidoModel.atualizaValores(pedidoValortotal, pedidoId);
                console.log(pedidoValortotal)
                //===========================================//
            } else {
                ok = false;
                msg = "nao ha produtos no carrinho"
            }

            res.send({ ok: ok, msg: mensagens.join(" | ") });
        }
    }
}
module.exports = PedidosController;