const DB_ROOT = 'v4_'; 
let uid = null;
let nickname = "";
let vrgk = 0;
let skrepki = 0;
let exp = 0; 
let cur_energy = 1000, max_energy = 1000, energy_regen = 3;
let tap_power = 1;
let profit_ph = 0;
let inv = {}; 
let eq_sword = null, eq_armor = null, eq_offhand = null;
let rank_name = "БРОНЗА I";

// Карта Анархии
let world_map = {};
let map_x = 0, map_z = 0;
let is_in_anarchy = false;

// PvP
let target_uid = null;
let pvp_target_name = "";
let pvp_target_hp = 20;
let pvp_combo = 0;
let combat_timer = 0;
let my_hp = 20;

// Твоя база Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBQuKaUkor9AiiP5QsqHsrJMGebh8EUK0",
  authDomain: "vorgster-kombat-a1100.firebaseapp.com",
  databaseURL: "https://vorgster-kombat-a1100-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vorgster-kombat-a1100",
  storageBucket: "vorgster-kombat-a1100.firebasestorage.app",
  messagingSenderId: "1070503708882",
  appId: "1:1070503708882:web:66bfab9dbab363f2ee050b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==========================================
// ИСПРАВЛЕННАЯ АВТОРИЗАЦИЯ (ПРЯМО ИЗ БАЗЫ)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    let saved_nick = localStorage.getItem('vorg_nick');
    let saved_pin = localStorage.getItem('vorg_pin');
    
    if (saved_nick && saved_pin) {
        document.getElementById('auth-nick').value = saved_nick;
        document.getElementById('auth-pin').value = saved_pin;
        auth_player(); // Пробуем авто-вход
    } else {
        document.getElementById('auth-modal').style.display = 'flex';
    }
});

function auth_player() {
    let nick = document.getElementById('auth-nick').value.trim();
    let pin = document.getElementById('auth-pin').value.trim();
    if(nick.length < 3 || pin.length !== 4) return alert("Ник от 3 букв, пин-код ровно 4 цифры!");
    
    // Лезем в твою старую базу данных напрямую
    db.ref(DB_ROOT + 'users/' + nick).once('value', snap => {
        let p = snap.val();
        if (p) {
            // Аккаунт существует, сверяем ПИН-КОД
            if (p.pin === pin || p.pin == pin) {
                uid = nick; // У тебя uid и ник совпадают
                localStorage.setItem('vorg_nick', nick);
                localStorage.setItem('vorg_pin', pin);
                load_player_data();
            } else {
                alert("Неверный пин-код!");
            }
        } else {
            // Регистрация нового аккаунта
            db.ref(DB_ROOT + 'users/' + nick).set({
                nickname: nick,
                pin: pin,
                vrgk: 1000, 
                skrepki: 0, 
                exp: 0, 
                inv: { iron: 0, diamond: 0, lapis: 0 }
            }).then(() => {
                uid = nick;
                localStorage.setItem('vorg_nick', nick);
                localStorage.setItem('vorg_pin', pin);
                load_player_data();
            });
        }
    });
}
// ==========================================

function load_player_data() {
    document.getElementById('auth-modal').style.display = 'none';
    db.ref(DB_ROOT + 'users/' + uid).on('value', snap => {
        let p = snap.val();
        if(!p) return;
        
        nickname = p.nickname;
        vrgk = p.vrgk || 0;
        skrepki = p.skrepki || 0;
        exp = p.exp || 0;
        inv = p.inv || {};
        eq_sword = p.eq_sword || null;
        eq_armor = p.eq_armor || null;
        eq_offhand = p.eq_offhand || null;
        
        // ВОЗВРАТ СКРЕПОК ЗА СТАРЫЕ ЧАРЫ
        if (p.enchants) {
            let refund = 0;
            if(p.enchants.sharpness) refund += p.enchants.sharpness * 20; 
            if(p.enchants.protection) refund += p.enchants.protection * 20;
            if(p.enchants.vampirism) refund += p.enchants.vampirism * 50;
            if(p.enchants.fire) refund += p.enchants.fire * 30;
            
            if (refund > 0) {
                skrepki += refund;
                db.ref(DB_ROOT + 'users/' + uid + '/enchants').remove();
                save_data();
                setTimeout(() => {
                    alert(`🔥 ОБНОВЛЕНИЕ ЧАР!\nСтарая система удалена. За твои чары возвращено ${refund} 📎 скрепок!\nТеперь чарить вещи нужно через Стол Зачарований за Опыт и Лазурит.`);
                }, 2000);
            }
        }

        upd_ui();
        render_inventory();
    });
    
    setInterval(game_tick, 1000);
    setInterval(anarchy_tick, 200); 
}

function save_data() {
    // Используем update, чтобы не затереть пароль (pin)
    db.ref(DB_ROOT + 'users/' + uid).update({
        vrgk: vrgk, skrepki: skrepki, exp: exp, inv: inv, 
        eq_sword: eq_sword, eq_armor: eq_armor, eq_offhand: eq_offhand
    });
}

function upd_ui() {
    let el_vrgk = document.getElementById('vrgk-balance');
    if(el_vrgk) el_vrgk.innerText = Math.floor(vrgk).toLocaleString();
    let el_sk = document.getElementById('skrepki-val');
    if(el_sk) el_sk.innerText = skrepki;
    let el_exp = document.getElementById('exp-val');
    if(el_exp) el_exp.innerText = exp;
    let el_ec = document.getElementById('energy-current');
    if(el_ec) el_ec.innerText = Math.floor(cur_energy);
    let el_em = document.getElementById('energy-max');
    if(el_em) el_em.innerText = max_energy;
    let el_ef = document.getElementById('energy-fill');
    if(el_ef) el_ef.style.width = (cur_energy/max_energy*100)+'%';
    let el_cn = document.getElementById('current-nick');
    if(el_cn) el_cn.innerText = "Твой ник: " + nickname;
}

window.sw_tab = function(tabid, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`tab-${tabid}`).classList.add('active');
    el.classList.add('active');
    is_in_anarchy = (tabid === 'anarchy');
    if (is_in_anarchy) load_map_chunk();
}

// ---------------- ТАП ----------------
let tapArea = document.getElementById('tap-area');
if(tapArea) {
    tapArea.addEventListener('touchstart', e => {
        e.preventDefault();
        for(let i=0; i<e.changedTouches.length; i++) do_tap();
    }, {passive:false});
}

function do_tap() {
    if(cur_energy >= tap_power) {
        cur_energy -= tap_power;
        vrgk += tap_power;
        upd_ui();
        if(Math.random() < 0.05) save_data(); 
    }
}

function game_tick() {
    if (cur_energy < max_energy) {
        cur_energy += energy_regen;
        if(cur_energy > max_energy) cur_energy = max_energy;
    }
    upd_ui();
}

window.craft = function() {
    if (vrgk >= 900000) { vrgk -= 900000; skrepki++; save_data(); upd_ui(); }
    else alert("Нужно 900к воргиков!");
}

window.uncraft = function() {
    if (skrepki >= 1) { skrepki--; vrgk += 900000; save_data(); upd_ui(); alert("Ты разобрал 1 скрепку на 900 000 🪙"); }
    else alert("У тебя нет скрепок!");
}

// ---------------- ИНВЕНТАРЬ И ЧАРЫ ----------------
function get_item_name(key, obj = null) {
    let n = key;
    if(key === 'iron') n = "Жел. руда 🪨";
    if(key === 'lapis') n = "Лазурит 🔷";
    if(key === 'diamond') n = "Алмаз 💎";
    if(key === 'ingot_iron') n = "Жел. слиток 🪙";
    if(key === 'sword_iron') n = "Жел. меч 🗡️";
    if(key === 'armor_iron') n = "Жел. сет 🛡️";
    if(key === 'sword_diamond') n = "Алм. меч 🗡️";
    if(key === 'armor_diamond') n = "Алм. сет 🛡️";
    
    if (key.startsWith('ench_') && obj) {
        let base = get_item_name(obj.type);
        let e = [];
        if(obj.ench.sharpness) e.push("Острота " + obj.ench.sharpness);
        if(obj.ench.fire) e.push("Огонь " + obj.ench.fire);
        if(obj.ench.protection) e.push("Защита " + obj.ench.protection);
        return `${base} [${e.join(', ')}]`;
    }
    return n;
}

window.render_inventory = function() {
    let div = document.getElementById('inv-container');
    if(!div) return;
    div.innerHTML = '';
    
    let uoi = document.getElementById('ui-ore-iron');
    if(uoi) {
        uoi.innerText = inv['iron'] || 0;
        document.getElementById('ui-ingot-iron').innerText = inv['ingot_iron'] || 0;
        document.getElementById('ui-gem-diamond').innerText = inv['diamond'] || 0;
    }
    
    for (let key in inv) {
        if (inv[key] <= 0 && !key.startsWith('ench_')) continue;
        
        let countText = key.startsWith('ench_') ? '1 шт' : `${inv[key]} шт`;
        let isEq = (eq_sword === key || eq_armor === key || eq_offhand === key);
        let border = isEq ? 'border-color:#0f0; background:#131;' : '';
        let btnStr = `<button class="buy-btn" style="width:100%; font-size:10px; margin-top:5px;" onclick="pvp_equip('${key}')">${isEq ? 'СНЯТЬ' : 'НАДЕТЬ'}</button>`;
        
        let name = key.startsWith('ench_') ? get_item_name(key, inv[key]) : get_item_name(key);
        if (['iron', 'diamond', 'lapis', 'ingot_iron'].includes(key)) btnStr = ''; 
        
        div.innerHTML += `
            <div class="inv-item" style="${border}">
                <div class="inv-item-name" style="font-size:10px;">${name}</div>
                <div style="font-size:14px; font-weight:bold; color:#d4af37;">${countText}</div>
                ${btnStr}
            </div>
        `;
    }
}

window.pvp_equip = function(key) {
    let type = key.startsWith('ench_') ? inv[key].type : key;
    if (type.includes('sword')) { eq_sword = (eq_sword === key) ? null : key; }
    else if (type.includes('armor')) { eq_armor = (eq_armor === key) ? null : key; }
    else if (type.includes('sphere') || type.includes('talisman')) { eq_offhand = (eq_offhand === key) ? null : key; }
    save_data();
    render_inventory();
}

window.open_enchant_modal = function() {
    let el = document.getElementById('enchant-modal');
    if(!el) return;
    el.style.display = 'flex';
    document.getElementById('ui-ench-exp').innerText = exp;
    document.getElementById('ui-ench-lapis').innerText = inv['lapis'] || 0;
    
    let sel = document.getElementById('ench-item-select');
    sel.innerHTML = '<option value="">-- Выбери предмет из рюкзака --</option>';
    
    let enchantables = ['sword_iron', 'armor_iron', 'sword_diamond', 'armor_diamond'];
    for(let key in inv) {
        if (enchantables.includes(key) && inv[key] > 0) {
            sel.innerHTML += `<option value="${key}">${get_item_name(key)} (Обычный)</option>`;
        } else if (key.startsWith('ench_')) {
            sel.innerHTML += `<option value="${key}">${get_item_name(key, inv[key])}</option>`;
        }
    }
    document.getElementById('ench-tiers').style.display = 'none';
}

window.update_enchant_ui = function() {
    document.getElementById('ench-tiers').style.display = document.getElementById('ench-item-select').value ? 'flex' : 'none';
    document.getElementById('ench-result').innerText = '';
}

window.roll_enchant = function(tier) {
    let selKey = document.getElementById('ench-item-select').value;
    if(!selKey) return;
    
    let costLapis = tier === 1 ? 1 : (tier === 2 ? 3 : 5);
    let costExp = tier === 1 ? 100 : (tier === 2 ? 300 : 1000);
    
    if((inv['lapis'] || 0) < costLapis) return alert("Не хватает Лазурита!");
    if(exp < costExp) return alert("Не хватает Опыта!");
    
    inv['lapis'] -= costLapis;
    exp -= costExp;
    
    let baseType = selKey.startsWith('ench_') ? inv[selKey].type : selKey;
    
    if(selKey.startsWith('ench_')) {
        if(eq_sword === selKey) eq_sword = null;
        if(eq_armor === selKey) eq_armor = null;
        delete inv[selKey];
    } else {
        inv[selKey]--;
    }
    
    let newEnch = {};
    if (baseType.includes('sword')) {
        newEnch.sharpness = tier + (Math.random()>0.5 ? 1 : 0);
        if(tier >= 2 && Math.random() > 0.4) newEnch.fire = 1 + (tier===3?1:0); 
    } else if (baseType.includes('armor')) {
        newEnch.protection = tier + (Math.random()>0.5 ? 1 : 0);
    }
    
    let newUid = 'ench_' + Date.now() + Math.floor(Math.random()*1000);
    inv[newUid] = { type: baseType, ench: newEnch };
    
    save_data();
    open_enchant_modal(); 
    document.getElementById('ench-result').innerText = `🎉 УСПЕШНО! Получено:\n${get_item_name(newUid, inv[newUid])}`;
}

// ---------------- КРАФТ ----------------
window.open_craft_modal = function() {
    render_inventory();
    let el = document.getElementById('craft-modal');
    if(el) el.style.display = 'flex';
}

window.smelt = function(type) {
    if(type === 'iron' && (inv['iron'] || 0) > 0) {
        inv['iron']--;
        inv['ingot_iron'] = (inv['ingot_iron'] || 0) + 1;
        save_data(); render_inventory();
    }
}

window.craft_item = function(item, cost) {
    let res = item.includes('diamond') ? 'diamond' : 'ingot_iron';
    if ((inv[res] || 0) >= cost) {
        inv[res] -= cost;
        inv[item] = (inv[item] || 0) + 1;
        save_data(); render_inventory(); alert("Успешно скрафчено!");
    } else alert("Не хватает ресурсов!");
}

// ---------------- АНАРХИЯ ----------------
let joyZone = document.getElementById('joystick-zone');
let joyKnob = document.getElementById('joystick-knob');
let jx = 0, jy = 0, isJoy = false;
let jRect = null;

if(joyZone) {
    joyZone.addEventListener('touchstart', e => { e.preventDefault(); isJoy = true; jRect = joyZone.getBoundingClientRect(); handleJoy(e.touches[0]); }, {passive:false});
    joyZone.addEventListener('touchmove', e => { e.preventDefault(); if(isJoy) handleJoy(e.touches[0]); }, {passive:false});
    joyZone.addEventListener('touchend', e => { e.preventDefault(); isJoy = false; jx=0; jy=0; joyKnob.style.transform = `translate(0px, 0px)`; }, {passive:false});
}

function handleJoy(t) {
    let dx = t.clientX - (jRect.left + 50); let dy = t.clientY - (jRect.top + 50);
    let max = 40; let dist = Math.sqrt(dx*dx + dy*dy);
    if(dist > max) { dx = (dx/dist)*max; dy = (dy/dist)*max; }
    joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    jx = dx/max; jy = dy/max;
}

function load_map_chunk() {
    let cx = Math.floor(map_x / 10); let cz = Math.floor(map_z / 10);
    db.ref(DB_ROOT + `map/${cx}_${cz}`).once('value', snap => {
        let chunk = snap.val() || generate_chunk(cx, cz);
        world_map = Object.assign(world_map, chunk);
    });
}

function generate_chunk(cx, cz) {
    let chunk = {};
    for(let i=0; i<3; i++) {
        let rx = cx*10 + Math.floor(Math.random()*10);
        let rz = cz*10 + Math.floor(Math.random()*10);
        let r = Math.random();
        let type = 'iron';
        if (r < 0.1) type = 'diamond';
        else if (r < 0.25) type = 'lapis'; 
        chunk[`${rx}_${rz}`] = { type: type, hp: (type==='iron'?3:5) };
    }
    db.ref(DB_ROOT + `map/${cx}_${cz}`).set(chunk);
    return chunk;
}

function anarchy_tick() {
    if(!is_in_anarchy) return;
    
    if(jx !== 0 || jy !== 0) {
        map_x += jx * 1.2;
        map_z += jy * 1.2;
        document.getElementById('map-x').innerText = Math.floor(map_x);
        document.getElementById('map-z').innerText = Math.floor(map_z);
        if (Math.random() < 0.1) load_map_chunk(); 
        
        db.ref(DB_ROOT + 'world_players/' + uid).set({ x: map_x, z: map_z, name: nickname, hp: my_hp });
    }
    
    draw_topdown_map();
    check_pvp();
    
    let clb = document.getElementById('combat-log-badge');
    let ccb = document.getElementById('combat-combo-badge');
    let th = document.getElementById('target-hud');
    
    if(combat_timer > 0) {
        combat_timer--;
        if(clb) clb.style.display = 'block';
        let clt = document.getElementById('combat-log-timer');
        if(clt) clt.innerText = combat_timer;
    } else {
        if(clb) clb.style.display = 'none';
        pvp_combo = 0;
        if(ccb) ccb.style.display = 'none';
        target_uid = null;
        if(th) th.style.display = 'none';
    }
}

function draw_topdown_map() {
    let cvs = document.getElementById('rtp-canvas');
    if(!cvs) return;
    let ctx = cvs.getContext('2d');
    let w = cvs.parentElement.clientWidth; let h = cvs.parentElement.clientHeight;
    cvs.width = w; cvs.height = h;
    
    ctx.fillStyle = '#2d5a27'; ctx.fillRect(0,0,w,h);
    
    let cx = w/2; let cy = h/2;
    let scale = 20; 

    let on_ore = false;
    let current_ore_key = null;

    for(let key in world_map) {
        let coords = key.split('_');
        let bx = parseInt(coords[0]); let bz = parseInt(coords[1]);
        
        let scrX = cx + (bx - map_x)*scale;
        let scrY = cy + (bz - map_z)*scale;
        
        if(scrX > -50 && scrX < w+50 && scrY > -50 && scrY < h+50) {
            let ore = world_map[key];
            if(!ore) continue;
            
            if(ore.type === 'iron') ctx.fillStyle = '#bfae99';
            else if(ore.type === 'diamond') ctx.fillStyle = '#00ffff';
            else if(ore.type === 'lapis') ctx.fillStyle = '#1e90ff';
            
            ctx.fillRect(scrX-10, scrY-10, 20, 20);
            
            if(Math.hypot(bx - map_x, bz - map_z) < 1.5) {
                on_ore = true; current_ore_key = key;
                ctx.strokeStyle = '#fff'; ctx.lineWidth=2; ctx.strokeRect(scrX-12, scrY-12, 24, 24);
            }
        }
    }
    
    let btnMine = document.getElementById('mine-btn');
    if(btnMine) {
        if(on_ore) {
            btnMine.style.display = 'flex';
            btnMine.onclick = () => mine_ore_action(current_ore_key);
        } else {
            btnMine.style.display = 'none';
        }
    }

    ctx.fillStyle = combat_timer > 0 ? '#f00' : '#fff';
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font="10px Arial"; ctx.textAlign="center"; ctx.fillText(nickname, cx, cy-12);
}

function mine_ore_action(key) {
    let ore = world_map[key];
    if(!ore) return;
    ore.hp--;
    
    let mw = document.getElementById('map-wrapper');
    if(mw) {
        mw.style.transform = `translate(${Math.random()*4-2}px, ${Math.random()*4-2}px)`;
        setTimeout(() => mw.style.transform = 'none', 50);
    }
    
    if (ore.hp <= 0) {
        inv[ore.type] = (inv[ore.type] || 0) + 1;
        let xpGained = (ore.type === 'iron' ? 10 : (ore.type === 'lapis' ? 30 : 50));
        exp += xpGained;
        
        delete world_map[key];
        db.ref(DB_ROOT + `map/${key.split('_')[0]}_0`).update({ [key]: null }); 
        save_data();
        
        let pop = document.createElement('div');
        pop.innerText = `+${xpGained} XP`;
        pop.style.cssText = `position:absolute; top:40%; left:50%; color:#0f0; font-weight:bold; font-size:20px; z-index:100; pointer-events:none; animation: floatUp 1s ease-out forwards;`;
        if(mw) mw.appendChild(pop);
        setTimeout(()=>pop.remove(), 1000);
    }
}

// ---------------- БОЁВКА ----------------
function get_my_damage() {
    let dmg = 1; 
    let fire = 0;
    
    if (eq_sword) {
        let base = eq_sword.startsWith('ench_') ? inv[eq_sword].type : eq_sword;
        let enchObj = eq_sword.startsWith('ench_') ? inv[eq_sword].ench : {};
        
        if (base === 'sword_iron') dmg = 4;
        if (base === 'sword_diamond') dmg = 7;
        
        if (enchObj.sharpness) dmg += enchObj.sharpness * 1.5;
        if (enchObj.fire) fire = enchObj.fire;
    }
    
    if (pvp_combo > 3) dmg += (pvp_combo * 0.2); 
    return { dmg: dmg, fire: fire };
}

window.map_attack = function() {
    if(!target_uid) return;
    
    let stats = get_my_damage();
    let final_dmg = stats.dmg;
    
    db.ref(DB_ROOT + 'world_players/' + target_uid).once('value', snap => {
        let enemy = snap.val();
        if(!enemy) return;
        
        let newHp = enemy.hp - final_dmg;
        db.ref(DB_ROOT + 'world_players/' + target_uid).update({ hp: newHp });
        
        pvp_combo++;
        let ccb = document.getElementById('combat-combo-badge');
        if(ccb) {
            ccb.style.display = 'block';
            document.getElementById('combat-combo-count').innerText = pvp_combo;
            document.getElementById('combat-combo-boost').innerText = "+" + Math.floor(pvp_combo*10) + "%";
        }
        
        combat_timer = 15;
        let tht = document.getElementById('target-hp-text');
        let thf = document.getElementById('target-hp-fill');
        if(tht) tht.innerText = Math.floor(newHp) + "/20";
        if(thf) thf.style.width = Math.max(0, (newHp/20)*100) + "%";
        
        if (newHp <= 0) {
            alert("Ты убил " + pvp_target_name + "!");
            exp += 200; 
            save_data();
            target_uid = null;
            let th = document.getElementById('target-hud');
            if(th) th.style.display = 'none';
        }
    });
}

function check_pvp() {
    db.ref(DB_ROOT + 'world_players').once('value', snap => {
        let players = snap.val();
        let closest = null; let min_dist = 6; 
        
        for(let id in players) {
            if(id === uid) continue;
            let p = players[id];
            let dist = Math.hypot(p.x - map_x, p.z - map_z);
            if(dist < min_dist) { min_dist = dist; closest = { id: id, name: p.name, hp: p.hp }; }
        }
        
        let th = document.getElementById('target-hud');
        if(closest) {
            if(target_uid !== closest.id) {
                target_uid = closest.id;
                pvp_target_name = closest.name;
                pvp_combo = 0;
            }
            if(th) th.style.display = 'block';
            let tn = document.getElementById('target-name');
            let tht = document.getElementById('target-hp-text');
            let thf = document.getElementById('target-hp-fill');
            if(tn) tn.innerText = pvp_target_name;
            if(tht) tht.innerText = Math.floor(closest.hp) + "/20";
            if(thf) thf.style.width = Math.max(0, (closest.hp/20)*100) + "%";
        }
    });
}

window.do_rtp = function() {
    if(combat_timer > 0) return alert("В БОЮ НЕЛЬЗЯ ТЕЛЕПОРТИРОВАТЬСЯ!");
    map_x = Math.floor(Math.random()*10000 - 5000);
    map_z = Math.floor(Math.random()*10000 - 5000);
    world_map = {}; 
    alert("Телепортация на X: " + map_x + " Z: " + map_z);
}
