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

echo "AWS CloudWatch Agent Install Start"
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
echo "AWS CloudWatch Agent Install End"

sudo mv /tmp/AmazonCloudWatch-config.json /opt/AmazonCloudWatch-config.json

sudo mkdir -p /opt/webapp

sudo unzip /tmp/webapp.zip -d /opt/webapp/

cd /opt/webapp

# Install app dependencies
sudo npm install

sudo mv /opt/webapp/opt/user.csv /opt/

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo mv /opt/webapp /opt/csye6225/


sudo chown -R csye6225:csye6225 /opt/csye6225/webapp
sudo chmod -R 750 /opt/csye6225/webapp


sudo systemctl start amazon-cloudwatch-agent
sudo systemctl enable amazon-cloudwatch-agent

# Systemd setup

sudo systemctl daemon-reload
sudo systemctl enable node.service
sudo systemctl start node.service
sudo systemctl status node.service

echo "Your server setup is complete. You can now deploy your Node.js app."
