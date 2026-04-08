import offers from "../config/offers.json" assert {type:"json"}
import { scoreOffer } from "../ai/offerScoring.js"

export function getBestOffer(user, stats){

    let scored = offers.map(o=>{

        const score = scoreOffer(o, stats[o.name] || {})

        return {offer:o, score}

    })

    scored.sort((a,b)=>b.score-a.score)

    return scored[0].offer

}
