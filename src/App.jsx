
import { useState } from "react";

// PÁGINA INICIAL DO CLIENTE
import InicioCliente from "./pages/cliente/InicioCliente";
import AgendarCliente from "./pages/cliente/AgendarCliente";
import MeusAgendamentos from "./pages/cliente/MeusAgendamentos";


// CLIENTE
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";

// BARBEIRO
import LoginBarbeiro from "./pages/LoginBarbeiro";
import CadastroBarbeiro from "./pages/CadastroBarbeiro";
import PerfilBarbeiro from "./pages/PerfilBarbeiro";
import EditarPerfilBarbeiro from "./pages/EditarPerfilBarbeiro";

function App() {
  const [pagina, setPagina] = useState("login");

  // =========================
  // DADOS DO CLIENTE
  // =========================

  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      try {
        return JSON.parse(usuarioSalvo);
      } catch {
        localStorage.removeItem("usuario");
      }
    }

    return {
      id_usuario: null,
      nome: "",
      email: "",
      telefone: "",
      data_nascimento: ""
    };
  });

  // =========================
  // DADOS DO BARBEIRO
  // =========================

  const [barbeiro, setBarbeiro] = useState(() => {
    const barbeiroSalvo = localStorage.getItem("barbeiro");

    if (barbeiroSalvo) {
      try {
        return JSON.parse(barbeiroSalvo);
      } catch {
        localStorage.removeItem("barbeiro");
      }
    }

    return {
      id_usuario: null,
      nome: "",
      email: "",
      telefone: "",
      especialidade: ""
    };
  });

  return (
    <>

      {/* ========================= */}
      {/* LOGIN DO CLIENTE */}
      {/* ========================= */}

      {pagina === "login" && (
        <Login
          irParaCadastro={() =>
            setPagina("cadastro")
          }

          irParaPerfil={() =>
            setPagina("inicio")
          }

          irParaLoginBarbeiro={() =>
            setPagina("loginBarbeiro")
          }

          setUsuario={setUsuario}
        />
      )}


      {/* ========================= */}
      {/* CADASTRO DO CLIENTE */}
      {/* ========================= */}

      {pagina === "cadastro" && (
        <Cadastro
          irParaLogin={() =>
            setPagina("login")
          }
        />
      )}


      {/* ========================= */}
      {/* INÍCIO DO CLIENTE */}
      {/* ========================= */}

      {pagina === "inicio" && (
        <InicioCliente
          nome={usuario.nome}

          irParaAgendar={() =>
            setPagina("agendar")
          }

          irParaPerfil={() =>
            setPagina("perfil")
          }
        />
      )}


      {/* ========================= */}
      {/* AGENDAMENTO */}
    {/* AGENDAMENTO DO CLIENTE */}

{pagina === "agendar" && (
  <AgendarCliente
    irParaInicio={() => setPagina("inicio")}
  />
)}
{/* MEUS AGENDAMENTOS */}

{pagina === "meusAgendamentos" && (
  <MeusAgendamentos
    irParaInicio={() => setPagina("inicio")}
    irParaAgendar={() => setPagina("agendar")}
  />
)}

      {/* ========================= */}
      {/* PERFIL DO CLIENTE */}
      {/* ========================= */}

      {pagina === "perfil" && (
        <Perfil
          usuario={usuario}

          irParaEditarPerfil={() =>
            setPagina("editarPerfil")
          }

          irParaLogin={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setPagina("login");
          }}
        />
      )}


      {/* ========================= */}
      {/* EDITAR PERFIL DO CLIENTE */}
      {/* ========================= */}

      {pagina === "editarPerfil" && (
        <EditarPerfil
          usuario={usuario}

          setUsuario={setUsuario}

          irParaPerfil={() =>
            setPagina("perfil")
          }
        />
      )}


      {/* ========================= */}
      {/* LOGIN DO BARBEIRO */}
      {/* ========================= */}

      {pagina === "loginBarbeiro" && (
        <LoginBarbeiro
          setBarbeiro={setBarbeiro}

          irParaLogin={() =>
            setPagina("login")
          }

          irParaCadastroBarbeiro={() =>
            setPagina("cadastroBarbeiro")
          }

          irParaPerfilBarbeiro={() =>
            setPagina("perfilBarbeiro")
          }
        />
      )}


      {/* ========================= */}
      {/* CADASTRO DO BARBEIRO */}
      {/* ========================= */}

      {pagina === "cadastroBarbeiro" && (
        <CadastroBarbeiro
          irParaLoginBarbeiro={() =>
            setPagina("loginBarbeiro")
          }
        />
      )}


      {/* ========================= */}
      {/* PERFIL DO BARBEIRO */}
      {/* ========================= */}

      {pagina === "perfilBarbeiro" && (
        <PerfilBarbeiro
          barbeiro={barbeiro}

          irParaEditarPerfilBarbeiro={() =>
            setPagina("editarPerfilBarbeiro")
          }

          irParaLoginBarbeiro={() => {
            localStorage.removeItem("barbeiro");
            setPagina("loginBarbeiro");
          }}
        />
      )}


      {/* ========================= */}
      {/* EDITAR PERFIL DO BARBEIRO */}
      {/* ========================= */}

      {pagina === "editarPerfilBarbeiro" && (
        <EditarPerfilBarbeiro
          barbeiro={barbeiro}

          setBarbeiro={setBarbeiro}

          irParaPerfilBarbeiro={() =>
            setPagina("perfilBarbeiro")
          }
        />
      )}

    </>
  );
}

export default App;
