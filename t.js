function addSay(target) {
  target.say = function() {
    console.log(target.name)
  }
}

@addSay
class Servant {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

var saber = new Servant('saebr', 17)
saber.say()
