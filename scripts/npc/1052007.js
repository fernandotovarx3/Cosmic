var status = 0;
var ticketSelection = -1;
var text = "Here's the ticket reader.";
var hasTicket = false;
var em;

function start() {
    // Added Kerning Square as Selection 2
    cm.sendSimple("Pick your destination.\r\n#L0#Enter Construction Site#l\r\n#L1#New Leaf City#l\r\n#L2# #bKerning Square#k#l");
}

function action(mode, type, selection) {
    em = cm.getEventManager("Subway");

    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    } else {
        status++;
    }

    if (status == 1) {
        if (selection == 0) { // Construction Site
            if (cm.haveItem(4031036) || cm.haveItem(4031037) || cm.haveItem(4031038)) {
                text += " You will be brought in immediately. Which ticket you would like to use?#b";
                for (var i = 0; i < 3; i++) {
                    if (cm.haveItem(4031036 + i)) {
                        text += "\r\n#b#L" + (i + 1) + "##t" + (4031036 + i) + "#";
                    }
                }
                cm.sendSimple(text);
                hasTicket = true;
            } else {
                cm.sendOk("It seems as though you don't have a ticket!");
                cm.dispose();
            }
        } else if (selection == 1) { // New Leaf City
            if (!cm.haveItem(4031711) && cm.getPlayer().getMapId() == 103000100) {
                cm.sendOk("It seems you don't have a ticket! You can buy one from Bell.");
                cm.dispose();
                return;
            }
            if (em.getProperty("entry") == "true") {
                cm.sendYesNo("It looks like there's plenty of room for this ride. Please have your ticket ready so I can let you in. Do you want to get on this ride?");
            } else {
                cm.sendNext("We will begin boarding 1 minute before takeoff. Please be patient.");
                cm.dispose();
            }
        } else if (selection == 2) { // Kerning Square
            // Instant warp to Kerning Square
            cm.warp(103000310, 0); 
            cm.dispose();
        }
    } else if (status == 2) {
        if (hasTicket) {
            ticketSelection = selection;
            if (ticketSelection > -1) {
                cm.gainItem(4031035 + ticketSelection, -1);
                cm.warp(103000897 + (ticketSelection * 3), "st00");
                cm.dispose();
            }
        } else if (cm.haveItem(4031711)) {
            cm.gainItem(4031711, -1);
            cm.warp(600010004);
            cm.dispose();
        }
    }
}
