// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



export default class textSms {
    body: string;
    from: string;
    to: [] | string;



    private async send() {
        await client.messages
            .create({
                body: this.body,
                from: this.from,
                to: this.to
            })
            .then((
                message: {
                    sid: any;
                }) => console.log(
                    message.sid
                ));


    }
}