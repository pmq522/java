var view ={
  displayMessage: function(msg){
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");//显示战舰位置
  },
  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3, // 战舰长度
  shipsSunk: 0,
  ships: [{ locations: [0, 0, 0], hits: ["", "", ""], isSunked: false,isShowed: false},
          { locations: [0, 0, 0], hits: ["", "", ""], isSunked: false,isShowed: false},
          { locations: [0, 0, 0], hits: ["", "", ""], isSunked: false,isShowed: false},
          { locations: [0,0,], hits: ["",""], isSunked: false,isShowed: false},
          { locations: [0], hits: [""],isSunked: false,isShowed: false}],
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];//依次获取三艘战舰
      var locations = ship.locations;
      // console.log(locations)
      // 比如说用户猜测的是A1，之前的代码会将他转成01
      var index = locations.indexOf(guess);//获取guess数组中的索引
      // hits = ["hit", "hit", "hit"]
      // console.log(index)
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
          console.log('sunked:' + this.shipsSunk)
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed."); 
    return false;
  },

  isSunk: function(ship) {
    var count = 0
    for(var p = 0; p < this.shipLength; p++) {
      document.getElementById(ship.locations[p]).style.backgroundImage = "url('boom1.png')"
    }
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] === "hit") {
        count++
      }
    }
    if (count > this.shipLength*0.66){
      return true
    }
    return false;
  }
};

// 把用户输入的 D3 中的 D 转换成了 数字3
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);  // 获取0到6的数字
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize ||
      column < 0 || column >= model.boardSize) {  //自动类型转换，检查是否在0到6之间  用游戏版大小和这个数字比较
        alert("Oops, that's off the board!");
      } else {
        return row + column;  //row是数字，column是字符串，但结果是字符串
      }
  }
  return null;
}


var controller = {
  guesses: 0,
  processGuess: function(e) { // D3
    var location = e.target.id
    // D3 成为了 33
    // 从这以后的代码，就是在判断 33 是不是击中了舰艇
    // 以及击中或未击中后的用户反馈
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
      }
    }
  }
};

function init() {
  // 绑定页面中fireButton元素到 变量fireButton
  var fireButton = document.getElementById("fireButton"); 
  // console.log(typeof fireButton)
  // 绑定 onclick事件，执行 handleFireButton函数
  fireButton.onclick=handleFireButton;

   //console.log(agou[0])
   //绑定 onclick事件，执行 test函数
   //amao.onclick=test;

   //console.log('hi')
   var agou = document.getElementsByTagName('td');
   console.log(agou)
   for (var i = 0; i < agou.length; i++) {
     agou[i].onclick = controller.processGuess
   }

  // function forClick(myDom) {
  //   console.log(myDom.target.id)
  // }

  // agou[0].onclick = forClick(this)
  // var agou = document.getElementById('00');
  
  // agou.onclick = forClick


  // console.log(agou)

  // 将当前发生的浏览器事件，传值到event这个变量里
  // document.querySelectorAll('#board td')[0].onclick = function (event) {
  //   console.log(event.target.id)
  // }
  // document.querySelectorAll('#board td')[1].onclick = function (event) {
  //   console.log(event.target.id)
  // }
  // document.querySelectorAll('#board td')[2].onclick = function (event) {
  //   console.log(event.target.id)
  // }

  // 下面这句话代表，把函数getTargetId执行后的返回值，赋值到页面中的对象中去
  // document.querySelectorAll('#board td')[2].onclick = getTargetId()
  // 函数赋值时候，不带括号的意思是，把整个函数赋值给onclick事件
  // document.querySelectorAll('#board td')[3].onclick = getTargetId
  // function getTargetId(event) {
  //   console.log(event.target.id)
  // }


  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
function handleFireButton() {
  var guessInput1 = document.getElementById("guessInput1");
  var guessInput2 = document.getElementById("guessInput2");
  guessInput2.addEventListener('click',()=>{
    guessInput1.onclick();
  });
  var guess = guessInput1.value;
  var guess = guessInput2.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

//  function test(myDom){
//   console.log(myDom.id)  // 解决了如何获取被点击对象的id信息
//  }

window.onload = init;
view.displayMessage("Tap tap, is this thing on?");