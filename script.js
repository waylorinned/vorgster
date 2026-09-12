// === ИНИЦИАЛИЗАЦИЯ FIREBASE ===
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

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ИГРОКА ===
let my_nick = localStorage.getItem('vorg_nick') || null;
let my_hp = 20;
let my_max_hp = 20;
let my_x = 0;
let my_z = 0;
let is_auth = false;

// === БОЕВЫЕ ПЕРЕМЕННЫЕ (АНАРХИЯ) ===
let in_combat = false;
let combat_timer = 0;
let combat_interval = null;

let combo_count = 0;
let last_hit_time = 0;
let sword_hits = 0; // Для Разящего клинка
let is_stunned = false; // Состояние оглушения
let current_target = null; // Ник врага, с которым бьёмся
let players_cache = {}; // Кэш игроков на карте

// === УПРАВЛЕНИЕ ВКЛАДКАМИ ===
function sw_tab(tab_id, btn) {
    if (in_combat && (tab_id !== 'anarchy')) {
        alert("Внимание! Ты в бою! Нельзя переключать вкладки!");
        return;
    }
    
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById('tab-' + tab_id).classList.add('active');
    if (btn) btn.classList.add('active');
    
    if (tab_id === 'anarchy' && is_auth) {
        init_canvas();
    }
}

// === АВТОРИЗАЦИЯ ===
function auth_player() {
    let nick = document.getElementById('auth-nick').value.trim();
    if (nick.length < 3) return alert("Ник от 3 символов");
    
    my_nick = nick;
    localStorage.setItem('vorg_nick', nick);
    document.getElementById('auth-modal').style.display = 'none';
    is_auth = true;

    // Подгрузка данных и проверка на лив с поля боя
    db.ref('users/' + my_nick).once('value', snap => {
        if (!snap.exists()) {
            // Регистрация
            db.ref('users/' + my_nick).set({ x: 0, z: 0, hp: 20, skrepki: 0 });
        } else {
            let data = snap.val();
            my_x = data.x || 0;
            my_z = data.z || 0;
            my_hp = data.hp || 20;
            
            // Наказание за лив во время комбат-лога
            if (data.died_offline) {
                alert("☠️ ТЫ ПОЗОРНО СБЕЖАЛ ИЗ БОЯ!\nТвои вещи были сброшены на карту, инвентарь пуст.");
                my_hp = 20;
                my_x = 0;
                my_z = 0;
                // Тут в будущем функция wipe_inventory()
                db.ref('users/' + my_nick).update({ died_offline: null, hp: 20, x: 0, z: 0 });
            }
        }
        setup_player_listeners();
        start_online_sync();
    });
}

window.onload = () => {
    if (!my_nick) {
        document.getElementById('auth-modal').style.display = 'flex';
    } else {
        auth_player(); // авто-вход
    }
};

// === CANVAS И КАРТА ===
const canvas = document.getElementById('rtp-canvas');
const ctx = canvas.getContext('2d');
let anim_id;

function init_canvas() {
    canvas.width = document.getElementById('map-wrapper').clientWidth;
    canvas.height = document.getElementById('map-wrapper').clientHeight;
    
    if (!anim_id) draw_map();
}

// Постоянный цикл отрисовки
function draw_map() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    // Сетка (Фон)
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for(let i = (cx - my_x) % 40; i < canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for(let i = (cy - my_z) % 40; i < canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

    // Безопасная зона (Спавн)
    let sx = cx - my_x - 100;
    let sy = cy - my_z - 100;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(sx, sy, 200, 200);
    ctx.fillRect(sx, sy, 200, 200);

    // Отрисовка других игроков
    for (let key in players_cache) {
        if (key === my_nick) continue;
        let p = players_cache[key];
        
        // Плавная интерполяция тут (для простоты рисуем сразу)
        let px = cx + (p.x - my_x);
        let pz = cy + (p.z - my_z);

        ctx.fillStyle = (current_target === key) ? '#f55' : '#aaa';
        ctx.fillRect(px - 10, pz - 10, 20, 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(key, px, pz - 15);
        
        // Полоска хп над игроком
        let hp_perc = Math.max(0, p.hp / 20);
        ctx.fillStyle = '#f00'; ctx.fillRect(px - 10, pz + 12, 20, 3);
        ctx.fillStyle = '#0f0'; ctx.fillRect(px - 10, pz + 12, 20 * hp_perc, 3);
    }

    // Отрисовка себя
    ctx.fillStyle = '#0ff';
    ctx.fillRect(cx - 10, cy - 10, 20, 20);

    document.getElementById('map-x').innerText = Math.round(my_x);
    document.getElementById('map-z').innerText = Math.round(my_z);

    anim_id = requestAnimationFrame(draw_map);
}

// === УПРАВЛЕНИЕ И СИНХРОНИЗАЦИЯ ===
let is_moving = false;
let move_dir = {x:0, z:0};

document.getElementById('joystick-zone').addEventListener('touchstart', (e) => { is_moving = true; update_joy(e); });
document.getElementById('joystick-zone').addEventListener('touchmove', (e) => { update_joy(e); });
document.getElementById('joystick-zone').addEventListener('touchend', () => { 
    is_moving = false; 
    document.getElementById('joystick-knob').style.transform = `translate(0px, 0px)`;
});

function update_joy(e) {
    let rect = document.getElementById('joystick-zone').getBoundingClientRect();
    let tx = e.touches[0].clientX - rect.left - 50;
    let ty = e.touches[0].clientY - rect.top - 50;
    let dist = Math.hypot(tx, ty);
    
    if (dist > 40) { tx = (tx/dist)*40; ty = (ty/dist)*40; }
    document.getElementById('joystick-knob').style.transform = `translate(${tx}px, ${ty}px)`;
    
    move_dir.x = tx / 40;
    move_dir.z = ty / 40;
}

// Синхронизация с сервером
function start_online_sync() {
    setInterval(() => {
        if (is_moving && !is_stunned) {
            let speed = 4; // Базовая скорость
            my_x += move_dir.x * speed;
            my_z += move_dir.z * speed;
            db.ref('users/' + my_nick).update({ x: my_x, z: my_z });
        }
    }, 50); // 20 TPS

    // Слушаем других игроков
    db.ref('users').on('value', snap => {
        players_cache = snap.val() || {};
        update_target_hud();
    });
}

// === СЛУШАТЕЛЬ ВХОДЯЩЕГО УРОНА ===
function setup_player_listeners() {
    db.ref('users/' + my_nick + '/dmg_queue').on('child_added', snap => {
        let dmg_data = snap.val();
        snap.ref.remove(); // Очищаем удар из очереди
        
        process_incoming_damage(dmg_data);
    });
}

// === ЛОГИКА БОЯ (АТАКА) ===
function map_attack() {
    if (is_stunned) return; // Не можем бить в стане
    
    // Проверка мирной зоны (-100 до 100)
    if (Math.abs(my_x) <= 100 && Math.abs(my_z) <= 100) {
        return alert("Ты на спавне (Мирная Зона). Тут нельзя драться!");
    }

    // Ищем врага в радиусе атаки (40px)
    let closest = null;
    let min_d = 45;

    for (let key in players_cache) {
        if (key === my_nick) continue;
        let p = players_cache[key];
        
        // Враг на спавне?
        if (Math.abs(p.x) <= 100 && Math.abs(p.z) <= 100) continue; 
        
        let d = Math.hypot(p.x - my_x, p.z - my_z);
        if (d < min_d) { min_d = d; closest = key; }
    }

    if (!closest) return; // Никого нет рядом
    
    current_target = closest;
    trigger_attack_logic();
}

function trigger_attack_logic() {
    let now = Date.now();
    let is_crit = false;
    let is_sweeping = false;

    // --- Логика Комбо ---
    if (now - last_hit_time <= 1200) {
        combo_count++;
    } else {
        combo_count = 1; // Сброс при долгой паузе
    }

    // Заглушки урона (потом привяжешь к get_best_weapon())
    let base_dmg = 7; // Алмазный меч
    let is_sword = true; // Считаем, что в руках меч

    // --- Разящий клинок (каждый 3-й удар мечом) ---
    if (is_sword) {
        sword_hits++;
        if (sword_hits >= 3) {
            is_sweeping = true;
            sword_hits = 0; 
            combo_count = 0; // Разящий клинок сбрасывает серию комбо
        }
    }

    // --- Крит (20% шанс) ---
    if (!is_sweeping && Math.random() <= 0.20) {
        is_crit = true;
    }

    // --- Итоговый урон ---
    let final_dmg = base_dmg;

    // Прибавка от комбо (с 3-го удара +20% за стак, макс +40%)
    if (!is_sweeping && combo_count >= 3) {
        let boost = Math.min((combo_count - 2) * 0.20, 0.40);
        final_dmg *= (1 + boost);
    }

    // Множитель крита
    if (is_crit) final_dmg *= 1.5;

    last_hit_time = now;
    
    // Обновляем UI Комбо
    update_combo_ui(is_sweeping);

    // Входим в комбат-лог
    set_combat_log();

    // Отправляем урон врагу
    db.ref('users/' + current_target + '/dmg_queue').push({
        dmg: final_dmg,
        attacker: my_nick,
        is_crit: is_crit,
        is_sweeping: is_sweeping,
        ts: now
    });

    // Визуальная отдача кнопки
    let btn = document.getElementById('map-btn-attack');
    btn.style.transform = 'scale(0.8)';
    setTimeout(() => btn.style.transform = 'scale(1)', 100);
}

// === ПОЛУЧЕНИЕ УРОНА И СТАН ===
function process_incoming_damage(data) {
    // 1. Броня (заглушка: Незеритка = 70% защиты)
    let armor_reduction = 0.70; 
    
    // 2. Разящий клинок срезает 20% брони
    if (data.is_sweeping) {
        armor_reduction -= 0.20; 
        console.log("Вам пробили броню разящим клинком!");
    }
    
    if (armor_reduction < 0) armor_reduction = 0;

    // 3. Вычет брони
    let actual_dmg = data.dmg * (1 - armor_reduction);
    if (actual_dmg < 0.5) actual_dmg = 0.5; // Мин. урон

    my_hp -= actual_dmg;
    
    // 4. Микро-стан на 0.35с (Knockback)
    is_stunned = true;
    setTimeout(() => { is_stunned = false; }, 350);

    // 5. Входим в комбат-лог и сбрасываем СВОЁ комбо
    set_combat_log();
    combo_count = 0;
    update_combo_ui(false);

    // 6. Тряска экрана (визуал получения урона)
    document.getElementById('map-wrapper').style.transform = 'translate(5px, 5px)';
    setTimeout(() => document.getElementById('map-wrapper').style.transform = 'none', 100);

    // 7. Проверка на смерть
    if (my_hp <= 0) {
        handle_death(data.attacker);
    } else {
        db.ref('users/' + my_nick).update({ hp: my_hp });
    }
}

// === КОМБАТ-ЛОГ (30 сек) ===
function set_combat_log() {
    combat_timer = 30;
    
    if (!in_combat) {
        in_combat = true;
        document.getElementById('combat-log-badge').style.display = 'block';
        
        // НАКАЗАНИЕ ЗА ЛИВ: вешаем триггер на сервер. Если пропадет коннект -> перс умирает
        db.ref('users/' + my_nick).onDisconnect().update({ died_offline: true, hp: 0 });
    }

    if (combat_interval) clearInterval(combat_interval);
    
    document.getElementById('combat-log-timer').innerText = combat_timer;
    combat_interval = setInterval(() => {
        combat_timer--;
        document.getElementById('combat-log-timer').innerText = combat_timer;
        
        if (combat_timer <= 0) {
            end_combat_log();
        }
    }, 1000);
}

function end_combat_log() {
    in_combat = false;
    clearInterval(combat_interval);
    document.getElementById('combat-log-badge').style.display = 'none';
    
    // Снимаем наказание за дисконнект
    db.ref('users/' + my_nick).onDisconnect().cancel();
}

// === СМЕРТЬ И ДРОП ===
function handle_death(killer) {
    end_combat_log();
    alert(`☠️ ТЕБЯ УБИЛ ИГРОК ${killer}!\nВесь лут выпал на карту.`);
    
    my_hp = 20;
    my_x = 0;
    my_z = 0;
    
    // Позже тут будет генерация Entity лута на карту
    // clear_inventory();
    
    db.ref('users/' + my_nick).update({ hp: 20, x: 0, z: 0 });
}

// === UI ОБНОВЛЕНИЯ ===
function update_combo_ui(was_sweeping) {
    let badge = document.getElementById('combat-combo-badge');
    
    if (combo_count >= 3 && !was_sweeping) {
        badge.style.display = 'block';
        let boost = Math.min((combo_count - 2) * 20, 40);
        document.getElementById('combat-combo-count').innerText = combo_count;
        document.getElementById('combat-combo-boost').innerText = `+${boost}%`;
    } else if (was_sweeping) {
        badge.style.display = 'block';
        document.getElementById('combat-combo-count').innerText = "КЛИНКОМ!";
        document.getElementById('combat-combo-boost').innerText = "Броня пробита";
        setTimeout(() => badge.style.display = 'none', 1000);
    } else {
        badge.style.display = 'none';
    }
}

function update_target_hud() {
    let hud = document.getElementById('target-hud');
    if (!current_target || !players_cache[current_target]) {
        hud.style.display = 'none';
        return;
    }
    
    let p = players_cache[current_target];
    hud.style.display = 'block';
    document.getElementById('target-name').innerText = current_target;
    
    let hp = Math.max(0, p.hp).toFixed(1);
    document.getElementById('target-hp-text').innerText = `${hp} HP`;
    
    let perc = (hp / 20) * 100;
    document.getElementById('target-hp-fill').style.width = `${Math.min(100, perc)}%`;
}

// Заглушки кнопок, чтобы не сыпались ошибки
function do_rtp() {
    if (in_combat) return alert("В бою нельзя использовать RTP!");
    my_x = (Math.random() - 0.5) * 2000;
    my_z = (Math.random() - 0.5) * 2000;
    db.ref('users/' + my_nick).update({ x: my_x, z: my_z });
}
function map_heal() {
    // В будущем привяжем к гэплам
    if (my_hp >= my_max_hp) return;
    my_hp = Math.min(my_max_hp, my_hp + 4);
    db.ref('users/' + my_nick).update({ hp: my_hp });
}
function pvp_swap_offhand() { console.log("Свап артефакта"); }
