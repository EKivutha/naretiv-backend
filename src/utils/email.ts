import config from "config";
import { User } from "../entity/user";
import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from "html-to-text";

const smtp = config.get<{
    host: string;
    port: number;
    user: string;
    pass: string;
}>('smtp');


export default class Email {
    name: string;
    to: string;
    from: string;

    constructor(public user: User, public url: string) {
        this.name = user.name;
        this.to = user.email;
        this.from = `Codevo ${config.get<string>('emailFrom')}`;
    };

    private newTransport() {
        return nodemailer.createTransport({
            ...smtp,
            auth: {
                user: smtp.user,
                pass: smtp.pass
            },
        });
    }

    private async send(template: string, subject: string) {
        const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
            name: this.name,
            subject,
            url: this.url,
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: convert(html),
            html,
        };

        const info = await this.newTransport().sendMail(mailOptions);
        console.log(nodemailer.getTestMessageUrl(info));
    }

    async sendVerificationCode() {
        await this.send('verificationCode', 'Your account verification code');
    }

    async sendPasswordResetToken() {
        await this.send(
            'resetPassword',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
}