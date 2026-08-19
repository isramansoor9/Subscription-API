import { emailTemplates } from "./email-template.js";
import dayjs from "dayjs";
import transporter, {
    accountEmail,
} from "../config/nodemailer.js";

export const sendReminderEmail = async ({
    to,
    type,
    subscription,
}) => {
    if (!to || !type) {
        throw new Error("Missing required parameters");
    }

    console.log("📨 Preparing email");
    console.log("To:", to);
    console.log("Type:", type);

    const template = emailTemplates.find(
        (t) => t.label === type
    );

    if (!template) {
        throw new Error(`Invalid email type: ${type}`);
    }

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(
            subscription.renewalDate
        ).format("MMM D, YYYY"),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to,
        subject,
        html: message,
    };

    console.log("📤 Sending email...");

    const info = await transporter.sendMail(mailOptions);

    console.log(
        "✅ Email sent successfully:",
        info.messageId
    );

    return info;
};