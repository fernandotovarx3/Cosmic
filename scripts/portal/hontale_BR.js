function enter(pi) {
    var eim = pi.getPlayer().getEventInstance();
    if (eim != null) {
        var state = eim.getProperty("state");
        
        if (state == "1") { 
            // If first head is dead, go to Trail 2
            pi.warp(240060100, "sp");
            return true;
        } else if (state == "2") {
            // If second head is dead, go to the Main Cave
            pi.warp(240060200, "sp");
            return true;
        } else {
            pi.playerMessage(5, "You must defeat the head in this room before proceeding.");
            return false;
        }
    }
    pi.warp(240050400); // Send back to lobby if event lost
    return true;
}
