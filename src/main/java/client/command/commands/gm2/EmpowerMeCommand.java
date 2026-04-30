/*
    This file is part of the HeavenMS MapleStory Server, commands OdinMS-based
    Copyleft (L) 2016 - 2019 RonanLana

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
   @Author: Arthur L - Refactored command content into modules
*/
package client.command.commands.gm2;

import client.Character;
import client.Client;
import client.SkillFactory;
import client.command.Command;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class EmpowerMeCommand extends Command {
    private static final long COOLDOWN_MS = 1000;
    private static final Map<Integer, Long> lastUsed = new ConcurrentHashMap<>();

    {
        setDescription("Activate all useful buffs.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        
        long now = System.currentTimeMillis();
        long last = lastUsed.getOrDefault(player.getId(), 0L);
        if (now - last < COOLDOWN_MS) {
            player.dropMessage("Buff cooldown active. Wait " + ((COOLDOWN_MS - (now - last)) / 1000 + 1) + " seconds.");
            return;
        }
        lastUsed.put(player.getId(), now);
        
        final int[] array = {2311003, 2301004, 1301007, 4101004, 2001002, 1101007, 2301003, 5121009, 1111002, 4111001, 4211003, 4211005, 1321000, 2321004, 3121002};
        for (int i : array) {
            try {
                SkillFactory.getSkill(i).getEffect(SkillFactory.getSkill(i).getMaxLevel()).applyTo(player);
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                // Skip invalid skill IDs
            }
        }
    }
}
