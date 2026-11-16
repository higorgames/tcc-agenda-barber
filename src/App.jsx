import { useState } from "react";

// CLIENTE
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import InicioCliente from "./pages/cliente/InicioCliente";
import AgendarCliente from "./pages/cliente/AgendarCliente";
import MeusAgendamentos from "./pages/cliente/MeusAgendamentos";

// BARBEIRO
import LoginBarbeiro from "./pages/LoginBarbeiro";
import CadastroBarbeiro from "./pages/CadastroBarbeiro";
import PerfilBarbeiro from "./pages/PerfilBarbeiro";
import EditarPerfilBarbeiro from "./pages/EditarPerfilBarbeiro";
import LayoutBarbeiro from "./pages/barbeiro/LayoutBarbeiro";
import PainelBarbeiro from "./pages/barbeiro/PainelBarbeiro";
import AgendamentosBarbeiro from "./pages/barbeiro/AgendamentosBarbeiro";
import ClientesBarbeiro from "./pages/barbeiro/ClientesBarbeiro";
import ServicosBarbeiro from "./pages/barbeiro/ServicosBarbeiro";
import DisponibilidadeBarbeiro from "./pages/barbeiro/DisponibilidadeBarbeiro";

import {
  agendamentosFuturos,
  carregarAgendamentos,
  carregarServicos,
  filtrarDoCliente,
} from "./services/agendaStorage";

// páginas que exigem login
const PAGINAS_CLIENTE = [
  "inicio",
  "agendar",
  "meusAgendamentos",
  "perfil",
  "editarPerfil",
];

const PAGINAS_BARBEIRO = [
  "painelBarbeiro",
  "agendamentosBarbeiro",
  "clientesBarbeiro",
  "servicosBarbeiro",
  "disponibilidadeBarbeiro",
  "perfilBarbeiro",
  "editarPerfilBarbeiro",
];

// menu lateral do barbeiro -> página
const ROTAS_BARBEIRO = {
  inicio: "painelBarbeiro",
  agendamentos: "agendamentosBarbeiro",
  clientes: "clientesBarbeiro",
  servicos: "servicosBarbeiro",
  disponibilidade: "disponibilidadeBarbeiro",
  perfil: "perfilBarbeiro",
};

// página -> item ativo do menu
const MENU_ATIVO_BARBEIRO = {
  painelBarbeiro: "inicio",
  agendamentosBarbeiro: "agendamentos",
  clientesBarbeiro: "clientes",
  servicosBarbeiro: "servicos",
  disponibilidadeBarbeiro: "disponibilidade",
  perfilBarbeiro: "perfil",
  editarPerfilBarbeiro: "perfil",
};

const USUARIO_VAZIO = {
  id_usuario: null,
  nome: "",
  email: "",
  telefone: "",
  data_nascimento: "",
};

const BARBEIRO_VAZIO = {
  id_usuario: null,
  nome: "",
  email: "",
  telefone: "",
  especialidade: "",
};

function lerSalvo(chave, vazio) {
  const salvo = localStorage.getItem(chave);

  if (salvo) {
    try {
      return JSON.parse(salvo);
    } catch {
      localStorage.removeItem(chave);
    }
  }

  return vazio;
}

function App() {
  // =========================
  // DADOS DO CLIENTE E DO BARBEIRO
  // =========================

  const [usuario, setUsuario] = useState(() =>
    lerSalvo("usuario", USUARIO_VAZIO)
  );

  const [barbeiro, setBarbeiro] = useState(() =>
    lerSalvo("barbeiro", BARBEIRO_VAZIO)
  );

  const clienteLogado = Boolean(usuario?.id_usuario);
  const barbeiroLogado = Boolean(barbeiro?.id_usuario);

  // mantém a pessoa logada ao recarregar a página (F5)
  const [pagina, setPagina] = useState(() => {
    if (
      localStorage.getItem("tokenBarbeiro") &&
      lerSalvo("barbeiro", BARBEIRO_VAZIO).id_usuario
    ) {
      return "painelBarbeiro";
    }

    if (
      localStorage.getItem("token") &&
      lerSalvo("usuario", USUARIO_VAZIO).id_usuario
    ) {
      return "inicio";
    }

    return "login";
  });

  // proteção de rotas: sem login, volta para a tela de entrada
  let paginaAtual = pagina;

  if (PAGINAS_CLIENTE.includes(pagina) && !clienteLogado) {
    paginaAtual = "login";
  }

  if (PAGINAS_BARBEIRO.includes(pagina) && !barbeiroLogado) {
    paginaAtual = "loginBarbeiro";
  }

  function sairCliente() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(USUARIO_VAZIO);
    setPagina("login");
  }

  function sairBarbeiro() {
    localStorage.removeItem("tokenBarbeiro");
    localStorage.removeItem("barbeiro");
    setBarbeiro(BARBEIRO_VAZIO);
    setPagina("loginBarbeiro");
  }

  // moldura com menu lateral para as telas do barbeiro
  function comMenuBarbeiro(conteudo) {
    return (
      <LayoutBarbeiro
        barbeiro={barbeiro}
        ativa={MENU_ATIVO_BARBEIRO[paginaAtual]}
        navegar={(chave) => setPagina(ROTAS_BARBEIRO[chave])}
        sair={sairBarbeiro}
      >
        {conteudo}
      </LayoutBarbeiro>
    );
  }

  // dados da tela inicial do cliente
  const agendamentosDoCliente = filtrarDoCliente(
    carregarAgendamentos(),
    usuario
  );

  return (
    <>

      {/* ========================= */}
      {/* CLIENTE */}
      {/* ========================= */}

      {paginaAtual === "login" && (
        <Login
          irParaCadastro={() => setPagina("cadastro")}
          irParaPerfil={() => setPagina("inicio")}
          irParaLoginBarbeiro={() => setPagina("loginBarbeiro")}
          setUsuario={setUsuario}
        />
      )}

      {paginaAtual === "cadastro" && (
        <Cadastro irParaLogin={() => setPagina("login")} />
      )}

      {paginaAtual === "inicio" && (
        <InicioCliente
          nome={usuario.nome}
          proximosAgendamentos={agendamentosFuturos(agendamentosDoCliente)}
          meusAgendamentos={agendamentosDoCliente}
          servicos={carregarServicos()}
          irParaAgendar={() => setPagina("agendar")}
          irParaMeusAgendamentos={() => setPagina("meusAgendamentos")}
          irParaPerfil={() => setPagina("perfil")}
        />
      )}

      {paginaAtual === "agendar" && (
        <AgendarCliente
          usuario={usuario}
          irParaInicio={() => setPagina("inicio")}
          irParaMeusAgendamentos={() => setPagina("meusAgendamentos")}
        />
      )}

      {paginaAtual === "meusAgendamentos" && (
        <MeusAgendamentos
          usuario={usuario}
          irParaInicio={() => setPagina("inicio")}
          irParaAgendar={() => setPagina("agendar")}
        />
      )}

      {paginaAtual === "perfil" && (
        <Perfil
          usuario={usuario}
          irParaEditarPerfil={() => setPagina("editarPerfil")}
          irParaInicio={() => setPagina("inicio")}
          irParaLogin={sairCliente}
        />
      )}

      {paginaAtual === "editarPerfil" && (
        <EditarPerfil
          usuario={usuario}
          setUsuario={setUsuario}
          irParaPerfil={() => setPagina("perfil")}
        />
      )}

      {/* ========================= */}
      {/* BARBEIRO - ENTRADA */}
      {/* ========================= */}

      {paginaAtual === "loginBarbeiro" && (
        <LoginBarbeiro
          setBarbeiro={setBarbeiro}
          irParaLogin={() => setPagina("login")}
          irParaCadastroBarbeiro={() => setPagina("cadastroBarbeiro")}
          irParaPerfilBarbeiro={() => setPagina("painelBarbeiro")}
        />
      )}

      {paginaAtual === "cadastroBarbeiro" && (
        <CadastroBarbeiro
          irParaLoginBarbeiro={() => setPagina("loginBarbeiro")}
        />
      )}

      {/* ========================= */}
      {/* BARBEIRO - PAINEL */}
      {/* ========================= */}

      {paginaAtual === "painelBarbeiro" &&
        comMenuBarbeiro(
          <PainelBarbeiro
            barbeiro={barbeiro}
            navegar={(chave) => setPagina(ROTAS_BARBEIRO[chave])}
          />
        )}

      {paginaAtual === "agendamentosBarbeiro" &&
        comMenuBarbeiro(<AgendamentosBarbeiro />)}

      {paginaAtual === "clientesBarbeiro" &&
        comMenuBarbeiro(<ClientesBarbeiro />)}

      {paginaAtual === "servicosBarbeiro" &&
        comMenuBarbeiro(<ServicosBarbeiro />)}

      {paginaAtual === "disponibilidadeBarbeiro" &&
        comMenuBarbeiro(<DisponibilidadeBarbeiro />)}

      {paginaAtual === "perfilBarbeiro" &&
        comMenuBarbeiro(
          <PerfilBarbeiro
            barbeiro={barbeiro}
            irParaEditarPerfilBarbeiro={() =>
              setPagina("editarPerfilBarbeiro")
            }
            irParaLoginBarbeiro={sairBarbeiro}
          />
        )}

      {paginaAtual === "editarPerfilBarbeiro" &&
        comMenuBarbeiro(
          <EditarPerfilBarbeiro
            barbeiro={barbeiro}
            setBarbeiro={setBarbeiro}
            irParaPerfilBarbeiro={() => setPagina("perfilBarbeiro")}
          />
        )}

    </>
  );
}

export default App;
