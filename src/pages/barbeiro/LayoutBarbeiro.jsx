import "./PainelBarbeiro.css";

const MENU = [
  { chave: "inicio", rotulo: "Início", icone: "⌂" },
  { chave: "agendamentos", rotulo: "Agendamentos", icone: "◷" },
  { chave: "clientes", rotulo: "Clientes", icone: "☺" },
  { chave: "servicos", rotulo: "Serviços", icone: "✂" },
  { chave: "disponibilidade", rotulo: "Horários", icone: "☰" },
  { chave: "perfil", rotulo: "Perfil", icone: "●" },
];

// Estrutura comum de todas as telas do painel do barbeiro:
// menu lateral + cabeçalho com o nome do usuário.
export default function LayoutBarbeiro({
  barbeiro = {},
  ativa = "inicio",
  navegar = () => {},
  sair = () => {},
  children,
}) {
  const nomeCompleto = barbeiro?.nome || "Barbeiro";

  return (
    <div className="painel-barbeiro">

      {/* MENU LATERAL */}

      <aside className="painel-menu">

        <div className="painel-logo">
          <span className="painel-logo-icone">✂</span>
          <strong>AGENDA BARBER</strong>
        </div>

        <nav aria-label="Menu do barbeiro">
          {MENU.map((item) => (
            <button
              key={item.chave}
              type="button"
              className={`painel-menu-item ${
                ativa === item.chave ? "ativo" : ""
              }`}
              aria-current={ativa === item.chave ? "page" : undefined}
              onClick={() => navegar(item.chave)}
            >
              <span aria-hidden="true">{item.icone}</span>
              {item.rotulo}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="painel-sair"
          onClick={sair}
        >
          Sair
        </button>

      </aside>

      {/* CONTEÚDO */}

      <div className="painel-area">

        <header className="painel-topo">
          <button
            type="button"
            className="painel-usuario"
            onClick={() => navegar("perfil")}
          >
            <span className="painel-avatar">
              {nomeCompleto.charAt(0).toUpperCase()}
            </span>
            {nomeCompleto}
          </button>
        </header>

        <main className="painel-conteudo">
          {children}
        </main>

      </div>

    </div>
  );
}
