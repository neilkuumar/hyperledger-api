# Getting Started with Hyperledger Fabric Demo

## You will need to run through the following

## Build

### start off in root folder

    yarn install

    cd fabric-scripts/build

    ./startBuild.sh (answer y to the docker cache question)

    node enrollAdmin

    node registerUser

### Back to Root Folder

    cd ../../

## Run App

    node app

    http://localhost:3000

## API Reference

Unique Key is made up of: **Serial Number, Part Number and Manufacturer Name**.

### Create Part

### **/create**

#### POST

    {
        serialNumber: '1',
        partNumber: '2',
        manufacturerName: 'geminiParts',
        cageCode: '1',
        faaApprovalCode: '1',
        description: 'Spark Plug',
        revision: '1',
        drawingNumber: '1',
        quantity: '1',
        uom: 'm',
        batchNumber: '1',
        grDate: '15/06/2018',
        status: 'done',
        owner: 'geminiParts',
        location: 'engine',
        parentPart: '',
        prePart: ''
    }

### Query Manufacturer

### **/getParts?manufacturerName={manufacturerName}**

#### GET

#### E.G

    /getParts?manufacturerName=geminiParts

### Change Owner

### **/changeOwner** POST

    {
        serialNumber: '1',
        partNumber: '2',
        manufacturerName: 'geminiParts',
        owner: 'cgAutoz'
    }

### Change Status

### **/changeStatus** POST

    {
        serialNumber: '1',
        partNumber: '2',
        manufacturerName: 'geminiParts',
        status: 'error'
    }

## Upgrade Chaincode

### After updating the chaincode program `fabric-scripts/chaincode/fabpart/node/fabpart.js`

### Upgrade (increment version number)

### Install

    docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n fabpart -v 1.1 -p /opt/gopath/src/github.com/fabpart/node -l node

### Then Upgrade

    docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n fabpart -l node -v 1.1 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
