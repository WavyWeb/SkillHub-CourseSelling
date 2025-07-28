class apiError extends Error{
    contructor(
        statusCode,
        message= "Something went wrong!!",
        errors = [],
        stack = "",
    ){
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null
        this.success = false;

        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.contructor)
        }
    }
} 

module.exports = { apiError }