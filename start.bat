@echo off

:: Open a new Command Prompt for the Hardhat deployment
start cmd /k "cd C:\Users\Manav\blockchain && npx hardhat run scripts/deploy.js --network localhost"

:: Open a new Command Prompt for the frontend
start cmd /k "cd C:\Users\Manav\blockchain\frontend && npm run dev"

:: Open a new Command Prompt for the backend
start cmd /k "cd C:\Users\Manav\blockchain\backend && node server.js"
