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

sudo mv /tmp/node.service /etc/systemd/system/

# Install unzip
sudo apt-get install unzip -y

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo mv /tmp/webapp.zip /opt/csye6225/webapp.zip

unzip /opt/csye6225/webapp.zip -d /opt/csye6225/

cd /opt/csye6225/webapp

# Install app dependencies
npm install

sudo mv /opt/csye6225/webapp/opt/user.csv /opt/

# Systemd setup

# sudo chown -R csye6225:csye6225 /home/admin/webapp
# sudo chmod -R 755 /home/admin/webapp
# sudo chown -R csye6225:csye6225 /etc/environment
# sudo chmod -R 755 /etc/environment
sudo systemctl daemon-reload
sudo systemctl enable node.service
sudo systemctl start node.service
sudo systemctl status node.service

echo "Your server setup is complete. You can now deploy your Node.js app."
