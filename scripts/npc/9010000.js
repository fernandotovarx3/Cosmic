var status = -1;
var currentVoteId = -1;
var unclaimedVotesCount = 0;
var mapleLeafId = 4001126;

function start() {
    var accountName = cm.getClient().getAccountName().toLowerCase(); 

    unclaimedVotesCount = getUnclaimedVotesCount(accountName);
    currentVoteId = getFirstUnclaimedVoteId(accountName);

    if (currentVoteId == -1 && !cm.haveItem(mapleLeafId, 1)) {
        cm.sendOk("You have no unclaimed votes and no Maple Leaves.");
        cm.dispose();
    } else {
        action(1, 0, 0);
    }
}

function action(mode, type, selection) {
    if (mode <= 0) { cm.dispose(); return; }
    status++;

    var chr = cm.getPlayer();
    var cashShop = chr.getCashShop(); 

    if (status == 0) {
        cm.sendSimple("Welcome! You have #b" + unclaimedVotesCount + " Unclaimed Votes#k.\r\n" +
            "What would you like to do?\r\n\r\n" +
            "#L0#Claim Vote Reward (1 Vote -> 25k NX & 500 HP/MP)#l\r\n" +
            "#L1#Trade 1 Maple Leaf for 10 HP/MP#l");
    } else if (status == 1) {
        if (selection == 0) { 
            if (currentVoteId == -1) {
                cm.sendOk("You have no unclaimed votes.");
                cm.dispose();
            } else {
                cashShop.gainCash(1, 25000); 
                chr.addMaxHP(500);
                chr.addMaxMP(500);
                markAsClaimed(currentVoteId);

                // --- NEW BROADCAST ATTEMPT ---
                try {
                    var msg = "[Vote] " + chr.getName() + " has claimed 25,000 NX and 500 HP/MP!";
                    // This method is built into the World Server for most Cosmic versions
                    cm.getClient().getWorldServer().broadcastMessage(6, msg);
                } catch (e) {
                    // Still silent if it fails, ensuring you get your rewards.
                }

                cm.sendOk("Success! You spent 1 Vote.\r\nReceived: 25,000 NX and 500 HP/MP.");
                cm.dispose();
            }
        } else if (selection == 1) {
            if (!cm.haveItem(mapleLeafId, 1)) {
                cm.sendOk("You don't have any Maple Leaves.");
                cm.dispose();
            } else {
                cm.gainItem(mapleLeafId, -1);
                chr.addMaxHP(10);
                chr.addMaxMP(10);
                cm.sendOk("Success! You traded 1 Maple Leaf for 10 HP/MP.");
                cm.dispose();
            }
        }
    }
}

// --- DATABASE FUNCTIONS (UNTOUCHED) ---

function getDbConn() {
    var props = new java.util.Properties();
    props.put("user", "root");
    props.put("password", "Tobedog12.12.");
    return java.sql.DriverManager.getConnection("jdbc:mysql://cosmic-db-1:3306/cosmic?allowPublicKeyRetrieval=true&useSSL=false", props);
}

function getUnclaimedVotesCount(name) {
    try {
        var conn = getDbConn();
        var stmt = conn.prepareStatement("SELECT COUNT(*) FROM vote_log WHERE LOWER(account_name) = ? AND last_claimed_time = 0");
        stmt.setString(1, name);
        var rs = stmt.executeQuery();
        var count = rs.next() ? rs.getInt(1) : 0;
        conn.close();
        return count;
    } catch (e) { return 0; }
}

function getFirstUnclaimedVoteId(name) {
    try {
        var conn = getDbConn();
        var stmt = conn.prepareStatement("SELECT id FROM vote_log WHERE LOWER(account_name) = ? AND last_claimed_time = 0 ORDER BY id ASC LIMIT 1");
        stmt.setString(1, name);
        var rs = stmt.executeQuery();
        var id = rs.next() ? rs.getInt("id") : -1;
        conn.close();
        return id;
    } catch (e) { return -1; }
}

function markAsClaimed(id) {
    try {
        var conn = getDbConn();
        var stmt = conn.prepareStatement("UPDATE vote_log SET last_claimed_time = 1 WHERE id = ?");
        stmt.setInt(1, id);
        stmt.executeUpdate();
        conn.close();
    } catch (e) {}
}
