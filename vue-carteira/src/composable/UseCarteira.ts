import { ref, computed } from "vue";
import axios from 'axios';

interface Formulario {
  valor: number | null; 
  descricao: string;
  tipoEvento: string;
}

interface Operation extends Formulario {
  id: number;
}

const aviso = ref(false);
const mensagemAviso = ref('');

const formulario = ref<Formulario>({
  valor: null,
  descricao: '',
  tipoEvento: ''
});

const operations = ref<Operation[]>([]);

function avisando(msg: string): void {
  mensagemAviso.value = msg;
  aviso.value = true;
  setTimeout(() => { aviso.value = false; }, 1200);
}


const totalGastos = computed(() => {
  return operations.value
    .filter(op => op.tipoEvento === "gasto")
    .reduce((acumulador, op) => acumulador + Number(op.valor), 0);
})

const totalRendas = computed(() => {
  return operations.value
    .filter(op => op.tipoEvento === "renda")
    .reduce((acumulador, op) => acumulador + Number(op.valor), 0);
})

const totalSaldo = computed(() => totalRendas.value - totalGastos.value)

const moedaBR = (valor: number): string => {
  const v = isNaN(valor) ? 0 : valor;
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- CORREÇÃO 1: Adicionar ---
const adicionarDadosAPI = async () => {
  if (formulario.value.valor === null || !formulario.value.tipoEvento.trim() || !formulario.value.descricao.trim()) {
    avisando("Campos obrigatórios");
    return;
  }

  const valorNumerico = Number(formulario.value.valor);
  
  await axios.post("https://backcarteira.onrender.com/operacoes", {
    tipoEvento: formulario.value.tipoEvento,
    valor: valorNumerico,
    descricao: formulario.value.descricao,
    categoria: "geral", 
    dataEvento: new Date().toISOString()
  });

  operations.value.push({
    id: Date.now(),
    tipoEvento: formulario.value.tipoEvento,
    valor: valorNumerico,
    descricao: formulario.value.descricao
  });

  formulario.value = { valor: null, descricao: '', tipoEvento: '' };
  avisando("Cadastrado com sucesso!");
}

//Exibir
const exibirDadosAPI = async () => {
  const response = await axios.get("https://backcarteira.onrender.com/operacoes");
  
  operations.value = response.data.map((op: any) => ({
    id: op.id,
    tipoEvento: op.tipoEvento,
    descricao: op.descricao,
    valor: Number(op.valor)
  }));
}

const deletarDadosAPI = async (id: number) => {
  await axios.delete(`https://backcarteira.onrender.com/operacoes/${id}`);
  operations.value = operations.value.filter(op => op.id !== id);
}

export function UseCarteira() {
  return {
    formulario,
    operations,
    adicionarDadosAPI,
    avisando,
    aviso,
    mensagemAviso,
    moedaBR,
    totalGastos,
    totalRendas,
    totalSaldo, 
    exibirDadosAPI, 
    deletarDadosAPI
  };
}