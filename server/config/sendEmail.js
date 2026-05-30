import * as Brevo from '@getbrevo/brevo'
import dotenv from 'dotenv'

dotenv.config()

const brevoApiKey = process.env.BREVO_API_KEY
const senderEmail = process.env.BREVO_SENDER_EMAIL
const senderName = process.env.BREVO_SENDER_NAME || 'Daily Basket'

if(!brevoApiKey){
    console.log('Provide BREVO_API_KEY in the .env file')
}

if(!senderEmail){
    console.log('Provide BREVO_SENDER_EMAIL in the .env file')
}

const apiInstance = new Brevo.TransactionalEmailsApi()

if (brevoApiKey) {
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, brevoApiKey)
}

const sendEmail = async({sendTo, subject, html })=>{
    try {
        if (!brevoApiKey || !senderEmail) {
            console.error('Brevo email configuration is missing')
            return null
        }

        const sendSmtpEmail = new Brevo.SendSmtpEmail()

        sendSmtpEmail.sender = {
            email: senderEmail,
            name: senderName,
        }
        sendSmtpEmail.to = [{ email: sendTo }]
        sendSmtpEmail.subject = subject
        sendSmtpEmail.htmlContent = html

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

export default sendEmail

