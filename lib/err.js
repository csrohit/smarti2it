/*      GENERAL ERRORS        */
module.exports.INVALID_ID = 100;
module.exports.DEPARTMENT_REQUIRED = 101;
module.exports.NAME_REQUIRED = 102;
module.exports.EMAIL_REQUIRED = 103;
/*      USER ERRORS           */
module.exports.USER_DOES_NOT_EXIST = 200;
module.exports.USER_UNCHANGED = 201;
module.exports.USERNAME_REQUIRED = 202;
module.exports.DESIGNATION_REQUIRED = 203;
/*      TEACHER ERRORS         */
module.exports.TEACHER_DOES_NOT_EXIST = 300;
module.exports.TEACHER_UNCHANGED = 301;
module.exports.SUBJECT_REQUIRED = 302;
/*      STUDENT ERRORS         */
module.exports.STUDENT_DOES_NOT_EXIST = 400;
module.exports.STUDENT_UNCHANGED = 401;
module.exports.ROLL_NO_REQUIRED = 402;

/*------------------------------
        HTTP Response Codes
------------------------------*/
module.exports.BAD_REQUEST = 400;
module.exports.CREATED = 201;
module.exports.OK = 200;
module.exports.INTERNAL_SERVER_ERROR = 500;