document.addEventListener('DOMContentLoaded', function () {
    console.log(window.location.href);
    subject.getForm();
});

// Admin Options
const subject = {
    getForm: () => {
        let result = document.getElementById('result');
        result.innerHTML = '';
        ajax('GET', '/ajax/subject',"text/html", null)
            .then(response => {
                result.innerHTML = response;
            })
            .catch(e=>{
                result.innerHTML = "Failed to create subject";
            });
    },
    create: () => {
        const form = document.querySelector('form'),
              result = document.getElementById('result');
        getPostData(form)
            .then(data=>{
                ajax('POST','/subject','text/html',data)
                    .then(response=>render(result,response))
                    .catch(e=>render(result,e));
            })
            .catch(e=>render(result,e));
    },
    update : async (id)=>{
        let data = '_id='+id;
        let response = await ajax('PUT','/ajax/subject','text/html',data);
        let result = document.getElementById('result');
        render(result,response)
    },
    listAll:async ()=>{
        const result = document.getElementById('result');
        result.innerHTML = '';
        let subjects = await ajax('GET','/subject','application/json');
        subjects = JSON.parse(subjects);
        let table = document.createElement('table');
        let tableContent = `<tr>
                    <th>No. </th>
                    <th>Name</th>
                    <th>Links</th>
                 </tr>`;
        let len = subjects.length,i=0;
        while (i<len){
            tableContent+=`
                           <tr>
                           <td>` + (i+1) + `</td>
                           <td><a href="` +subjects[i].value + `" >`+ subjects[i].name+`</a></td>
                           <td>   <a class="delete" href="javascript:subject.delete('`+ subjects[i].value +`')">delete</a> <a class="green" href="javascript:subject.update('`+ subjects[i].value +`')">update</a></td>
                           </tr>
                          `;
            i++;
        }
        table.innerHTML = tableContent  ;
        result.appendChild(table);
    },
    delete: async (id)=>{
        let data = "id="+id;
        let result = await ajax('DELETE','/ajax/subject','text/html',data);
        alert(result);
    },
    departmentSelected: async ()=>{
        let select = document.getElementById('department'),
            teacherSelect = document.getElementById('teacher');
        teacherSelect.options.length = 0;
        let department = select.value;
        let teachers=[];
        try {
            teachers = await ajax('GET','/ajax/teacher?department='+department,'application/json',null);
            console.log(teachers);
            teachers = JSON.parse(teachers);
            let len = teachers.length;
            while (len>0){
                len--;
                let option = document.createElement('option');
                option.text = teachers[len].name;
                option.value = teachers[len].value;
                teacherSelect.add(option);
            }
        }catch (e) {
            alert(e);
        }
    }
};
const teacher = {
  getForm : async _id=>{
      let result = document.getElementById('result');
      let response=null;
      try{
          if(!_id){
            response = await ajax('GET','/teacher','text/html');
        }else{
            response = await ajax('PUT','/teacher','text/html',"_id="+_id);
          }
          return render(result, response);
      }catch(e){
          return render(result,e);
      }
  },
  create : async ()=>{
      const form = document.querySelector('form'),
          result = document.getElementById('result');
      try {
          let data = await getPostData(form),
              response = await ajax('POST','/admin/create-teacher','text/html',data);
            render(result,response);
      }catch (e) {
          render(result,e);
      }
  },
  listAll : async ()=>{
      const result = document.getElementById('result');
      try{
        const result = document.getElementById('result');
        result.innerHTML = '';
        let teachers = await ajax('GET','/teacher','application/json');
        teachers = JSON.parse(teachers);
        let table = document.createElement('table');
        let tableContent = `<tr>
                    <th>No. </th>
                    <th>Name</th>
                    <th>Links</th>
                 </tr>`;
        let len = teachers.length,i=0;
        while (i<len){
            tableContent+=`
                            <tr>
                            <td>` + (i+1) + `</td>
                            <td><a href="` +teachers[i].value + `" >`+ teachers[i].name+`</a></td>
                            <td>
                            <a class="delete" href="javascript:teacher.delete('`+ teachers[i].value +`')">delete</a>
                            <a class="green" href="javascript:teacher.getForm('`+ teachers[i].value +`')">update</a>
                            </td>
                            </tr>`;
            i++;
        }
        table.innerHTML = tableContent  ;
        result.appendChild(table);
        }catch(e){
            return render(result,e);
      }
  },
  departmentSelected: async ()=>{
    let select = document.getElementById('department'),
        subjectSelect = document.getElementById('subject');
    subjectSelect.options.length = 0;
    let department = select.value;
    let subjects=[];
    try {
        subjects = await ajax('GET','/subject?department='+department,'application/json',null);
        subjects = JSON.parse(subjects);
        let len = subjects.length;
        while (len>0){
            len--;
            let option = document.createElement('option');
            option.text = subjects[len].name;
            option.value = subjects[len].value;
            subjectSelect.add(option);
        }
    }catch (e) {
        alert(e);
    }
},
delete : async (_id)=>{
    let data = "id="+id;
    let result = await ajax('DELETE','/teacher','text/html',data);
    alert(result);
}
};
const student = {
    getForm : async ()=>{
        let result = document.getElementById('result');
        ajax('GET', '/ajax/create-student','text/html', null)
            .then(response =>render(result,response))
            .catch(e=>render(result,e));
    },
    create : async ()=>{
        const form = document.querySelector('form'),
            result = document.getElementById('result');
        try {
            let data = await getPostData(form),
                response = ajax('POST','/admin/create-student','text/html',data);
            render(result,response);
        }catch (e) {
            render(result,e);
        }
    }
};
const designation = {
    getForm:()=>{
        const result = document.getElementById('result');
        ajax('GET','/ajax/create-designation','text/html',null)
            .then(response=>render(result,response))
            .catch(e=>render(result,e));
    },
    create:()=>{
        const form =document.querySelector('form'),
            result = document.getElementById('result');
        getPostData(form)
            .then(data=>{
                console.log(data);
                ajax('POST','/admin/create-designation','text/html',data)
                    .then(response=>render(result,response))
                    .catch(e=>render(result,e));
            })
            .catch(e=>render(result,e));
    }
};
const department = {
    getForm:()=>{
        const result = document.getElementById('result');
        ajax('GET','/ajax/create-department','text/html')
            .then(response=>render(result,response))
            .catch(e=>render(result,e));
    },
    create:async ()=>{
        const form =document.querySelector('form'),
            result = document.getElementById('result');
        let data = await getPostData(form),
            response = await ajax('POST','/admin/create-department','text/html',data);

        render(result,response);
    }
};
const classs={
    getForm:()=>{
        const result = document.getElementById('result');
        ajax('GET','/ajax/create-class','text/html')
            .then(response=>render(result,response))
            .catch(e=>render(result,e));
    },
    create:async ()=>{
        const form =document.querySelector('form'),
            result = document.getElementById('result');
        let data = await getPostData(form),
            response = await ajax('POST','/admin/create-department','text/html',data);

        render(result,response);
    },
  departmentSelected: async ()=>{
        let select = document.getElementById('department'),
            teacherSelect = document.getElementById('teacher'),
            subjectsSelect = document.getElementById('subjects');
            teacherSelect.options.length = 0;
        let department = select.value;
        let teachers=[],subjects=[];
        try {
            teachers = await ajax('GET','/ajax/teacher?department='+department,'application/json',null);
            teachers = JSON.parse(teachers);
            let len = teachers.length;
            while (len>0){
                len--;
               let option = document.createElement('option');
               option.text = teachers[len].name;
               option.value = teachers[len].value;
               teacherSelect.add(option);
            }
            len = subjects.length;
            while (len>0){
                len--;
                let option = document.createElement('option');
                option.text = teachers[len].name;
                option.value = teachers[len].value;
                subjectsSelect.add(option);
            }
        }catch (e) {
            alert(e);
        }
  }
};



// User defined functions

function ajax(method, theUrl,responseType, data=null) {
    return new Promise((resolve,reject)=>{
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                switch (req.status) {
                    case 200:
                        resolve(req.responseText);
                        break;
                    default:
                        reject('request failed');
                }
            }
        };
        req.open(method, theUrl, true);
        req.setRequestHeader('Accept', responseType);
        if (method.toLowerCase() !== 'get') {
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            req.send(data);
        } else req.send();
    })
}
function getPostData(form){
    return new Promise((resolve,reject)=>{
        let data = '',
            i = 0;
        if (form.elements.length=0)
            reject("Form does not contain any elements");
        while (i < form.elements.length) {
            if (form.elements[i].tagName === 'SELECT'){
                data +=appendSelectData(form.elements[i]);
            }
            else {

                data += "&" + form.elements[i].name + '=' + form.elements[i].value;
            }
            i++;
        }
        resolve(data.substr(1,data.length));
    })
}
function render(result,response) {
    result.innerHTML = '';
    result.innerHTML = response;
return;
}
function appendSelectData(select) {
    let options = select.options,
        len = options.length,
        data='',
        i=0;
    while (i<len){
        if (options[i].selected)
            data+= "&" + select.name + '=' + options[i].value;
        i++;
    }
    return data;
}
function smoothScroll(id) {
    let target = document.getElementById(id);
    target.scrollIntoView({ behavior: 'smooth' });
}