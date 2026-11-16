import { useState } from "react";
import {
  STATUS,
  atualizarStatusAgendamento,
  carregarAgendamentos,
  dataLocal,
  formatarData,
  moeda,
  ordenarPorDataHora,
} from "../../services/agendaStorage";

const FILTROS = ["Hoje", "Pendentes", "Próximos", "Todos"];

function classeSelo(status) {
  if (status === STATUS.CONFIRMADO) return "confirmado";
  if (status === STATUS.CONCLUIDO) return "concluido";
  if (status === STATUS.CANCELADO) return "cancelado";
  return "pendente";
}

// Lista de agendamentos com confirmar, concluir e cancelar
export default function AgendamentosBarbeiro() {
  const [agendamentos, setAgendamentos] = useState(carregarAgendamentos);
  const [filtro, setFiltro] = useState("Todos");

  function mudarStatus(id, status) {
    setAgendamentos(atualizarStatusAgendamento(id, status));
  }

  function cancelar(id) {
    const confirmar = window.confirm(
      "Deseja cancelar este agendamento? O horário ficará livre."
    );

    if (confirmar) {
      mudarStatus(id, STATUS.CANCELADO);
    }
  }

  const lista = ordenarPorDataHora(agendamentos).filter((item) => {
    if (filtro === "Hoje") {
      return item.data === dataLocal() && item.status !== STATUS.CANCELADO;
    }

    if (filtro === "Pendentes") {
      return item.status === STATUS.PENDENTE;
    }

    if (filtro === "Próximos") {
      return (
        item.data >= dataLocal() &&
        (item.status === STATUS.PENDENTE ||
          item.status === STATUS.CONFIRMADO)
      );
    }

    return true;
  });

  return (
    <>
      <h1>Agendamentos</h1>
      <p className="painel-subtitulo">
        Confirme, conclua ou cancele os horários marcados pelos clientes.
      </p>

      <div className="painel-filtros">
        {FILTROS.map((opcao) => (
          <button
            key={opcao}
            type="button"
            className={filtro === opcao ? "ativo" : ""}
            onClick={() => setFiltro(opcao)}
          >
            {opcao}
          </button>
        ))}
      </div>

      {lista.length > 0 ? (
        lista.map((item) => (
          <article className="painel-item" key={item.id}>

            <span className="painel-hora">{item.hora}</span>

            <div className="painel-item-principal">
              <strong>{item.clienteNome || "Cliente"}</strong>
              <small>
                {item.servicoNome} · {formatarData(item.data)} ·{" "}
                {item.barbeiroNome} · {moeda(item.preco)}
              </small>
            </div>

            <span className={`selo ${classeSelo(item.status)}`}>
              {item.status}
            </span>

            <div className="painel-item-acoes">
              {item.status === STATUS.PENDENTE && (
                <button
                  type="button"
                  className="btn-painel pequeno"
                  onClick={() => mudarStatus(item.id, STATUS.CONFIRMADO)}
                >
                  Confirmar
                </button>
              )}

              {item.status === STATUS.CONFIRMADO && (
                <button
                  type="button"
                  className="btn-painel pequeno"
                  onClick={() => mudarStatus(item.id, STATUS.CONCLUIDO)}
                >
                  Concluir
                </button>
              )}

              {(item.status === STATUS.PENDENTE ||
                item.status === STATUS.CONFIRMADO) && (
                <button
                  type="button"
                  className="btn-painel pequeno perigo"
                  onClick={() => cancelar(item.id)}
                >
                  Cancelar
                </button>
              )}
            </div>

          </article>
        ))
      ) : (
        <p className="painel-vazio">
          Nenhum agendamento encontrado neste filtro.
        </p>
      )}
    </>
  );
}
