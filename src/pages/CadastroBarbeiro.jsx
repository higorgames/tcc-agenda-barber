import { useState } from "react";
import "./Auth.css";

function CadastroBarbeiro({ irParaLoginBarbeiro }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function cadastrar(event) {
    event.preventDefault();

    if (
      nome === "" ||
      email === "" ||
      telefone === "" ||
      especialidade === "" ||
      senha === "" ||
      confirmarSenha === ""
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais!");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3000/barbeiros",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            nome: nome,
            email: email,
            telefone: telefone,
            especialidade: especialidade,
            senha: senha
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(
          dados.message ||
          "Erro ao cadastrar barbeiro."
        );

        return;
      }

      alert(
        dados.message ||
        "Barbeiro cadastrado com sucesso!"
      );

      setNome("");
      setEmail("");
      setTelefone("");
      setEspecialidade("");
      setSenha("");
      setConfirmarSenha("");

      irParaLoginBarbeiro();

    } catch (erro) {
      console.error(
        "Erro ao cadastrar barbeiro:",
        erro
      );

      alert(
        "Erro ao conectar com o Back-End."
      );
    }
  }

  return (
    <main className="pagina-login">

      <div className="caixa-login">

        <div className="logo">
          ✂
        </div>

        <h2 className="nome-sistema">
          AGENDA BARBER
        </h2>

        <h1>
          Cadastro de Barbeiro
        </h1>

        <p className="descricao">
          Crie sua conta profissional.
        </p>

        <form onSubmit={cadastrar}>

          <div className="campo">

            <label>
              Nome completo
            </label>

            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
            />

          </div>

          <div className="campo">

            <label>
              E-mail
            </label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>

          <div className="campo">

            <label>
              Telefone
            </label>

            <input
              type="text"
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(event) =>
                setTelefone(event.target.value)
              }
            />

          </div>

          <div className="campo">

            <label>
              Especialidade
            </label>

            <input
              type="text"
              placeholder="Ex: Corte, barba, degradê"
              value={especialidade}
              onChange={(event) =>
                setEspecialidade(event.target.value)
              }
            />

          </div>

          <div className="campo">

            <label>
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
            />

          </div>

          <div className="campo">

            <label>
              Confirmar senha
            </label>

            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
            />

          </div>

          <button
            className="botao-entrar"
            type="submit"
          >
            Criar conta de Barbeiro
          </button>

        </form>

        <p className="criar-conta">
          Já possui uma conta?{" "}

          <span onClick={irParaLoginBarbeiro}>
            Entrar
          </span>
        </p>

      </div>

    </main>
  );
}

export default CadastroBarbeiro;