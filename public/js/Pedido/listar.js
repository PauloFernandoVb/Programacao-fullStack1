//vincula com o pedido listarejs

document.addEventListener("DOMContentLoaded",function(){

    carregarPedidos();

    function carregarPedidos(){
        //faz o fetch para obter a lista de pedidos
        fetch("/pedido/listar")
        .then(function(resposta){
            return resposta.json();
        })
        .then(function(corpo){
            console.log(corpo);
            let html="";
            if(corpo.lista>0){
                for(let i=0;i<corpo.lista.length;i++){
                    let item=corpo.lista[i];
                     html=`<tr>
                        <td>${item.pedido}</td>
                        <td>${item.data}</td>
                        <td>${item.produto}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.valorUnitario}</td>
                        <td>${item.valorTotal}</td>
                        
                        </tr>`
            }
            document.querySelectorAll("#pedidos > tbody").innerHtml=html;
                }
               
        })
    }
})