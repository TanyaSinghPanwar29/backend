const { generateToken } = require('../Authentication/jwt-service');
const { response } = require('express');

const RESPONSE_MODALS = {
    userRegistered: {
        success: {
            success: true,
            message: "User has been created"
        },
        failed: {
            success: false,
            message: "Unable to register user"
        },
        userAlreadyExist: {
            success: false,
            message: "User already exists"
        }
    },
    loggedIn: {
        success: {
            success: true,
            message: "Authorized",
        },
        failed: {
            success: false,
            message: "Invalid Credentials"
        },
        user_not_found: {
            success: false,
            message: "User not found"
        },
        invalidData: {
            success: false,
            message: "Invalid Parameters"
        }

    },
    profileUpdate: {
        success: {
            success: true,
            message: "User updated",
        },
        failed: {
            success: false,
            message: "Details could not be updates..."
        }
    },
    search: {
        success: {
            success: true,
            message: "Results"
        },
        failed: {
            success: false,
            message: "NO Results found..."
        }

    },
    userInfo:{
        success:{
            success: true,
            message: "user details found"
        },
        failed:{
            success: false,
            message: "No result found"
        }
    },
    friendRequest:{
        success:{
            success: true,
            message: "Friend request send"
        },
        failed:{
            success: false,
            message: "failed to send request"
        }
    },
    userStatus:{
        success:{
            success: true,
            message: "contact status determined"
        },
        failed:{
            success: false,
            message: "can't determine..."
        }
    },
    friendRequest: {
        accepted: {
            success: true,
            message: "Friend Request Accepted"
        },
        rejected: {
            success: false,
            message: "Friend Request rejected"
        }
    }

}

const getJWTTokenPayLoad = (email) => {
    if (!email)
        return null;

    let date = new Date();
    let time = date.toISOString().split('T')[0] + " " + date.getHours() + ":"
        + (date.getMinutes().toString().length === 1 ? "0" : "")
        + date.getMinutes().toString()
        + ":" + date.getSeconds();

    const payLoad = {
        email: email,
        createdAt: time
    }

    return payLoad;
}

const getSuccessfulLoginResponse = (email, isupdated) => {
    let response = {
        ...RESPONSE_MODALS.loggedIn.success,
        email:email,
        token: generateToken(getJWTTokenPayLoad(email)),
        isUpdated: isupdated
    }
    return response;
}

exports.RESPONSE_MODALS = RESPONSE_MODALS;
exports.getJWTTokenPayLoad = getJWTTokenPayLoad;
exports.getSuccessfulLoginResponse = getSuccessfulLoginResponse;