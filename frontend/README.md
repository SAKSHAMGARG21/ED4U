## To start the backend and frontend concurrently
"server": "cd server && npm run dev",
"dev": "concurrently -n \"client,server\" -c \"bgBlue,bgYellow\" \"npm start\" \"npm run server\""

## to start this project
"server": "cd.. && cd Backend && npm run dev",
"dev": "concurrently -n \"client,server\" -c \"bgBlue,bgYellow\" \"npm run dev2\" \"npm run server\""

# this is to generate secret key
PS D:\desktop\web dev\SEM 5 Backend Class\JwtTokens> node
Welcome to Node.js v20.11.0.
Type ".help" for more information.
> require("crypto").randomBytes(64).toString("hex")