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
        const entradaDate = typeof entrada === 'string' ? new Date(entrada) : entrada;
        const agora = new Date();
        const diffMs = agora.getTime() - entradaDate.getTime();
        const diffMin = Math.floor(diffMs / (1000 * 60));
        const horas = Math.floor(diffMin / 60);
        const minutos = diffMin % 60;
        return `${horas} horas e ${minutos} minutos`;
    }
    exibirMensagemTempoEstacionado(nome, tempo) {
        const msg = `O veículo ${nome} permaneceu estacionado por ${tempo}`;
        return confirm(msg);
    }
    validarPlaca(placa) {
        const regexPlaca = /^[A-Z]{3}-?\d{4}$/;
        return regexPlaca.test(placa);
    }
    adicionar(veiculo) {
        if (!this.validarPlaca(veiculo.placa)) {
            alert("Placa inválida. Insira uma placa no formato correto (ex: ABC-1234 ou ABC1234).");
            return;
        }
        veiculo.entrada = new Date(); // Definir a entrada como objeto Date
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
          <td>${veiculo.tipo}</td>
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
            const tipoSelect = $("#tipo");
            const nome = nomeInput.value;
            const placa = placaInput.value;
            const tipo = tipoSelect.value;
            const entrada = new Date().toLocaleString("pt-BR");
            patio.adicionar({ nome, placa, tipo, entrada });
            nomeInput.value = "";
            placaInput.value = "";
            tipoSelect.value = "Carro";
        });
    }
})();
