(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function patio() {
        function ler() { }
        function adicionar(veiculo) {
            var _a;
            const row = document.createElement("tr");
            row.innerHTML = `
    <td>${veiculo.nome}</td>
    <td>${veiculo.placa}</td>
    <td>${veiculo.entrada}</td>
    <td> 
      <button class="delete" data-placa="${veiculo.placa}">X</button>
    </td>
    `;
            (_a = $("#patio")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
        }
        function remover() { }
        function salvar() { }
        function listar() { }
        return { ler, adicionar, remover, salvar, listar };
    }
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const nome = $("#nome").value;
        const placa = $("#placa").value;
        if (!nome || !placa) {
            alert("Preencha todos os campos!");
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date() });
    });
})();
