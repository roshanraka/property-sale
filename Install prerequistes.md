﻿# Installing pre-requisites:

   (Reference: https://hyperledger.github.io/composer/latest/installing/installing-prereqs)

   In the terminal window paste the text below and press enter:

      curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

      touch .bash_profile

      curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

      nvm install --lts

      nvm use --lts


   Download docker from https://store.docker.com/editions/community/docker-ce-desktop-mac
   Install docker: https://docs.docker.com/docker-for-mac/install/


# Installing dev-environment: https://hyperledger.github.io/composer/latest/installing/development-tools

   Note that you should not use su or sudo for the following npm commands.

* Run the following commands in terminal

    1. Essential CLI tools:
       npm install -g composer-cli@0.20
    2. Utility for running a REST Server on your machine to expose your business networks as RESTful APIs:
       npm install -g composer-rest-server@0.20
    3. Useful utility for generating application assets:
       npm install -g generator-hyperledger-composer@0.20
    4. Yeoman is a tool for generating applications, which utilizes generator-hyperledger-composer:
       npm install -g yo

* Step 2: Install Playground

    1. Browser app for simple editing and testing Business Networks:
       npm install -g composer-playground@0.20
* Step 3: Install Hyperledger Fabric
   This step gives you a local Hyperledger Fabric runtime to deploy your business networks to.
    1. In a directory of your choice (we will assume ~/fabric-dev-servers), get the .tar.gz file that contains the tools to install Hyperledger Fabric:
       mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers
       
       curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
       tar -xvf fabric-dev-servers.tar.gz
    2. Use the scripts you just downloaded and extracted to download a local Hyperledger Fabric v1.2 runtime:
       cd ~/fabric-dev-servers
       export FABRIC_VERSION=hlfv12
       ./downloadFabric.sh
       
* Step 4: Start Hyperledger Fabric
    
    In terminal window run the following commands:
    
    cd ~/fabric-dev-servers
    export FABRIC_VERSION=hlfv12
    ./startFabric.sh
    ./createPeerAdminCard.sh
       
       




Installing property-sales poc/application:


Inside the "property-sale" directory of this project, run the following commands


Step 1: Deploying business network

//Run the following commands in the project directory. It must be packaged into a deployable business network archive (.bna) file.

Command: composer archive create -t dir -n .


// To install the business network, from the property-sale directory, run the following command:


Command: composer network install --card PeerAdmin@hlfv1 --archiveFile property-sales@0.0.1.bna

/*The composer network install command requires a PeerAdmin business network card (in this case one has been created and imported in advance), and the the file path of the .bna which defines the business network.*/

// To start the business network, run the following command:


Command: composer network start --networkName property-sales --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

/*The composer network start command requires a business network card, as well as the name of the admin identity for the business network, the name and version of the business network and the name of the file to be created ready to import as a business network card.*/

// To import the network administrator identity as a usable business network card, run the following command:


Command: composer card import --file networkadmin.card

/*The composer card import command requires the filename specified in composer network start to create a card.*/

//To check that the business network has been deployed successfully, run the following command to ping the network:


Command: composer network ping --card admin@property-sales


Step 2: Generating Rest Server

Command: composer-rest-server -c admin@property-sales -n never -w true

Step 3: In a separate terminal window

Command: cd property-deals/property-sale/property-sale/

//this would take some time
Command: npm install

Command: npm start

The application should start at http://localhost:4200



To shutdown all the process

Type Ctrl + C in terminal windows

Then, run the following commands

Command: 
    cd ~/fabric-dev-servers
    ./stopFabric.sh


To restart the POC 

1. Open a terminal window and run the following command:

Command: composer-rest-server -c admin@property-sales -n never -w true


2. Inside the "property-sale" directory of this project, run the following commands in a terminal window

Command: cd property-sale/property-sale/

Command: npm start

The application should start at http://localhost:4200


