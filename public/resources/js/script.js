
async function update(route){
    const form = document.querySelector('form');
    try {
        let data = await getPostData(form),
            response = await ajax('PUT','/'+route,'text/html',data);
            if(response === '200')
                return window.location.href = '/'+route+'/'+form.elements['_id'].value;
            else if(response === '400')
                return window.location.href = '/'+route;
                let nav = document.querySelector('nav'),
                body = document.querySelector('body');  
                body.innerHTML = '';
                body.appendChild(nav);
                body.innerHTML += response
                departmentSelected('subject');
        return;
            // return document.write(response);
        }catch (e) {
            console.log(e);
        }
    }    
function showDelConfirmation(){
    let modal = document.createElement('div');

}
async function del(_id,route){
    try{
        let data = "_id="+_id;
        let response = await ajax('DELETE','/'+route,'text/html',data); 
        return window.location.href = '/'+route;
    }catch(e){
        console.log(e);
    }
}
async function departmentSelected(route){
    let select = document.getElementById('department');
    let data = "department="+select.value;
    let response = await ajax('GET','/'+route+'?'+data,'application/json');
    response = JSON.parse(response);
    let targetSelect = document.getElementById(route);
    targetSelect.options.length = 0;
        for(let i=0; i<response.length;i++){
            let option = document.createElement('option');
            option.value = response[i]._id;
            option.text = response[i].name;
            targetSelect.add(option);
        }
}
function test(){
    alert("blah");
}

// User defined functions
function ajax(method, theUrl,responseType, data=null) {
    return new Promise((resolve,reject)=>{
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if(req.status <400)
                    return resolve(req.responseText);
                return reject('request failed');
            }
        };
        req.open(method, theUrl, true);
        req.setRequestHeader('Accept', responseType);
        if (method.toLowerCase() !== 'get') {
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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