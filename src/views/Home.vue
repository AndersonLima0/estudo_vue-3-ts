<template>
    <div>
        <h1>Gerenciado de tarefas</h1>
        <TodoForm
        :todo="currentTodo"
        :isEditing="isEditing"
        @submit="saveTodo"
        />

        <TodoList :todos="todos" @edit="editTodo" @remove="deleteTodo" />
    </div>
</template>

<script lang="ts">

import { defineComponent,ref,onMounted } from 'vue';
import type { PropType } from 'vue';
import axios from 'axios';
import type { Todo } from '@/components/interfaces/Todo';
import TodoForm from '@/components/TodoForm.vue';
import TodoList from '@/components/TodoList.vue';


export default defineComponent({

    components:{TodoForm,TodoList},
    setup(){
        const todos = ref<Todo[]>([]);
        const currentTodo = ref<Todo>({id: "0", text:''});
        const isEditing = ref(false);
        
        const fetchTodos = async () =>{
            try{
                const response = await axios.get<Todo[]>('http://localhost:3000/todos');
                todos.value = response.data;
            }
            catch(error){
                console.error("Erro ao buscar tarefas: ", error);
            }
        }
        const createTodo = async () => {
    try {
        // Não envie um id, pois o JSON Server irá gerar um automaticamente
        const response = await axios.post<Todo>("http://localhost:3000/todos", {
            text: currentTodo.value.text,
        });

        todos.value.push(response.data); // Adicione o novo todo à lista
        resetForm();
    } catch (error) {
        console.error("Erro ao criar tarefa: ", error);
    }
};

const updateTodo = async () => {
    try {
        // Atualiza a tarefa usando o ID numérico
        const response = await axios.put<Todo>(
            `http://localhost:3000/todos/${currentTodo.value.id}`,
            {
                text: currentTodo.value.text, // Envia apenas o texto para atualização
            }
        );

        const index = todos.value.findIndex(todo => todo.id === response.data.id);
        if (index !== -1) todos.value.splice(index, 1, response.data); // Atualiza a tarefa na lista
        resetForm();
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
    }
};



const deleteTodo = async (id: string) => {
    console.log("id: "+id)
    try {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        todos.value = todos.value.filter(todo => todo.id !== id); // Remove a tarefa da lista
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
    }
};


    // Salva a tarefa, chamando 'createTodo' ou 'updateTodo' dependendo do modo
    const saveTodo = () => {
      if (isEditing.value) {
        updateTodo();
      } else {
        createTodo();
      }
    };

    // Prepara o formulário para edição de uma tarefa
    const editTodo = (todo: Todo) => {
      currentTodo.value = { ...todo };
      isEditing.value = true;
    };

    // Reseta o formulário, limpando a tarefa atual e saindo do modo de edição
    const resetForm = () => {
      currentTodo.value = { id: "0", text: '' };
      isEditing.value = false;
    };

    // Carrega as tarefas ao montar o componente
    onMounted(fetchTodos);

    // Retorna as variáveis e métodos para o template
    return {
      todos,
      currentTodo,
      isEditing,
      saveTodo,
      editTodo,
      deleteTodo,
    };
  },
})


</script>