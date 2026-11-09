import "./Perfil.css";

function PerfilBarbeiro({
  barbeiro,
  irParaEditarPerfilBarbeiro,
  irParaLoginBarbeiro
}) {
  function sair() {
    localStorage.removeItem("tokenBarbeiro");
    localStorage.removeItem("barbeiro");

    irParaLoginBarbeiro();
  }

  async function excluirConta() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta de barbeiro?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/barbeiros/${barbeiro.id_usuario}`,
        {
          method: "DELETE"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(
          dados.message ||
          "Erro ao excluir a conta."
        );

        return;
      }

      alert("Conta excluída com sucesso!");

      localStorage.removeItem("tokenBarbeiro");
      localStorage.removeItem("barbeiro");

      irParaLoginBarbeiro();

    } catch (erro) {
      console.error(
        "Erro ao excluir conta do barbeiro:",
        erro
      );

      alert(
        "Erro ao conectar com o Back-End."
      );
    }
  }

  return (
    <div className="perfil-container">

      <div className="perfil-card">

        <div className="logo">
          AGENDA <span>BARBER</span>
        </div>

        <div className="avatar">
          {barbeiro?.nome
            ? barbeiro.nome.charAt(0).toUpperCase()
            : "B"}
        </div>

        <h1>
          Perfil do Barbeiro
        </h1>

        <div className="perfil-info">

          <div className="campo">
            <label>Nome</label>

            <p>
              {barbeiro?.nome || "Não informado"}
            </p>
          </div>

          <div className="campo">
            <label>E-mail</label>

            <p>
              {barbeiro?.email || "Não informado"}
            </p>
          </div>

          <div className="campo">
            <label>Telefone</label>

            <p>
              {barbeiro?.telefone || "Não informado"}
            </p>
          </div>

          <div className="campo">
            <label>Especialidade</label>

            <p>
              {barbeiro?.especialidade || "Não informada"}
            </p>
          </div>

        </div>

        <button
          className="btn-editar"
          onClick={irParaEditarPerfilBarbeiro}
        >
          Editar Perfil
        </button>

        <button
          className="btn-excluir"
          onClick={excluirConta}
        >
          Excluir Conta
        </button>

        <button
          className="btn-sair"
          onClick={sair}
        >
          Sair
        </button>

      </div>

    </div>
  );
}

export default PerfilBarbeiro;