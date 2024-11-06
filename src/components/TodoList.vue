<template>
    <div>
        <h2>Lista de tarefas</h2>
        <ul>
            <li v-for="todo in todos" :key="todo.id">
                <span>{{ todo.text }}</span>
                <button @click="edit(todo)">Editar</button>
                <button @click="remove(todo.id)">Excluir</button>                
            </li>
        </ul>
    </div>
</template>


<script lang="ts">

import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Todo } from './interfaces/Todo';

/*defineComponent é uma função auxiliar que torna a definição de componentes mais clara,
especialmente ao usar TypeScript. Ele ajuda a configurar as propriedades (props), eventos emitidos
 (emits), e métodos do componente de forma mais estruturada.*/

export default defineComponent({

    props:{
        todos:{
            type: Array as PropType<Todo[]>,
            required: true,
        },
    },
    //emit - eventos que podem ser emitidos para o componente pai
    emits:['edit' ,'remove'],
    //method - define funções que podem ser chamadas dentro do componente
    methods:{
        edit(todo : Todo){
            this.$emit('edit',todo);
        },
        remove(id : string){
            this.$emit('remove',id);
        },
    },

})

</script>