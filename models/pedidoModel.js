const Database = require("../db/database");

const banco = new Database();

class PedidoModel {

    #pedidoId;
    #pedidoData;
    #pedidoValorTotal

    get pedidoValorTotal(){
        return this.#pedidoValorTotal;
    }
    set pedidoValorTotal(pedidoValorTotal){
        this.pedidoValorTotal=pedidoValorTotal;
    }

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId){
        this.#pedidoId = pedidoId;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData){
        this.#pedidoData = pedidoData;
    }

    constructor(pedidoId, pedidoData,pedidoValorTotal) {
        this.#pedidoId = pedidoId;
        this.#pedidoData = pedidoData;
        this.#pedidoValorTotal=pedidoValorTotal;
    }

    async listar() {
        let sql = "select * from tb_pedido";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaPedidos = [];

        for(let i =0; i< rows.length; i++) {
            let row = rows[i];
            listaPedidos.push(new PedidoModel(row["ped_id"], row["ped_data"]));
        }

        return listaPedidos;
    }

    async gravar() {
        let sql = "insert into tb_pedido (ped_data) values (now())";     
        let valores = [];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);//serve para comandos que retornam quando eu necessito do retorno do banco, ent ele retorna 
        //retorna o id inserido no banco que é auto incremental para saber qual é o pedido q foi incrmentado
        return result;// aqui é aquele id para fazer as incerssoes dos itens do pedido

        //É QUANDO O INSERT DO ITEN DEPENDE DO INSERT DO PEDIDO AI USA ESSA FUNCTION
    }
    async atualizaValores(valortotal,id){
        let sql = "update tb_pedido set ped_valortotal = ? where ped_id = ? "
        let valores=[valortotal,id];
        return await banco.ExecutaComandoNonQuery(sql,valores);// valor no banco apenas
    }

}

module.exports = PedidoModel;