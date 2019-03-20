pragma solidity 0.5.0;

contract CHRToken {
    string  public name = "Charol";
    string  public symbol = "CHR";
    string  public standard = "Charol Token v1.0";
    uint256 public totalSupply;
    uint256 public index=0;
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    event CharityAdded(
        string name,
        address _addr
    );
    struct TransactionDetail {
        address[] addr;
        uint256[] amount;
        uint size;
  }
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    address[] public charAddr;
    mapping(address => string) public charityName;
    mapping(address=> TransactionDetail) public transactionHistoryOfCharity;
    string n="";
    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        TransactionDetail storage td= transactionHistoryOfCharity[_to];
        if(td.size==0)
        {
            td.addr.push(_from);
            td.amount.push(_value); 
            td.size=1;  
        }
        else
        {
            td.addr.push(_from);
            td.amount.push(_value);   
            td.size++;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    function addCharity(address _addr, string memory cname) public {

        require (bytes(charityName[_addr]).length==0);
        charityName[_addr]=cname;
         charAddr.push(_addr);
        index++;
        emit CharityAdded(cname, _addr);
    }
    function getAddressFromArray(uint256 i) public returns(address){
        return charAddr[i];
    }
 /*   function getTransactionHistory(address in1, address  in2, uint256 i) public returns(uint256 ){
        return transactionHistoryOfCharity[in1][in2][i];
    }*/
    function getTDforAddr (address add)public  returns(address[] memory, uint256[] memory) {
         address[] memory taddr = transactionHistoryOfCharity[add].addr;
         uint256[] memory tamt= transactionHistoryOfCharity[add].amount;
         return (taddr, tamt);

    }
    
}
