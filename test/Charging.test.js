const   Charging = artifacts.require("Charging");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Charging',([deployer,seller,buyer])=>{
    let charging

    before (async()=>{
        charging = await Charging.deployed()
    })

    describe('deployment', async()=>{
        it('deploys successfully', async()=>{
            const address = await charging.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it ('has a name ', async()=>{
            const name = await charging.name()
            assert.equal(name,'charging dapp')
        })
    })

    describe('deployment', async()=>{
        let result, stationCount 

        before (async()=>{
            result = await charging.createStation('1',web3.utils.toWei('1','Ether'),{from: seller})
            stationCount = await charging.stationCount()
        })

        it ('creates products', async()=>{

            assert.equal(stationCount,1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),stationCount.toNumber(),'id is correct')
            assert.equal(event.name,'1' , 'is correct')
            assert.equal(event.price,'1000000000000000000', 'price is correct')
            assert.equal(event.owner,seller , 'owner  is correct')
            assert.equal(event.purchased, false, 'purchased is correct')

            await await charging.createStation('',web3.utils.toWei('1','Ether'),{from: seller}).should.be.rejected;

            await await charging.createStation('1',0,{from: seller}).should.be.rejected;
        })
        it ('lists stations', async()=>{

            const Station = await charging.stations(stationCount)
            
            assert.equal(Station.id.toNumber(),stationCount.toNumber(),'id is correct')
            assert.equal(Station.name,'1' , 'is correct')
            assert.equal(Station.price,'1000000000000000000', 'price is correct')
            assert.equal(Station.owner,seller , 'owner  is correct')
            assert.equal(Station.purchased, false, 'purchased is correct')

        })
        it ('sells gas', async()=>{

            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)


            result = await charging.purchasegas(stationCount,{from: buyer, value:web3.utils.toWei('1','Ether')})


            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),stationCount.toNumber(),'id is correct')
            assert.equal(event.name,'1' , 'is correct')
            assert.equal(event.price,'1000000000000000000', 'price is correct')
            //assert.equal(event.owner,seller , 'owner  is correct')
            assert.equal(event.purchased, true, 'purchased is correct')
            
            //seller received funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1','Ether')
            price = new web3.utils.BN(price)

            const expectedBalance = oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            console.log(oldSellerBalance,newSellerBalance,price)

            //invalid id
             await charging.purchasegas(99,{from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected;
            
             await charging.purchasegas(stationCount,{from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected;

        })
    })
})