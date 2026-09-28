#!/bin/bash

# High Draw Golf — Automated Brand Owner Tool
# Designed for Non-Technical Management

echo "===================================================="
echo "      HIGH DRAW GOLF — BRAND OWNER COMMAND SUITE     "
echo "===================================================="
echo ""
echo "Select an option:"
echo " 1) Start Local Preview Website (http://localhost:3013)"
echo " 2) Publish Live Site to Vercel & GitHub"
echo " 3) Test Code Health & Environment Variables"
echo " 4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
  1)
    echo "⚡ Launching preview server at http://localhost:3013..."
    npm run dev -- --port 3013 --host
    ;;
  2)
    echo "🚀 Publishing live updates to Vercel and GitHub..."
    git add .
    git commit -m "update: Automated brand updates"
    git push -u origin master
    npx vercel --prod
    ;;
  3)
    echo "🔍 Running automated health checks..."
    npm run build
    ;;
  4)
    echo "Goodbye!"
    exit 0
    ;;
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac
