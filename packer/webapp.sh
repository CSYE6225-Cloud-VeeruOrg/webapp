#!/bin/bash

# Update the package list and upgrade installed packages
sudo apt-get update
sudo apt-get upgrade -y

# Install PostgreSQL and related packages
sudo apt-get install postgresql postgresql-contrib -y

sudo postgresql-setup initdb
sudo sed -i 's/ident/md5/g' /var/lib/pgsql/data/pg_hba.conf

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo "started and enabled PostgreSQL service"

sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '1234567890';"

# Initialize the Postgres database
sudo service postgresql initdb

# Create a new PostgreSQL user and database
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE test;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE test TO $DB_USER;"

# Configure PostgreSQL to allow remote connections (be cautious with this)
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/<version>/main/postgresql.conf
echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/<version>/main/pg_hba.conf

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql

# Install Node.js and npm
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs -y

# Install unzip if not already installed
sudo apt-get install unzip -y

unzip /home/admin/webapp.zip -d /home/admin/webapp

cd /home/admin/webapp

# Install app dependencies
npm install
# npm install -g nodemon
# npm install --save-dev nodemon

# cd src

echo "Your server setup is complete. You can now deploy your Node.js app."
