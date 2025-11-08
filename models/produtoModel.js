const Database = require('../db/database');
const fs = require("fs");

const conexao = new Database();
class ProdutoModel {

    #produtoId;
    #produtoCodigo;
    #produtoNome;
    #produtoQuantidade;
    #produtoPreco;
    #produtoImagem;
    #categoriaId;
    #categoriaNome;
    #marcaId;
    #marcaNome;

    get produtoId() { return this.#produtoId; } set produtoId(produtoId) {this.#produtoId = produtoId;}
    get produtoCodigo() { return this.#produtoCodigo; } set produtoCodigo(produtoCodigo) {this.#produtoCodigo = produtoCodigo;}
    get produtoNome() { return this.#produtoNome; } set produtoNome(produtoNome) {this.#produtoNome = produtoNome;}
    get produtoQuantidade() { return this.#produtoQuantidade; } set produtoQuantidade(produtoQuantidade) {this.#produtoQuantidade = produtoQuantidade;}
    get categoriaId() { return this.#categoriaId; } set categoriaId(categoriaId) {this.#categoriaId = categoriaId;}
    get categoriaNome() { return this.#categoriaNome; } set categoriaNome(categoriaNome) {this.#categoriaNome = categoriaNome;}
    get marcaId() { return this.#marcaId; } set marcaId(marcaId) {this.#marcaId = marcaId;}
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) {this.#marcaNome = marcaNome;}
    get produtoImagem() { return this.#produtoImagem; } set produtoImagem(produtoImagem) {this.#produtoImagem = produtoImagem;}
    get produtoPreco() { return this.#produtoPreco; } set produtoPreco(produtoPreco) {this.#produtoPreco = produtoPreco;}



    constructor(produtoId, produtoCodigo, produtoNome, produtoQuantidade, categoriaId, marcaId, categoriaNome, marcaNome, produtoImagem, produtoPreco) {
        this.#produtoId = produtoId
        this.#produtoCodigo = produtoCodigo
        this.#produtoNome = produtoNome
        this.#produtoQuantidade = produtoQuantidade
        this.#categoriaId = categoriaId;
        this.#categoriaNome = categoriaNome;
        this.#marcaId = marcaId;
        this.#marcaNome = marcaNome;
        this.#produtoImagem = produtoImagem;
        this.#produtoPreco = produtoPreco;
    }

    async excluir(codigo){
        let sql = "delete from tb_produto where prd_id = ?"
        let valores = [codigo];

        var result = await conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async gravar() {
        if(this.#produtoId == 0){
            let sql = "insert into tb_produto (prd_cod, prd_nome, prd_quantidade, cat_id, mar_id, prd_imagem, prd_preco) values (?, ?, ?, ?, ?, ?, ?)";

            let valores = [this.#produtoCodigo, this.#produtoNome, this.#produtoQuantidade, this.#categoriaId, this.#marcaId, this.#produtoImagem, this.#produtoPreco];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
        else{
            //alterar
            let sql = "update tb_produto set prd_cod = ?, prd_nome =?, prd_quantidade= ?, cat_id = ?, mar_id = ?, prd_imagem = ?, prd_preco = ? where prd_id = ?";

            let valores = [this.#produtoCodigo, this.#produtoNome, 
                this.#produtoQuantidade, 
                this.#categoriaId, 
                this.#marcaId, this.#produtoImagem, this.produtoPreco, this.#produtoId];

            return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
        }
    }
    async atualizaEstoque(id,novaQuantidade){
        let sql ="update tb_produto set prd_quantidade = ? where prd_id = ?"
        let valor=[novaQuantidade,id];
        return await conexao.ExecutaComandoNonQuery(sql,valor);

    }
    async buscarQuantidade(id){
        let sql ="select prd_quantidade from tb_produto where prd_id = ?"
        let valor=[id];
        var rows = await conexao.ExecutaComando(sql,valor);

        let qntd =rows[0].prd_quantidade;

        return qntd;
    }

    async buscarProduto(id){
        let sql = 'select * from tb_produto where prd_id = ? order by prd_id';
        let valores = [id];
        var rows = await conexao.ExecutaComando(sql, valores);

        let produto = null;

        if(rows.length > 0){
            var row = rows[0];

            //armazenamento em diretório
            let imagem = "";
            if(row["prd_imagem"] != null && 
                fs.existsSync(global.CAMINHO_IMG_ABS + row["prd_imagem"])) {
                imagem = global.CAMINHO_IMG + row["prd_imagem"];
            }
            else {
                imagem = global.CAMINHO_IMG + "produto-sem-imagem.webp";
            }
                    
            
            produto = new ProdutoModel(row['prd_id'], 
            row['prd_cod'], row['prd_nome'], row['prd_quantidade'], 
            row['cat_id'], row['mar_id'], "", "", imagem, row["prd_preco"]);

        }

        return produto;
    }

    async listarProdutos() {

        let sql = 'select * from tb_produto p inner join tb_categoria c on p.cat_id = c.cat_id inner join tb_marca m on p.mar_id = m.mar_id order by prd_id';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){

                var row = rows[i];

                //converter binário da imagem em base64 (armazenamento em banco)
                // let imagemBase64 = "";
                // if(row["prd_imagem"] != null) {
                //     imagemBase64 = "data:image/png;base64," + row["prd_imagem"].toString("base64");
                // }

                //armazenamento em diretório
                let imagem = "";
                if(row["prd_imagem"] != null 
                    && 
                fs.existsSync(global.CAMINHO_IMG_ABS + row["prd_imagem"])) {
                    imagem = global.CAMINHO_IMG + row["prd_imagem"];
                }
                else {
                    imagem = global.CAMINHO_IMG + "produto-sem-imagem.webp";
                }
                    

                listaRetorno.push(new ProdutoModel(row['prd_id'], 
                row['prd_cod'], row['prd_nome'], row['prd_quantidade'], 
                row['cat_id'], row['mar_id'], row['cat_nome'], row['mar_nome'], imagem, row["prd_preco"]));
            }
        }

        return listaRetorno;
    }

    toJSON() {
        return {
            id: this.#produtoId,
            nome: this.#produtoNome,
            preco: this.#produtoPreco,
            imagem: this.#produtoImagem
        }
    }

}

module.exports = ProdutoModel;