import { useState } from "react";
import {
  carregarServicos,
  moeda,
  salvarServicos,
} from "../../services/agendaStorage";

const FORM_VAZIO = {
  nome: "",
  descricao: "",
  duracao: "",
  preco: "",
};

// Cadastro de serviços: criar, editar, ativar/desativar e excluir.
// O cliente vê esses serviços na tela de agendamento.
export default function ServicosBarbeiro() {
  const [servicos, setServicos] = useState(carregarServicos);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function atualizar(lista, aviso) {
    setServicos(lista);
    salvarServicos(lista);
    setMensagem(aviso);
  }

  function alterarCampo(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function limparFormulario() {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setErro("");
  }

  function salvar(event) {
    event.preventDefault();

    const duracao = Number(form.duracao);
    const preco = Number(String(form.preco).replace(",", "."));

    if (!form.nome.trim()) {
      setErro("Informe o nome do serviço.");
      return;
    }

    if (!Number.isFinite(duracao) || duracao <= 0) {
      setErro("Informe a duração em minutos (maior que zero).");
      return;
    }

    if (!Number.isFinite(preco) || preco < 0) {
      setErro("Informe um preço válido.");
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      duracao,
      preco,
    };

    if (editandoId !== null) {
      atualizar(
        servicos.map((item) =>
          item.id === editandoId ? { ...item, ...dados } : item
        ),
        "Serviço atualizado."
      );
    } else {
      const proximoId =
        servicos.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;

      atualizar(
        [...servicos, { id: proximoId, ativo: true, ...dados }],
        "Serviço cadastrado."
      );
    }

    limparFormulario();
  }

  function editar(item) {
    setEditandoId(item.id);
    setErro("");
    setMensagem("");
    setForm({
      nome: item.nome,
      descricao: item.descricao || "",
      duracao: String(item.duracao),
      preco: String(item.preco),
    });
  }

  function alternarAtivo(item) {
    atualizar(
      servicos.map((s) =>
        s.id === item.id ? { ...s, ativo: s.ativo === false } : s
      ),
      item.ativo === false ? "Serviço ativado." : "Serviço desativado."
    );
  }

  function excluir(item) {
    const confirmar = window.confirm(
      `Excluir o serviço "${item.nome}"?`
    );

    if (!confirmar) return;

    atualizar(
      servicos.filter((s) => s.id !== item.id),
      "Serviço excluído."
    );

    if (editandoId === item.id) limparFormulario();
  }

  return (
    <>
      <h1>Serviços</h1>
      <p className="painel-subtitulo">
        Cadastre os serviços que os clientes poderão agendar.
      </p>

      {mensagem && <p className="painel-sucesso">{mensagem}</p>}

      <section className="painel-bloco">
        <div className="painel-bloco-topo">
          <h2>
            {editandoId !== null ? "Editar serviço" : "Novo serviço"}
          </h2>
        </div>

        <form className="painel-form" onSubmit={salvar}>

          <label className="painel-campo">
            Nome
            <input
              name="nome"
              value={form.nome}
              onChange={alterarCampo}
              placeholder="Ex.: Corte masculino"
            />
          </label>

          <label className="painel-campo">
            Duração (minutos)
            <input
              name="duracao"
              type="number"
              min="1"
              value={form.duracao}
              onChange={alterarCampo}
              placeholder="40"
            />
          </label>

          <label className="painel-campo">
            Preço (R$)
            <input
              name="preco"
              inputMode="decimal"
              value={form.preco}
              onChange={alterarCampo}
              placeholder="35,00"
            />
          </label>

          <label className="painel-campo">
            Descrição
            <input
              name="descricao"
              value={form.descricao}
              onChange={alterarCampo}
              placeholder="Opcional"
            />
          </label>

          {erro && <p className="painel-erro">{erro}</p>}

          <div className="painel-form-acoes">
            <button type="submit" className="btn-painel">
              {editandoId !== null ? "Salvar alterações" : "Cadastrar"}
            </button>

            {editandoId !== null && (
              <button
                type="button"
                className="btn-painel secundario"
                onClick={limparFormulario}
              >
                Cancelar
              </button>
            )}
          </div>

        </form>
      </section>

      {servicos.map((item) => (
        <article className="painel-item" key={item.id}>

          <div className="painel-item-principal">
            <strong>{item.nome}</strong>
            <small>
              {item.duracao} min · {moeda(item.preco)}
              {item.descricao ? ` · ${item.descricao}` : ""}
            </small>
          </div>

          {item.ativo === false && (
            <span className="selo inativo">Inativo</span>
          )}

          <div className="painel-item-acoes">
            <button
              type="button"
              className="btn-painel pequeno secundario"
              onClick={() => editar(item)}
            >
              Editar
            </button>

            <button
              type="button"
              className="btn-painel pequeno secundario"
              onClick={() => alternarAtivo(item)}
            >
              {item.ativo === false ? "Ativar" : "Desativar"}
            </button>

            <button
              type="button"
              className="btn-painel pequeno perigo"
              onClick={() => excluir(item)}
            >
              Excluir
            </button>
          </div>

        </article>
      ))}
    </>
  );
}
