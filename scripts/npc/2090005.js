/**
 Hak - Cabin <To Mu Lung>(200000141) / Mu Lung Temple(250000100) / Herb Town(251000000)
 Instant Warp Version for VengefulStory
 **/

var menu = ["Mu Lung", "Orbis", "Herb Town"];
var cost = [1500, 1500, 500];
var slct;
var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        cm.sendNext("OK. If you ever change your mind, please let me know.");
        cm.dispose();
        return;
    }

    status++;

    if (status == 0) {
        var display = "Hello there! I can navigate the skies to get you where you need to go instantly. Where would you like to head to?";
        
        // Dynamic menu based on current map
        if (cm.getMapId() == 200000141) { // At Orbis Station
            display += "\r\n#L0##bMu Lung (" + cost[0] + " mesos)#k#l";
        } else if (cm.getMapId() == 250000100) { // At Mu Lung
            display += "\r\n#L1##bOrbis (" + cost[1] + " mesos)#k#l";
            display += "\r\n#L2##bHerb Town (" + cost[2] + " mesos)#k#l";
        } else if (cm.getMapId() == 251000000) { // At Herb Town
            display += "\r\n#L0##bMu Lung (" + cost[2] + " mesos)#k#l";
        }
        cm.sendSimple(display);

    } else if (status == 1) {
        slct = selection;
        var destination = (slct == 0) ? "Mu Lung" : (slct == 1) ? "Orbis" : "Herb Town";
        var finalCost = (cm.getMapId() == 251000000) ? cost[2] : cost[slct];
        
        cm.sendYesNo("Will you move to #b" + destination + "#k now? If you have #b" + finalCost + " mesos#k, I'll take you there right now.");

    } else if (status == 2) {
        var finalCost = (cm.getMapId() == 251000000) ? cost[2] : cost[slct];

        if (cm.getMeso() < finalCost) {
            cm.sendNext("Are you sure you have enough mesos?");
            cm.dispose();
        } else {
            cm.gainMeso(-finalCost);
            
            // Warp Logic
            if (slct == 0) {
                cm.warp(250000100, 0); // To Mu Lung
            } else if (slct == 1) {
                cm.warp(200000100, 0); // To Orbis
            } else if (slct == 2) {
                cm.warp(251000000, 0); // To Herb Town
            }
            
            cm.dispose();
        }
    }
}
