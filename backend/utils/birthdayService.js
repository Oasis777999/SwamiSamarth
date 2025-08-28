const User = require("../Models/PersonMode");
const axios = require("axios");

async function getUserWithBirthday(month, day){
    return await User.find({
        $expr:{
            $and:[
                {$eq:[{$dayOfMonth : '$dob'}, day]},
                {$eq:[{$month:'$dob'}, month]}
            ]
        }
    })
}

async function checkAndSendBirthdaySMS(){
    const today = new Date();
    const month = today.getMonth()+1;
    const day = today.getDate();

    try{
        const userWithBirthdayToday = await getUserWithBirthday(month, day);

        for(let user of userWithBirthdayToday){
            await sendBirthdaySMS(user);
        }
        console.log(`Sent SMS to ${userWithBirthdayToday.length} users`);
    }
    catch(error){
        console.log(`Error during birthday check : `, error);
        
    }
}

async function sendBirthdaySMS(user) {
    return axios.post(`http://sms.advaitdigital.com/api/smsapi?key=c0a386bcdce63e8ce841f9e127b2458b&route=1&sender=COOCSL&number=${user.mobile}&sms=Dear, Rs. 100000 has been debited to your account 0831. Account balance: Rs. 00. Chartered Co-Operative
&templateid=1707173614237110753`)
}

module.exports = {checkAndSendBirthdaySMS};
