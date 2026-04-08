export function generateLanding(offer){

return `
<html>

<h1>Exclusive ${offer.name} Reward</h1>

<p>Complete this offer and get your reward.</p>

<a href="/go?offer=${offer.name}">
Claim now
</a>

</html>
`
}
