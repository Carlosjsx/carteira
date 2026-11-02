<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async()=>{
  await exibirDadosAPI();
})

import { UseCarteira } from '@/composable/UseCarteira';

const { 
  formulario, 
  operations, 
  adicionarDadosAPI, 
  aviso, 
  mensagemAviso, 
  moedaBR, 
  totalGastos,
  totalRendas,
  totalSaldo,exibirDadosAPI,deletarDadosAPI
} = UseCarteira();


 </script>

<template>
  <section id="main">

    <div class="resume">
      <div class="box box__saldo">
        <p><strong>Saldo</strong></p>
        <span>{{ moedaBR(totalSaldo) }}</span>
      </div>

      <div class="box box__gastos">
        <p><strong>Gastos</strong></p>
        <span>{{ moedaBR(totalGastos) }}</span>
      </div>

      <div class="box box__rendas">
        <p><strong>Rendas</strong></p>
        <span>{{ moedaBR(totalRendas) }}</span>
      </div>
    </div>

    <form class="form" @submit.prevent="adicionarDadosAPI">
      <select v-model="formulario.tipoEvento">
        <option disabled value="">Escolha o tipo</option>
        <option value="gasto">gasto</option>
        <option value="renda">renda</option>
      </select>
      
      <input v-model.number="formulario.valor" type="number" placeholder="valor" />
      <input v-model="formulario.descricao" placeholder="descrição" />
      
      <button type="submit" class="btn btn__solid-primary">Adicionar transação</button>
    </form>

    <ul>
<li v-for="op in operations" :key="op.id" :class="op.tipoEvento === 'gasto' ? 'tipo__gastos' : 'tipo__rendas'">
  <p>
    {{ op.descricao }} - {{ moedaBR(Number(op.valor)) }} - {{ op.tipoEvento }} 
    <button @click="deletarDadosAPI(op.id)" class="btn-delete">x</button>
  </p>
</li>
    </ul>
  </section>

  <transition name="fade">
    <div v-if="aviso" class="aviso">
      {{ mensagemAviso }}
    </div>
  </transition>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

#main {
  margin: 0 auto;
  max-width: 400px;
}

.resume {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  gap: 5px;
}

.box {
  border-radius: 5px;
  box-shadow: 0 0 5px #00000050;
  padding: 1rem;
  flex: 1;
}

.box__saldo {
  border-left: 7px solid green;
}

.box__gastos {
  border-left: 7px solid brown;
}

.box__rendas {
  border-left: 7px solid green;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 2rem;
}

.form select,
.form input {
  padding: 11px;
}

.btn {
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  padding: 10px;
}

.btn__solid-primary {
  background-color: blueviolet;
  color: white;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li {
  padding: 10px;
  box-shadow: 0 0 3px #00000030;
  border-radius: 4px;
}

li p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-delete {
  display: flex;
  background-color: crimson;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}
 

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.aviso {
  background-color: green;
  color: white;
  width: 240px;
  padding: 1rem;
  text-align: center;
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 4px;
}

.tipo__rendas{
  border-left: 5px solid green;
}


.tipo__gastos{
  border-left: 5px solid red;
}


</style>