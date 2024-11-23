## To start the backend and frontend concurrently
"server": "cd server && npm run dev",
"dev": "concurrently -n \"client,server\" -c \"bgBlue,bgYellow\" \"npm start\" \"npm run server\""

## to start this project
"server": "cd.. && cd Backend && npm run dev",
"dev": "concurrently -n \"client,server\" -c \"bgBlue,bgYellow\" \"npm run dev2\" \"npm run server\""