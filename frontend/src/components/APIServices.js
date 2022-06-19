export default class APIServices {
    static checkPassword(password , setErrors) {

        const validPassRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        if (validPassRegex.test(password)) {
            setErrors(prev => ({
                ...prev,
                passerr: ''
            }));
        }
        else {
            setErrors(prev => ({
                ...prev,
                passerr: 'Error',
                len: 'Atleast 8 charracters are required',
                lower: 'Atleast one lowercase is required',
                upper: 'Atleast one uppercase is required',
                digit: 'Atleast one digit is required',
                special: 'Atleast one special character is required'
            }));
        }
    }

    static checkConfirmPass(password, confirmPass, setErrors) {
        if (password === confirmPass) {
            setErrors(prev => ({
                ...prev,
                confirmPasserr: ''
            }))
        }
        else {
            setErrors(prev => ({
                ...prev,
                confirmPasserr: "Password's don't match"
            }))
        }
    }

    static checkUsername(username, setErrors) {
        if (username.length < 3)
            setErrors(prev => ({
                ...prev,
                usernamerr: 'Username must be atleast 3 characters'
            }));
        else
            setErrors(prev => ({
                ...prev,
                usernamerr: ''
            }))
    }
}