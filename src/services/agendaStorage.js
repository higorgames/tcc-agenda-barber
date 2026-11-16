// =====================================================
// DADOS COMPARTILHADOS ENTRE CLIENTE E BARBEIRO
// Enquanto o Back-End não tem rotas de agendamento,
// os dados ficam no localStorage (mesmo navegador).
// Quando as rotas existirem, basta trocar o conteúdo
// destas funções por chamadas fetch().
// =====================================================

const CHAVE_AGENDAMENTOS = "agendamentos";
const CHAVE_SERVICOS = "servicos";
const CHAVE_DISPONIBILIDADE = "disponibilidade";

export const STATUS = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

export const SERVICOS_PADRAO = [
  {
    id: 1,
    nome: "Corte masculino",
    descricao: "Corte tradicional ou degradê.",
    duracao: 40,
    preco: 35,
    ativo: true,
  },
  {
    id: 2,
    nome: "Barba",
    descricao: "Aparar e modelar a barba.",
    duracao: 30,
    preco: 25,
    ativo: true,
  },
  {
    id: 3,
    nome: "Cabelo + Barba",
    descricao: "Atendimento completo.",
    duracao: 60,
    preco: 55,
    ativo: true,
  },
];

export const BARBEIROS_PADRAO = [
  { id: 1, nome: "Carlos Mendes", especialidade: "Cortes masculinos" },
  { id: 2, nome: "Rafael Souza", especialidade: "Barba e acabamento" },
  { id: 3, nome: "Lucas Ferreira", especialidade: "Cortes modernos" },
];

// 0 = domingo ... 6 = sábado
export const DISPONIBILIDADE_PADRAO = {
  dias: [false, true, true, true, true, true, true],
  inicio: "08:00",
  fim: "18:00",
  almocoInicio: "12:00",
  almocoFim: "13:00",
};

export const NOMES_DIAS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

// ---------- leitura/escrita genéricas ----------

function ler(chave, padrao) {
  try {
    const dados = JSON.parse(localStorage.getItem(chave));

    if (dados === null || dados === undefined) {
      return padrao;
    }

    return dados;
  } catch {
    return padrao;
  }
}

function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// ---------- agendamentos ----------

export function carregarAgendamentos() {
  const dados = ler(CHAVE_AGENDAMENTOS, []);
  return Array.isArray(dados) ? dados : [];
}

export function salvarAgendamentos(lista) {
  gravar(CHAVE_AGENDAMENTOS, lista);
}

export function atualizarStatusAgendamento(id, status) {
  const atualizados = carregarAgendamentos().map((item) =>
    item.id === id ? { ...item, status } : item
  );

  salvarAgendamentos(atualizados);
  return atualizados;
}

// agendamentos do cliente logado (os antigos, sem clienteId, continuam aparecendo)
export function filtrarDoCliente(lista, usuario) {
  const id = usuario?.id_usuario;

  return lista.filter(
    (item) =>
      id === null ||
      id === undefined ||
      item.clienteId === undefined ||
      item.clienteId === null ||
      item.clienteId === id
  );
}

export function ordenarPorDataHora(lista) {
  return [...lista].sort((a, b) =>
    `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`)
  );
}

// agendamentos futuros (ou de hoje que ainda não passaram) e não cancelados
export function agendamentosFuturos(lista) {
  const agora = `${dataLocal()} ${horaLocal()}`;

  return ordenarPorDataHora(lista).filter(
    (item) =>
      item.status !== STATUS.CANCELADO &&
      item.status !== STATUS.CONCLUIDO &&
      `${item.data} ${item.hora}` >= agora
  );
}

// ---------- serviços ----------

export function carregarServicos() {
  const dados = ler(CHAVE_SERVICOS, null);

  if (!Array.isArray(dados) || dados.length === 0) {
    return SERVICOS_PADRAO;
  }

  return dados;
}

export function salvarServicos(lista) {
  gravar(CHAVE_SERVICOS, lista);
}

// ---------- disponibilidade ----------

export function carregarDisponibilidade() {
  const dados = ler(CHAVE_DISPONIBILIDADE, null);

  if (!dados || !Array.isArray(dados.dias)) {
    return DISPONIBILIDADE_PADRAO;
  }

  return { ...DISPONIBILIDADE_PADRAO, ...dados };
}

export function salvarDisponibilidade(disponibilidade) {
  gravar(CHAVE_DISPONIBILIDADE, disponibilidade);
}

// ---------- datas e horários ----------

export function dataLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function horaLocal() {
  const agora = new Date();

  return `${String(agora.getHours()).padStart(2, "0")}:${String(
    agora.getMinutes()
  ).padStart(2, "0")}`;
}

function paraMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function paraHora(minutos) {
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(
    minutos % 60
  ).padStart(2, "0")}`;
}

export function diaDaSemana(data) {
  return new Date(`${data}T12:00:00`).getDay();
}

// horários de hora em hora, respeitando expediente e almoço
export function gerarHorarios(data, disponibilidade) {
  if (!data) return [];

  if (!disponibilidade.dias[diaDaSemana(data)]) {
    return [];
  }

  const inicio = paraMinutos(disponibilidade.inicio);
  const fim = paraMinutos(disponibilidade.fim);
  const almocoInicio = paraMinutos(disponibilidade.almocoInicio);
  const almocoFim = paraMinutos(disponibilidade.almocoFim);

  const horarios = [];

  for (let minuto = inicio; minuto < fim; minuto += 60) {
    const noAlmoco = minuto >= almocoInicio && minuto < almocoFim;

    if (!noAlmoco) {
      horarios.push(paraHora(minuto));
    }
  }

  return horarios;
}

// true se o horário não pode ser escolhido
export function horarioIndisponivel(data, hora, barbeiroId, agendamentos) {
  const passou =
    data < dataLocal() || (data === dataLocal() && hora <= horaLocal());

  if (passou) return true;

  // impede marcação duplicada: mesmo barbeiro, mesma data e mesma hora
  return agendamentos.some(
    (item) =>
      item.status !== STATUS.CANCELADO &&
      item.data === data &&
      item.hora === hora &&
      String(item.barbeiroId) === String(barbeiroId)
  );
}

// ---------- formatação ----------

export function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(data) {
  if (!data) return "--/--/----";

  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");
}

export function formatarMes(data) {
  if (!data) return "---";

  return new Date(`${data}T12:00:00`)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
}
