import { useState } from "react";
import {
  NOMES_DIAS,
  carregarDisponibilidade,
  salvarDisponibilidade,
} from "../../services/agendaStorage";

// Define quando a barbearia atende. A tela de agendamento do cliente
// só mostra horários dentro desse expediente.
export default function DisponibilidadeBarbeiro() {
  const [disp, setDisp] = useState(carregarDisponibilidade);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function alternarDia(indice) {
    const dias = disp.dias.map((aberto, i) =>
      i === indice ? !aberto : aberto
    );

    setDisp({ ...disp, dias });
    setMensagem("");
  }

  function alterarHora(event) {
    setDisp({ ...disp, [event.target.name]: event.target.value });
    setMensagem("");
  }

  function salvar(event) {
    event.preventDefault();

    if (!disp.dias.some(Boolean)) {
      setErro("Marque pelo menos um dia de atendimento.");
      return;
    }

    if (disp.inicio >= disp.fim) {
      setErro("O horário de abertura deve ser antes do fechamento.");
      return;
    }

    if (disp.almocoInicio > disp.almocoFim) {
      setErro("O intervalo de almoço está inválido.");
      return;
    }

    setErro("");
    salvarDisponibilidade(disp);
    setMensagem("Horários de atendimento salvos.");
  }

  return (
    <>
      <h1>Horários de atendimento</h1>
      <p className="painel-subtitulo">
        Defina os dias e o expediente. Os clientes só poderão agendar
        dentro desses horários.
      </p>

      {mensagem && <p className="painel-sucesso">{mensagem}</p>}

      <form className="painel-bloco painel-form" onSubmit={salvar}>

        <div className="painel-dias" role="group" aria-label="Dias">
          {NOMES_DIAS.map((nome, indice) => (
            <label
              key={nome}
              className={`painel-dia ${
                disp.dias[indice] ? "marcado" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={disp.dias[indice]}
                onChange={() => alternarDia(indice)}
              />
              {nome}
            </label>
          ))}
        </div>

        <label className="painel-campo">
          Abre às
          <input
            type="time"
            name="inicio"
            value={disp.inicio}
            onChange={alterarHora}
          />
        </label>

        <label className="painel-campo">
          Fecha às
          <input
            type="time"
            name="fim"
            value={disp.fim}
            onChange={alterarHora}
          />
        </label>

        <label className="painel-campo">
          Almoço de
          <input
            type="time"
            name="almocoInicio"
            value={disp.almocoInicio}
            onChange={alterarHora}
          />
        </label>

        <label className="painel-campo">
          Almoço até
          <input
            type="time"
            name="almocoFim"
            value={disp.almocoFim}
            onChange={alterarHora}
          />
        </label>

        {erro && <p className="painel-erro">{erro}</p>}

        <div className="painel-form-acoes">
          <button type="submit" className="btn-painel">
            Salvar horários
          </button>
        </div>

      </form>
    </>
  );
}
