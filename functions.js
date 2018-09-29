module.exports.parseForSelect = function parseForSelect(source){
    let len = source.length,
        result = [];
    for (let i=0;i<len;i++){
        let designation = source[i];
        let obj = {
            name:designation.name,
            value:designation._id
        };
        result.push(obj);
    }
    return result;
};