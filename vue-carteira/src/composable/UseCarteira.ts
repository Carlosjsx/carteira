import { ref, computed } from "vue";

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

  setTimeout(() => {
    aviso.value = false;
  }, 1200);
}

function addOperacao(): void {
  if (!formulario.value.tipoEvento || formulario.value.valor === null || !formulario.value.descricao) {
    avisando("Preencha todos os campos!");
    return;
  }

  operations.value.push({
    id: Date.now(),
    tipoEvento: formulario.value.tipoEvento,
    valor: Number(formulario.value.valor),
    descricao: formulario.value.descricao
  });

  formulario.value = {
    valor: null,
    descricao: '',
    tipoEvento: ''
  };

  avisando("Cadastrado com sucesso!");
}

// Função para remover a operação pelo ID
function removerOperacao(id: number): void {
  operations.value = operations.value.filter(op => op.id !== id);
  avisando("Operação removida!");
}

const totalGastos = computed(()=>{
  return operations.value
    .filter(op => op.tipoEvento === "gasto")
    .reduce((acumulador, op) => acumulador + Number(op.valor), 0);
})

const totalRendas = computed(()=>{
  return operations.value
    .filter(op => op.tipoEvento === "renda")
    .reduce((acumulador, op) => acumulador + Number(op.valor), 0);
})
const totalSaldo = computed(()=>{
  return totalRendas.value - totalGastos.value
})

const moedaBR = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export function UseCarteira() {
  return { 
    formulario, 
    operations, 
    addOperacao, 
    removerOperacao, 
    avisando, 
    aviso, 
    mensagemAviso, 
    moedaBR,
    totalGastos,
    totalRendas,
    totalSaldo
  };
}