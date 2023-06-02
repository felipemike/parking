(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function patio() {
        function ler() {
            return JSON.parse(localStorage.getItem("patio") || "[]");
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
    <td>${veiculo.nome}</td>
    <td>${veiculo.placa}</td>
    <td>${veiculo.entrada}</td>
    <td> 
      <button class="delete" data-placa="${veiculo.placa}">X</button>
    </td>
    `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva) {
                salvar([...ler(), veiculo]);
            }
        }
        function remover(placa) {
            const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
            const tempo = Math.floor((new Date().getTime() - new Date(entrada).getTime()) / 1000 / 60);
            const msg = `O veiculo ${nome} permaneceu estacionado por ${tempo} minutos`;
            if (confirm(msg)) {
                salvar(ler().filter((veiculo) => veiculo.placa !== placa));
                listar();
            }
        }
        function salvar(veiculo) {
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }
        function listar() {
            $("#patio").innerHTML = "";
            const veiculos = ler();
            if (veiculos.length) {
                veiculos.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, listar };
    }
    patio().listar();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const nome = $("#nome").value;
        const placa = $("#placa").value;
        if (!nome || !placa) {
            alert("Preencha todos os campos!");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
