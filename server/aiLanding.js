export function generateLanding(offer){

return `
<!DOCTYPE html>
<html>

<head>
<title>${offer.name}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

body{
font-family:Arial;
text-align:center;
background:#0f172a;
color:white;
padding:40px
}

button{
padding:20px;
font-size:22px;
background:#22c55e;
border:none;
border-radius:10px;
cursor:pointer
}

</style>

</head>

<body>

<h1>Limited Offer</h1>

<p>${offer.name}</p>

<a href="/?offer=${offer.name}">
<button>Claim Reward</button>
</a>

</body>

</html>
`
}
