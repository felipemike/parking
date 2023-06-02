interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
  saida?: Date;
}


(function () {
const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

function patio() {

  function ler(){
    return JSON.parse(localStorage.getItem("patio") || "[]") as Veiculo[];
  }

  function adicionar(veiculo: Veiculo, salva?: boolean){
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${veiculo.nome}</td>
    <td>${veiculo.placa}</td>
    <td>${veiculo.entrada}</td>
    <td> 
      <button class="delete" data-placa="${veiculo.placa}">X</button>
    </td>
    `;
    row.querySelector(".delete")?.addEventListener("click", function(){
      remover(this.dataset.placa);
    });


    $("#patio")?.appendChild(row);
    if(salva){
      salvar([...ler(), veiculo]);
    }
  }

  function remover(placa: string){
    const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
    const tempo = Math.floor((new Date().getTime() - new Date(entrada).getTime()) / 1000 / 60);
    const msg = `O veiculo ${nome} permaneceu estacionado por ${tempo} minutos`;
    if(confirm(msg)){
      salvar(ler().filter((veiculo) => veiculo.placa !== placa));
      listar();
    }
  }

  function salvar(veiculo: Veiculo[]){
    localStorage.setItem("patio", JSON.stringify(veiculo));
  }

  function listar(){
    $("#patio")!.innerHTML = "";
    const veiculos = ler();
    if(veiculos.length){
      veiculos.forEach((veiculo) => adicionar(veiculo));

    }
  }

  return { ler, adicionar, remover, salvar, listar };
}
patio().listar();

$("#cadastrar")?.addEventListener("click", () => {
  const nome = $("#nome").value;
  const placa = $("#placa").value;
  if (!nome || !placa) {
    alert("Preencha todos os campos!");
    return;
  }

  patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);

});
})();