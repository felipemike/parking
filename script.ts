interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
  saida?: Date;
  tipo: "Carro" | "Moto" | string;
}

class Patio {
  private veiculos: Veiculo[];

  constructor() {
    this.veiculos = this.ler();
  }

  private ler(): Veiculo[] {
    return JSON.parse(localStorage.getItem("patio") || "[]") as Veiculo[];
  }

  private salvar(): void {
    localStorage.setItem("patio", JSON.stringify(this.veiculos));
  }

  private calcularTempoEstacionado(entrada: Date | string): string {
    const entradaDate = typeof entrada === 'string' ? new Date(entrada) : entrada;
    const agora = new Date();
    const diffMs = agora.getTime() - entradaDate.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const horas = Math.floor(diffMin / 60);
    const minutos = diffMin % 60;
    return `${horas} horas e ${minutos} minutos`;
  }
  
  private exibirMensagemTempoEstacionado(nome: string, tempo: string): boolean {
    const msg = `O veículo ${nome} permaneceu estacionado por ${tempo}`;
    return confirm(msg);
  }

  private validarPlaca(placa: string): boolean {
    const regexPlaca = /^[A-Z]{3}-?\d{4}$/;
    return regexPlaca.test(placa);
  }

  public adicionar(veiculo: Veiculo): void {
    if (!this.validarPlaca(veiculo.placa)) {
      alert("Placa inválida. Insira uma placa no formato correto (ex: ABC-1234 ou ABC1234).");
      return;
    }
  
    veiculo.entrada = new Date(); // Definir a entrada como objeto Date
    this.veiculos.push(veiculo);
    this.salvar();
    this.listar();
  }
  

  public remover(placa: string): void {
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
  


  public listar(): void {
    const patioElement = document.querySelector("#patio");
    if (patioElement) {
      patioElement.innerHTML = "";
      this.veiculos.forEach((veiculo) => {
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
        row.querySelector(".delete")?.addEventListener("click", () => {
          this.remover(veiculo.placa);
        });
        patioElement.appendChild(row);
      });
    }
  }
}

(function () {
  const $ = (query: string): HTMLElement | null => document.querySelector(query);

  const patio = new Patio();
  patio.listar();

  const cadastrarBtn = $("#cadastrar");
  if (cadastrarBtn) {
    cadastrarBtn.addEventListener("click", () => {
      const nomeInput = $("#nome") as HTMLInputElement;
      const placaInput = $("#placa") as HTMLInputElement;
      const tipoSelect = $("#tipo") as HTMLSelectElement;
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

