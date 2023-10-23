#!/bin/bash

# Update the package list and upgrade installed packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs -y

sudo mv /home/admin/node.service /etc/systemd/system/

# Install unzip
sudo apt-get install unzip -y

unzip /home/admin/webapp.zip -d /home/admin/webapp

cd /home/admin/webapp

# Install app dependencies
npm install

sudo mv /home/admin/webapp/opt/user.csv /opt/

sudo systemctl daemon-reload
sudo systemctl enable node.service
sudo systemctl start node.service
sudo systemctl status node.service

echo "Your server setup is complete. You can now deploy your Node.js app."
