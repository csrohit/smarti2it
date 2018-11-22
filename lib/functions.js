const err = require('./err');
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

module.exports.pushError = e=>{
    let msg=new Object();
    switch(e){
        case err.INVALID_ID:
            msg['msg'] = "Invalid ObjectId";
            msg['status'] = err.OK;
        break;
        case err.NAME_REQUIRED:
            msg['msg'] = "Name can not be empty";
            msg['status'] = err.OK;
        break;
        case err.EMAIL_REQUIRED:
            msg['msg'] = "Email can not be empty";
            msg['status'] = err.OK;
        break;
        case err.USERNAME_REQUIRED:
            msg['msg'] = "Username can not be empty";
            msg['status'] = err.OK;
        break;
        case err.DEPARTMENT_REQUIRED:
            msg['msg'] = "Department can not be empty";
            msg['status'] = err.OK;
        break;
        case err.DESIGNATION_REQUIRED:
            msg['msg'] = "Designation can not be empty";
            msg['status'] = err.OK;
        break;
        case err.ROLL_NO_REQUIRED:
            msg['msg'] = "Roll no. can not be empty";
            msg['status'] = err.OK;
        break;
        case err.SUBJECT_REQUIRED:
            msg['msg'] = "Subject can not be empty";
            msg['status'] = err.OK;
        break;
        case err.USER_DOES_NOT_EXIST:
            msg['msg'] = "User not found";
            msg['status'] = err.BAD_REQUEST;
        break;
        case err.STUDENT_DOES_NOT_EXIST:
            msg['msg'] = "Student not found";
            msg['status'] = err.BAD_REQUEST;
        break;
        case err.STUDENT_UNCHANGED:
            msg['msg'] = "Student is unchanged";
            msg['status'] = err.CREATED;
        break;
        case err.TEACHER_DOES_NOT_EXIST:
            msg['msg'] = "Teacher not found";
            msg['status'] = err.BAD_REQUEST;
        break;
        default :
            console.log(e);
            msg['msg'] = "Unidentified exception";
            msg['status'] = err.INTERNAL_SERVER_ERROR;
    }
    return msg;
}