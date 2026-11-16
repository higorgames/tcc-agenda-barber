
import "./InicioCliente.css";

import {
  STATUS,
  dataLocal,
  formatarMes,
  moeda,
} from "../../services/agendaStorage";

// devolve "hoje", "amanhã" ou null, para o lembrete
function quandoAcontece(data) {
  if (!data) return null;

  if (data === dataLocal()) return "hoje";

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);

  const ano = amanha.getFullYear();
  const mes = String(amanha.getMonth() + 1).padStart(2, "0");
  const dia = String(amanha.getDate()).padStart(2, "0");

  return data === `${ano}-${mes}-${dia}` ? "amanhã" : null;
}

export default function InicioCliente({
  nome,
  proximosAgendamentos = [],
  meusAgendamentos = [],
  servicos = [],
  irParaAgendar = () => {},
  irParaMeusAgendamentos = () => {},
  irParaPerfil = () => {},
}) {
  const proximo = proximosAgendamentos[0];

  const concluidos = meusAgendamentos.filter(
    (item) => item.status === STATUS.CONCLUIDO
  ).length;

  const quando = quandoAcontece(proximo?.data);

  const servicosAtivos = servicos.filter(
    (item) => item.ativo !== false
  );

  return (
    <main className="inicio-cliente">

      {/* CABEÇALHO */}

      <header className="cliente-header">
        <div className="cliente-logo">
          <span className="logo-icon">✂</span>
          <div>
            <strong>AGENDA BARBER</strong>
            <small>BARBEARIA & AGENDAMENTOS</small>
          </div>
        </div>

        <div className="cliente-header-acoes">
          <button
            className="perfil-header"
            onClick={irParaMeusAgendamentos}
          >
            Meus agendamentos
          </button>

          <button
            className="perfil-header"
            onClick={irParaPerfil}
          >
            Meu perfil
          </button>
        </div>
      </header>

      {/* BOAS-VINDAS */}

      <section className="welcome-card">
        <div className="welcome-content">
          <span className="welcome-label">
            ÁREA DO CLIENTE
          </span>

          <h1>
            Olá, {nome?.split(" ")[0] || "Cliente"}!
          </h1>

          <p>
            Que tal reservar um momento para cuidar do seu visual?
          </p>

          <button
            className="button-agendar"
            onClick={irParaAgendar}
          >
            Agendar horário
            <span>→</span>
          </button>
        </div>

        <div className="welcome-mark">
          ✂
        </div>
      </section>

      {/* LEMBRETE */}

      {quando && (
        <section className="lembrete-card" role="status">
          <span className="lembrete-icone">🔔</span>

          <p>
            Lembrete: você tem <strong>{proximo.servicoNome}</strong>{" "}
            {quando} às <strong>{proximo.hora}</strong> com{" "}
            {proximo.barbeiroNome || "o barbeiro"}.
          </p>
        </section>
      )}

      {/* INDICADORES */}

      <section className="stat-grid">

        <article className="stat-card">
          <span className="stat-icon">◷</span>
          <div>
            <p>Próximos horários</p>
            <strong>{proximosAgendamentos.length}</strong>
            <small>Agendamentos futuros</small>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">✓</span>
          <div>
            <p>Atendimentos concluídos</p>
            <strong>{concluidos}</strong>
            <small>Visitas realizadas</small>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">✂</span>
          <div>
            <p>Serviços disponíveis</p>
            <strong>{servicosAtivos.length}</strong>
            <small>Opções para você</small>
          </div>
        </article>

      </section>

      {/* PRÓXIMO AGENDAMENTO */}

      <section className="content-card">

        <div className="section-heading">
          <div>
            <span className="section-label">
              SUA PROGRAMAÇÃO
            </span>

            <h2>Próximo agendamento</h2>
          </div>

          <button
            className="button-secondary"
            onClick={irParaMeusAgendamentos}
          >
            Ver todos
          </button>
        </div>

        {proximo ? (

          <article className="appointment-card">

            <div className="appointment-date">
              <strong>
                {proximo.data?.slice(8, 10) || "--"}
              </strong>

              <span>
                {formatarMes(proximo.data)}
              </span>
            </div>

            <div className="appointment-main">
              <strong>{proximo.servicoNome}</strong>

              <p>
                Profissional: {proximo.barbeiroNome || "A definir"}
              </p>

              <small>
                {proximo.hora || "--:--"} ·{" "}
                {proximo.duracao || 0} min ·{" "}
                {moeda(proximo.preco)}
              </small>
            </div>

            <span className="status-badge">
              {proximo.status}
            </span>

          </article>

        ) : (

          <div className="empty-state">
            <span className="empty-icon">◷</span>

            <h3>Nenhum horário agendado</h3>

            <p>
              Você ainda não possui um atendimento marcado.
              Escolha um serviço e reserve seu horário.
            </p>

            <button
              className="button-secondary"
              onClick={irParaAgendar}
            >
              Fazer agendamento
            </button>
          </div>

        )}

      </section>

      {/* SERVIÇOS */}

      <section className="content-card">

        <div className="section-heading">
          <div>
            <span className="section-label">
              CONHEÇA NOSSAS OPÇÕES
            </span>

            <h2>Nossos serviços</h2>
          </div>
        </div>

        {servicosAtivos.length > 0 ? (

          <div className="service-preview-grid">

            {servicosAtivos.slice(0, 3).map((servico) => (

              <article
                className="service-preview"
                key={servico.id || servico.id_servico || servico.nome}
              >
                <span className="service-symbol">✂</span>

                <h3>{servico.nome}</h3>

                <p>
                  {servico.duracao} minutos
                </p>

                <strong>
                  {moeda(servico.preco)}
                </strong>

              </article>

            ))}

          </div>

        ) : (

          <p className="empty-services">
            Os serviços disponíveis serão exibidos aqui.
          </p>

        )}

      </section>

    </main>
  );
}
