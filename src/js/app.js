App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("CHRTokenSale.json", function(CHRTokenSale) {
      App.contracts.CHRTokenSale = TruffleContract(CHRTokenSale);
      App.contracts.CHRTokenSale.setProvider(App.web3Provider);
      App.contracts.CHRTokenSale.deployed().then(function(CHRTokenSale) {
        console.log("CHR Token Sale Address:", CHRTokenSale.address);
      });
    }).done(function() {
      $.getJSON("CHRToken.json", function(CHRToken) {
        App.contracts.CHRToken = TruffleContract(CHRToken);
        App.contracts.CHRToken.setProvider(App.web3Provider);
        App.contracts.CHRToken.deployed().then(function(CHRToken) {
          console.log("CHR Token Address:", CHRToken.address);
        });

        App.listenForSold();
        App.listenForCharityAdded();
        App.listenForTransactionAdded();
        return App.render();
      });
    })
  },

  // Listen for events emitted from the contract
  listenForSold: function() {
    App.contracts.CHRTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      });
      })
  },
  listenForCharityAdded: function() {
    App.contracts.CHRToken.deployed().then(function(instance) {
      instance.CharityAdded({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("charity triggered", event);
        App.loadCharityList();
      });
      })
  },
  listenForTransactionAdded: function(){
    App.contracts.CHRToken.deployed().then(function(instance) {
      instance.Transfer({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("Transaction Occured", event);
        App.render();
      });
      })
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    // Load token sale contract
    App.contracts.CHRTokenSale.deployed().then(function(instance) {
      CHRTokenSaleInstance = instance;
      return CHRTokenSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html("In circulation: "+App.tokensSold+" CHR");
      App.contracts.CHRToken.deployed().then(function(instance) {
        CHRTokenInstance = instance;
        CHRTokenInstance.charityName(App.account).then(function(res){
        console.log("sefse: "+res.length);    
        if(res.length !=0)
        {
          $("#addCharity").hide();
          $("#carform").hide();
          $("#buyTokens").hide();
          $("#info").append("You charity name: "+res);
        }
        return CHRTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.CHR-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      })
      App.loadCharityList();
      App.loadTransaction();
    });
    });
  },
 loadTransaction: function(){
      console.log("Transaction happedd"); 
      App.contracts.CHRToken.deployed().then(function(instance){
          instance.index().then( async function(result){
            console.log("result index "+result);
            var dvTable = document.getElementById("Donations");
            dvTable.innerHTML="";
            for(var ind=0;ind<result;ind++)
            {
             await instance.charAddr.call(ind).then( async function(res){
                console.log("addr"+res);
                 await instance.getTDforAddr.call(res).then( async function(re){
                  console.log("res: ",re);
                  console.log("sf: "+re.addr);
                  const [addrs, amts]= re;
                  var trTable = new Array();
                  trTable.push(["Donor Address", "CHR"]);
                  for (let k = 0; k < addrs.length; k++)
                   {
                    console.log(addrs[k]+"  "+ amts[k]);
                    trTable.push([addrs[k], amts[k]]);
                   } 
                    var table = document.createElement("TABLE");  
                    var cap= table.createCaption();
                    table.border = "1";
 
                    //Get the count of columns.
                    var columnCount = trTable[0].length;
                   //Add the header row.
                    var row = table.insertRow(-1);
                    for (var i = 0; i < columnCount; i++) {
                      var headerCell = document.createElement("TH");
                      headerCell.innerHTML = trTable[0][i];
                      row.appendChild(headerCell);
                    }
                    for (var i = 1; i < trTable.length; i++) {
                        row = table.insertRow(-1);
                        for (var j = 0; j < columnCount; j++) {
                          var cell = row.insertCell(-1);
                          cell.innerHTML = trTable[i][j];
                     }
                   }
                   var div=document.createElement("div");
                   div.setAttribute("style", "display:inline-block; margin-right: 40px;");
                   await instance.balanceOf(res).then(function(bal){
                    console.log("Balance: "+bal);
                     instance.charityName(res).then(function(name){
                      console.log("Name: "+name);
                      cap.innerHTML="Charity Name: "+ name+ "     "+"Balance: "+bal;  
                    })
                     
                   }) 
                   div.innerHTML=""
                   div.appendChild(table);
                   dvTable.appendChild(div);

                })
              })
            }
          }) 
      });
 },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.CHRTokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Sell event
    });
  },
  donate: function(){

     App.contracts.CHRToken.deployed().then(function(instance){
      var amount=$('#amount').val();
      var select=document.getElementById("charities");
      var addr=select.options[select.selectedIndex].value;
      console.log(amount, " got it "+ addr);
      return instance.transfer(App.account, addr, amount).then(function(result){
        console.log("Reciept: "+result);
      })
    });
  },


   flag:0,
  displayCharity: function(x){
    if(App.flag==0)
    {
       console.log(x);
       App.flag=1;
       var charities = new Array();
       charities.push(["Address", "Name"]);
       for(var key in x)
          charities.push([key, x[key]]);
       var sel=document.getElementById("charities");
       sel.innerHTML="";
       var first = document.createElement("option");
       first.setAttribute("value", "null");
       var firstText = document.createTextNode("Select charity");
        first.appendChild(firstText);
        sel.appendChild(first);
       for(var i=1;i,i<charities.length; i++)
       {
        var opt = document.createElement("option");
        opt.setAttribute("value", charities[i][0]);
        var t = document.createTextNode(charities[i][1]);
        opt.appendChild(t);
        sel.appendChild(opt);
       }

    }
  },
   loadCharityList: function(){
    App.flag=0;
    App.contracts.CHRToken.deployed().then(async function(instance){
      var addressName=new Object();
         console.log("saurav");
         await instance.index().then(async function(result){
          console.log("asfL: "+result );
           for(var i=0;i<result;i++)
           {
            var x= await instance.charAddr(i).then(async function(res){
             console.log("addr: "+res); 
              await instance.charityName(res).then(function(ress){
              addressName[res]=ress;
              console.log("name: "+ress);
              if(Object.keys(addressName).length==result)
                App.displayCharity(addressName);
             });
            });
          }
         });

         });
          
  },
  addCharity: function(){
    var name=$('#nameCharity').val();
    App.contracts.CHRToken.deployed().then(function(instance){
      return  instance.addCharity(App.account, name);
    }).then(function(result){
      console.log("result: "+result);
      App.render();
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});
