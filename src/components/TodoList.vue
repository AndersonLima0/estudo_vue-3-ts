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


export default defineComponent({

    props:{
        todos:{
            type: Array as PropType<Todo[]>,
            required: true,
        },
    },
    emits:['edit' ,'remove'],
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