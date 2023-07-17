const Response = require('../helpers/response');
const generalHelper = require('../helpers/generalHelper');
const { Account } = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmailVerificationCode } = require("./email");
const moment = require('moment');

const accountRegistration = async(req, res) => {
    try{
        const { email, password, fullName } = req.body;
        // check if email is already in use
        const existingUser = await Account.findOne({email});
        if(existingUser) {
            return Response.failureResponse("Email already exist", {email}, res);
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12);

        //generate email code
        const emailCode = generalHelper.generateEmailCode();
        // Create the account
        const newAccount = await Account.create({
            email,
            password: hashedPassword,
            emailCode: emailCode,
            fullName,
        });

        //send emailCode to user email
        const { status: EmailStatusCode } = await sendEmailVerificationCode({
            user: email,
            code: emailCode,
        });

        const accountData = {
            id: newAccount._id,
            email: newAccount.email,
            fullName: newAccount.fullName,
            EmailStatusCode: EmailStatusCode,
        };

        return Response.createdResponse('Account created successfully', accountData, res)
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in Account Creation endpoint',
            res, err
        );
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        //Check if account exist
        const account = await Account.findOne({email: email});
        if(!account) {
            return Response.UnprocessableResponse("Incorrect credentials", res);
        }
        //Check if password match
        const passwordMatch = await bcrypt.compare(password, account.password);
        if(!passwordMatch) {
            return Response.UnprocessableResponse("Incorrect credentials", res);
        }
        //Serialize account data
        const accountData = generalHelper.removeConfidentialData(account);

        //Generate JWT token
        const token = jwt.sign(accountData, process.env.JWT_KEY, {expiresIn: process.env.TOKEN_VALIDATION_DURATION});

        return Response.loginResponse(
            token,
            'Login successful', 
            accountData,
            res
        );

    } catch (err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in Login endpoint',
            res, err
        );
    }
}

const googleSignIn = async (params) => {
    try {
      const {
        googleId,
        email: _email,
      } = params;
     
      const userExist = await Account.findOne({
        email: _email,
        isGoogleSignIn: true,
        googleId: googleId,
      });
  
      // user does not exist register the user.
      if (!userExist) {
        const newAccount = await Account.create({
          email: _email,
          isGoogleSignIn: true,
          googleId: googleId,
        });

        const accountData = {
            id: newAccount._id,
            email: newAccount.email,
            isGoogleSignIn: newAccount.isGoogleSignIn,
        };

        return Response.createdResponse('Account created successfully', accountData, res)
      }
  
      const accountData = {
        email: userExist.email,
        googleId: userExist.googleId,
        isGoogleSignIn: userExist.isGoogleSignIn,
      }

      //Generate JWT token
      const token = jwt.sign(accountData, process.env.JWT_KEY, {expiresIn: process.env.TOKEN_VALIDATION_DURATION});
      return Response.loginResponse(
        token,
        'Google signin successful', 
        accountData,
        res
    );
      
    } catch (err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in Google signIn endpoint',
            res, err
        );
    }
}  

const sendPasswordResetCode = async(req, res) => {
    try{
        const { email } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account){
            return Response.UnprocessableResponse("Account does not exist", res);
        }

        //Generate code to send to user
        const passwordCode = generalHelper.generateEmailCode();
        const dateObj = new Date();
        //Set timer for password expiration
        const passwordExpiresAt = moment(dateObj).add(2, 'h').toString();
        //Save the code in the DB
        account.passwordCode = passwordCode;
        account.passwordResetCodeExpiresAt = passwordExpiresAt;
        account.save();
        
        //IMPLEMENT THE EMAIL MECHANISM TO SEND TO USER
        const { status: EmailStatusCode } = await sendEmailVerificationCode({
            user: email,
            code: passwordCode,
        });
        if(EmailStatusCode === true) {
            return Response.simpleResponse("Password reset code sent", res);
        } else {
            return Response.UnprocessableResponse("Sending of Password reset code failed", res);
        }
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in forgot Password endpoint',
            res, err
        );
    }
}

const resendEmailVerificationCode = async(req, res) => {
    try{
        const { email } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account){
            return Response.UnprocessableResponse("Account does not exist", res);
        }

        //generate email code
        const emailCode = generalHelper.generateEmailCode();
        //Save the code in the DB
        account.emailCode = emailCode;
        account.save();
        
        //EMAIL MECHANISM TO SEND TO USER
        const { status: EmailStatusCode } = await sendEmailVerificationCode({
            user: email,
            code: emailCode,
        });
        if(EmailStatusCode === true) {
            return Response.simpleResponse("Verification code sent", res);
        } else {
            return Response.UnprocessableResponse("Failed sending verification code", res);
        }
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in resend email verification code endpoint',
            res, err
        );
    }
}

const validatePasswordResetCode = async(req, res) => {
    try{
        const { email, passwordCode } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }

        //Check if password code has expired
        const currentDate = new Date().toString();
        if(currentDate > account.passwordResetCodeExpiresAt) {
            return Response.UnprocessableResponse("Password code has expired", res);
        }
        //Check if the passwordCode matches wht is in the DB
        if(passwordCode !== account.passwordCode) {
            return Response.UnprocessableResponse("Wrong password reset code", res);
        }

        return Response.simpleResponse('Valid pasword code', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in validatePasswordResetCode endpoint',
            res, err
        );
    }
}

const updatePassword = async(req, res) => {
    try{
        const { email, password } = req.body;
        //Check if account exist
        const account = await Account.findOne({email});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        //Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);
        account.password = hashedPassword;
        account.save();

        return Response.simpleResponse('Password changed successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in update password endpoint',
            res, err
        );
    }
}

const updateAccount = async(req, res) => {
    try{
        const authId = req.auth.id;
        const { companyName, address, phone, state, city, zip, tinNumber, website, accNumber, bankName, logoUrl} = req.body;
        //Check if account exist
        const account = await Account.findOne({_id: authId});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        //Update account details
        account.companyName = companyName !== undefined ? companyName : account.companyName;
        account.address = address !== undefined ? address : account.address;
        account.phone = phone !== undefined ? phone : account.phone;
        account.state = state !== undefined ? state : account.state;
        account.city = city !== undefined ? city : account.city;
        account.zip = zip !== undefined ? zip : account.zip;
        account.tinNumber = tinNumber !== undefined ? tinNumber : account.tinNumber;
        account.website = website !== undefined ? website : account.website;
        account.accNumber = accNumber !== undefined ? accNumber : account.accNumber;
        account.bankName = bankName !== undefined ? bankName : account.bankName;
        account.logo = logoUrl !== undefined ? logoUrl : account.logoUrl;
        account.save();

        // Serialize updated account before returning to user
        const accountData = generalHelper.removeConfidentialData(account);

        return Response.createdResponse('Account updated successfully', accountData, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in update account endpoint',
            res, err
        );
    }
}

const getUserDetails = async(req, res) => {
    try{
        const authId = req.auth.id;
        //Check if account exist
        const account = await Account.findOne({_id: authId});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }
        // Serialize updated account before returning to user
        const userDetails = generalHelper.removeConfidentialData(account);

        return Response.successResponse('User details retrieved successfully', userDetails, res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in get user details endpoint',
            res, err
        );
    }
}

const deleteUserAccount = async(req, res) => {
    try{
        const authId = req.auth.id;
        //Check if account exist
        const account = await Account.findOne({_id: authId});
        if(!account) {
            return Response.UnprocessableResponse("Account does not exist", res);
        }

        await Account.deleteOne({ _id: authId });

        return Response.simpleResponse('Account deleted successfully', res);
    } catch(err) {
        console.log(err);
        return Response.serverError(
            'Ooops...Something occured in delete user account endpoint',
            res, err
        );
    }
}


module.exports = {
    accountRegistration,
    login,
    sendPasswordResetCode,
    validatePasswordResetCode,
    updatePassword,
    updateAccount,
    getUserDetails,
    deleteUserAccount,
    resendEmailVerificationCode,
    googleSignIn
}