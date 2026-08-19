import dayjs from "dayjs";
import { serve } from "@upstash/workflow/express";

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    console.log("🔥 WORKFLOW STARTED");

    const { subscriptionId } = await context.requestPayload;

    console.log("SUBSCRIPTION ID:", subscriptionId);

    const subscription = await fetchSubscription(
        context,
        subscriptionId
    );

    if (!subscription) {
        console.log("❌ Subscription not found");
        return;
    }

    if (subscription.status !== "active") {
        console.log(
            `❌ Subscription is not active: ${subscription.status}`
        );
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    console.log(
        `📅 Renewal date: ${renewalDate.format("YYYY-MM-DD HH:mm:ss")}`
    );

    if (renewalDate.isBefore(dayjs())) {
        console.log("❌ Renewal date has passed");
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(
            daysBefore,
            "day"
        );

        const label = `Reminder ${daysBefore} days before`;

        console.log(
            `⏰ Checking ${daysBefore}-day reminder: ${reminderDate.format(
                "YYYY-MM-DD HH:mm:ss"
            )}`
        );

        // Wait only if the reminder is in the future
        if (reminderDate.isAfter(dayjs())) {
            console.log(
                `😴 Sleeping until ${label} at ${reminderDate.format(
                    "YYYY-MM-DD HH:mm:ss"
                )}`
            );

            await context.sleepUntil(
                label,
                reminderDate.toDate()
            );
        }

        // Send the email
        await context.run(
            `send ${daysBefore} day reminder`,
            async () => {
                console.log(`📧 Sending ${label}`);

                await sendReminderEmail({
                    to: subscription.user.email,
                    type: `Reminder ${daysBefore} days before`,
                    subscription,
                });
            }
        );
    }
});

const fetchSubscription = async (
    context,
    subscriptionId
) => {
    return await context.run(
        "get subscription",
        async () => {
            console.log(
                `🔍 Fetching subscription ${subscriptionId}`
            );

            return await Subscription.findById(
                subscriptionId
            ).populate("user", "name email");
        }
    );
};