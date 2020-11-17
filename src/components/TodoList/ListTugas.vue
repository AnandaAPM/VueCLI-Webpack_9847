<template>
    <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">To Do List</h3>

    <v-card>
        <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="success" dark @click="dialog = true">
                Tambah
            </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="todos" :search="search">
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn small class="mr-2" @click="editItem(item)">
                    edit
                </v-btn>
                <v-btn small class="mr-2" @click="deleteItem(item)">
                    delete
                </v-btn>
                <input type="checkbox" v-model="item.del" @change="checked(item)">
            </template>
            <template v-slot:[`item.priority`]="{item}">
                <td>
                    <v-card v-if="item.priority == 'Penting'" >
                    <v-chip
                    close-icon="mdi-close-outline"
                    color="red"
                    outlined>
                        {{item.priority}}
                    </v-chip>
                    </v-card>
                    <v-card v-if="item.priority == 'Biasa'" >
                    <v-chip
                    close-icon="mdi-close-outline"
                    color="blue"
                    outlined>
                        {{item.priority}}
                    </v-chip>
                    
                    </v-card>
                    <v-card v-if="item.priority == 'Tidak penting'">
                    <v-chip
                    close-icon="mdi-close-outline"
                    color="green"
                    outlined>
                        {{item.priority}}
                    </v-chip>
                    </v-card>
                </td>            
            </template>
        </v-data-table>
    </v-card>

    <v-dialog v-model="dialogD" persistent max-width="600px">
        <v-card>
        <v-card-title>
            <span class="headline"> Yakin ingin menghapus?</span>
        </v-card-title>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="batal">Tidak</v-btn>
        <v-btn color="red darken-1" text @click="ya">Ya</v-btn>        
        </v-card-actions>
        </v-card>
    </v-dialog>
    

    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
            <span class="headline" v-if="add==true">
                From Todo
            </span>
            <span class="headline" v-else>
                Edit
            </span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-text-field
                        v-model="formTodo.task"
                        label="Task"
                        required
                    ></v-text-field>

                    <v-select
                        v-model="formTodo.priority"
                        :items="['Penting','Biasa','Tidak penting']"
                        label="Priority"
                        required
                    ></v-select>

                    <v-textarea
                        v-model="formTodo.note"
                        label="Note"
                        required
                    ></v-textarea>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancel">
                    Cancel
                </v-btn>
                <v-btn v-if="add == true" color="blue darken-1" text @click="save">
                    Save
                </v-btn>
                 <v-btn v-else color="blue darken-1" text @click="edit(formTodo)">
                    Save
                </v-btn>
                
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-card v-if="itemChecked.length">
        <v-card-title>Delete Multiple</v-card-title>
        <v-card-text>
            <ul v-for="(todo,index) in itemChecked" :key="index">
                <li>
                    {{todo.task}}
                </li>
            </ul>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="delAll" color="red" class="white--text">
            Delete All
            </v-btn>
        </v-card-actions>
    </v-card>
    </v-main>
</template>



<script>
export default {
    name:"List",
    data(){
        return{
            search: null,
            dialog: false,
            dialogD: false,
            add:true,
            edititem:null,
            headers:[
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                {text:"Priority", value:"priority"},
                {text:"Note", value:"note"},
                {text:"Actions",value:"actions"},
            ],

            todos:[
                {
                    task: "bernafas",
                    priority: "Penting",
                    note:"huffttt",
                    del: false
                },
                {
                    task: "nongkrong",
                    priority:"Tidak penting",
                    note:"bersama tman2",
                    del: false
                },
                {
                    task:"masak",
                    priority:"Biasa",
                    note:"masak air 500ml",
                    del: false
                },
            ],
            itemChecked:[],
            formTodo:{
                task: null,
                priority:null,
                note:null,
            },
        };
    },
    methods:{
        save() {
            this.todos.push(this.formTodo);
            this.cancel();
        },
        cancel(){
            this.resetForm();
            this.dialog = false;
            this.add=true;
            this.editItem = null;
        },
        resetForm(){
            this.formTodo = {
                task:null,
                priority:null,
                note:null,
            };
        },
        batal(){
            this.resetForm();
            this.dialogD=false;
        },
        ya(){
            this.todos.splice(this.todos.indexOf(this.editItem),1);
            this.dialogD=false;
        },
        editItem(item){
            this.add=false;
            this.formTodo={
                task: item.task,
                priority:item.priority,
                note:item.note,
            };
            this.dialog=true;
            this.editItem=item;
            
        },
        edit(formTodo){
            this.editItem.task = formTodo.task;
            this.editItem.priority = formTodo.priority;
            this.editItem.note = formTodo.note;
            this.cancel();
        },
        deleteItem(item){
            this.dialogD=true;
            this.editItem=item;
        },
        checked(item){
            if(item.del){
                this.itemChecked.push(item);
            }else{
                let position = this.itemChecked.findIndex(el=>el.task === item.task);
                this.itemChecked.splice(position,1);
            }
        },
        delAll(){
            this.todos = this.todos.filter(el=>!this.itemChecked.includes(el));
            this.itemChecked = [];
        }

    },
};
</script>
