export function routeOffer(req, offers){

  const user = req.query

  let filtered = offers.filter(o => {

    if(user.goal === "cash" && !o.category.includes("pozyczki")) return false
    if(user.score === "bad" && o.type === "bank") return false
    if(user.time === "fast" && o.speed !== "instant") return false

    return true
  })

  if(filtered.length === 0){
    return offers.sort((a,b)=>(b.epc||0)-(a.epc||0))[0]
  }

  function scoreOffer(o){
    let score = 0

    if(user.goal === "cash") score += 20
    if(user.time === "fast" && o.speed === "instant") score += 15
    if(user.score === "bad" && o.type !== "bank") score += 15
    if(user.amount === "big") score += 10

    score += (o.epc || 0) * 5

    return score
  }

  filtered.sort((a,b)=>scoreOffer(b)-scoreOffer(a))

  return filtered[0]
}