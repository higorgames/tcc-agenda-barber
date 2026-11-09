import { useState } from "react";
import "./Auth.css";

function Login({
  irParaCadastro,
  irParaPerfil,
  irParaLoginBarbeiro,
  setUsuario
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function entrar(event) {
    event.preventDefault();

    if (email === "" || senha === "") {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3000/clientes/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            senha: senha
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.message || "E-mail ou senha inválidos.");
        return;
      }

      // SALVA TOKEN
      localStorage.setItem("token", dados.token);

      // SALVA USUÁRIO
      localStorage.setItem(
        "usuario",
        JSON.stringify(dados.usuario)
      );

      // MANDA OS DADOS REAIS PARA O APP
      setUsuario(dados.usuario);

      alert("Login realizado com sucesso!");

      irParaPerfil();

    } catch (erro) {
      console.error("Erro no login:", erro);

      alert("Erro ao conectar com o Back-End.");
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

        <h1>Entre na sua conta</h1>

        <p className="descricao">
          Acesse sua conta para continuar.
        </p>

        <form onSubmit={entrar}>

          <div className="campo">
            <label>E-mail</label>

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
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
            />
          </div>

          <button
            className="botao-entrar"
            type="submit"
          >
            Entrar
          </button>

        </form>

        <p className="criar-conta">
          Ainda não possui uma conta?{" "}

          <span onClick={irParaCadastro}>
            Criar conta
          </span>
        </p>

        <button
          type="button"
          className="botao-barbeiro"
          onClick={irParaLoginBarbeiro}
        >
          Sou Barbeiro
        </button>

      </div>
    </main>
  );
}

export default Login;