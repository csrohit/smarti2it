// module.exports = {
    // _section : (name, options)=>{
    //     if(!this._section){
    //         this._section = new Object();
    //         this._section[name] = options.fn(this);
    //     }
    //     return /* options.fn(this) */;
    // },
//     exCond : (v1,v2,options)=>{
//         if (v1 != v2)
//             return options.fn(this);
//         else
//             return options.inverse(this);
//     },
//     ifCond : (v1,v2,options)=>{
//         if (v1 == v2)
//             return options.fn(this);
//         else
//             return options.inverse(this);
//     }
// }

// module.exports = {
//     foo : ()=>{return 'abcd'},
//     _section : (name, options)=>{
//         if(!this._section){
//             this._section = new Object();
//             this._section[name] = options.fn(this);
//         }
//         return /* options.fn(this) */;
//     },
  
// }
module.exports = {
    section : function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    ifCond : (v1,v2,options)=>{
        if (v1 == v2)
            return options.fn(this);
        else
            return options.inverse(this);
    } 
}