
export const validCatName = (str) => {
    if(str === ""){
        return [false, "* name is required"];
    } else if (str.trim().length < 4) {
        return [false, "* name length must be more than 3 character"]
    } else {
        return [true , ""]
    }
}

export const validNameSimple = (str) => {
    if(str === ""){
        return false
    } else {
        return true
    }
}

export const validateEmail = (email) => {

    if(email === ""){
        return [false, "* email is required"]
    }else if (/^\w+([-]?\w+)@\w+([-]?\w+)(\.\w{2,3})+$/.test(email)) {
        return [true, ""]
    } else {
        return [false , "* invalid email, email must contain special character"]
    }
};