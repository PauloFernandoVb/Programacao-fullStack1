const ProdutoModel = require("../models/produtoModel");

class HomeController {

    constructor() {

    }

    async homeView(req, res) {
        let produto = new ProdutoModel();
        let listaProdutos = await produto.listarProdutos();
        res.render('home/index', {layout: false, produtos: listaProdutos});
    }
}


module.exports = HomeController;