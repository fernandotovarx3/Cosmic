/* Event: Zakum Battle
    Engine: GraalJS (JDK 21)
    Logic: Solo-compatible with standard Event methods
    Fix: Added afterSetup and monsterValue hooks to resolve NoSuchMethodException
*/

var entryMap = 280030000;
var exitMap = 211042400;

// REQUIRED: init() - Called when the server loads the script
function init() {
    em.setProperty("party", "Level 50 ~ 255 | 1 ~ 30 Players");
}

// REQUIRED: setup() - Called when the expedition starts
function setup(channel) {
    var eim = em.newInstance("Zakum" + channel);

    eim.setProperty("canJoin", "1");
    eim.setProperty("defeatedBoss", "0");

    // Start the 2-hour timer (120 minutes)
    eim.startEventTimer(120 * 60000);

    return eim;
}

// FIX: Called immediately after setup() to finalize instance parameters
function afterSetup(eim) {
    // Left empty to satisfy the engine hook
}

// REQUIRED: playerEntry() - Warps the player into the boss map
function playerEntry(eim, player) {
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
}

// FIX: Determines event value/EXP of killed mobs. Stops the "monsterValue" log spam.
function monsterValue(eim, mobId) {
    return 1;
}

// Boss Kill Logic with Discord
function monsterKilled(mob, eim) {
    if (mob.getId() == 8800002) { // Zakum Body
        eim.setIntProperty("defeatedBoss", 1);

        var players = eim.getPlayers();
        var leaderName = (players.size() > 0) ? players.get(0).getName() : "A brave soul";

        sendDiscordMessage("🌋 **" + leaderName + "** and their expedition party have just defeated **Zakum**! The Altar is silent once more.");

        eim.stopEventTimer();
        eim.setEventCleared();

        // Update the Gate in the previous map
        var gateMap = em.getChannelServer().getMapFactory().getMap(211042300);
        if (gateMap != null) {
            gateMap.getReactorById(2118002).forceHitReactor(0);
        }

        mob.getMap().broadcastZakumVictory();
    }
}

function sendDiscordMessage(text) {
    try {
        var webhookUrl = "https://discord.com/api/webhooks/1483184667325759532/ZAt_-h1wI7rAIX1kY6tza7AC62UDBmApjHA2lRzbvJC6AIS9YWgh-dz87W3GsxOX80gb";
        var payload = JSON.stringify({ content: text });

        var URI = Java.type('java.net.URI');
        var HttpClient = Java.type('java.net.http.HttpClient');
        var HttpRequest = Java.type('java.net.http.HttpRequest');
        var HttpResponse = Java.type('java.net.http.HttpResponse');

        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder()
            .uri(URI.create(webhookUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    } catch (e) {
        // Silent fail to console
    }
}

// --- STANDARD EVENT METHODS ---

function scheduledTimeout(eim) {
    end(eim);
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 0);
}

function playerDead(eim, player) {}
function playerDisconnected(eim, player) {
    eim.unregisterPlayer(player);
}
function leftParty(eim, player) {}
function disbandParty(eim) {}
function allMonstersDead(eim) {}
function changedMap(eim, player, mapid) {
    if (mapid != entryMap) {
        eim.unregisterPlayer(player);
    }
}

function end(eim) {
    var players = eim.getPlayers();
    for (var i = 0; i < players.size(); i++) {
        playerExit(eim, players.get(i));
    }
    eim.dispose();
}

function clearPQ(eim) {
    end(eim);
}

function dispose(eim) {}
function cancelSchedule() {}
