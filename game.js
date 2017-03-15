/**
 * Created by Jordan on 3/14/2016.
 */


/*
 * @class
 */

class Tile {
    constructor(){
        this.x       = x;
        this.y       = y;
        this.ownedBy = null;
    }
}

class WinMethod {
    constructor(){
        this.children = [];
        this.canWin = true;
        this.map = {};
    }

    /**
     * Adds Child to the win method.
     * @param child
     */

    addChild(child){
        this.map["x"+child.x+' y'+child.y] = this.location;
        this.location++;
        this.children.push(child)
    }

    /**
     *
     * @returns {boolean}
     */

    checkForWin(){

        if(this.canWin === false){
            return false;
        }

        let targetPlayer;

        for(let i = 0; i < this.children.length; i++){

            let child = this.children[i];

            if(child.ownedBy == null){
                return false;
            }

            if(targetPlayer && targetPlayer !== child.ownedBy){
                this.cantWin();
                return false;
            }

            targetPlayer = this.children[child].ownedBy
        }
    }

    /**
     *
     * @param player
     * @param location
     * @returns {boolean}
     */

    claim(player, location){
        let tile = this.map[location];
        if(tile > -1 && this.children[tile].ownedBy === null){
            this.children[tile].ownedBy = player;
        }

        return this.checkForWin()
    }

    /**
     * Sets canWin to false, rendering this method impossible.
     */

    cantWin(){
        this.canWin = false;
    }
}

class Row {
    constructor(){
        this.html = document.createElement("div");
        this.html.className = "row";
    }

    addChild(field){
        this.html.appendChild(field)
    }
}

class Field {
    constructor(x, y){
        this.html = document.createElement("div");
        this.html.className = "field";
        this.html.id = "x"+x+" y"+y;
        this.html.addEventListener("click", function(){
            var claim = document.createElement("p");
            claim.innerHTML = "x";
            this.appendChild(claim);
            game.claimSpot(this.id);
        });
    }
}

/**
 *
 */

class Game {
    constructor(playerOne, playerTwo, size){
        this.winMethods = {};
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.activePlayer = playerOne;

        let body = document.getElementsByTagName("body")[0];
        this.winMethods.topLeftBottomRight = new WinMethod();
        this.winMethods.topRightBottomLeft= new WinMethod();
        for(let y = 1; y <= size; y++){
            this.winMethods['yAxis '+y] = new WinMethod();
            let row = new Row();
            for(let x = 1; x <= size; x++){
                let field = new Field(x, y);

                row.addChild(field);

                if(x == size) {
                    body.appendChild(row);
                }
                // TODO: merge tile and field
                let tile = new Tile(x, y);
                if(y == 1) {
                    this.winMethods['xAxis '+x] = new WinMethod();
                }

                if(x == y) {
                    this.winMethods.topLeftBottomRight.addChild(tile);
                }

                if(x+y == size+1) {
                    this.winMethods.topRightBottomLeft.addChild(tile);
                }

                this.winMethods['xAxis '+x].addChild(tile);
                this.winMethods['yAxis '+y].addChild(tile);
            }
        }
    }

    /**
     * Declares the winner.
     * @param player
     */

    static won(player){
        alert(player + ", you won!")
    }

    /**
     * Claims a tile at the given location.
     * @param location
     * @returns {*}
     */

    claimTile(location){
        let inProgress = true;
        for(let key in this.winMethods){
            if(this.winMethods.hasOwnProperty(key)){
                let result = this.winMethods[key].claim(this.activePlayer, location);
                inProgress = inProgress && !result;
            }
        }
        if(inProgress === false){
            return this.won(this.activePlayer);
        }

        this.turnOver();
    }

    /**
     *  Ends the turn for the activePlayer.
     */

    turnOver(){
        if(this.activePlayer === this.playerOne){
            this.activePlayer = this.playerTwo;
            return
        }

        this.activePlayer = this.playerOne;
    }
}
