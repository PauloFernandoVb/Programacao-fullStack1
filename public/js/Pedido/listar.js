document.addEventListener("DOMContentLoaded", function() {

    carregarPedidos();

    function carregarPedidos() {
        //faz o fetch para obter a lista de pedidos
        fetch("/pedido/listar")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpo) {
            console.log(corpo);
            let html = "";
            if(corpo.lista.length > 0) {
                for(let i =0; i < corpo.lista.length; i++) {
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