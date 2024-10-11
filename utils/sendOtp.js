const axios = require("axios");

exports.sendOtp = async (contactNumber, otp) => {
    const apiKey = "66a8b820620fd";
    const senderId = "IMRIMR";
    const peid = "1201160200437741355";
    const templateId = "1207172209292892274";

    const smsText = `Your OTP is ${otp} for verification of mobile number ${contactNumber} for Defence Partnership Days. Team IMR Media. defencepartners.in`;

    const response = await axios.get("https://softsms.in/app/smsapi/index.php", {
        params: {
            key: apiKey,
            type: "long",
            contacts: contactNumber,
            senderid: senderId,
            peid: peid,
            templateid: templateId,
            msg: smsText,
        },
    });

    return response.data;
};
