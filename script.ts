interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
  saida?: Date;
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

  private calcularTempoEstacionado(entrada: Date | string): number {
    const tempo = Math.floor((new Date().getTime() - new Date(entrada).getTime()) / 1000 / 60);
    return tempo;
  }

  private exibirMensagemTempoEstacionado(nome: string, tempo: number): boolean {
    const msg = `O veiculo ${nome} permaneceu estacionado por ${tempo} minutos`;
    return confirm(msg);
  }

  public adicionar(veiculo: Veiculo): void {
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
      const nome = nomeInput.value;
      const placa = placaInput.value;
      if (!nome || !placa) {
        alert("Preencha todos os campos!");
        return;
      }
      const veiculo: Veiculo = {
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
