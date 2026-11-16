
import { useState } from "react";
import "./MeusAgendamentos.css";

import {
  STATUS,
  atualizarStatusAgendamento,
  carregarAgendamentos,
  filtrarDoCliente,
  formatarData,
  moeda,
  ordenarPorDataHora,
} from "../../services/agendaStorage";

export default function MeusAgendamentos({
  usuario = {},
  irParaInicio = () => {},
  irParaAgendar = () => {},
}) {
  const [agendamentos, setAgendamentos] = useState(() =>
    filtrarDoCliente(carregarAgendamentos(), usuario)
  );

  const [filtro, setFiltro] = useState("Todos");

  function cancelarAgendamento(id) {
    const confirmar = window.confirm(
      "Deseja realmente cancelar este agendamento?"
    );

    if (!confirmar) return;

    atualizarStatusAgendamento(id, STATUS.CANCELADO);

    setAgendamentos((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? { ...item, status: STATUS.CANCELADO }
          : item
      )
    );
  }

  const agendamentosFiltrados = ordenarPorDataHora(agendamentos).filter(
    (item) => {
      if (filtro === "Ativos") {
        return (
          item.status === STATUS.PENDENTE ||
          item.status === STATUS.CONFIRMADO
        );
      }

      if (filtro === "Cancelados") {
        return item.status === STATUS.CANCELADO;
      }

      return true;
    }
  );

  return (
    <main className="meus-agendamentos">

      {/* CABEÇALHO */}

      <header className="agendamentos-header">
        <div className="agendamentos-logo">
          <span>✂</span>

          <div>
            <strong>AGENDA BARBER</strong>
            <small>ÁREA DO CLIENTE</small>
          </div>
        </div>

        <button
          className="voltar-inicio"
          onClick={irParaInicio}
        >
          ← Voltar ao início
        </button>
      </header>

      {/* TÍTULO */}

      <section className="agendamentos-intro">
        <span>SEUS HORÁRIOS</span>

        <h1>Meus agendamentos</h1>

        <p>
          Consulte seus atendimentos e acompanhe
          seus horários marcados.
        </p>

        <button
          className="novo-agendamento"
          onClick={irParaAgendar}
        >
          + Novo agendamento
        </button>
      </section>

      {/* FILTROS */}

      <section className="agendamentos-conteudo">

        <div className="agendamentos-filtros">

          {["Todos", "Ativos", "Cancelados"].map((opcao) => (
            <button
              key={opcao}
              className={
                filtro === opcao ? "filtro-ativo" : ""
              }
              onClick={() => setFiltro(opcao)}
            >
              {opcao}
            </button>
          ))}

        </div>

        {/* LISTA */}

        {agendamentosFiltrados.length > 0 ? (

          <div className="agendamentos-lista">

            {agendamentosFiltrados.map((item) => (

              <article
                className="agendamento-item"
                key={item.id}
              >

                <div className="agendamento-data">
                  <strong>
                    {item.data?.slice(8, 10) || "--"}
                  </strong>

                  <span>
                    {item.data
                      ? new Date(
                          `${item.data}T12:00:00`
                        ).toLocaleDateString("pt-BR", {
                          month: "short",
                        }).replace(".", "")
                      : "---"}
                  </span>
                </div>

                <div className="agendamento-detalhes">

                  <h3>{item.servicoNome}</h3>

                  <p>
                    Profissional: {item.barbeiroNome}
                  </p>

                  <div className="agendamento-informacoes">
                    <span>
                      Data: {formatarData(item.data)}
                    </span>

                    <span>
                      Horário: {item.hora}
                    </span>

                    <span>
                      Duração: {item.duracao} min
                    </span>
                  </div>

                </div>

                <div className="agendamento-lateral">

                  <strong className="agendamento-preco">
                    {moeda(item.preco)}
                  </strong>

                  <span
                    className={
                      item.status === STATUS.CANCELADO
                        ? "status-cancelado"
                        : item.status === STATUS.CONFIRMADO
                        ? "status-confirmado"
                        : item.status === STATUS.CONCLUIDO
                        ? "status-concluido"
                        : "status-pendente"
                    }
                  >
                    {item.status}
                  </span>

                  {(item.status === STATUS.PENDENTE ||
                    item.status === STATUS.CONFIRMADO) && (
                    <button
                      className="cancelar-agendamento"
                      onClick={() =>
                        cancelarAgendamento(item.id)
                      }
                    >
                      Cancelar
                    </button>
                  )}

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="agendamentos-vazio">

            <span>◷</span>

            <h2>
              Nenhum agendamento encontrado
            </h2>

            <p>
              Seus horários aparecerão aqui
              quando você realizar um agendamento.
            </p>

            <button
              className="novo-agendamento"
              onClick={irParaAgendar}
            >
              Agendar meu primeiro horário
            </button>

          </div>

        )}

      </section>

    </main>
  );
}
