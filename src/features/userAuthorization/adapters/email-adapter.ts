import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, code: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        // Создание транспортера для отправки писем
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Используем сервис Gmail
            auth: {
                user: "allahverdigumbatov01@gmail.com",
                pass: "efqc cbnd cfhp xhtd",
            },
        });

        try {
            // Отправка письма
            const info = await transporter.sendMail({
                from: 'Alik <allahverdigumbatov01@gmail.com>', // Адрес отправителя
                to: email, // Адрес получателя
                subject: 'Confirm your email',
                html: `<h1>Thank you for your registration</h1>
               <p>To finish registration, please follow the link below:
               <a href='http://localhost:5005/auth/registration-confirmation?code=${code}'>Complete registration</a></p>`
            });

            return true// Логирование информации об отправке
        } catch (error) {
            console.error('Failed to send email:', error); // Логирование ошибки
            return false
        }
    },
async sendEmailForRecoveryPassword(email: string, code: string): Promise<boolean> {
    if (!email) {
        return false;
    }
    // Создание транспортера для отправки писем
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Используем сервис Gmail
        auth: {
            user: "allahverdigumbatov01@gmail.com",
            pass: "efqc cbnd cfhp xhtd",
        },
    });

    try {
        // Отправка письма
        const info = await transporter.sendMail({
            from: 'Alik <allahverdigumbatov01@gmail.com>', // Адрес отправителя
            to: email, // Адрес получателя
            subject: 'recovery your password',
            html: `<h1>Thank you for your try</h1>
               <p>To finish recovery password, please follow the link below:
               <a href='http://localhost:5005/auth/new-password?recoveryCode=${code}'>recovery password</a></p>`
        });

        return true// Логирование информации об отправке
    } catch (error) {
        console.error('Failed to send recovery code:', error); // Логирование ошибки
        return false
    }
}
}
