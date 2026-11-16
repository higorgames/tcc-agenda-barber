import { useState } from "react";
import {
  STATUS,
  carregarAgendamentos,
  formatarData,
} from "../../services/agendaStorage";

// Clientes que já marcaram horário (montado a partir dos agendamentos)
export default function ClientesBarbeiro() {
  const [busca, setBusca] = useState("");

  const agendamentos = carregarAgendamentos();
  const porCliente = {};

  agendamentos.forEach((item) => {
    const chave = item.clienteId ?? item.clienteNome ?? "sem-nome";

    if (!porCliente[chave]) {
      porCliente[chave] = {
        chave,
        nome: item.clienteNome || "Cliente",
        total: 0,
        concluidos: 0,
        ultimaData: "",
      };
    }

    const cliente = porCliente[chave];

    if (item.status !== STATUS.CANCELADO) {
      cliente.total += 1;

      if (item.data > cliente.ultimaData) {
        cliente.ultimaData = item.data;
      }
    }

    if (item.status === STATUS.CONCLUIDO) {
      cliente.concluidos += 1;
    }
  });

  const clientes = Object.values(porCliente)
    .filter((cliente) =>
      cliente.nome.toLowerCase().includes(busca.trim().toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <>
      <h1>Clientes</h1>
      <p className="painel-subtitulo">
        Clientes que já agendaram um horário na barbearia.
      </p>

      <div className="painel-campo" style={{ marginBottom: 16 }}>
        <label htmlFor="busca-cliente">Buscar cliente</label>

        <input
          id="busca-cliente"
          type="search"
          placeholder="Digite o nome"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      {clientes.length > 0 ? (
        clientes.map((cliente) => (
          <article className="painel-item" key={cliente.chave}>

            <span className="painel-avatar">
              {cliente.nome.charAt(0).toUpperCase()}
            </span>

            <div className="painel-item-principal">
              <strong>{cliente.nome}</strong>
              <small>
                {cliente.total} agendamento(s) ·{" "}
                {cliente.concluidos} concluído(s)
                {cliente.ultimaData
                  ? ` · último: ${formatarData(cliente.ultimaData)}`
                  : ""}
              </small>
            </div>

          </article>
        ))
      ) : (
        <p className="painel-vazio">
          Nenhum cliente encontrado.
        </p>
      )}
    </>
  );
}
