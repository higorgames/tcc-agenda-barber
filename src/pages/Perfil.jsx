import "./Perfil.css";

function Perfil({
  usuario,
  irParaEditarPerfil,
  irParaLogin
}) {

  function formatarData(data) {
    if (!data) {
      return "Não informado";
    }

    const dataSemHora = data.split("T")[0];

    const partes = dataSemHora.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    irParaLogin();
  }

  async function excluirConta() {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/clientes/${usuario.id_usuario}`,
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

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      irParaLogin();

    } catch (erro) {
      console.error(
        "Erro ao excluir conta:",
        erro
      );

      alert("Erro ao conectar com o Back-End.");
    }
  }

  return (
    <div className="perfil-container">

      <div className="perfil-card">

        <div className="logo">
          AGENDA <span>BARBER</span>
        </div>

        <div className="avatar">
          {usuario?.nome
            ? usuario.nome.charAt(0).toUpperCase()
            : "U"}
        </div>

        <h1>Meu Perfil</h1>

        <div className="perfil-info">

          <div className="campo">
            <label>Nome</label>

            <p>
              {usuario?.nome || "Não informado"}
            </p>
          </div>

          <div className="campo">
            <label>E-mail</label>

            <p>
              {usuario?.email || "Não informado"}
            </p>
          </div>

          <div className="campo">
            <label>Telefone</label>

            <p>
              {usuario?.telefone || "Não informado"}
            </p>
          </div>

          <div className="campo">
            <label>Data de nascimento</label>

            <p>
              {formatarData(
                usuario?.data_nascimento
              )}
            </p>
          </div>

        </div>

        <button
          className="btn-editar"
          onClick={irParaEditarPerfil}
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

export default Perfil;