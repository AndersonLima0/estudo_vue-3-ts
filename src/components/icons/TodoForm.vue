<template>
    <form @submit.prevent="handleSubmit">
        <input 
        type="text"
        v-model="todo.text"
        placeholder="Nova Tarefa"
        required
        />
        <button type="submit">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
    </form>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Todo } from '../interfaces/Todo';


export default defineComponent({
    props:{
        todo:{
            type: Object as PropType<Todo>,
            required: true,
        },
        isEditing:{
        type:Boolean,
        default:false,
        },
    },
    emits:['submit'],
    methods:{
        handleSubmit(){
            this.$emit('submit', this.todo);
        },
    },
})
</script>