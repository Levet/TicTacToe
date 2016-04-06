/**
 * Created by Jordan on 3/14/2016.
 */


/*
 * @class
 */

function Tile(x, y){
    this.x       = x;
    this.y       = y;
    this.ownedBy = null;
}

function Win(){
    this.children = [];
    this.cantWin = true;
    this.checkForWin = function(){
        var targetPlayer;

        for(var child in this.children){
            if(this.children[child].ownedBy == null) return false;
            if(targetPlayer && targetPlayer != this.children[child].ownedBy){
                this.cantWin = true;
                return false;
            }
            targetPlayer = this.children[child].ownedBy;
        }
        return true;
    };
    this.map = {};
    this.location = 0;
    this.addChild = function(child){
        this.map["x"+child.x+' y'+child.y] = this.location;
        this.location++;
        this.children.push(child)
    };
    this.claim = function(player, location){
        var loc = this.map[location];
        console.log(this.map, location);
        if(loc > -1 && !this.children[loc].ownedBy){
            this.children[loc].ownedBy = player;
        }
        return this.checkForWin();
    }
}


function Game(playerOne, playerTwo){
    this.winMethods = {};
    this.new = function(size){
        var body = document.getElementsByTagName("body")[0];
        this.winMethods.topLeftBottomRight = new Win();
        this.winMethods.topRightBottomLeft= new Win();
        for(var y = 1; y <= size; y++){
            this.winMethods['yAxis '+y] = new Win();
            var row = document.createElement("div");
            row.className = "row";
            for(var x = 1; x <= size; x++){
                var field = document.createElement("div");
                field.className = "field";
                field.id = "x"+x+" y"+y;
                field.addEventListener("click", function(){
                    var claim = document.createElement("p");
                    claim.innerHTML = "x";
                    this.appendChild(claim);
                    game.claimSpot(this.id);
                });

                row.appendChild(field);
                if(x == size) body.appendChild(row);
                var tile = new Tile(x, y);
                if(y == 1) this.winMethods['xAxis '+x] = new Win();
                if(x == y) this.winMethods.topLeftBottomRight.addChild(tile);
                if(x+y == size+1) this.winMethods.topRightBottomLeft.addChild(tile);
                this.winMethods['xAxis '+x].addChild(tile);
                this.winMethods['yAxis '+y].addChild(tile);
            }
        }
    };
    this.won = function(player){
        alert(player+", you won!");
    };

    this.claimSpot = function(location){
        var inProgress = true;
        for(var key in this.winMethods){
            var result = this.winMethods[key].claim(this.activePlayer, location);
            inProgress = inProgress && !result;
        }
        if(!inProgress){
            this.won(this.activePlayer);
        }
        this.turnOver();
    };

    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.activePlayer = playerOne;

    this.turnOver = function(){
        this.activePlayer = this.activePlayer == this.playerOne ? this.playerTwo : this.playerOne;
    }


}