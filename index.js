const URL_ = "https://mi-web-personal-backend.herokuapp.com/";

let allForms = []; // guardo copia de los forms de DB

let checkboxChanged =[]; // voy agregando las propiedades "id" y "leido" de los forms q se modifican para luego guardar cambios en DB

let deletedList =[]; // voy agregando los "id" de los forms q voy borrando para luego guardar cambios en DB

let view = "todos"; // indica que se visualiza

var idToRemove; // guardo el "id" a borrar para leerlo en el modal que confirma su eliminación 

let saveMessage;

let saveAlertSetColor;

let saveAlertRemoveColor;


/* ---------------------- PETICION DE LISTADO DE FORMULARIOS AL BACKEND--------------------- */

fetch(`${URL_}formList/`).then(function (res) {
  return res.json();
}).then(function (forms) {
  allForms = forms.reverse();
  renderForms(allForms);//renderizo todos al inicio por defecto
});


/* ------------------------ME POSICIONO EN EL DOM Y ASIGNO EVENTOS-------------------------- */

const listado= document.querySelector('#listado');
const todos = document.querySelector('#todos');
const noLeidos = document.querySelector('#no-leidos');
const btnGuardar = document.querySelector('#btnGuardar');
const divSaveAlert = document.querySelector('#divSaveAlert');
const spanSaveAlert = document.querySelector('#spanSaveAlert');

todos.addEventListener('change', todosHandler);
todos.addEventListener('click', todosHandler);
noLeidos.addEventListener('change', noLeidosHandler);
noLeidos.addEventListener('click', noLeidosHandler);
btnGuardar.addEventListener('click', guardarHandler);


/* -----------------------------------DEFINO FUNCIONES--------------------------------------- */

function todosHandler(){
  view = "todos";
  listado.innerHTML = "";
  if (allForms.length === 0){
    renderSinMensajes();
  }else{
    renderForms(allForms);
  }
}


function noLeidosHandler(){
  view = "noLeidos";
  listado.innerHTML = "";
  noLeidosForms = allForms.filter(form => form.leido === false);
  if (noLeidosForms.length === 0){
    renderSinMensajes();
  }else{
    renderForms(noLeidosForms);
  }
}


function guardarHandler() {//guarda todos los cambios en DB
  if(checkboxChanged.length === 0 && deletedList.length === 0){
    saveMessage = "No hay cambios para guardar";
    saveAlertSetColor = "alert-warning";
    saveAlertRemoveColor = "alert-success"
  }else{
    saveMessage = "Se han enviado los cambios correctamente";
    saveAlertSetColor = "alert-success";
    saveAlertRemoveColor = "alert-warning"
  }  
  if (checkboxChanged.length > 0){
    checkboxChanged.forEach(elemento =>{
      fetch(`${URL_}formState/${elemento.id}`,{
        'body':JSON.stringify({leido:elemento.leido}),
        'method':'PATCH',
        'headers':{'Content-Type':'application/json'}
      }).then((res)=>{
        return res.json();  
      }).then((res)=>{
        console.log("checkbox modificado: ", res);
        checkboxChanged =[]
      })
    })
  }
  if (deletedList.length > 0){
    deletedList.forEach(elemento =>{
      fetch(`${URL_}deleteForm/${elemento.id}`,{
        'method':'DELETE'
      }).then((res)=>{
        return res.json();  
      }).then((res)=>{
        console.log("formulario borrado: ", res);
        deletedList =[]
      })
    })
  }
  divSaveAlert.removeAttribute("hidden");
  divSaveAlert.classList.remove(saveAlertRemoveColor);
  divSaveAlert.classList.add(saveAlertSetColor);
  spanSaveAlert.innerText = saveMessage;
  setTimeout(() => {
    divSaveAlert.setAttribute("hidden", "true");
  }, 2000)
}


function deleteHandler(e) { // guarda los "id "de los formularios a borrar en un array
  deletedList.push({id:idToRemove});
  let indiceD = -1;
  let indiceC = -1;
  allForms.forEach((element, index)=> {
    if(element._id === idToRemove){
      indiceD= index;
    }
  })
  if (indiceD>-1){
    allForms.splice(indiceD, 1);
  }
  checkboxChanged.forEach((element, index)=> {
    if(element.id === idToRemove){
      indiceC= index;
    }
  })
  if (indiceC>-1){
    checkboxChanged.splice(indiceC, 1);
  }
  view === "todos"? todosHandler() : noLeidosHandler();
}


function changeHandler(e){ // guarda las propiedades "id" y "leido" de los formularios a borrar en un array
  let indiceChanges = -1;
  let indiceAllForms = -1;
  checkboxChanged.forEach((element, index) => {
    if(element.id ===e.target.id){
      indiceChanges = index;
    }
  });
  if(indiceChanges===-1){
    checkboxChanged.push({id:e.target.id, leido: e.target.checked});
  }else{
    checkboxChanged.splice(indiceChanges, 1);
  }
  allForms.forEach((element, index) => {
    if(element._id ===e.target.id){
      indiceAllForms = index;
    }
  });
  allForms[indiceAllForms].leido = !allForms[indiceAllForms].leido;
  if(e.target.checked){
    e.target.parentElement.parentElement.parentElement.parentElement.classList.remove('fw-bolder');
    e.target.parentElement.parentElement.parentElement.parentElement.classList.add('fw-light');
  }else{
    e.target.parentElement.parentElement.parentElement.parentElement.classList.remove('fw-light');
    e.target.parentElement.parentElement.parentElement.parentElement.classList.add('fw-bolder');
  }
  view === "noLeidos"? setTimeout(() => noLeidosHandler(),300) : "";
}


function renderSinMensajes() {
  let vacio =`<div class=" my-1 py-3 bg-secondary bg-gradient text-center text-warning" >
                <h2>¡No hay mensajes!</h2>
              </div>`;
  listado.innerHTML = vacio;
}

function renderForms(forms) {
  if (forms.length===0) return renderSinMensajes();      
  forms.forEach(function (form) {

    let divCard = document.createElement("div");
    let divCardBody = document.createElement("div");
    let divCardHeader = document.createElement("div");
    let divCardTitle = document.createElement("div");
    let cardName = document.createElement("span");
    let iconDelete = document.createElement("i");
    let modalDelete = document.createElement("div");
    let modalDeleteDialog = document.createElement("div");
    let modalDeleteContent = document.createElement("div");
    let modalDeleteHeader = document.createElement("div");
    let modalDeleteTitle = document.createElement("h5");
    let iconModalDeleteTitle = document.createElement("i");
    let modalDeleteFooter = document.createElement("div");
    let modalDeleteBtnDelete = document.createElement("button");
    let modalDeleteBtnCancel = document.createElement("button");
    let cardDate = document.createElement("span");
    let cardMessage = document.createElement("p");
    let cardEmail = document.createElement("p");
    let input = document.createElement("input");
    
    divCard.setAttribute('class',"card my-1 py-3 bg-secondary bg-gradient");
    divCard.setAttribute('id',`${form._id}`);
    if (!form.leido){
      divCard.classList.add('fw-bolder');
    }else{
      divCard.classList.add('fw-light');
    }

    divCardBody.setAttribute('class','card-body');

    divCardHeader.setAttribute('class', 'd-flex flex-row justify-content-between align-items-center');

    cardName.setAttribute('class','card-title ps-4 fs-5');
    cardName.innerText = `${form.name}`;
    
    modalDelete.setAttribute('class', "modal fade");
    modalDelete.setAttribute('id', "exampleModal");
    modalDelete.setAttribute('tabindex', "-1");
    modalDelete.setAttribute('aria-labelledby', "exampleModalLabel");
    modalDelete.setAttribute('aria-hidden', "true");
    
    modalDeleteDialog.setAttribute('class', "modal-dialog modal-dialog-centered");
    
    modalDeleteContent.setAttribute('class', "modal-content");
    
    modalDeleteHeader.setAttribute('class', "modal-header");
    
    iconModalDeleteTitle.setAttribute('class', 'fas fa-exclamation-triangle text-warning mx-3');
    
    modalDeleteTitle.setAttribute('class', "modal-title");
    modalDeleteTitle.setAttribute('id', "exampleModalLabel");
    modalDeleteTitle.innerText = "¿Esta seguro de eliminar el elemento?";
    
    modalDeleteFooter.setAttribute('class', "modal-footer");
    
    modalDeleteBtnCancel.setAttribute('type', "button");
    modalDeleteBtnCancel.setAttribute('class', "btn btn-secondary");
    modalDeleteBtnCancel.setAttribute('data-bs-dismiss', "modal");
    modalDeleteBtnCancel.innerText = "Cancelar";
    
    modalDeleteBtnDelete.setAttribute('type', "button");
    modalDeleteBtnDelete.setAttribute('class', "btn btn-danger");
    modalDeleteBtnDelete.setAttribute('data-bs-dismiss', "modal");
    modalDeleteBtnDelete.innerText = "Eliminar";
    modalDeleteBtnDelete.addEventListener('click', deleteHandler);
   
    iconDelete.setAttribute('class', 'fas fa-trash-alt icon-delete p-2 bg-danger text-white fs-4 rounded-3');
    iconDelete.setAttribute('id', `${form._id}`);
    iconDelete.setAttribute('data-bs-toggle', "modal");
    iconDelete.setAttribute('data-bs-target', "#exampleModal");
    iconDelete.addEventListener('click', function(e) {
      idToRemove = e.target.id;
    })

    cardDate.setAttribute('class','card-subtitle mb-2 text-black-50 ps-5 ');
    cardDate.innerText = `${form.date}`;

    cardMessage.setAttribute('class', 'card-text px-5 py-3');
    cardMessage.innerText = `${form.message}`;

    cardEmail.setAttribute('class', 'card-text text-light px-5');
    cardEmail.innerText = `${form.email}`;
    
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'form-check-input ms-1');
    input.setAttribute('id', `${form._id}`);  
    if (form.leido){
      input.setAttribute('checked', "true");
    }
    input.addEventListener('change', changeHandler);

    modalDeleteTitle.appendChild(iconModalDeleteTitle);

    modalDeleteHeader.appendChild(modalDeleteTitle);

    modalDeleteFooter.appendChild(modalDeleteBtnCancel);
    modalDeleteFooter.appendChild(modalDeleteBtnDelete);

    modalDeleteContent.appendChild(modalDeleteHeader);
    modalDeleteContent.appendChild(modalDeleteFooter);

    modalDeleteDialog.appendChild(modalDeleteContent);

    modalDelete.appendChild(modalDeleteDialog);

    divCardTitle.appendChild(input);
   
    divCardTitle.appendChild(cardName);
    divCardTitle.appendChild(cardDate);

    divCardHeader.appendChild(divCardTitle);
    divCardHeader.appendChild(iconDelete);
    divCardHeader.appendChild(modalDelete);

    divCardBody.appendChild(divCardHeader);
    divCardBody.appendChild(cardMessage);
    divCardBody.appendChild(cardEmail);

    divCard.appendChild(divCardBody);

    listado.appendChild(divCard);
    
  });
}









