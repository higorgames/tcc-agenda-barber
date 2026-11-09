import { useState } from "react";
import "./EditarPerfilBarbeiro.css";

function EditarPerfilBarbeiro({ barbeiro, setBarbeiro, voltar }) {
  const [nome, setNome] = useState(barbeiro?.nome || "");
  const [email, setEmail] = useState(barbeiro?.email || "");
  const [telefone, setTelefone] = useState(barbeiro?.telefone || "");
  const [especialidade, setEspecialidade] = useState(
    barbeiro?.especialidade || ""
  );

  function salvarAlteracoes(e) {
    e.preventDefault();

    const barbeiroAtualizado = {
      ...barbeiro,
      nome,
      email,
      telefone,
      especialidade,
    };

    setBarbeiro(barbeiroAtualizado);

    localStorage.setItem(
      "barbeiro",
      JSON.stringify(barbeiroAtualizado)
    );

    alert("Perfil atualizado com sucesso!");

    if (voltar) {
      voltar();
    }
  }

  return (
    <div className="editar-barbeiro-page">
      <div className="editar-barbeiro-card">

        <div className="editar-barbeiro-header">
          <div className="barbeiro-icon">
            ✂
          </div>

          <div>
            <h1>Editar perfil</h1>
            <p>Atualize suas informações profissionais</p>
          </div>
        </div>

        <form onSubmit={salvarAlteracoes}>

          <div className="campo-barbeiro">
            <label>Nome completo</label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="campo-barbeiro">
            <label>E-mail</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="campo-barbeiro">
            <label>Telefone</label>

            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Digite seu telefone"
            />
          </div>

          <div className="campo-barbeiro">
            <label>Especialidade</label>

            <input
              type="text"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              placeholder="Ex: Corte masculino, barba..."
            />
          </div>

          <div className="botoes-barbeiro">

            <button
              type="button"
              className="btn-voltar-barbeiro"
              onClick={voltar}
            >
              ← Voltar
            </button>

            <button
              type="submit"
              className="btn-salvar-barbeiro"
            >
              Salvar alterações
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default EditarPerfilBarbeiro;
