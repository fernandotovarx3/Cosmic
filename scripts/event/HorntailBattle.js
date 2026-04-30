var isPq = true;
var minPlayers = 1, maxPlayers = 30;
var minLevel = 100, maxLevel = 255;
var entryMap = 240060000;
var exitMap = 240050600;
var recruitMap = 240050400;
var clearMap = 240050600;
var minMapId = 240060000;
var maxMapId = 240060200;
var eventTime = 120; 
const maxLobbies = 1;

var webhookUrl = "https://discord.com/api/webhooks/1483184667325759532/ZAt_-h1wI7rAIX1kY6tza7AC62UDBmApjHA2lRzbvJC6AIS9YWgh-dz87W3GsxOX80gb";

function sendDiscordMessage(content) {
    try {
        var URL = Java.type("java.net.URL");
        var HttpURLConnection = Java.type("java.net.HttpURLConnection");
        var OutputStreamWriter = Java.type("java.io.OutputStreamWriter");
        var url = new URL(webhookUrl);
        var con = url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);
        var json = '{"content": "' + content + '"}';
        var out = new OutputStreamWriter(con.getOutputStream());
        out.write(json);
        out.flush();
        out.close();
        con.getResponseCode();
        con.disconnect();
    } catch (e) {
        java.lang.System.out.println("Discord Error: " + e);
    }
}

function init() {
    em.setProperty("party", "Solo-Ready");
    em.setProperty("state", "0");
}

function setup(channel) {
    var eim = em.newInstance("Horntail" + channel);
    eim.setProperty("canJoin", "1");
    eim.setProperty("state", "0");
    
    var LifeFactory = Java.type('server.life.LifeFactory');
    var Point = Java.type('java.awt.Point');
    
    // Trial 1
    var map1 = eim.getInstanceMap(240060000);
    map1.spawnMonsterOnGroundBelow(LifeFactory.getMonster(8810000), new Point(960, 120));
    
    // Trial 2
    var map2 = eim.getInstanceMap(240060100);
    map2.spawnMonsterOnGroundBelow(LifeFactory.getMonster(8810001), new Point(-400, 120));
    
    eim.startEventTimer(eventTime * 60000);
    return eim;
}

function afterSetup(eim) {}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
    if (eim.getProperty("leader") == null) {
        eim.setProperty("leader", player.getName());
    }
}

function monsterKilled(mob, eim) {
    var mobId = mob.getId();
    var players = eim.getPlayers();
    
    if (mobId == 8810000) {
        eim.setProperty("state", "1");
        for (var i = 0; i < players.size(); i++) {
            players.get(i).dropMessage(6, "The first head has fallen! Proceed through the portal.");
        }
    } else if (mobId == 8810001) {
        eim.setProperty("state", "2");
        for (var i = 0; i < players.size(); i++) {
            players.get(i).dropMessage(6, "The second head has fallen! The path to the main cave is open.");
        }
    } else if (mobId == 8810018) {
        for (var i = 0; i < players.size(); i++) {
            players.get(i).dropMessage(6, "Horntail has been defeated!");
        }
        sendDiscordMessage("🐉 **Horntail defeated by " + players.get(0).getName() + "**");
        eim.stopEventTimer();
        eim.setEventCleared();
    }
}

function changedMap(eim, player, mapid) {
    if (mapid < minMapId || mapid > maxMapId) {
        eim.unregisterPlayer(player);
        if (eim.getPlayers().size() < 1) eim.dispose();
    }
}

function scheduledTimeout(eim) { eim.dispose(); }
function playerExit(eim, player) { eim.unregisterPlayer(player); player.changeMap(exitMap, 0); }
function playerRevive(eim, player) { return true; }
function playerDisconnected(eim, player) { eim.unregisterPlayer(player); }
function monsterValue(eim, mobId) { return 1; }
function allMonstersDead(eim) {}
function cancelSchedule() {}
function dispose(eim) {}
function playerUnregistered(eim, player) {}
function leftParty(eim, player) {}
function disbandParty(eim) {}
function changedLeader(eim, leader) {}
function playerDead(eim, player) {}
