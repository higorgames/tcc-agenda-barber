import { useState } from "react";
import "./EditarPerfil.css";

function EditarPerfil({ usuario, setUsuario, irParaPerfil }) {
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [telefone, setTelefone] = useState(usuario?.telefone || "");
  const [dataNascimento, setDataNascimento] = useState(
    usuario?.data_nascimento || ""
  );

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function salvarAlteracoes(e) {
    e.preventDefault();

    if (!nome || !email || !telefone || !dataNascimento) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      const resposta = await fetch(
        `http://localhost:3000/clientes/${usuario.id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            email,
            telefone,
            data_nascimento: dataNascimento,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.message || "Erro ao atualizar perfil.");
        return;
      }

      const usuarioAtualizado = {
        ...usuario,
        nome,
        email,
        telefone,
        data_nascimento: dataNascimento,
      };

      setUsuario(usuarioAtualizado);

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioAtualizado)
      );

      setMensagem("Perfil atualizado com sucesso!");

      setTimeout(() => {
        irParaPerfil();
      }, 1000);
    } catch (erro) {
      console.error(erro);
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="editar-page">

      <div className="editar-card">

        {/* CABEÇALHO */}
        <div className="editar-header">

          <button
            className="btn-voltar"
            onClick={irParaPerfil}
            type="button"
          >
            ←
          </button>

          <div className="perfil-avatar">
            {nome ? nome.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="editar-header-text">
            <span className="mini-logo">AGENDA BARBER</span>

            <h1>Editar meu perfil</h1>

            <p>
              Atualize seus dados pessoais abaixo.
            </p>
          </div>

        </div>

        {/* FORMULÁRIO */}
        <form
          className="editar-form"
          onSubmit={salvarAlteracoes}
        >

          <div className="campo">
            <label>Nome completo</label>

            <div className="input-wrapper">
              <span className="input-icon">👤</span>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
              />
            </div>
          </div>

          <div className="campo">
            <label>E-mail</label>

            <div className="input-wrapper">
              <span className="input-icon">✉</span>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
              />
            </div>
          </div>

          <div className="campo">
            <label>Telefone</label>

            <div className="input-wrapper">
              <span className="input-icon">📱</span>

              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Digite seu telefone"
              />
            </div>
          </div>

          <div className="campo">
            <label>Data de nascimento</label>

            <div className="input-wrapper">
              <span className="input-icon">📅</span>

              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>
          </div>

          {mensagem && (
            <div
              className={
                mensagem.includes("sucesso")
                  ? "mensagem sucesso"
                  : "mensagem erro"
              }
            >
              {mensagem}
            </div>
          )}

          {/* BOTÕES */}
          <div className="botoes">

            <button
              type="button"
              className="btn-cancelar"
              onClick={irParaPerfil}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-salvar"
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar alterações"}
            </button>

          </div>

        </form>

        <div className="editar-footer">
          Seus dados são utilizados apenas para o gerenciamento
          da sua conta.
        </div>

      </div>

    </div>
  );
}

export default EditarPerfil;