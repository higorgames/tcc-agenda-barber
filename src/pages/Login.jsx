import { useState } from "react";
import "./Auth.css";

function Login({ irParaCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar(event) {
    event.preventDefault();

    if (email === "" || senha === "") {
      alert("Preencha todos os campos!");
      return;
    }

    alert("Login realizado!");
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
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="campo">
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
          </div>

          <button className="botao-entrar" type="submit">
            Entrar
          </button>

        </form>

       <p className="criar-conta">
  Ainda não possui uma conta?{" "}

  <span onClick={irParaCadastro}>
    Criar conta
  </span>
</p>

      </div>

    </main>
  );
}

export default Login;