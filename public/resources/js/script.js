
async function update(route){
    const form = document.querySelector('form');
    try {
        let data = await getPostData(form),
            response = await ajax('PUT','/'+route,'application/json',data);
            return window.location.href = '/'+route+'/'+form.elements['_id'].value;
        }catch (e) {
            console.log(e);
        }
    }
    
async function del(_id,route){
    try{
        let data = "_id="+_id;
        let response = await ajax('DELETE','/'+route,'application/json',data);
        if(response === '200')
        return window.location.href = '/'+route;
    }catch(e){
        console.log(e);
    }
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