import { useState } from "react";
import "./Auth.css";

function Cadastro({ irParaLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function cadastrar(event) {
    event.preventDefault();

    if (
      !nome ||
      !email ||
      !telefone ||
      !dataNascimento ||
      !senha ||
      !confirmarSenha
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
        "http://localhost:3000/clientes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            nome: nome,
            email: email,
            telefone: telefone,
            data_nascimento: dataNascimento,
            senha: senha
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.message || "Erro ao realizar cadastro.");
        return;
      }

      alert(
        dados.message || "Cliente cadastrado com sucesso!"
      );

      setNome("");
      setEmail("");
      setTelefone("");
      setDataNascimento("");
      setSenha("");
      setConfirmarSenha("");

      irParaLogin();

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);

      alert(
        "Não foi possível conectar ao Back-End."
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
          Crie sua conta
        </h1>

        <p className="descricao">
          Preencha seus dados para se cadastrar.
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
              Data de nascimento
            </label>

            <input
              type="date"
              value={dataNascimento}
              onChange={(event) =>
                setDataNascimento(event.target.value)
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
            Criar conta
          </button>

        </form>

        <p className="criar-conta">
          Já possui uma conta?{" "}

          <span onClick={irParaLogin}>
            Entrar
          </span>
        </p>

      </div>

    </main>
  );
}

export default Cadastro;