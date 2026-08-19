import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";
import Subscription from "../models/subscription.model.js";

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({
            success: true,
            message: "Subscriptions retrieved successfully",
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription retrieved successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const createSubscription = async (req, res, next) => {
    try {
        console.log("REQ.USER:", req.user);
        console.log("USER ID:", req.user._id);

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id.toString(),
            },
        });

        console.log("WORKFLOW RUN ID:", workflowRunId);

        return res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription,
            workflowRunId,
        });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(
            req.params.id
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            { status: "cancelled" },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscription = async (req, res, next) => {
    try {
        if(req.user.id != req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.status = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({
            renewalDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            status: "active",
        });

        res.status(200).json({
            success: true,
            message: "Upcoming renewals retrieved successfully",
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};