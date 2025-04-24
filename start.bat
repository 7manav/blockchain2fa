@echo off

start cmd /k "cd C:\Users\Manav\blockchain && npx hardhat run scripts/deploy.js --network localhost"

start cmd /k "cd C:\Users\Manav\blockchain\frontend && npm run dev"

start cmd /k "cd C:\Users\Manav\blockchain\backend && node server.js"
