module.exports._section = (name, options)=>{
    if(!this._section){
        this._section = new Object();
        this._section[name] = options.fn(this);
    }
    return /* options.fn(this) */;
}
module.exports.exCond = (v1,v2,options)=>{
    if (v1 != v2)
        return options.fn(this);
    else
        return options.inverse(this);
}
module.exports.ifCond = (v1,v2,options)=>{
    if (v1 == v2)
        return options.fn(this);
    else
        return options.inverse(this);
}