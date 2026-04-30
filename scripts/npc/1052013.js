/*
    NPC ID: 1052013
    NPC NAME: Computer
    Updated for Solo Entry by Gemini
*/

var status;
var pqArea;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.getMapId() != 193000000) {
            var eim = cm.getEventInstance();

            if (status == 0) {
                if (!eim.isEventCleared()) {
                    var couponsNeeded = eim.getIntProperty("couponsNeeded");

                    if (cm.isEventLeader()) {
                        if (cm.haveItem(4001007, couponsNeeded)) {
                            cm.sendNext("Your team collected all the needed coupons, good work!");
                            cm.gainItem(4001007, couponsNeeded);
                            eim.clearPQ();
                            cm.dispose();
                        } else {
                            cm.sendYesNo("Your team must collect #r" + couponsNeeded + "#k coupons to complete this instance. Talk to me when you have the right amount in hands... Or you want to #bquit now#k?");
                        }
                    } else {
                        cm.sendYesNo("Your team must collect #r" + couponsNeeded + "#k coupons to complete this instance. Let your leader talk to me... Or you want to #bquit now#k?");
                    }
                } else {
                    if (!eim.giveEventReward(cm.getPlayer())) {
                        cm.sendOk("Please make room on your ETC inventory to receive the prize.");
                        cm.dispose();
                    } else {
                        cm.warp(193000000);
                        cm.dispose();
                    }
                }
            } else if (status == 1) {
                cm.warp(193000000);
                cm.dispose();
            }
        } else {
            var levels = ["#m190000000#", "#m191000000#", "#m192000000#", "#m195000000#", "#m196000000#", "#m197000000#"];
            
            if (status == 0) {
                var sendStr = "Premium Road is a place for grinding EXP and erasers. Select the area you are willing to face:\r\n\r\n#b";
                for (var i = 0; i < 6; i++) {
                    sendStr += "#L" + i + "#" + levels[i] + "#l\r\n";
                }
                cm.sendSimple(sendStr);
            } else if (status == 1) {
                pqArea = selection + 1;
                em = cm.getEventManager("CafePQ_" + pqArea);

                if (em == null) {
                    cm.sendOk("The CafePQ_" + pqArea + " has encountered an error.");
                    cm.dispose();
                    return;
                }

                cm.sendSimple("#e#b<Party Quest: Premium Road - " + levels[selection] + ">\r\n#k#n" + em.getProperty("party") + "\r\n\r\n#L0#I want to participate in the party quest.\r\n#L1#I would like to " + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "disable" : "enable") + " Party Search.\r\n#L2#I would like to hear more details.");
            } else if (status == 2) { // FIXED: Corrected status flow
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("You can participate in the party quest only if you are in a party.");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("Your party leader must talk to me to start this party quest.");
                        cm.dispose();
                    } else {
                        // Allow solo entry if party size is at least 1
                        var partySize = cm.getParty().getMembers().size();
                        
                        if (partySize < 1) {
                            cm.sendOk("You must be in a party to enter.");
                            cm.dispose();
                            return;
                        }

                        var eli = em.getEligibleParty(cm.getParty());

                        // Check if at least 1 member (you) is eligible
                        if (eli != null && eli.length >= 1) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("Another party is already inside. Please try another channel.");
                            }
                        } else {
                            cm.sendOk("You do not meet the level requirements or are in the wrong map.");
                        }
                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("Your Party Search status is now: #b" + (psState ? "enabled" : "disabled") + "#k.");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<Party Quest: Premium Road>#k#n\r\nGrind coupons and exchange them for erasers!");
                    cm.dispose();
                }
            }
        }
    }
}
