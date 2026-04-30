package client.command.commands.gm1;

import client.Character;
import client.Client;
import client.command.Command;
import constants.id.NpcId;
import server.ItemInformationProvider;
import server.life.MonsterDropEntry;
import server.life.MonsterInformationProvider;
import tools.Pair;

import java.util.Iterator;
import java.util.Map;

public class WhatDropsFromCommand extends Command {
    {
        setDescription("Show what items drop from a mob.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        if (params.length < 1) {
            player.dropMessage(5, "Please do @whatdropsfrom <monster name>");
            return;
        }
        String monsterName = player.getLastCommandMessage();
        String output = "";
        int limit = 3;
        Iterator<Pair<Integer, String>> listIterator = MonsterInformationProvider.getMobsIDsFromName(monsterName).iterator();
        for (int i = 0; i < limit; i++) {
            if (listIterator.hasNext()) {
                Pair<Integer, String> data = listIterator.next();
                int mobId = data.getLeft();
                String mobName = data.getRight();
                output += mobName + " drops the following items:\r\n\r\n";
                for (MonsterDropEntry drop : MonsterInformationProvider.getInstance().retrieveDrop(mobId)) {
                    try {
                        String name = ItemInformationProvider.getInstance().getName(drop.itemId);
                        if (name == null || name.equals("null") || drop.chance == 0) {
                            continue;
                        }

                        // Auto-detect scroll success rate and append to name
                        Map<String, Integer> equipStats = ItemInformationProvider.getInstance().getEquipStats(drop.itemId);
                        if (equipStats != null && equipStats.containsKey("success")) {
                            int successRate = equipStats.get("success");
                            if (successRate > 0 && successRate < 100) {
                                name = successRate + "% " + name;
                            } else if (successRate == 100) {
                                name = "100% " + name;
                            }
                        }

                        float chance = Math.max(1000000 / drop.chance / (!MonsterInformationProvider.getInstance().isBoss(mobId) ? player.getDropRate() : player.getBossDropRate()), 1);
                        output += "- " + name + " (1/" + (int) chance + ")\r\n";
                    } catch (Exception ex) {
                        ex.printStackTrace();
                        continue;
                    }
                }
                output += "\r\n";
            }
        }

        c.getAbstractPlayerInteraction().npcTalk(NpcId.MAPLE_ADMINISTRATOR, output);
    }
}

