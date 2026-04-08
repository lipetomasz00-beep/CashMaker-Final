import { getBestOffer } from "./aiEngine.js"

export function routeOffer(req,stats){

    const user = {

        country: req.headers["cf-ipcountry"] || "US",

        device: req.headers["user-agent"].includes("Mobile")
        ? "mobile"
        : "desktop"

    }

    const offer = getBestOffer(user,stats)

    return offer

}
