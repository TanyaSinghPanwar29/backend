const RESPONSE_MODALS = {
    userRegistered: {
        success: {
        success: true,
        message: "User has been created"
        },
        failed: {
        success: false,
        message: "Unable to register user"
        }
    },
    loggedIn: {
        success: {
            success: true,
            message: "Authorized"
            },
            failed: {
            success: false,
            message: "Invalid Credentials"
            },
            user_not_found: {
                success: false,
                message: "User not found"

            }
    }
}

const getJWTTokenPayLoad = (email) => {
    if(!email)
    return null;

    let date = new Date();
    let time = date.toISOString().split('T')[0]+" "+date.getHours()+":"
    +(date.getMinutes().toString().length === 1 ? "0" : "")
    +date.getMinutes().toString()
    +":"+date.getSeconds();

    const payLoad = {
        email: email,
        createdAt: time
    }

    return payLoad;
}

exports.RESPONSE_MODALS = RESPONSE_MODALS;
exports.getJWTTokenPayLoad = getJWTTokenPayLoad;