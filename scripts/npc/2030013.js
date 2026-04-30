/* Adobis - Zakum Expedition Gatekeeper
    ID: 2030013
    Optimized for GraalJS (JDK 21)
*/

var status = 0;
var expedItem = 4001017;
var expedBoss = "Zakum";

// Using Java.type for GraalJS compatibility
var ExpeditionType = Java.type('server.expeditions.ExpeditionType');
var exped = ExpeditionType.ZAKUM;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }

    status++;

    var player = cm.getPlayer();
    var em = cm.getEventManager("ZakumBattle");
    var expedition = cm.getExpedition(exped);

    if (status == 0) {
        if (player.getLevel() < exped.getMinLevel() || player.getLevel() > exped.getMaxLevel()) {
            cm.sendOk("You do not meet the criteria to battle " + expedBoss + "!");
            cm.dispose();
        } else if (expedition == null) {
            cm.sendSimple("#e#b<Expedition: Zakum>\r\n#k#n" + em.getProperty("party") + "\r\n\r\nWould you like to assemble a team to take on #r" + expedBoss + "#k?\r\n#b#L1#Lets get this going!#l\r\n#L2#No, I'll wait...#l");
        } else if (expedition.isLeader(player)) {
            if (expedition.isInProgress()) {
                cm.sendOk("Your expedition is already in progress.");
                cm.dispose();
            } else {
                cm.sendSimple("What would you like to do?#b\r\n\r\n#L1#View current Expedition members#l\r\n#L2#Start the fight!#l\r\n#L3#Stop the expedition.#l");
            }
        } else if (expedition.isRegistering()) {
            if (expedition.contains(player)) {
                cm.sendOk("Please wait for #r" + expedition.getLeader().getName() + "#k to begin the expedition.");
            } else {
                cm.sendOk(expedition.addMember(player));
            }
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 1) { // Create Expedition
            if (!cm.haveItem(expedItem)) {
                cm.sendOk("You need an #b#t" + expedItem + "##k to lead this expedition!");
                cm.dispose();
            } else {
                var res = cm.createExpedition(exped);
                if (res == 0) {
                    cm.sendOk("The expedition has been created. Talk to me again to start the fight.");
                } else {
                    cm.sendOk("You cannot create an expedition right now.");
                }
                cm.dispose();
            }
        } else if (selection == 2) { // Start Fight
            // SOLO FIX: Removed size checks for testing/solo play
            if (em == null) {
                cm.sendOk("Event Manager 'ZakumBattle' not found.");
                cm.dispose();
            } else {
                // Ensure properties are set as strings for GraalJS
                em.setProperty("leader", player.getName());
                em.setProperty("channel", String(player.getClient().getChannel()));

                if (!em.startInstance(expedition)) {
                    cm.sendOk("Another expedition is already inside.");
                }
                cm.dispose();
            }
        } else if (selection == 3) { // Stop Expedition
            cm.endExpedition(expedition);
            cm.dispose();
        } else {
            cm.dispose();
        }
    }
}
