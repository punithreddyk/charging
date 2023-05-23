pragma solidity  ^0.5.0;

contract Charging {
    string public name;
    uint public stationCount = 0;
    mapping(uint => Station) public stations;

    struct Station{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event stationCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event gaspurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name ="charging dapp";
    }

    function createStation(string memory _name, uint _price) public {

        require(bytes(_name).length > 0);
        require(_price > 0);

        stationCount ++;
        stations[stationCount]= Station(stationCount,_name,_price,msg.sender,false);

        emit stationCreated(stationCount,_name,_price, msg.sender,false);
    }

    function purchasegas(uint _id)public payable{
        
    Station memory _station = stations[_id];

    address payable _seller = _station.owner;

    require(_station.id>0 && _station.id <= stationCount);

    require(msg.value >= _station.price);

    require(_seller != msg.sender);

    _station.purchased = true;

    address(_seller).transfer(msg.value);

    emit gaspurchased(stationCount,_station.name,_station.price, msg.sender,true);

    }

}