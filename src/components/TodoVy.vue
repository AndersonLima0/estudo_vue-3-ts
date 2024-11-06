<template>
  <v-data-table
    :headers="headers"   
    :items="items"       
    :sort-by="[{ key: 'calories', order: 'asc' }]"  
  >
    <!-- Slot "top" para adicionar título e botões acima da tabela -->
    <template v-slot:top>
      <v-toolbar flat>  <!-- Barra de ferramentas sem sombra (flat). -->
        <v-toolbar-title>My CRUD</v-toolbar-title>  <!-- Título da barra de ferramentas. -->
        <v-divider class="mx-4" inset vertical></v-divider>  <!-- Divider (separador vertical) entre o título e os botões. -->
        <v-spacer></v-spacer>  <!-- Spacer que empurra os itens à direita (desalinha os botões). -->
        
        <!-- Dialog para criar ou editar um item -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">   <!-- Slot para o botão de ativação do diálogo. -->
            <v-btn class="mb-2" color="primary" dark v-bind="props">  <!-- Botão "Novo Item". -->
              New Item
            </v-btn>
          </template>
          
          <v-card>  <!-- Cartão que contém o formulário do item. -->
            <v-card-title>  <!-- Título do cartão. -->
              <span class="text-h5">{{ formTitle }}</span>   <!-- Título dinâmico (novo ou editar). -->
            </v-card-title>
            
            <v-card-text>  <!-- Conteúdo do cartão (formulário de entrada). -->
              <v-container>
                <v-row>
                  <!-- Formulário de entrada para as propriedades do item (nome, calorias, gordura, carboidratos, proteínas). -->
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>  <!-- Nome do item. -->
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>  <!-- Calorias do item. -->
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>  <!-- Gordura do item. -->
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>  <!-- Carboidratos do item. -->
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>  <!-- Proteínas do item. -->
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            
            <v-card-actions>  <!-- Ações do cartão (botões de salvar e cancelar). -->
              <v-spacer></v-spacer>  <!-- Cria espaço entre o botão de cancelar e o botão de salvar. -->
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>   <!-- Botão de cancelar (fecha o diálogo). -->
              <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>     <!-- Botão de salvar (salva os dados). -->
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- Slot "item.actions" para os botões de ação para cada item da tabela -->
    <template v-slot:item.actions="{ item }">
      <v-btn size="small" @click="editItem(item)" icon>  <!-- Botão de edição do item. -->
        Edit
      </v-btn>
      
      <v-btn size="small" @click="deleteItem(item)" icon>  <!-- Botão de exclusão do item. -->
        Delete
      </v-btn>
    </template>

    <!-- Slot "no-data" para mostrar um botão de reset caso não haja dados na tabela -->
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>  <!-- Botão de reset para inicializar os dados. -->
    </template>
  </v-data-table>
</template>

<script>
import { ref, computed } from 'vue';   // Importação de ref e computed do Vue
import axios from 'axios';  // Importação do Axios para chamadas HTTP

export default {
  setup() {
    const dialog = ref(false);  // Controla se o diálogo de criação/edição está visível.
    const dialogDelete = ref(false);  // Controla se o diálogo de exclusão está visível.
    
    // Cabeçalhos da tabela (definem os campos que aparecem na tabela).
    const headers = ref([
      { title: 'Dessert (100g serving)', align: 'start', sortable: false, key: 'name' },
      { title: 'Calories', key: 'calories' },
      { title: 'Fat (g)', key: 'fat' },
      { title: 'Carbs (g)', key: 'carbs' },
      { title: 'Protein (g)', key: 'protein' },
      { title: 'Actions', key: 'actions', sortable: false },
    ]);
    
    const items = ref([]);  // Contém os itens que serão mostrados na tabela.
    const editedIndex = ref(-1);  // Índice do item que está sendo editado.
    const editedItem = ref({  // Objeto do item sendo editado ou criado.
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    });

    // Função para buscar os itens do servidor (usando Axios).
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/items');
        items.value = response.data;  // Atualiza a lista de itens com os dados do servidor.
        console.log(items.value);  // Exibe os itens no console (para debug).
      } catch (error) {
        console.error('Erro ao buscar itens:', error);  // Trata erros de requisição.
      }
    };

    fetchItems();  // Chama a função de buscar itens ao carregar o componente.

    // Computed para determinar o título do formulário (novo ou editar).
    const formTitle = computed(() => {
      return editedIndex.value === -1 ? 'New Item' : 'Edit Item';
    });

    // Função para editar um item.
    const editItem = (item) => {
      editedIndex.value = items.value.indexOf(item);  // Encontra o índice do item a ser editado.
      editedItem.value = { ...item };  // Cria uma cópia do item a ser editado.
      dialog.value = true;  // Abre o diálogo de edição.
    };

    // Função para salvar o item (novo ou atualizado).
    const save = async () => {
      if (editedIndex.value > -1) {
        // Atualiza um item existente
        try {
          await axios.put(`http://localhost:3000/items/${editedItem.value.id}`, editedItem.value);  // Envia uma atualização via PUT.
          items.value[editedIndex.value] = editedItem.value;  // Atualiza o item na tabela local.
        } catch (error) {
          console.error('Erro ao atualizar item:', error);  // Trata erros de atualização.
        }
      } else {
        // Cria um novo item
        try {
          const response = await axios.post('http://localhost:3000/items', editedItem.value);  // Envia os dados via POST.
          items.value.push(response.data);  // Adiciona o novo item à lista de itens.
        } catch (error) {
          console.error('Erro ao salvar item:', error);  // Trata erros de criação.
        }
      }
      close();  // Fecha o diálogo após salvar.
    };

    // Função para excluir um item.
    const deleteItem = async (item) => {
      try {
        await axios.delete(`http://localhost:3000/items/${item.id}`);  // Envia uma requisição DELETE para excluir o item.
        const index = items.value.indexOf(item);  // Encontra o índice do item na lista.
        items.value.splice(index, 1);  // Remove o item da lista.
      } catch (error) {
        console.error('Erro ao excluir item:', error);  // Trata erros de exclusão.
      }
    };

    // Função para fechar o diálogo.
    const close = () => {
      dialog.value = false;  // Fecha o diálogo.
      editedItem.value = { name: '', calories: 0, fat: 0, carbs: 0, protein: 0 };  // Reseta o formulário.
      editedIndex.value = -1;  // Reseta o índice do item sendo editado.
    };

    return {
      dialog,
      dialogDelete,
      headers,
      items,
      editedItem,
      formTitle,
      fetchItems,
      editItem,
      save,
      deleteItem,
      close,
    };
  },
};
</script>
