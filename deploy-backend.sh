#!/bin/bash

# YojanaSathi Backend Deployment Script for EC2
# This script sets up the backend on an EC2 instance

set -e

echo "🚀 YojanaSathi Backend Deployment"
echo "=================================="

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/yojanasathi
sudo chown ec2-user:ec2-user /opt/yojanasathi
cd /opt/yojanasathi

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/VarshiniGunti/YojanaSathi.git .

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create logs directory
mkdir -p logs

# Copy environment file
echo "⚙️  Setting up environment..."
cp .env.example .env
echo "❗ IMPORTANT: Edit /opt/yojanasathi/backend/.env with your AWS credentials"

# Start application with PM2
echo "🚀 Starting application..."
npm run start:prod

# Setup PM2 to start on boot
echo "⚙️  Setting up PM2 startup..."
pm2 startup
pm2 save

# Configure firewall
echo "🔥 Configuring firewall..."
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

echo ""
echo "✅ Backend deployment complete!"
echo ""
echo "Next steps:"
echo "1. Edit /opt/yojanasathi/backend/.env with your AWS credentials"
echo "2. Restart the application: cd /opt/yojanasathi/backend && npm run restart"
echo "3. Check logs: npm run logs"
echo "4. Test API: curl http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000/api/v1/health"
echo ""
echo "Your backend will be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"