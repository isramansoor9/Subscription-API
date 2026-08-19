import express from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscription, getAllSubscriptions, 
    getSubscriptionById, updateSubscription, deleteSubscription, 
    cancelSubscription, getUpcomingRenewals } from "../controllers/subscription.controller.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/", getAllSubscriptions);
subscriptionRouter.get("/upcoming-renewals", getUpcomingRenewals);
subscriptionRouter.get("/:id", authorize, getSubscriptionById);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id", authorize, updateSubscription);
subscriptionRouter.delete("/:id", authorize, deleteSubscription);  
subscriptionRouter.get("/user/:id", authorize, getUserSubscription);
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

export default subscriptionRouter;
