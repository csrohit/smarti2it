module.exports.parseForSelect = function parseForSelect(source){
    let len = source.length,
        result = [];
    for (let i=0;i<len;i++){
        let destination = source[i];
        let obj = {
            name:destination.name,
            value:destination._id
        };
        result.push(obj);
    }
    return result;
};