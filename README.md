# Installing pre-requisites:

https://hyperledger.github.io/composer/latest/installing/installing-prereqs



# Installing dev-environment

https://hyperledger.github.io/composer/latest/installing/development-tools



# Installing property-deals project/application:

In the property-sale directory of this project


* Step 1: Deploying business network

//Run the following commands in the project directory. It must be packaged into a deployable business network archive (.bna) file.

Command: `composer archive create -t dir -n .`


// To install the business network, from the property-sale directory, run the following command:


Command: `composer network install --card PeerAdmin@hlfv1 --archiveFile property-sale@0.0.1.bna`

```The composer network install command requires a PeerAdmin business network card (in this case one has been created and imported in advance), and the the file path of the .bna which defines the business network.```

// To start the business network, run the following command:


Command: `composer network start --networkName property-sale --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card`

```The composer network start command requires a business network card, as well as the name of the admin identity for the business network, the name and version of the business network and the name of the file to be created ready to import as a business network card.```

// To import the network administrator identity as a usable business network card, run the following command:


Command: `composer card import --file networkadmin.card`

``` The composer card import command requires the filename specified in composer network start to create a card. ```

//To check that the business network has been deployed successfully, run the following command to ping the network:


Command: `composer network ping --card admin@property-sale`


* Step 2: Generating Rest Server

Command: `composer-rest-server`

```
Enter admin@property-sale as the card name.

Select never use namespaces when asked whether to use namespaces in the generated API.

Select No when asked whether to secure the generated API.

Select Yes when asked whether to enable event publication.

Select No when asked whether to enable TLS security.
```







