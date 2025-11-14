const Database = require("../db/database");

const banco = new Database();

class PedidoItemModel {

    #pedidodoItemId;
    #pedidoId;
    #produtoId;
    #pedidoItemQuantidade;
    #pedidoItemValor;
    #pedidoItemValorTotal;
    #pedidoData;
    #pedidoValorTotal;
    #produtoNome;

    get pedidoItemId() {
        return this.#pedidodoItemId;
    }
    set pedidoItemId(pedidoItemId) {
        this.#pedidodoItemId = pedidoItemId;
    }

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId) {
        this.#pedidoId = pedidoId;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(produtoId) {
        this.#produtoId = produtoId;
    }

    get pedidoItemQuantidade() {
        return this.#pedidoItemQuantidade;
    }
    set pedidoItemQuantidade(pedidoItemQuantidade) {
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
    }

    get pedidoItemValor() {
        return this.#pedidoItemValor;
    }
    set pedidoItemValor(pedidoItemValor) {
        this.#pedidoItemValor = pedidoItemValor;
    }

    get pedidoItemValorTotal() {
        return this.#pedidoItemValorTotal;
    }
    set pedidoItemValorTotal(pedidoItemValorTotal) {
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData) {
        this.#pedidoData = pedidoData;
    }

    get pedidoValorTotal() {
        return this.#pedidoValorTotal;
    }
    set pedidoValorTotal(pedidoValorTotal) {
        this.#pedidoValorTotal = pedidoValorTotal;
    }

    get produtoNome() {
        return this.#produtoNome;
    }
    set produtoNome(produtoNome) {
        this.#produtoNome = produtoNome;
    }


    constructor(pedidodoItemId, pedidoId, produtoId, 
        pedidoItemQuantidade, pedidoItemValor, 
        pedidoItemValorTotal, pedidoData, pedidoValorTotal, produtoNome) {
        this.#pedidodoItemId = pedidodoItemId;
        this.#pedidoId = pedidoId;
        this.#produtoId = produtoId;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
        this.#pedidoItemValor = pedidoItemValor;
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
        this.#pedidoData = pedidoData;
        this.#pedidoValorTotal = pedidoValorTotal;
        this.#produtoNome = produtoNome;
    }

    async listar() {
        let sql = `select p.ped_id, p.ped_data, p.ped_valortotal, 
                    i.pit_quantidade, 
                    i.pit_valorunidade, i.pit_valortotal, pr.prd_nome
                    from tb_pedido p 
                    inner join tb_pedidoitens i on p.ped_id = i.ped_id
                    inner join tb_produto pr on pr.prd_id = i.prd_id`;

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaItens = [];

        for(let i = 0; i< rows.length; i++) {
            let row = rows[i];
            listaItens.push(new PedidoItemModel(0, row["ped_id"], 0, row["pit_quantidade"], row["pit_valorunidade"], row["pit_valortotal"], row["ped_data"], row["ped_valortotal"], row["prd_nome"]));
        }

        return listaItens;
    }

    async gravar() {
        let sql = "insert into tb_pedidoitens (ped_id, prd_id, pit_quantidade, pit_valorunidade, pit_valortotal) values (?, ?, ?, ?, ?)";

        let valores = [this.#pedidoId, this.#produtoId, this.#pedidoItemQuantidade, this.#pedidoItemValor, this.#pedidoItemValorTotal];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toJSON() {
        return {
            pedido: this.#pedidoId,
            data: this.#pedidoData,
            produto: this.#produtoNome,
            quantidade: this.#pedidoItemQuantidade,
            valorUnitario: this.#pedidoItemValor,
            valorPedido: this.#pedidoValorTotal
        }
    }
}

module.exports = PedidoItemModel;