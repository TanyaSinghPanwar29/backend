class Utils {
    getFilteredEmail = (email) => {
        if(!email)
        return;
        let exceptions = [ ".", "#", "$", "[", "]"];
        let filteredEmail = '';
        for(let i = 0;i<email.length;i++){
            let c = email.charAt(i);
            if(!exceptions.includes(c)){
                filteredEmail+=c;
            }
            
        }
        return filteredEmail;
    }
}
exports.Utils = new Utils();