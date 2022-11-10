import Player from "./player"

class Room {
    player_list: Player[] = [];

    constructor(new_player: Player){
        this.player_list.push(new_player);
    }

}

export default Room;