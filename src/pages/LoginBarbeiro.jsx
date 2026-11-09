import { useState } from "react";
import "./Auth.css";

function LoginBarbeiro({
  setBarbeiro,
  irParaLogin,
  irParaCadastroBarbeiro,
  irParaPerfilBarbeiro
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
        "http://localhost:3000/barbeiros/login",
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
        alert(
          dados.message ||
          "E-mail ou senha inválidos."
        );

        return;
      }

      localStorage.setItem(
        "tokenBarbeiro",
        dados.token
      );

      localStorage.setItem(
        "barbeiro",
        JSON.stringify(dados.barbeiro)
      );

      setBarbeiro(dados.barbeiro);

      alert("Login realizado com sucesso!");

      irParaPerfilBarbeiro();

    } catch (erro) {
      console.error(
        "Erro no login do barbeiro:",
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
          Login do Barbeiro
        </h1>

        <p className="descricao">
          Acesse sua conta profissional.
        </p>

        <form onSubmit={entrar}>

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

          <button
            className="botao-entrar"
            type="submit"
          >
            Entrar como Barbeiro
          </button>

        </form>

        <p className="criar-conta">
          Ainda não possui uma conta?{" "}

          <span onClick={irParaCadastroBarbeiro}>
            Criar conta
          </span>
        </p>

        <button
          type="button"
          className="botao-voltar"
          onClick={irParaLogin}
        >
          Voltar para Login de Cliente
        </button>

      </div>

    </main>
  );
}

export default LoginBarbeiro;