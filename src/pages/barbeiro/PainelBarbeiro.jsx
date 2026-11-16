import {
  STATUS,
  agendamentosFuturos,
  carregarAgendamentos,
  carregarServicos,
  dataLocal,
  formatarData,
} from "../../services/agendaStorage";

// Tela inicial do barbeiro (Figura 17 dos slides)
export default function PainelBarbeiro({
  barbeiro = {},
  navegar = () => {},
}) {
  const agendamentos = carregarAgendamentos();
  const servicos = carregarServicos();

  const validos = agendamentos.filter(
    (item) => item.status !== STATUS.CANCELADO
  );

  const hoje = validos.filter((item) => item.data === dataLocal());

  const clientes = new Set(
    validos.map((item) => item.clienteId ?? item.clienteNome)
  );

  const pendentes = agendamentos.filter(
    (item) => item.status === STATUS.PENDENTE
  ).length;

  const proximos = agendamentosFuturos(agendamentos).slice(0, 4);

  // contagem de serviços mais realizados
  const contagem = {};

  validos.forEach((item) => {
    contagem[item.servicoNome] = (contagem[item.servicoNome] || 0) + 1;
  });

  const maisRealizados = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const primeiroNome = barbeiro?.nome?.split(" ")[0] || "Barbeiro";

  return (
    <>
      <h1>Olá, {primeiroNome}!</h1>
      <p className="painel-subtitulo">
        Bem-vindo ao seu painel da barbearia.
      </p>

      {pendentes > 0 && (
        <div className="painel-aviso" role="status">
          <span>
            Você tem <strong>{pendentes}</strong>{" "}
            {pendentes === 1
              ? "agendamento aguardando confirmação."
              : "agendamentos aguardando confirmação."}
          </span>

          <button
            type="button"
            className="btn-painel pequeno"
            onClick={() => navegar("agendamentos")}
          >
            Revisar
          </button>
        </div>
      )}

      <section className="painel-cards">
        <article className="painel-card-resumo">
          <span className="painel-card-icone">◷</span>
          <div>
            <strong>{hoje.length}</strong>
            <small>Agendamentos hoje</small>
          </div>
        </article>

        <article className="painel-card-resumo">
          <span className="painel-card-icone">☺</span>
          <div>
            <strong>{clientes.size}</strong>
            <small>Clientes</small>
          </div>
        </article>

        <article className="painel-card-resumo">
          <span className="painel-card-icone">✂</span>
          <div>
            <strong>
              {servicos.filter((item) => item.ativo !== false).length}
            </strong>
            <small>Serviços</small>
          </div>
        </article>
      </section>

      <section className="painel-grade">

        <div className="painel-bloco">
          <div className="painel-bloco-topo">
            <h2>Próximos agendamentos</h2>

            <button
              type="button"
              className="painel-link"
              onClick={() => navegar("agendamentos")}
            >
              Ver todos →
            </button>
          </div>

          {proximos.length > 0 ? (
            <ul className="painel-lista">
              {proximos.map((item) => (
                <li key={item.id}>
                  <span className="painel-hora">{item.hora}</span>

                  <div>
                    <strong>{item.clienteNome || "Cliente"}</strong>
                    <small>
                      {item.servicoNome} · {formatarData(item.data)}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="painel-vazio">
              Nenhum agendamento futuro por enquanto.
            </p>
          )}
        </div>

        <div className="painel-bloco">
          <div className="painel-bloco-topo">
            <h2>Serviços mais realizados</h2>
          </div>

          {maisRealizados.length > 0 ? (
            <ul className="painel-lista">
              {maisRealizados.map(([nome, quantidade]) => (
                <li key={nome}>
                  <span aria-hidden="true">✂</span>
                  <span>{nome}</span>
                  <strong className="painel-contagem">
                    {quantidade}
                  </strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="painel-vazio">
              Os serviços mais pedidos aparecerão aqui.
            </p>
          )}
        </div>

      </section>
    </>
  );
}
