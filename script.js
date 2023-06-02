class Patio {
    constructor() {
        this.veiculos = this.ler();
    }
    ler() {
        return JSON.parse(localStorage.getItem("patio") || "[]");
    }
    salvar() {
        localStorage.setItem("patio", JSON.stringify(this.veiculos));
    }
    calcularTempoEstacionado(entrada) {
        const tempo = Math.floor((new Date().getTime() - new Date(entrada).getTime()) / 1000 / 60);
        return tempo;
    }
    exibirMensagemTempoEstacionado(nome, tempo) {
        const msg = `O veiculo ${nome} permaneceu estacionado por ${tempo} minutos`;
        return confirm(msg);
    }
    adicionar(veiculo) {
        this.veiculos.push(veiculo);
        this.salvar();
        this.listar();
    }
    remover(placa) {
        const veiculoIndex = this.veiculos.findIndex((veiculo) => veiculo.placa === placa);
        if (veiculoIndex !== -1) {
            const veiculo = this.veiculos[veiculoIndex];
            const tempoEstacionado = this.calcularTempoEstacionado(veiculo.entrada);
            if (this.exibirMensagemTempoEstacionado(veiculo.nome, tempoEstacionado)) {
                this.veiculos.splice(veiculoIndex, 1);
                this.salvar();
                this.listar();
            }
        }
    }
    listar() {
        const patioElement = document.querySelector("#patio");
        if (patioElement) {
            patioElement.innerHTML = "";
            this.veiculos.forEach((veiculo) => {
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
                (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                    this.remover(veiculo.placa);
                });
                patioElement.appendChild(row);
            });
        }
    }
}
(function () {
    const $ = (query) => document.querySelector(query);
    const patio = new Patio();
    patio.listar();
    const cadastrarBtn = $("#cadastrar");
    if (cadastrarBtn) {
        cadastrarBtn.addEventListener("click", () => {
            const nomeInput = $("#nome");
            const placaInput = $("#placa");
            const nome = nomeInput.value;
            const placa = placaInput.value;
            if (!nome || !placa) {
                alert("Preencha todos os campos!");
                return;
            }
            const veiculo = {
                nome,
                placa,
                entrada: new Date().toISOString(),
            };
            patio.adicionar(veiculo);
            nomeInput.value = "";
            placaInput.value = "";
        });
    }
})();
