
import { useState } from "react";
import "./AgendarCliente.css";

const servicos = [
  {
    id: 1,
    nome: "Corte masculino",
    descricao: "Corte tradicional ou degradê.",
    duracao: 40,
    preco: 35,
  },
  {
    id: 2,
    nome: "Barba",
    descricao: "Aparar e modelar a barba.",
    duracao: 30,
    preco: 25,
  },
  {
    id: 3,
    nome: "Cabelo + Barba",
    descricao: "Atendimento completo.",
    duracao: 60,
    preco: 55,
  },
];

const barbeiros = [
  { id: 1, nome: "Carlos Mendes", especialidade: "Cortes masculinos" },
  { id: 2, nome: "Rafael Souza", especialidade: "Barba e acabamento" },
  { id: 3, nome: "Lucas Ferreira", especialidade: "Cortes modernos" },
];

const horarios = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function moeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function dataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function AgendarCliente({
  irParaInicio,
  irParaMeusAgendamentos,
}) {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [erro, setErro] = useState("");
  const [resumo, setResumo] = useState(null);

  const servico = servicos.find(
    (item) => item.id === servicoSelecionado
  );

  const barbeiro = barbeiros.find(
    (item) => item.id === barbeiroSelecionado
  );

  function confirmarAgendamento(event) {
    event.preventDefault();

    if (!servicoSelecionado || !barbeiroSelecionado || !data || !horario) {
      setErro("Preencha todas as etapas para continuar.");
      return;
    }

    setErro("");

    setResumo({
      servico,
      barbeiro,
      data,
      horario,
    });
  }

  function voltarParaEdicao() {
    setResumo(null);
  }
   function salvarAgendamento() {
  if (!resumo) return;

  let lista = [];

  try {
    const dados = JSON.parse(
      localStorage.getItem("agendamentos") || "[]"
    );

    if (Array.isArray(dados)) {
      lista = dados;
    }
  } catch {
    lista = [];
  }

  const novoAgendamento = {
    id: `ag-${Date.now()}`,
    servicoNome: resumo.servico.nome,
    barbeiroNome: resumo.barbeiro.nome,
    data: resumo.data,
    hora: resumo.horario,
    duracao: resumo.servico.duracao,
    preco: resumo.servico.preco,
    status: "Pendente",
  };

  localStorage.setItem(
    "agendamentos",
    JSON.stringify([...lista, novoAgendamento])
  );

  irParaMeusAgendamentos();
}
  return (
    <main className="agendar-page">

      <header className="agendar-header">
        <div>
          <span className="agendar-logo">✂</span>

          <div>
            <strong>AGENDA BARBER</strong>
            <small>AGENDAMENTO ONLINE</small>
          </div>
        </div>

        <button
          type="button"
          className="agendar-voltar"
          onClick={irParaInicio}
        >
          ← Voltar ao início
        </button>
      </header>

      <section className="agendar-intro">
        <span>ÁREA DO CLIENTE</span>
        <h1>Agende seu horário</h1>
        <p>
          Escolha seu serviço, profissional e o melhor
          horário para você.
        </p>
      </section>

      {!resumo ? (

        <form
          className="agendar-form"
          onSubmit={confirmarAgendamento}
        >

          {/* ETAPa 1 de - SERVICOS */}

          <section className="agendar-card">

            <div className="agendar-titulo">
              <span>01</span>

              <div>
                <h2>Escolha o serviço</h2>
                <p>Selecione o atendimento desejado.</p>
              </div>
            </div>

            <div className="agendar-servicos">

              {servicos.map((item) => (

                <button
                  type="button"
                  key={item.id}
                  className={`agendar-servico ${
                    servicoSelecionado === item.id
                      ? "selecionado"
                      : ""
                  }`}
                  onClick={() => {
                    setServicoSelecionado(item.id);
                    setErro("");
                  }}
                  aria-pressed={servicoSelecionado === item.id}
                >

                  <div className="servico-topo">
                    <span>✂</span>

                    {servicoSelecionado === item.id && (
                      <span className="servico-check">✓</span>
                    )}
                  </div>

                  <h3>{item.nome}</h3>

                  <p>{item.descricao}</p>

                  <div className="servico-informacoes">
                    <strong>{moeda(item.preco)}</strong>
                    <small>{item.duracao} min</small>
                  </div>

                </button>

              ))}

            </div>

          </section>

          {/* ETAPA 2 - BARBEIRO */}

          <section className="agendar-card">

            <div className="agendar-titulo">
              <span>02</span>

              <div>
                <h2>Escolha o profissional</h2>
                <p>Selecione quem realizará seu atendimento.</p>
              </div>
            </div>

            <div className="agendar-barbeiros">

              {barbeiros.map((item) => (

                <button
                  type="button"
                  key={item.id}
                  className={`agendar-barbeiro ${
                    barbeiroSelecionado === item.id
                      ? "selecionado"
                      : ""
                  }`}
                  onClick={() => {
                    setBarbeiroSelecionado(item.id);
                    setErro("");
                  }}
                  aria-pressed={barbeiroSelecionado === item.id}
                >

                  <div className="barbeiro-avatar">
                    {item.nome.charAt(0)}
                  </div>

                  <div>
                    <strong>{item.nome}</strong>
                    <small>{item.especialidade}</small>
                  </div>

                  {barbeiroSelecionado === item.id && (
                    <span className="barbeiro-check">✓</span>
                  )}

                </button>

              ))}

            </div>

          </section>

          {/* ETAPA 3 - DATA */}

          <section className="agendar-card">

            <div className="agendar-titulo">
              <span>03</span>

              <div>
                <h2>Escolha a data</h2>
                <p>Selecione o dia do atendimento.</p>
              </div>
            </div>

            <div className="campo-data">
              <label htmlFor="data-agendamento">
                Data do atendimento
              </label>

              <input
                id="data-agendamento"
                type="date"
                min={dataLocal()}
                value={data}
                onChange={(event) => {
                  setData(event.target.value);
                  setHorario("");
                  setErro("");
                }}
              />
            </div>

          </section>

          {/* ETAPA 4 - HORÁRIO */}

          <section className="agendar-card">

            <div className="agendar-titulo">
              <span>04</span>

              <div>
                <h2>Escolha o horário</h2>
                <p>Selecione um horário para o atendimento.</p>
              </div>
            </div>

            {!data ? (

              <p className="aviso-horario">
                Primeiro selecione uma data para visualizar os horários.
              </p>

            ) : (

              <div className="horarios-grid">

                {horarios.map((hora) => (

                  <button
                    type="button"
                    key={hora}
                    className={`horario-item ${
                      horario === hora ? "selecionado" : ""
                    }`}
                    onClick={() => {
                      setHorario(hora);
                      setErro("");
                    }}
                    aria-pressed={horario === hora}
                  >
                    {hora}
                  </button>

                ))}

              </div>

            )}

          </section>

          {/* RESUMO */}

          <section className="agendar-resumo">

            <h2>Resumo do agendamento</h2>

            <div className="resumo-linha">
              <span>Serviço</span>
              <strong>{servico?.nome || "Não selecionado"}</strong>
            </div>

            <div className="resumo-linha">
              <span>Profissional</span>
              <strong>{barbeiro?.nome || "Não selecionado"}</strong>
            </div>

            <div className="resumo-linha">
              <span>Data</span>
              <strong>
                {data
                  ? new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR")
                  : "Não selecionada"}
              </strong>
            </div>

            <div className="resumo-linha">
              <span>Horário</span>
              <strong>{horario || "Não selecionado"}</strong>
            </div>

            <div className="resumo-total">
              <span>Valor total</span>
              <strong>{moeda(servico?.preco || 0)}</strong>
            </div>

            {erro && (
              <p className="agendar-erro">{erro}</p>
            )}

            <button
              type="submit"
              className="botao-confirmar"
            >
              Revisar agendamento →
            </button>

          </section>

          <p className="agendar-observacao">
            Demonstração visual: os horários e profissionais
            serão conectados ao banco de dados posteriormente.
          </p>

        </form>

      ) : (

        /* TELA DE RESUMO */

        <section className="agendar-card confirmacao-card">

          <div className="confirmacao-icone">✓</div>

          <h2>Confira seu agendamento</h2>

          <p>
            Verifique as informações antes de finalizar.
          </p>

          <div className="confirmacao-dados">

            <div>
              <span>Serviço</span>
              <strong>{resumo.servico.nome}</strong>
            </div>

            <div>
              <span>Profissional</span>
              <strong>{resumo.barbeiro.nome}</strong>
            </div>

            <div>
              <span>Data</span>
              <strong>
                {new Date(`${resumo.data}T12:00:00`).toLocaleDateString("pt-BR")}
              </strong>
            </div>

            <div>
              <span>Horário</span>
              <strong>{resumo.horario}</strong>
            </div>

            <div>
              <span>Duração</span>
              <strong>{resumo.servico.duracao} minutos</strong>
            </div>

            <div>
              <span>Valor</span>
              <strong>{moeda(resumo.servico.preco)}</strong>
            </div>

          </div>

          <p className="aviso-demonstracao">
            Esta é uma prévia. O agendamento ainda não foi
            enviado nem confirmado pelo servidor.
          </p>

          <button
            type="button"
            className="botao-confirmar"
            onClick={voltarParaEdicao}
          >
         <div className="confirmacao-acoes">
         <button
    type="button"
    className="botao-voltar-edicao"
    onClick={voltarParaEdicao}
  >
    Voltar e editar
  </button>

  <button
    type="button"
    className="botao-confirmar"
    onClick={salvarAgendamento}
  >
    Confirmar agendamento
  </button>
</div>
          </button>

        </section>

      )}

    </main>
  );
}
