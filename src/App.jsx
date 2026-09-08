import { useState } from "react";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

function App() {
  const [pagina, setPagina] = useState("login");

  return (
    <>
      {pagina === "login" ? (
        <Login irParaCadastro={() => setPagina("cadastro")} />
      ) : (
        <Cadastro irParaLogin={() => setPagina("login")} />
      )}
    </>
  );
}

export default App;