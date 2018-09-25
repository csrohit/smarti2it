document.addEventListener('DOMContentLoaded', function () {
    console.log(window.location.href);
    subject.getForm();
});



// Admin Options
const subject = {
    getForm: () => {
        let result = document.getElementById('result');
        result.innerHTML = '';
        ajax('GET', '/ajax/subject', null)
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
                ajax('POST','/admin/create-subject',data)
                    .then(response=>render(result,response))
                    .catch(e=>render(result,e));
            })
            .catch(e=>render(result,e));
    },
    update : async ()=>{
        let res = await ajax('PATCH','/admin/test');
        alert(res);
    },
    listAll:async ()=>{
        const result = document.getElementById('result');
        result.innerHTML = '';
        let subjects = await ajax('GET','/ajax/get-subjects');
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
                           <td>` + i + `</td>
                           <td><a href="` +subjects[i].value + `" >`+ subjects[i].name+`</a></td>
                           <td>   <a class="delete" href="javascript:subject.delete('`+ subjects[i].value +`')">delete</a> <a class="green" href="javascript:subject.edit('\`+ subjects[i].value +\`')">edit</a></td>
                           </tr>
                          `;
            i++;
        }
        table.innerHTML = tableContent  ;
        result.appendChild(table);
    },
        delete: async (id)=>{
        let data = "id="+id;
        let result = await ajax('DELETE','/ajax/subject',data);
        alert(result);
    }
};
const teacher = {
  getForm : ()=>{
      let result = document.getElementById('result');
      ajax('GET', '/ajax/create-teacher', null)
          .then(response =>render(result,response))
          .catch(e=>render(result,e));
  },
  create : async ()=>{
      const form = document.querySelector('form'),
          result = document.getElementById('result');
      try {
          let data = await getPostData(form),
              response = ajax('POST','/admin/create-teacher',data);
            render(result,response);
      }catch (e) {
          render(result,e);
      }
  }
};
const student = {
    getForm : async ()=>{
        let result = document.getElementById('result');
        ajax('GET', '/ajax/create-student', null)
            .then(response =>render(result,response))
            .catch(e=>render(result,e));
    },
    create : async ()=>{
        const form = document.querySelector('form'),
            result = document.getElementById('result');
        try {
            let data = await getPostData(form),
                response = ajax('POST','/admin/create-student',data);
            render(result,response);
        }catch (e) {
            render(result,e);
        }
    }
};
const designation = {
    getForm:()=>{
        const result = document.getElementById('result');
        ajax('GET','/ajax/create-designation',null)
            .then(response=>render(result,response))
            .catch(e=>render(result,e));
    },
    create:()=>{
        const form =document.querySelector('form'),
            result = document.getElementById('result');
        getPostData(form)
            .then(data=>{
                console.log(data);
                ajax('POST','/admin/create-designation',data)
                    .then(response=>render(result,response))
                    .catch(e=>render(result,e));
            })
            .catch(e=>render(result,e));
    }
};
const department = {
    getForm:()=>{
        const result = document.getElementById('result');
        ajax('GET','/ajax/create-department')
            .then(response=>render(result,response))
            .catch(e=>render(result,e));
    },
    create:async ()=>{
        const form =document.querySelector('form'),
            result = document.getElementById('result');
        let data = await getPostData(form),
            response = await ajax('POST','/admin/create-department',data);

        render(result,response);
    }
};
const classs={
    getForm:()=>{
        const result = document.getElementById('result');
        ajax('GET','/ajax/create-class')
            .then(response=>render(result,response))
            .catch(e=>render(result,e));
    },
    create:async ()=>{
        const form =document.querySelector('form'),
            result = document.getElementById('result');
        let data = await getPostData(form),
            response = await ajax('POST','/admin/create-department',data);

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
            teachers = await ajax('GET','/ajax/get-teachers?department='+department,null);
            subjects = await ajax('GET','/ajax/get-subjects?department='+department,null);
            subjects = JSON.parse(subjects);
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

function ajax(method, theUrl, data=null) {
    return new Promise((resolve,reject)=>{
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
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