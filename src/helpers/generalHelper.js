const testCode = 123456;
const between = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
  
const generateEmailCode = () => {
    if (process.env.EMAIL_PIPE === "production") {
        const emailCode = between(100000, 200000);

        return emailCode;
    }
    return testCode;
};

const removeConfidentialData = (data) => {
    let result;
    if (data.length > 0) {
        result = data.map((object) => {
            const { password, passwordCode, emailCode, passwordResetCodeExpiresAt, __v, _id, ...serializeUserDetails } =
                JSON.parse(JSON.stringify(object));

            return serializeUserDetails;
        });
    } else {
        const { password, passwordCode, emailCode, passwordResetCodeExpiresAt, __v, _id, ...serializeUserDetails } =
        JSON.parse(JSON.stringify(data));

        result = serializeUserDetails;
    }

    return result;
}

const generateServiceCode = (str) => {
    if (str.length >= 2) {
      const firstTwoLetters = str.substring(0, 2);
      const lastLetter = str.substring(str.length - 1);
      
      // Generate a random 5-digit number
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      
      const result = firstTwoLetters + lastLetter + randomNumber;
      return result;
    } else {
      // Handle cases where the string is less than two characters
      return "Wrm00777";
    }
  }

module.exports = {
    generateEmailCode,
    removeConfidentialData,
    generateServiceCode
};