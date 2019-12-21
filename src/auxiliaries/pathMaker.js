export default function pathSorter (array, player, destiny) {
    var newArray;
    
    // up-left
    if (player.x >= destiny.x && player.y >= destiny.y) {
        newArray = array.sort(function(a, b){
            return b.x - a.x;
            
        });
        newArray = newArray.sort(function(a,b){
            return b.y - a.y
        })
        return newArray;
    }
    // up-right
    if (player.x < destiny.x && player.y > destiny.y) {
        newArray = array.sort(function(a,b){
            return b.y - a.y
        })
        return newArray;
    }
    // down-left
    if (player.x > destiny.x && player.y < destiny.y) {
        newArray = array.sort(function(a, b){
            return b.x - a.x
            
        });
        
        return newArray;
    }
    // down-right
    if (player.x <= destiny.x && player.y <= destiny.y) {
        return array;
    }
};