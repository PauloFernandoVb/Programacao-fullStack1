document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("buscar").addEventListener("click", carregarPedidos);

    carregarPedidos();
    document.getElementById("excel").addEventListener("click",expotarExcel);
    function expotarExcel(){
        var wb = XLSX.utils.table_to_book(document.getElementById("pedidos"));
         XLSX.writeFile(wb, "pedidos.xlsx");
    }

    function carregarPedidos() {
        let query = "";
        let termo = document.getElementById("inputBusca");//botao de buscar filtragem
        if (termo.value != "") {
            query = "?termo=" + termo.value;
        }
        //faz o fetch para obter a lista de pedidos 
        //COM ESSES DADOS QUE SAO TRAZIDOS OS DADOS PARA MONTAR A TABELA PELO FETCH
        //a ideia é fazer na interface as buscas que ocorreram por chamada via fetch que remontaram a tabela baseado noque eu encontrei
        //evitando dois trabalhos tanto na filtragem nolado do cliente e a oputra "fixa"  entao aqui ja monta a tabela  BASTA REFAZER UMA NOVA CHAMADA FETCH PARA REFAZER 

        //PASSAREMOS UMA QUERY STRING Q É OPCIONAL
        //ESSE INTERROGAÇAO ? PARA FRENTE É A QUERYSTRING| termo é o parametro e o valor perfume
        fetch("/pedido/listar"+query) //concatenar a query para passar a informaçao
            .then(function (resposta) {
                return resposta.json();
            })
            .then(function (corpo) {
                console.log(corpo);
                let html = "";
                if (corpo.lista.length > 0) {
                    for (let i = 0; i < corpo.lista.length; i++) {
                        let item = corpo.lista[i];
                        html += `<tr>
                                <td>${item.pedido}</td>
                                <td>${new Date(item.data).toLocaleString()}</td>
                                <td>${item.produto}</td>
                                <td>${item.quantidade}</td>
                                <td>R$ ${item.valorUnitario}</td>
                                <td>R$ ${item.valorTotal ? item.valorTotal : "0"}</td>
                            </tr>`;
                    }

                    document.querySelector("#pedidos > tbody").innerHTML = html;

                }
            })
    }
})