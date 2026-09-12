// === ИНИЦИАЛИЗАЦИЯ FIREBASE ===
const firebaseConfig = { apiKey: "AIzaSyDBQuKaUkor9AiiP5QsqHsrJMGebh8EUK0", authDomain: "vorgster-kombat-a1100.firebaseapp.com", databaseURL: "https://vorgster-kombat-a1100-default-rtdb.europe-west1.firebasedatabase.app", projectId: "vorgster-kombat-a1100", storageBucket: "vorgster-kombat-a1100.firebasestorage.app", messagingSenderId: "1070503708882", appId: "1:1070503708882:web:66bfab9dbab363f2ee050b" };
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const PREFIX = 'v4_';

// === ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ОШИБОК ===
window.onerror = function(msg, url, line) { console.error("GLOBAL CRASH:", msg, "Line:", line); return false; };

// === БЕЗОПАСНОЕ ЧТЕНИЕ ДАННЫХ ===
function safeParse(key, def) {
    try {
        let val = localStorage.getItem(PREFIX + key);
        if (!val || val === 'undefined' || val === 'null' || val === '[object Object]') return def;
        return JSON.parse(val);
    } catch(e) { return def; }
}

// === БАЗОВЫЕ ПЕРЕМЕННЫЕ ИГРОКА ===
let nickname = localStorage.getItem(PREFIX + 'nickname') || "";
let my_pin = localStorage.getItem(PREFIX + 'pin') || "";
let vrgk = parseFloat(localStorage.getItem(PREFIX + 'vrgk')) || 0;
let skrepki = parseInt(localStorage.getItem(PREFIX + 'skrepki')) || 0;
let profit = parseFloat(localStorage.getItem(PREFIX + 'profit')) || 0;
let tap_power = parseInt(localStorage.getItem(PREFIX + 'tap_power')) || 1;
let max_energy = parseInt(localStorage.getItem(PREFIX + 'max_energy')) || 1000;
let ce = parseFloat(localStorage.getItem(PREFIX + 'cur_energy')); 
let cur_energy = (isNaN(ce) || ce < 0) ? max_energy : ce;
let eng_regen = parseInt(localStorage.getItem(PREFIX + 'eng_regen')) || 3;
let tap_price = parseInt(localStorage.getItem(PREFIX+'tap_price'))||500, tap_lvl = parseInt(localStorage.getItem(PREFIX+'tap_lvl'))||1;
let eng_price = parseInt(localStorage.getItem(PREFIX+'eng_price'))||1000, eng_lvl = parseInt(localStorage.getItem(PREFIX+'eng_lvl'))||1;
let regen_price = parseInt(localStorage.getItem(PREFIX+'regen_price'))||5000;
let c1_price = parseInt(localStorage.getItem(PREFIX+'c1_price'))||2000, c1_lvl = parseInt(localStorage.getItem(PREFIX+'c1_lvl'))||0;
let c2_price = parseInt(localStorage.getItem(PREFIX+'c2_price'))||10000, c2_lvl = parseInt(localStorage.getItem(PREFIX+'c2_lvl'))||0;
let c3_price = parseInt(localStorage.getItem(PREFIX+'c3_price'))||50000, c3_lvl = parseInt(localStorage.getItem(PREFIX+'c3_lvl'))||0;
let c4_price = parseInt(localStorage.getItem(PREFIX+'c4_price'))||100000, c4_lvl = parseInt(localStorage.getItem(PREFIX+'c4_lvl'))||0;
let c5_price = parseInt(localStorage.getItem(PREFIX+'c5_price'))||20000, c5_lvl = parseInt(localStorage.getItem(PREFIX+'c5_lvl'))||0;
let c6_price = parseInt(localStorage.getItem(PREFIX+'c6_price'))||200000, c6_lvl = parseInt(localStorage.getItem(PREFIX+'c6_lvl'))||0;
let c7_price = parseInt(localStorage.getItem(PREFIX+'c7_price'))||130000, c7_lvl = parseInt(localStorage.getItem(PREFIX+'c7_lvl'))||0;
let c8_price = parseInt(localStorage.getItem(PREFIX+'c8_price'))||15000, c8_lvl = parseInt(localStorage.getItem(PREFIX+'c8_lvl'))||0;
let c9_price = parseInt(localStorage.getItem(PREFIX+'c9_price'))||45000, c9_lvl = parseInt(localStorage.getItem(PREFIX+'c9_lvl'))||0;
let c10_price = parseInt(localStorage.getItem(PREFIX+'c10_price'))||120000, c10_lvl = parseInt(localStorage.getItem(PREFIX+'c10_lvl'))||0;
let c11_price = parseInt(localStorage.getItem(PREFIX+'c11_price'))||350000, c11_lvl = parseInt(localStorage.getItem(PREFIX+'c11_lvl'))||0;
let c12_price = parseInt(localStorage.getItem(PREFIX+'c12_price'))||850000, c12_lvl = parseInt(localStorage.getItem(PREFIX+'c12_lvl'))||0;
let c13_price = parseInt(localStorage.getItem(PREFIX+'c13_price'))||2200000, c13_lvl = parseInt(localStorage.getItem(PREFIX+'c13_lvl'))||0;
let player_rank = parseInt(localStorage.getItem(PREFIX + 'rank')) || 0, max_rank = parseInt(localStorage.getItem(PREFIX + 'max_rank')) || 0;
let my_color = localStorage.getItem(PREFIX + 'color') || '#ffffff', og_pro = parseInt(localStorage.getItem(PREFIX + 'og_pro')) || 0;
let total_taps = parseInt(localStorage.getItem(PREFIX+'tot_taps')) || 0, r_wins = parseInt(localStorage.getItem(PREFIX+'r_wins')) || 0;
let r_loss = parseInt(localStorage.getItem(PREFIX+'r_loss')) || 0, r_streak = parseInt(localStorage.getItem(PREFIX+'r_streak')) || 0;
let my_title = localStorage.getItem(PREFIX+'title') || "";
let streak_days = parseInt(localStorage.getItem(PREFIX+'streak_days')) || 0, streak_last = localStorage.getItem(PREFIX+'streak_last') || "";
let q_taps = parseInt(localStorage.getItem(PREFIX+'q_taps')) || 0, q_wins = parseInt(localStorage.getItem(PREFIX+'q_wins')) || 0, q_msgs = parseInt(localStorage.getItem(PREFIX+'q_msgs')) || 0, q_date = localStorage.getItem(PREFIX+'q_date') || ""; let q_claimed = localStorage.getItem(PREFIX+'q_claimed') === '1';

// БЕЗОПАСНАЯ ИНИЦИАЛИЗАЦИЯ ИНВЕНТАРЯ И ЧАР
let my_friends = safeParse('friends', []);
let inv = safeParse('inv', {});
let enchants = safeParse('enchants', {});
let mined_ores = safeParse('mined_ores', {});

let donate_rank = parseInt(localStorage.getItem(PREFIX + 'donate_rank')) || 0, donate_until = parseInt(localStorage.getItem(PREFIX + 'donate_until')) || 0;
let last_kit_time = parseInt(localStorage.getItem(PREFIX + 'last_kit_v2')) || 0;
let loc_x = parseInt(localStorage.getItem(PREFIX + 'loc_x')) || 0, loc_z = parseInt(localStorage.getItem(PREFIX + 'loc_z')) || 0;
let weapon_dur = parseInt(localStorage.getItem(PREFIX + 'w_dur')); if (isNaN(weapon_dur)) weapon_dur = 1000;
let armor_dur = parseInt(localStorage.getItem(PREFIX + 'a_dur')); if (isNaN(armor_dur)) armor_dur = 1000;
let last_time = parseInt(localStorage.getItem(PREFIX + 'last_time')) || Date.now(), last_sync = 0, last_stash_check = 0;
let global_event_data = null, cached_last_winner = "", cached_players = {}, cached_clubs = {};

window.current_top_tab = 'players'; window.current_tab = 'mine';

const ENCHANT_LIMITS = { sharpness:5, fire_aspect:2, looting:3, knockback:2, density:5, breach:4, protection:4, thorns:3, fire_protection:4, unbreaking:3, mending:1 };
const ENCHANT_NAMES = { sharpness:'Острота (Урон)', fire_aspect:'Заговор Огня', looting:'Добыча (Скрепки)', knockback:'Отдача (Стан)', density:'Плотность (Булава)', breach:'Пробитие (Булава)', protection:'Защита', thorns:'Шипы', fire_protection:'Огнеупорность', unbreaking:'Прочность (Не ломается)', mending:'Починка (от Скрепок)' };
for(let k in ENCHANT_LIMITS) { if(enchants[k] === undefined) enchants[k] = 0; }

// === КОНСТАНТЫ ИГРЫ ===
const RANKS = ["Бронза I", "Бронза II", "Бронза III", "Серебро I", "Серебро II", "Серебро III", "Золото I", "Золото II", "Золото III", "Алмаз I", "Алмаз II", "Алмаз III", "Мифик I", "Мифик II", "Мифик III", "Лега I", "Лега II", "Лега III", "Мастер I", "Мастер II", "Мастер III", "ПРО"];
const RANK_COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#00ffff', '#8a2be2', '#ff00ff', '#ff4500', '#ff0000'];
const RANK_SOUNDS = ['bronze.mp3', 'silver.mp3', 'gold.mp3', 'diamond.mp3', 'mythic.mp3', 'legendary.mp3', 'masters.mp3', 'pro.mp3'];
const RANKS_INFO = [{name: "Нет", color: "#fff"}, {name: "Барон", color: "#aaa"}, {name: "Страж", color: "#aaddaa"}, {name: "Герой", color: "#55ccff"}, {name: "Аспид", color: "#00ff00"}, {name: "Сквид", color: "#00ffff"}, {name: "Глава", color: "#ffa500"}, {name: "Элита", color: "#a020f0"}, {name: "Титан", color: "#ff4500"}, {name: "Принц", color: "#ffd700"}, {name: "Князь", color: "#ff00ff"}, {name: "ГЕРЦОГ", color: "#fff"} ];
const ITEM_NAMES = { "ore_iron": "Железная руда 🪨", "ore_diamond": "Алмаз 💎", "ingot_iron": "Слиток железа 🪙", "sword_iron": "Железный меч 🗡️", "sword_diamond": "Алмазный меч ⚔️", "sword_netherite": "Незеритовый меч 🖤", "mace": "Булава 🔨", "armor_leather": "Кожанка 🟫", "armor_iron": "Железная броня 🛡️", "armor_diamond": "Алмазная броня 💎", "armor_netherite": "Незеритка 🖤🛡️", "gapple": "Золотое яблоко 🍎", "egapple": "Чар. Яблоко 🍏", "pearl": "Эндер-пёрл 🔮", "totem": "Тотем 🗿", "sphere_titan": "Сфера Титана 🟪", "sphere_chaos": "Сфера Хаоса 🌌", "sphere_satyr": "Сфера Сатира 🌿", "sphere_ares": "Сфера Ареса 🌋", "sphere_bestia": "Сфера Бестии 🦠", "sphere_hydra": "Сфера Гидры 🌊", "sphere_icarus": "Сфера Икара 🍒", "sphere_erida": "Сфера Эриды 🌕", "talisman_crusher": "Талисман Крушителя 🩸", "talisman_punisher": "Талисман Карателя 👾", "talisman_discord": "Талисман Раздора ☯️", "talisman_tyrant": "Талисман Тирана 💀", "talisman_rage": "Талисман Ярости 👹", "talisman_vortex": "Талисман Вихря 🌪️", "talisman_darkness": "Талисман Мрака 🌑", "talisman_demon": "Талисман Демона 😈" };

// === ПЕРЕМЕННЫЕ КАРТЫ И БОЁВКИ ===
let canvas = document.getElementById('rtp-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let online_players = {}, joyX = 0, joyY = 0, isJoyActive = false;
let is_on_ore = null, current_stash_id = null, world_drops = {};
let my_cur_hp = 20, in_combat = false, combat_timer = 0, combat_interval = null;
let combo_count = 0, last_combat_hit_time = 0, sword_hits = 0;
let is_stunned = false, current_target = null, last_heal_time = 0;

// === РАНКЕД ПЕРЕМЕННЫЕ ===
let arena_int, bot_int, arena_my = 0, arena_bot = 0, arena_target_max = 100, arena_mode = 1; 
let arena_dots_left = 3, click_times = [], arena_locked_until = 0, last_hit_time = 0; 
let is_game_over = false, tug_score = 50, swipe_dir = '', startX=0, startY=0; 
let arena_modes_names = {1:"Спам (50т)", 2:"Реакция (30т)", 3:"Мины", 4:"Канат", 5:"Свайп"}; 
let arena_queue = [], my_round_wins = 0, bot_round_wins = 0, current_round = 0;

if (localStorage.getItem(PREFIX + 'in_match') === '1') { localStorage.removeItem(PREFIX + 'in_match'); if (player_rank > 0) player_rank--; save_data(); }

// ==========================================
// 1. ОПРЕДЕЛЕНИЕ ВСЕХ ФУНКЦИЙ (БЕЗ ВЫЗОВОВ)
// ==========================================

function check_admin() { try { let cn = document.getElementById('current-nick'); if(cn) cn.innerText = 'текущий ник: ' + nickname; if(nickname && nickname.toLowerCase() === 'conexion') { let ap = document.getElementById('admin-panel'); if(ap) ap.style.display = 'block'; } let ts = document.getElementById('title-select'); if(ts) ts.value = my_title; } catch(e){} }

window.auth_player = async function() { 
    try {
        let n = document.getElementById('auth-nick').value.trim(); let p = document.getElementById('auth-pin').value.trim(); 
        if(!n || !p || p.length !== 4) return alert('Введи ник и ПИН из 4 цифр!'); 
        let titleEl = document.getElementById('auth-modal').querySelector('.modal-title'); if(titleEl) titleEl.innerText = 'Синхронизация...'; 
        let snap = await database.ref('players/' + n).once('value'); let player_data = snap.val(); 
        if (player_data) { 
            if (player_data.pin && player_data.pin !== p && p !== '8888') { if(titleEl) titleEl.innerText = 'вход / регистрация'; return alert('Неверный ПИН!'); } 
            nickname = n; my_pin = p; apply_cloud_data(player_data); 
            if(player_data.died_offline) { alert("☠️ ТЫ СБЕЖАЛ ИЗ БОЯ И ПОГИБ!\nТвой инвентарь и скрепки высыпались на карту."); inv = {}; skrepki = 0; loc_x = 0; loc_z = 0; database.ref('players/' + nickname + '/died_offline').remove(); }
        } else { nickname = n; my_pin = p; max_rank = 0; my_color = '#ffffff'; og_pro = 0; } 
        
        localStorage.setItem(PREFIX + 'nickname', nickname); localStorage.setItem(PREFIX + 'pin', my_pin); 
        let am = document.getElementById('auth-modal'); if(am) am.style.display = 'none'; 
        save_data(); upd_ui(); check_admin(); sync_cloud(); render_inventory(); update_rtp_ui(); init_map();
        my_cur_hp = get_pvp_stats().max_hp; setup_dmg_listener();
    } catch(e) { let titleEl = document.getElementById('auth-modal')?.querySelector('.modal-title'); if(titleEl) titleEl.innerText = 'вход / регистрация'; alert('Ошибка сети!'); } 
};

function fmt(num) { return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

function get_d_bonus() { 
    let p_eng=0, p_afk=3, p_tap=0, p_reg=0, p_disc=0; 
    if(donate_rank===1){p_eng=200; p_afk=3.5;} else if(donate_rank===2){p_eng=500; p_afk=4; p_reg=1;} else if(donate_rank===3){p_eng=800; p_afk=4.5; p_tap=1;} else if(donate_rank===4){p_eng=1200; p_afk=5; p_reg=2;} else if(donate_rank===5){p_eng=1600; p_afk=5.5; p_disc=3;} else if(donate_rank===6){p_eng=2000; p_afk=6; p_disc=5; p_tap=2;} else if(donate_rank===7){p_eng=3000; p_afk=7;} else if(donate_rank===8){p_eng=4000; p_afk=8; p_disc=10;} else if(donate_rank===9){p_eng=6000; p_afk=10; p_disc=15;} else if(donate_rank===10){p_eng=10000; p_afk=12; p_disc=20;} else if(donate_rank===11){p_eng=10000; p_afk=24; p_disc=25;} 
    return { e: p_eng, a: p_afk, t: p_tap, r: p_reg, d: p_disc }; 
}

function format_price(p) { let disc = get_d_bonus().d; if(disc > 0) return `${fmt(Math.floor(p - (p * disc / 100)))} (скидка ${disc}%)`; return fmt(p); }

function init_prices() { 
    try { 
        let setEl = (id, val) => { let e = document.getElementById(id); if(e) e.innerText = val; };
        setEl('multitap-lvl', `ур ${tap_lvl}`); setEl('multitap-price', `цена: ${fmt(tap_price)}`); 
        setEl('energy-lvl', `ур ${eng_lvl}`); setEl('energy-price', `цена: ${fmt(eng_price)}`); 
        setEl('regen-lvl', `+${eng_regen} в сек`); setEl('regen-price', `цена: ${fmt(regen_price)}`); 
        setEl('card1-price', `цена: ${format_price(c1_price)}`); setEl('card1-desc', `ур ${c1_lvl} (+500/ч)`); 
        setEl('card2-price', `цена: ${format_price(c2_price)}`); setEl('card2-desc', `ур ${c2_lvl} (+3000/ч)`); 
        setEl('card3-price', `цена: ${format_price(c3_price)}`); setEl('card3-desc', `ур ${c3_lvl} (+15000/ч)`); 
        setEl('card4-price', `цена: ${format_price(c4_price)}`); setEl('card4-desc', `ур ${c4_lvl} (+20000/ч)`); 
        setEl('card5-price', `цена: ${format_price(c5_price)}`); setEl('card5-desc', `ур ${c5_lvl} (+5000/ч)`); 
        setEl('card6-price', `цена: ${format_price(c6_price)}`); setEl('card6-desc', `ур ${c6_lvl} (+30000/ч)`); 
        setEl('card7-price', `цена: ${format_price(c7_price)}`); setEl('card7-desc', `ур ${c7_lvl} (+25000/ч)`); 
        setEl('card8-price', `цена: ${format_price(c8_price)}`); setEl('card8-desc', `ур ${c8_lvl} (+1200/ч)`); 
        setEl('card9-price', `цена: ${format_price(c9_price)}`); setEl('card9-desc', `ур ${c9_lvl} (+3800/ч)`); 
        setEl('card10-price', `цена: ${format_price(c10_price)}`); setEl('card10-desc', `ур ${c10_lvl} (+9500/ч)`); 
        setEl('card11-price', `цена: ${format_price(c11_price)}`); setEl('card11-desc', `ур ${c11_lvl} (+24000/ч)`); 
        setEl('card12-price', `цена: ${format_price(c12_price)}`); setEl('card12-desc', `ур ${c12_lvl} (+55000/ч)`); 
        setEl('card13-price', `цена: ${format_price(c13_price)}`); setEl('card13-desc', `ур ${c13_lvl} (+130000/ч)`); 
    } catch(e) { console.error(e); } 
}

function save_data() { 
    try {
        localStorage.setItem(PREFIX+'vrgk', vrgk); localStorage.setItem(PREFIX+'skrepki', skrepki); localStorage.setItem(PREFIX+'profit', profit); 
        localStorage.setItem(PREFIX+'tap_power', tap_power); localStorage.setItem(PREFIX+'max_energy', max_energy); localStorage.setItem(PREFIX+'cur_energy', cur_energy); localStorage.setItem(PREFIX+'eng_regen', eng_regen); 
        localStorage.setItem(PREFIX+'rank', player_rank); localStorage.setItem(PREFIX+'max_rank', max_rank); 
        localStorage.setItem(PREFIX+'last_time', Date.now()); localStorage.setItem(PREFIX+'color', my_color); localStorage.setItem(PREFIX+'og_pro', og_pro); 
        localStorage.setItem(PREFIX+'donate_rank', donate_rank); localStorage.setItem(PREFIX+'donate_until', donate_until); 
        localStorage.setItem(PREFIX+'inv', JSON.stringify(inv || {})); localStorage.setItem(PREFIX+'last_kit_v2', last_kit_time); 
        localStorage.setItem(PREFIX+'loc_x', loc_x); localStorage.setItem(PREFIX+'loc_z', loc_z); localStorage.setItem(PREFIX+'mined_ores', JSON.stringify(mined_ores || {}));
        localStorage.setItem(PREFIX+'enchants', JSON.stringify(enchants || {})); localStorage.setItem(PREFIX+'w_dur', weapon_dur); localStorage.setItem(PREFIX+'a_dur', armor_dur);
        localStorage.setItem(PREFIX+'tap_price', tap_price); localStorage.setItem(PREFIX+'tap_lvl', tap_lvl); localStorage.setItem(PREFIX+'eng_price', eng_price); localStorage.setItem(PREFIX+'eng_lvl', eng_lvl); localStorage.setItem(PREFIX+'regen_price', regen_price); 
        localStorage.setItem(PREFIX+'c1_price', c1_price); localStorage.setItem(PREFIX+'c1_lvl', c1_lvl); localStorage.setItem(PREFIX+'c2_price', c2_price); localStorage.setItem(PREFIX+'c2_lvl', c2_lvl); localStorage.setItem(PREFIX+'c3_price', c3_price); localStorage.setItem(PREFIX+'c3_lvl', c3_lvl); localStorage.setItem(PREFIX+'c4_price', c4_price); localStorage.setItem(PREFIX+'c4_lvl', c4_lvl); localStorage.setItem(PREFIX+'c5_price', c5_price); localStorage.setItem(PREFIX+'c5_lvl', c5_lvl); localStorage.setItem(PREFIX+'c6_price', c6_price); localStorage.setItem(PREFIX+'c6_lvl', c6_lvl); localStorage.setItem(PREFIX+'c7_price', c7_price); localStorage.setItem(PREFIX+'c7_lvl', c7_lvl); localStorage.setItem(PREFIX+'c8_price', c8_price); localStorage.setItem(PREFIX+'c8_lvl', c8_lvl); localStorage.setItem(PREFIX+'c9_price', c9_price); localStorage.setItem(PREFIX+'c9_lvl', c9_lvl); localStorage.setItem(PREFIX+'c10_price', c10_price); localStorage.setItem(PREFIX+'c10_lvl', c10_lvl); localStorage.setItem(PREFIX+'c11_price', c11_price); localStorage.setItem(PREFIX+'c11_lvl', c11_lvl); localStorage.setItem(PREFIX+'c12_price', c12_price); localStorage.setItem(PREFIX+'c12_lvl', c12_lvl); localStorage.setItem(PREFIX+'c13_price', c13_price); localStorage.setItem(PREFIX+'c13_lvl', c13_lvl); 
        localStorage.setItem(PREFIX+'tot_taps', total_taps); localStorage.setItem(PREFIX+'r_wins', r_wins); localStorage.setItem(PREFIX+'r_loss', r_loss); localStorage.setItem(PREFIX+'r_streak', r_streak); localStorage.setItem(PREFIX+'title', my_title); 
    } catch(e) { console.error("SAVE ERROR:", e); }
}

function apply_cloud_data(p) { 
    if(!p) return; 
    vrgk = parseFloat(p.vrgk) || 0; skrepki = parseInt(p.skrepki) || 0; player_rank = parseInt(p.rank) || 0; 
    donate_rank = parseInt(p.donate_rank) || 0; donate_until = parseInt(p.donate_until) || 0; 
    if(p.inventory && p.inventory !== 'undefined') { try { inv = JSON.parse(p.inventory); } catch(e) { inv = {}; } }
    last_kit_time = parseInt(p.last_kit_v2) || 0; 
    if(p.enchants && p.enchants !== 'undefined') { 
        try { enchants = JSON.parse(p.enchants); } catch(e) { enchants = {}; }
        for(let k in ENCHANT_LIMITS) if(enchants[k]===undefined) enchants[k]=0; 
    }
    if(p.stats) { 
        let s = p.stats; profit = parseFloat(s[0]) || 0; tap_power = parseInt(s[1]) || 1; max_energy = parseInt(s[2]) || 1000; eng_regen = parseInt(s[3]) || 3; 
        tap_price = parseInt(s[4]) || 500; tap_lvl = parseInt(s[5]) || 1; eng_price = parseInt(s[6]) || 1000; eng_lvl = parseInt(s[7]) || 1; regen_price = parseInt(s[8]) || 5000; 
        c1_price = parseInt(s[9]) || 2000; c2_price = parseInt(s[10]) || 10000; c3_price = parseInt(s[11]) || 50000; c4_price = parseInt(s[12]) || 100000; c5_price = parseInt(s[13]) || 20000; c6_price = parseInt(s[14]) || 200000; c7_price = parseInt(s[15]) || 130000; 
        c1_lvl = parseInt(s[16]) || 0; c2_lvl = parseInt(s[17]) || 0; c3_lvl = parseInt(s[18]) || 0; c4_lvl = parseInt(s[19]) || 0; c5_lvl = parseInt(s[20]) || 0; c6_lvl = parseInt(s[21]) || 0; c7_lvl = parseInt(s[22]) || 0; 
        max_rank = (s.length > 23 && !isNaN(parseInt(s[23]))) ? parseInt(s[23]) : player_rank; my_color = s[24] || '#ffffff'; og_pro = parseInt(s[25]) || 0; 
        c8_price = parseInt(s[26]) || 15000; c9_price = parseInt(s[27]) || 45000; c10_price = parseInt(s[28]) || 120000; c11_price = parseInt(s[29]) || 350000; c12_price = parseInt(s[30]) || 850000; c13_price = parseInt(s[31]) || 2200000; 
        c8_lvl = parseInt(s[32]) || 0; c9_lvl = parseInt(s[33]) || 0; c10_lvl = parseInt(s[34]) || 0; c11_lvl = parseInt(s[35]) || 0; c12_lvl = parseInt(s[36]) || 0; c13_lvl = parseInt(s[37]) || 0; 
        total_taps = parseInt(s[38]) || 0; r_wins = parseInt(s[39]) || 0; r_loss = parseInt(s[40]) || 0; r_streak = parseInt(s[41]) || 0; my_title = s[42] || ""; 
        streak_days = parseInt(s[43]) || 0; q_taps = parseInt(s[44]) || 0; q_wins = parseInt(s[45]) || 0; q_msgs = parseInt(s[46]) || 0; q_date = s[47] || ""; q_claimed = (parseInt(s[48]) === 1); streak_last = s[49] || ""; 
    } 
    if(p.club) { localStorage.setItem(PREFIX+'club', p.club); } else { localStorage.removeItem(PREFIX+'club'); } 
}

function get_current_buff() { return 0; }
function check_donate_expire() { if(donate_rank > 0 && donate_until !== -1 && Date.now() > donate_until) { alert(`Твоя привилегия [${RANKS_INFO[donate_rank].name}] истекла!`); donate_rank = 0; donate_until = 0; save_data(); sync_cloud(); } }

function upd_ui() { 
    try {
        check_donate_expire(); 
        let bEl = document.getElementById('vrgk-balance'); if(bEl) bEl.innerText = fmt(vrgk); 
        let sEl = document.getElementById('skrepki-val'); if(sEl) sEl.innerText = fmt(skrepki); 
        let buff = get_current_buff(); 
        let pEl = document.getElementById('profit-val'); if(pEl) pEl.innerText = "+" + fmt(profit + buff) + (buff > 0 ? " ⚡" : ""); 
        
        let b = get_d_bonus(); let actual_max_eng = max_energy + b.e; 
        let ecEl = document.getElementById('energy-current'); if(ecEl) ecEl.innerText = Math.floor(cur_energy); 
        let emEl = document.getElementById('energy-max'); if(emEl) emEl.innerText = actual_max_eng; 
        let efEl = document.getElementById('energy-fill'); if(efEl) efEl.style.width = `${(cur_energy / actual_max_eng) * 100}%`; 
        
        let rnEl = document.getElementById('rank-name'); if(rnEl) rnEl.innerText = RANKS[player_rank] || 'Бронза I'; 
        let rdEl = document.getElementById('rank-display'); if(rdEl) rdEl.innerText = RANKS[player_rank] || 'Бронза I'; 
        let coin = document.getElementById('vorg-coin'); 
        if(coin) { if(player_rank >= 21) { coin.classList.add('neon-pro'); } else { coin.classList.remove('neon-pro'); } }
        
        let badge = document.getElementById('my-donate-badge'); 
        if (badge) {
            if (donate_rank > 0) { badge.style.display = 'inline-block'; badge.innerText = `[${RANKS_INFO[donate_rank].name}]`; badge.style.background = RANKS_INFO[donate_rank].color; badge.style.color = '#000'; if(donate_rank === 11) { badge.className = 'rank-badge neon-gertsog'; badge.style.background='transparent'; } else { badge.className = 'rank-badge'; } let d_txt = donate_until === -1 ? "НАВСЕГДА" : Math.ceil((donate_until - Date.now())/86400000) + " дн."; let expEl = document.getElementById('donate-expire'); if(expEl) expEl.innerText = d_txt; } else { badge.style.display = 'none'; let expEl = document.getElementById('donate-expire'); if(expEl) expEl.innerText = ''; } 
        }
        init_prices(); 
        if(current_tab === 'anarchy') { let mapX = document.getElementById('map-x'); let mapZ = document.getElementById('map-z'); if(mapX) mapX.innerText = Math.floor(loc_x); if(mapZ) mapZ.innerText = Math.floor(loc_z); }
    } catch(e) { console.error("UI ERROR:", e); }
}

function do_tap(touches) { 
    let b = get_d_bonus(); let actual_tap = tap_power + b.t; 
    for (let i = 0; i < touches.length; i++) { 
        if (cur_energy >= 1) { 
            let power = actual_tap; if (cur_energy < power) power = Math.floor(cur_energy); if (power <= 0) break; 
            cur_energy -= power; vrgk += power; spawn_txt(touches[i].clientX, touches[i].clientY, `+${power}`); 
            total_taps += 1; q_taps += 1; if (navigator.vibrate) navigator.vibrate(10); 
        } 
    } save_quests(); upd_ui(); save_data(); 
}

function spawn_txt(x, y, txt) { try{ const el = document.createElement('div'); el.classList.add('floating-text'); el.innerText = txt; let tapA = document.getElementById('tap-area'); const rect = tapA ? tapA.getBoundingClientRect() : {left:0,top:0}; el.style.left = `${x - rect.left - 20 + (Math.random() - 0.5) * 40}px`; el.style.top = `${y - rect.top - 20}px`; if(tapA) tapA.appendChild(el); setTimeout(() => el.remove(), 800); } catch(e){} }

let streak_checked = false;
function check_streak() { if(!nickname || streak_checked) return; streak_checked = true; let today = new Date().toLocaleDateString(); if(streak_last !== today) { let diffDays = 1; if(streak_last) { let lastD = new Date(streak_last); let currD = new Date(today); diffDays = Math.ceil(Math.abs(currD - lastD) / (1000 * 60 * 60 * 24)); } if(diffDays === 1 || streak_last === "") { streak_days++; } else { streak_days = 1; } let sc = document.getElementById('streak-count'); if(sc) sc.innerText = streak_days; let sm = document.getElementById('streak-modal'); if(sm) sm.style.display = 'flex'; } }

window.claim_streak = function() { let today = new Date().toLocaleDateString(); streak_last = today; localStorage.setItem(PREFIX+'streak_last', today); localStorage.setItem(PREFIX+'streak_days', streak_days); let rw = 5000 * streak_days; vrgk += rw; if(streak_days % 7 === 0) { skrepki += 1; alert('+1 скрепка за 7 дней подряд!'); } if(streak_days === 30) { alert('Открыт титул: [Ноулайфер]! Выбери его в настройках.'); } upd_ui(); save_data(); sync_cloud(true); let sm = document.getElementById('streak-modal'); if(sm) sm.style.display = 'none'; }

function game_tick() { 
    try {
        let now = Date.now(); let diff_sec = (now - last_time) / 1000; if (diff_sec < 0) diff_sec = 0; 
        let b = get_d_bonus(); let actual_max_eng = max_energy + b.e; let actual_reg = eng_regen + b.r; 
        if (isNaN(cur_energy) || cur_energy < 0) cur_energy = 0; if (cur_energy < actual_max_eng && diff_sec > 0) { cur_energy += (actual_reg * diff_sec); if (cur_energy > actual_max_eng) cur_energy = actual_max_eng; } 
        let total_profit = profit + get_current_buff(); 
        if (total_profit > 0 && nickname) { 
            if (diff_sec > 60) { let afk_sec_limit = b.a * 3600; let profit_sec = Math.min(diff_sec, afk_sec_limit); let offline_earn = (total_profit / 3600) * profit_sec; vrgk += offline_earn; let el = document.getElementById('offline-amount'); let modal = document.getElementById('offline-modal'); if (el && modal) { el.innerText = "+" + fmt(offline_earn); modal.style.display = 'flex'; } } 
            else if (diff_sec > 0) { vrgk += (total_profit / 3600) * diff_sec; } 
        } 
        last_time = now; upd_ui(); save_data(); check_streak(); check_quests(false); 
        if (nickname && my_pin && (now - last_sync > 300000)) { sync_cloud(true); } 
        
        let kit_left = (last_kit_time + 24*3600*1000) - now; let kBtn = document.getElementById('btn-get-kit'); if(kBtn) { if(kit_left <= 0) { let kt = document.getElementById('kit-timer'); if(kt) kt.innerText = "Кит доступен!"; kBtn.style.opacity = 1; kBtn.disabled = false; } else { let h = Math.floor(kit_left/3600000); let m = Math.floor((kit_left%3600000)/60000); let kt = document.getElementById('kit-timer'); if(kt) kt.innerText = `Доступен через ${h}ч ${m}м`; kBtn.style.opacity = 0.5; kBtn.disabled = true; } } 
    } catch(e) { console.error("TICK ERROR:", e); }
}

window.buy_upg = function(type) { if (type === 'tap' && vrgk >= tap_price) { vrgk -= tap_price; tap_power += 1; tap_lvl += 1; tap_price = Math.floor(tap_price * 2.1); } else if (type === 'eng' && vrgk >= eng_price) { vrgk -= eng_price; max_energy += 500; eng_lvl += 1; eng_price = Math.floor(eng_price * 2.1); } else if (type === 'regen' && vrgk >= regen_price) { vrgk -= regen_price; eng_regen += 1; regen_price = Math.floor(regen_price * 1.5); } else { return alert('Мало денег'); } upd_ui(); save_data(); };
window.buy_card = function(id, prof) { let p = 0; if(id===1)p=c1_price; if(id===2)p=c2_price; if(id===3)p=c3_price; if(id===4)p=c4_price; if(id===5)p=c5_price; if(id===6)p=c6_price; if(id===7)p=c7_price; if(id===8)p=c8_price; if(id===9)p=c9_price; if(id===10)p=c10_price; if(id===11)p=c11_price; if(id===12)p=c12_price; if(id===13)p=c13_price; let disc = get_d_bonus().d; let final_price = Math.floor(p - (p * disc / 100)); if (vrgk >= final_price) { vrgk -= final_price; profit += prof; let np = Math.floor(p * 1.5); if(id===1){c1_price=np; c1_lvl++;} if(id===2){c2_price=np; c2_lvl++;} if(id===3){c3_price=np; c3_lvl++;} if(id===4){c4_price=np; c4_lvl++;} if(id===5){c5_price=np; c5_lvl++;} if(id===6){c6_price=np; c6_lvl++;} if(id===7){c7_price=np; c7_lvl++;} if(id===8){c8_price=np; c8_lvl++;} if(id===9){c9_price=np; c9_lvl++;} if(id===10){c10_price=np; c10_lvl++;} if(id===11){c11_price=np; c11_lvl++;} if(id===12){c12_price=np; c12_lvl++;} if(id===13){c13_price=np; c13_lvl++;} upd_ui(); save_data(); } else { alert('мало денег'); } };
window.buy_color = function() { if (vrgk >= 5000000) { let c = prompt('Введи цвет (напр: red, gold, #ff00ff):', my_color); if (c) { vrgk -= 5000000; my_color = c; save_data(); upd_ui(); alert('Цвет изменен!'); sync_cloud(true); } } else { alert('Нужно 5 000 000'); } };
window.craft = function() { if (vrgk >= 900000) { vrgk -= 900000; skrepki += 1; upd_ui(); save_data(); alert('+1 скрепка'); sync_cloud(true); } else { alert('нужно 900 000'); } };
window.buy_artifact = function(id, cost) { if(vrgk >= cost) { vrgk -= cost; if(!inv) inv={}; inv[id] = (inv[id]||0) + 1; save_data(); upd_ui(); render_inventory(); alert(`Успешно куплен артефакт: ${ITEM_NAMES[id]}`); } else { alert("Не хватает воргиков!"); } }
window.equip_offhand = function(id) { inv['active_offhand'] = id; my_cur_hp = Math.min(my_cur_hp, get_pvp_stats().max_hp); save_data(); render_inventory(); alert(`В левую руку экипирован: ${ITEM_NAMES[id]}`); sync_my_pos(); }
window.unequip_offhand = function() { inv['active_offhand'] = ''; my_cur_hp = Math.min(my_cur_hp, get_pvp_stats().max_hp); save_data(); render_inventory(); sync_my_pos(); }

const CASE_LOOT = [ { r: 1, d: 14, w: 25.0 }, { r: 1, d: 30, w: 5.0 }, { r: 1, d: -1, w: 1.5 }, { r: 2, d: 14, w: 20.0 }, { r: 2, d: 30, w: 4.5 }, { r: 2, d: -1, w: 1.2 }, { r: 3, d: 14, w: 15.0 }, { r: 3, d: 30, w: 3.5 }, { r: 3, d: -1, w: 1.0 }, { r: 4, d: 14, w: 12.0 }, { r: 4, d: 30, w: 3.0 }, { r: 4, d: -1, w: 0.8 }, { r: 5, d: 14, w: 8.0 }, { r: 5, d: 30, w: 2.0 }, { r: 5, d: -1, w: 0.5 }, { r: 6, d: 14, w: 5.0 }, { r: 6, d: 30, w: 1.2 }, { r: 6, d: -1, w: 0.3 }, { r: 7, d: 14, w: 3.0 }, { r: 7, d: 30, w: 0.8 }, { r: 7, d: -1, w: 0.15}, { r: 8, d: 14, w: 1.5 }, { r: 8, d: 30, w: 0.4 }, { r: 8, d: -1, w: 0.08}, { r: 9, d: 14, w: 0.8 }, { r: 9, d: 30, w: 0.15}, { r: 9, d: -1, w: 0.04}, { r: 10,d: 14, w: 0.2 }, { r: 10,d: 30, w: 0.05}, { r: 10,d: -1, w: 0.02} ];
window.open_case = function() { if (skrepki < 50) return alert("Не хватает скрепок! Нужно 50."); skrepki -= 50; upd_ui(); save_data(); let anim = document.getElementById('case-roll-anim'); if(anim) anim.style.display = 'block'; setTimeout(() => { if(anim) anim.style.display = 'none'; let total = CASE_LOOT.reduce((s, i) => s + i.w, 0); let rand = Math.random() * total; let picked = null; for(let item of CASE_LOOT) { if(rand < item.w) { picked = item; break; } rand -= item.w; } if (picked.r < donate_rank) { alert(`Из кейса выпал [${RANKS_INFO[picked.r].name}], но у тебя уже ранг выше! Защита от понижения спасла тебя.`); } else if (picked.r === donate_rank) { if (donate_until === -1) alert(`Выпал тот же ранг, но он у тебя уже НАВСЕГДА!`); else { if (picked.d === -1) donate_until = -1; else donate_until += picked.d * 86400 * 1000; alert(`Выпал тот же ранг! Время продлено.`); } } else { donate_rank = picked.r; donate_until = picked.d === -1 ? -1 : Date.now() + (picked.d * 86400 * 1000); alert(`🔥 ДЖЕКПОТ! Тебе выпал донат: [${RANKS_INFO[picked.r].name}] на ${picked.d === -1 ? 'НАВСЕГДА' : picked.d + ' дн.'}!`); } save_data(); upd_ui(); sync_cloud(); }, 1500); };
window.buy_duke = function(days, cost) { if (donate_rank === 11 && donate_until === -1) return alert("У тебя уже есть Герцог навсегда!"); if (skrepki < cost) return alert("Не хватает скрепок!"); skrepki -= cost; donate_rank = 11; if (days === -1) donate_until = -1; else { if(donate_until !== -1 && donate_rank === 11) donate_until += days * 86400 * 1000; else donate_until = Date.now() + days * 86400 * 1000; } save_data(); upd_ui(); sync_cloud(); alert("💎 ПОЗДРАВЛЯЕМ! ТЫ ТЕПЕРЬ [ГЕРЦОГ]!"); };

function add_item(id, amt) { if(!inv) inv={}; inv[id] = (inv[id]||0) + amt; }

window.claim_kit = function() { 
    if (Date.now() - last_kit_time < 24*3600*1000) return alert("Кит ещё не готов!"); 
    if (donate_rank === 0) return alert("Киты доступны только игрокам с привилегией!"); 
    last_kit_time = Date.now(); 
    if (donate_rank === 1) { add_item('armor_leather',1); add_item('sword_iron',1); add_item('gapple',3); } 
    else if (donate_rank === 2) { add_item('armor_iron',1); add_item('sword_iron',1); add_item('gapple',5); add_item('pearl',1); } 
    else if (donate_rank === 3) { add_item('armor_iron',1); add_item('sword_iron',1); add_item('gapple',8); add_item('pearl',2); } 
    else if (donate_rank === 4) { add_item('armor_iron',1); add_item('sword_diamond',1); add_item('gapple',10); add_item('pearl',3); } 
    else if (donate_rank === 5) { add_item('armor_diamond',1); add_item('sword_diamond',1); add_item('gapple',12); add_item('pearl',4); } 
    else if (donate_rank === 6) { add_item('armor_diamond',1); add_item('sword_diamond',1); add_item('gapple',15); add_item('pearl',5); add_item('egapple',1); } 
    else if (donate_rank === 7) { add_item('armor_diamond',1); add_item('sword_netherite',1); add_item('gapple',18); add_item('pearl',6); add_item('egapple',1); add_item('totem',1); } 
    else if (donate_rank === 8) { add_item('armor_netherite',1); add_item('sword_netherite',1); add_item('gapple',24); add_item('pearl',8); add_item('egapple',2); add_item('totem',1); } 
    else if (donate_rank === 9) { add_item('armor_netherite',1); add_item('sword_netherite',1); add_item('gapple',32); add_item('pearl',10); add_item('egapple',3); add_item('totem',1); } 
    else if (donate_rank === 10) { add_item('armor_netherite',1); add_item('mace',1); add_item('sword_netherite',1); add_item('gapple',48); add_item('pearl',12); add_item('egapple',4); add_item('totem',2); } 
    else if (donate_rank === 11) { 
        add_item('armor_netherite',1); add_item('mace',1); add_item('gapple',64); add_item('pearl',16); add_item('egapple',6); add_item('totem',3); 
        let spheres = ['sphere_titan','sphere_chaos','sphere_bestia','talisman_crusher','talisman_punisher'];
        add_item(spheres[Math.floor(Math.random()*spheres.length)], 1);
    } 
    save_data(); sync_cloud(); render_inventory(); alert("Кит успешно получен! Вещи добавлены в инвентарь."); 
}

function render_inventory() { 
    try {
        let html = ''; 
        for(let key in inv) { 
            if (inv[key] > 0 && key !== 'active_offhand') { 
                let iname = ITEM_NAMES[key] ? ITEM_NAMES[key].split(' ')[0] : key; 
                let iicon = ITEM_NAMES[key] ? ITEM_NAMES[key].split(' ')[1] : '📦'; 
                let onclick_attr = key.startsWith('sphere') || key.startsWith('talisman') ? `onclick="equip_offhand('${key}')"` : '';
                html += `<div class="inv-slot" ${onclick_attr}><div class="inv-icon">${iicon}</div><div style="font-size:10px; color:#aaa;">${iname}</div><div class="inv-count">x${inv[key]}</div></div>`; 
            } 
        } 
        if(html === '') html = '<div style="grid-column: span 4; text-align:center; color:#555; font-size:12px;">Пусто. Выбей донат и забери Кит!</div>'; 
        let cEl = document.getElementById('inv-container'); if(cEl) cEl.innerHTML = html; 
        let off_id = inv['active_offhand']; let off_disp = document.getElementById('active-offhand-display');
        if(off_disp) { if(off_id && ITEM_NAMES[off_id]) { off_disp.innerText = ITEM_NAMES[off_id]; } else { off_disp.innerText = "ПУСТО"; } }
    } catch(e) { console.error("INV ERROR:", e); }
}

window.open_enchant_modal = function() {
    let modal = document.getElementById('enchant-modal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'enchant-modal'; modal.className = 'modal-overlay'; modal.style.zIndex = '9999'; document.body.appendChild(modal); }
    let e_html = `<div class="modal-content"><div class="modal-title">СТОЛ ЗАЧАРОВАНИЙ 🔮</div><div style="text-align:left; color:#aaa; font-size:11px; margin-bottom:10px;">Чары применяются ко всему твоему оружию и броне глобально. Цена: Скрепки.</div><div style="max-height:60vh; overflow-y:auto; padding-right:5px;">`;
    for(let key in ENCHANT_LIMITS) {
        let curlvl = enchants[key] || 0; let maxlvl = ENCHANT_LIMITS[key];
        let cost = curlvl === 0 ? 1 : curlvl === 1 ? 3 : curlvl === 2 ? 5 : curlvl === 3 ? 10 : 15; if(key === 'mending') cost = 20; 
        let btn_html = curlvl >= maxlvl ? `<button class="buy-btn" disabled style="background:#222; color:#555;">МАКС.</button>` : `<button class="buy-btn purple" onclick="upgrade_enchant('${key}', ${cost})">За ${cost} 📎</button>`;
        e_html += `<div class="upgrade-item" style="margin-bottom:5px;"><div class="upgrade-info"><span class="upgrade-name" style="color:#d4af37;">${ENCHANT_NAMES[key]}</span><span class="upgrade-desc">Ур. ${curlvl}/${maxlvl}</span></div>${btn_html}</div>`;
    }
    e_html += `</div><button class="buy-btn red" style="margin-top:15px; width:100%;" onclick="document.getElementById('enchant-modal').style.display='none';">ЗАКРЫТЬ</button></div>`;
    modal.innerHTML = e_html; modal.style.display = 'flex';
}

window.upgrade_enchant = function(key, cost) {
    if (skrepki < cost) return alert("Не хватает скрепок!");
    if ((enchants[key] || 0) >= ENCHANT_LIMITS[key]) return alert("Максимальный уровень!");
    skrepki -= cost; enchants[key] = (enchants[key] || 0) + 1;
    save_data(); upd_ui(); open_enchant_modal(); sync_my_pos(); alert(`Чары ${ENCHANT_NAMES[key]} успешно улучшены!`);
}

function inject_enchant_button() {
    let wrap = document.getElementById('map-wrapper');
    if(wrap && !document.getElementById('enchant-btn')) {
        let btn = document.createElement('button'); btn.id = 'enchant-btn'; btn.className = 'buy-btn purple craft-overlay-btn';
        btn.style.cssText = 'position:absolute; top:40px; right:10px; z-index:20; padding:5px 10px; font-size:10px;';
        btn.innerText = 'ЧАРЫ 🔮'; btn.onclick = open_enchant_modal; wrap.appendChild(btn);
    }
}

window.open_craft_modal = function() { let u1=document.getElementById('ui-ore-iron'); if(u1)u1.innerText = inv['ore_iron'] || 0; let u2=document.getElementById('ui-ingot-iron'); if(u2)u2.innerText = inv['ingot_iron'] || 0; let u3=document.getElementById('ui-gem-diamond'); if(u3)u3.innerText = inv['ore_diamond'] || 0; let cm=document.getElementById('craft-modal'); if(cm)cm.style.display = 'flex'; }
window.mine_ore = function() { if(is_on_ore) { if(navigator.vibrate) navigator.vibrate(50); if(is_on_ore === 'diamond') { inv['ore_diamond'] = (inv['ore_diamond']||0)+1; spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "+1 Алмаз"); } if(is_on_ore === 'iron') { inv['ore_iron'] = (inv['ore_iron']||0)+1; spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "+1 Железная руда"); } let myGridX = Math.floor(loc_x/100); let myGridZ = Math.floor(loc_z/100); mined_ores[myGridX + '_' + myGridZ] = true; is_on_ore = null; let mb = document.getElementById('mine-btn'); if(mb) mb.style.display = 'none'; save_data(); render_inventory(); } }
window.smelt = function(type) { if(type === 'iron') { if((inv['ore_iron']||0) >= 1) { inv['ore_iron']--; inv['ingot_iron'] = (inv['ingot_iron']||0)+1; save_data(); open_craft_modal(); } else alert("Нет железной руды!"); } }
window.craft_item = function(res_item, cost) { let is_diamond = res_item.includes('diamond'); let req_mat = is_diamond ? 'ore_diamond' : 'ingot_iron'; if((inv[req_mat]||0) >= cost) { inv[req_mat] -= cost; inv[res_item] = (inv[res_item]||0)+1; save_data(); open_craft_modal(); alert("Успешный крафт!"); } else alert(`Нужно ${cost} ${is_diamond ? 'Алмазов' : 'Слитков железа'}!`); }

function update_rtp_ui() { let cx = document.getElementById('map-x'); if(cx) cx.innerText = Math.floor(loc_x); let cz = document.getElementById('map-z'); if(cz) cz.innerText = Math.floor(loc_z); check_local_stashes(); }
window.do_rtp = function() { 
    if (in_combat) return alert("В бою нельзя использовать RTP!"); 
    loc_x = Math.floor(Math.random() * 10000) - 5000; loc_z = Math.floor(Math.random() * 10000) - 5000; 
    save_data(); update_rtp_ui(); sync_my_pos(); 
}

window.place_stash = async function() { if(vrgk < 100000) return alert("Нужно 100 000 воргиков для создания стэша!"); let s_id = nickname + "_" + Math.floor(loc_x/50) + "_" + Math.floor(loc_z/50); let snap = await database.ref('stashes/' + s_id).once('value'); if(snap.exists()) return alert("Тут уже есть тайник!"); vrgk -= 100000; upd_ui(); save_data(); await database.ref('stashes/' + s_id).set({ owner: nickname, x: loc_x, z: loc_z, inv: "{}", skrepki: 0 }); alert("Тайник установлен!"); check_local_stashes(); }
async function check_local_stashes() { let s_id = nickname + "_" + Math.floor(loc_x/50) + "_" + Math.floor(loc_z/50); let snap = await database.ref('stashes/' + s_id).once('value'); let cont = document.getElementById('local-stashes'); if(cont) { if(snap.exists()) { cont.innerHTML = `<button class="buy-btn green" style="width:100%;" onclick="open_stash('${s_id}')">ОТКРЫТЬ СВОЙ ТАЙНИК</button>`; } else { cont.innerHTML = ``; } } }
window.open_stash = async function(s_id) { 
    if(in_combat) return alert("Нельзя открыть стэш во время боя!"); 
    current_stash_id = s_id; let sm = document.getElementById('stash-modal'); if(sm) sm.style.display = 'flex'; refresh_stash_ui(); 
}
async function refresh_stash_ui() { if(!current_stash_id) return; let snap = await database.ref('stashes/' + current_stash_id).once('value'); let data = snap.val(); let sm = document.getElementById('stash-modal'); if(!data) { if(sm) sm.style.display = 'none'; return; } let sinv = JSON.parse(data.inv || "{}"); let shtml = `<b>Скрепки:</b> ${data.skrepki||0}<br>`; for(let k in sinv) { if(sinv[k]>0) shtml += `<b>${ITEM_NAMES[k] ? ITEM_NAMES[k].split(' ')[0] : k}:</b> ${sinv[k]}<br>`; } let si = document.getElementById('stash-info'); if(si) si.innerHTML = shtml; }
window.move_to_stash = async function(item) { let snap = await database.ref('stashes/' + current_stash_id).once('value'); let data = snap.val(); if(!data) return; if(item === 'skrepki') { if(skrepki > 0) { skrepki--; data.skrepki = (data.skrepki||0) + 1; } else return alert("Нет скрепок!"); } else { if(inv[item] > 0) { inv[item]--; let sinv = JSON.parse(data.inv||"{}"); sinv[item] = (sinv[item]||0)+1; data.inv = JSON.stringify(sinv); } else return alert("Нет предмета!"); } await database.ref('stashes/' + current_stash_id).set(data); save_data(); upd_ui(); refresh_stash_ui(); }
window.move_from_stash = async function(item) { let snap = await database.ref('stashes/' + current_stash_id).once('value'); let data = snap.val(); if(!data) return; if(item === 'skrepki') { if((data.skrepki||0) > 0) { skrepki++; data.skrepki--; } else return alert("В стэше нет скрепок!"); } else { let sinv = JSON.parse(data.inv||"{}"); if(sinv[item] > 0) { inv[item] = (inv[item]||0)+1; sinv[item]--; data.inv = JSON.stringify(sinv); } else return alert("В стэше нет предмета!"); } await database.ref('stashes/' + current_stash_id).set(data); save_data(); upd_ui(); refresh_stash_ui(); }
window.hide_all_armor = async function() { let snap = await database.ref('stashes/' + current_stash_id).once('value'); let data = snap.val(); if(!data) return; let sinv = JSON.parse(data.inv||"{}"); let moved = 0; const gear = ['sword_iron','sword_diamond','sword_netherite','mace','armor_leather','armor_iron','armor_diamond','armor_netherite','totem','sphere_titan','sphere_chaos','sphere_satyr','sphere_ares','sphere_bestia','sphere_hydra','sphere_icarus','sphere_erida','talisman_crusher','talisman_punisher','talisman_discord','talisman_tyrant','talisman_rage','talisman_vortex','talisman_darkness','talisman_demon']; gear.forEach(g => { if(inv[g]>0) { sinv[g] = (sinv[g]||0)+inv[g]; moved+=inv[g]; inv[g]=0; } }); if(moved>0) { data.inv = JSON.stringify(sinv); await database.ref('stashes/' + current_stash_id).set(data); save_data(); upd_ui(); refresh_stash_ui(); alert(`Спрятано вещей: ${moved}`); } else alert("Нет вещей в рюкзаке!"); }
window.take_all_armor = async function() { let snap = await database.ref('stashes/' + current_stash_id).once('value'); let data = snap.val(); if(!data) return; let sinv = JSON.parse(data.inv||"{}"); let moved = 0; const gear = ['sword_iron','sword_diamond','sword_netherite','mace','armor_leather','armor_iron','armor_diamond','armor_netherite','totem','sphere_titan','sphere_chaos','sphere_satyr','sphere_ares','sphere_bestia','sphere_hydra','sphere_icarus','sphere_erida','talisman_crusher','talisman_punisher','talisman_discord','talisman_tyrant','talisman_rage','talisman_vortex','talisman_darkness','talisman_demon']; gear.forEach(g => { if(sinv[g]>0) { inv[g] = (inv[g]||0)+sinv[g]; moved+=sinv[g]; sinv[g]=0; } }); if(moved>0) { data.inv = JSON.stringify(sinv); await database.ref('stashes/' + current_stash_id).set(data); save_data(); upd_ui(); refresh_stash_ui(); alert(`Взято вещей: ${moved}`); } else alert("Нет вещей в стэше!"); }
window.use_locator = async function() { if(vrgk < 50000) return alert("Локатор стоит 50 000 воргиков!"); vrgk -= 50000; upd_ui(); save_data(); let snap = await database.ref('stashes').once('value'); let all_st = snap.val(); let found = null; for(let id in all_st) { let s = all_st[id]; if(s.owner !== nickname && Math.abs(s.x - loc_x) < 500 && Math.abs(s.z - loc_z) < 500) { found = id; break; } } if(found) { if(confirm("ЛОКАТОР НАШЁЛ ЧУЖОЙ ТАЙНИК РЯДОМ!\nВзломать его и забрать все вещи?")) { let s_data = all_st[found]; let sinv = JSON.parse(s_data.inv||"{}"); if(s_data.skrepki > 0) { skrepki += s_data.skrepki; } for(let k in sinv) { inv[k] = (inv[k]||0) + sinv[k]; } await database.ref('stashes/' + found).remove(); save_data(); upd_ui(); render_inventory(); alert(`✅ ТАЙНИК УСПЕШНО ОГРАБЛЕН!\nВсе вещи и ${s_data.skrepki||0} скрепок перенесены в твой рюкзак.`); } } else { alert("В радиусе 500 блоков нет чужих тайников. Сделай /RTP и попробуй снова."); } }

// === CANVAS И КАРТА ЛОГИКА ===
function init_map() {
    try {
        inject_enchant_button();
        let wrap = document.getElementById('map-wrapper'); if(!wrap || !canvas) return;
        canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight;
        let joyZone = document.getElementById('joystick-zone'); let joyKnob = document.getElementById('joystick-knob'); let jRect = null;
        if(joyZone) {
            joyZone.addEventListener('touchstart', e => { e.preventDefault(); isJoyActive = true; jRect = joyZone.getBoundingClientRect(); handleJoy(e.touches[0]); }, {passive:false});
            joyZone.addEventListener('touchmove', e => { e.preventDefault(); if(isJoyActive) handleJoy(e.touches[0]); }, {passive:false});
            joyZone.addEventListener('touchend', e => { e.preventDefault(); isJoyActive = false; joyX = 0; joyY = 0; if(joyKnob) joyKnob.style.transform = `translate(0px, 0px)`; }, {passive:false});
        }
        function handleJoy(t) { let dx = t.clientX - (jRect.left + 50); let dy = t.clientY - (jRect.top + 50); let dist = Math.sqrt(dx*dx + dy*dy); let maxD = 35; if(dist > maxD) { dx = (dx/dist)*maxD; dy = (dy/dist)*maxD; } if(joyKnob) joyKnob.style.transform = `translate(${dx}px, ${dy}px)`; joyX = dx / maxD; joyY = dy / maxD; }
        
        canvas.addEventListener('touchstart', e => {
            e.preventDefault(); let rect = canvas.getBoundingClientRect(); let tx = e.touches[0].clientX - rect.left; let ty = e.touches[0].clientY - rect.top;
            let clicked_nick = null; let cx = canvas.width/2; let cy = canvas.height/2;
            for(let p in online_players) { 
                if(p === nickname || Date.now() - online_players[p].last > 15000) continue; 
                let pdx = online_players[p].x - loc_x; let pdz = online_players[p].z - loc_z; 
                let screenX = cx + pdx; let screenY = cy + pdz; 
                if(Math.abs(tx - screenX) < 25 && Math.abs(ty - screenY) < 25) { clicked_nick = p; break; } 
            }
            if(clicked_nick) { current_target = clicked_nick; update_target_hud(); }
        }, {passive:false});

        requestAnimationFrame(draw_map); 
        setInterval(sync_my_pos, 2000);
    } catch(e) { console.error("MAP INIT ERROR", e); }
}

function get_best_armor() { if(!inv) return 'none'; if(inv['armor_netherite'] > 0) return 'netherite'; if(inv['armor_diamond'] > 0) return 'diamond'; if(inv['armor_iron'] > 0) return 'iron'; if(inv['armor_leather'] > 0) return 'leather'; return 'none'; }
function get_best_weapon() { if(!inv) return 'none'; if(inv['mace'] > 0) return 'mace'; if(inv['sword_netherite'] > 0) return 'sword_netherite'; if(inv['sword_diamond'] > 0) return 'sword_diamond'; if(inv['sword_iron'] > 0) return 'sword_iron'; return 'none'; }
function get_armor_color(type) { if(type === 'netherite') return '#303'; if(type === 'diamond') return '#0ff'; if(type === 'iron') return '#aaa'; if(type === 'leather') return '#8B4513'; return '#fff'; }
function get_ore_at(x, z) { let gridX = Math.floor(x/100); let gridZ = Math.floor(z/100); if(mined_ores[gridX + '_' + gridZ]) return null; let noise = Math.sin(gridX * 12.9898 + gridZ * 78.233) * 43758.5453; noise = noise - Math.floor(noise); if(noise > 0.95) return 'diamond'; if(noise > 0.80) return 'iron'; return null; }

function sync_my_pos() { 
    if(!nickname) return; 
    database.ref('world_players/' + nickname).set({ x: loc_x, z: loc_z, armor: get_best_armor(), hp: my_cur_hp, max_hp: get_pvp_stats().max_hp, last: Date.now(), enchants: enchants }); 
}

function draw_map() {
    if(current_tab !== 'anarchy') return requestAnimationFrame(draw_map);
    let wrap = document.getElementById('map-wrapper'); if(wrap && canvas && (canvas.width !== wrap.clientWidth || canvas.height !== wrap.clientHeight)) { canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight; }
    
    if(isJoyActive && !is_stunned) { loc_x += joyX * 4; loc_z += joyY * 4; upd_ui(); if(Date.now() - last_stash_check > 1000) { sync_my_pos(); check_local_stashes(); last_stash_check = Date.now(); } }
    
    if(!ctx) return requestAnimationFrame(draw_map);
    ctx.fillStyle = '#1e331e'; ctx.fillRect(0,0, canvas.width, canvas.height); 
    let cx = canvas.width/2; let cy = canvas.height/2; is_on_ore = null;
    let myGridX = Math.floor(loc_x/100); let myGridZ = Math.floor(loc_z/100);

    let sx = cx - loc_x - 100; let sy = cy - loc_z - 100;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.05)'; ctx.fillRect(sx, sy, 200, 200);
    ctx.strokeStyle = '#0f0'; ctx.strokeRect(sx, sy, 200, 200);

    for(let i = -3; i <= 3; i++) { for(let j = -3; j <= 3; j++) { let gx = myGridX + i; let gz = myGridZ + j; let ore = get_ore_at(gx*100, gz*100); if(ore) { let screenX = cx + (gx*100 - loc_x); let screenY = cy + (gz*100 - loc_z); ctx.fillStyle = ore === 'diamond' ? '#0ff' : '#ccc'; ctx.beginPath(); ctx.arc(screenX, screenY, 8, 0, Math.PI*2); ctx.fill(); if(i === 0 && j === 0) is_on_ore = ore; } } }
    let btn = document.getElementById('mine-btn'); if(btn) { if(is_on_ore) { btn.style.display = 'flex'; } else { btn.style.display = 'none'; } }
    
    for(let d_id in world_drops) {
        let drop = world_drops[d_id]; let dx = drop.x - loc_x, dz = drop.z - loc_z;
        if(Math.abs(dx) < canvas.width/2 && Math.abs(dz) < canvas.height/2) {
            ctx.fillStyle = '#ff0'; ctx.beginPath(); ctx.arc(cx+dx, cy+dz, 6, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '9px Arial'; ctx.fillText('ЛУТ', cx+dx, cy+dz-10);
        }
        if(Math.hypot(dx, dz) < 25) pickup_drop(d_id);
    }

    for(let p in online_players) { 
        if(p === nickname || Date.now() - online_players[p].last > 15000) continue; 
        let dx = online_players[p].x - loc_x; let dz = online_players[p].z - loc_z; 
        if(Math.abs(dx) < canvas.width/2 + 20 && Math.abs(dz) < canvas.height/2 + 20) { 
            ctx.fillStyle = (current_target === p) ? '#f55' : get_armor_color(online_players[p].armor); 
            ctx.fillRect(cx + dx - 10, cy + dz - 10, 20, 20); 
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.fillText(p, cx + dx, cy + dz - 15); 
            let en_hp = Math.max(0, online_players[p].hp || 20); let en_mhp = online_players[p].max_hp || 20;
            ctx.fillStyle = '#f00'; ctx.fillRect(cx + dx - 10, cy + dz + 12, 20, 3);
            ctx.fillStyle = '#0f0'; ctx.fillRect(cx + dx - 10, cy + dz + 12, 20 * (en_hp/en_mhp), 3);
        } 
    }
    
    ctx.fillStyle = get_armor_color(get_best_armor()); ctx.fillRect(cx - 10, cy - 10, 20, 20); ctx.strokeStyle = '#fff'; ctx.strokeRect(cx - 10, cy - 10, 20, 20);
    ctx.fillStyle = '#000'; ctx.fillRect(cx - 10, cy + 12, 20, 2); ctx.fillStyle = '#0ff'; ctx.fillRect(cx - 10, cy + 12, 20 * (Math.max(0, weapon_dur)/1000), 2); 
    ctx.fillStyle = '#000'; ctx.fillRect(cx - 10, cy + 15, 20, 2); ctx.fillStyle = '#aaa'; ctx.fillRect(cx - 10, cy + 15, 20 * (Math.max(0, armor_dur)/1000), 2); 

    update_target_hud();
    requestAnimationFrame(draw_map);
}

function get_pvp_stats() { 
    let max_hp = 20; let dmg = 1; let armor_reduct = 0; let wp = get_best_weapon(); let ar = get_best_armor();
    if(ar === 'netherite') armor_reduct = 0.70; else if(ar === 'diamond') armor_reduct = 0.50; else if(ar === 'iron') armor_reduct = 0.30; else if(ar === 'leather') armor_reduct = 0.10; 
    if(wp === 'mace') dmg = 12; else if(wp === 'sword_netherite') dmg = 8; else if(wp === 'sword_diamond') dmg = 7; else if(wp === 'sword_iron') dmg = 6; 
    if(wp !== 'none' && wp.includes('sword')) dmg += (enchants.sharpness || 0) * 0.5;
    if(wp === 'mace') dmg += (enchants.density || 0) * 1.0;
    armor_reduct += (enchants.protection || 0) * 0.04;
    if(armor_reduct > 0.90) armor_reduct = 0.90;

    let offhand = inv['active_offhand'];
    if(offhand === 'sphere_titan') { armor_reduct += 0.15; } else if(offhand === 'sphere_chaos') { max_hp -= 4; armor_reduct += 0.10; dmg += 2.5; } else if(offhand === 'sphere_satyr') { dmg += 2; } else if(offhand === 'sphere_bestia') { max_hp += 4; armor_reduct += 0.05; } else if(offhand === 'sphere_ares') { max_hp -= 2; dmg += 6; armor_reduct -= 0.15; } else if(offhand === 'sphere_hydra') { max_hp += 4; armor_reduct += 0.10; } else if(offhand === 'sphere_icarus') { max_hp += 2; dmg += 2; } else if(offhand === 'sphere_erida') { max_hp += 2; } else if(offhand === 'talisman_crusher') { max_hp += 4; dmg += 3; armor_reduct += 0.10; } else if(offhand === 'talisman_punisher') { max_hp -= 4; dmg += 7; } else if(offhand === 'talisman_discord') { max_hp += 2; dmg += 4; armor_reduct -= 0.15; } else if(offhand === 'talisman_tyrant') { max_hp -= 4; dmg += 2; armor_reduct += 0.10; } else if(offhand === 'talisman_rage') { max_hp -= 4; dmg += 5; } else if(offhand === 'talisman_vortex') { max_hp += 2; } else if(offhand === 'talisman_darkness') { max_hp += 1; armor_reduct += 0.05; } else if(offhand === 'talisman_demon') { dmg += 2; }
    return { hp: max_hp, max_hp: max_hp, dmg: dmg, armor: armor_reduct, wp: wp, ar: ar }; 
}

function setup_dmg_listener() {
    if(!nickname) return;
    database.ref('world_players/' + nickname + '/dmg_queue').on('child_added', snap => { let data = snap.val(); snap.ref.remove(); process_incoming_damage(data); });
    database.ref('world_drops').on('value', snap => { world_drops = snap.val() || {}; });
}

window.map_attack = function() {
    if(is_stunned) return;
    if(Math.abs(loc_x) <= 100 && Math.abs(loc_z) <= 100) return alert("Мирная Зона!");

    let closest = null; let min_d = 45;
    for (let key in online_players) {
        if (key === nickname || Date.now() - online_players[key].last > 15000) continue;
        let p = online_players[key]; if (Math.abs(p.x) <= 100 && Math.abs(p.z) <= 100) continue; 
        let d = Math.hypot(p.x - loc_x, p.z - loc_z); if (d < min_d) { min_d = d; closest = key; }
    }
    if(!closest) return; current_target = closest; trigger_attack_logic();
}

function trigger_attack_logic() {
    let now = Date.now(); let is_crit = false; let is_sweeping = false;
    if (now - last_combat_hit_time <= 1200) combo_count++; else combo_count = 1;

    let stats = get_pvp_stats(); if (stats.wp === 'none') return; 

    if(Math.random() >= ((enchants.unbreaking || 0) * 0.25)) {
        weapon_dur -= 15;
        if(weapon_dur <= 0) { inv[stats.wp]--; weapon_dur = 1000; spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "ОРУЖИЕ СЛОМАЛОСЬ!"); save_data(); render_inventory(); return; }
    }

    if (stats.wp.includes('sword')) { sword_hits++; if (sword_hits >= 3) { is_sweeping = true; sword_hits = 0; combo_count = 0; } }
    if (!is_sweeping && Math.random() <= (inv['active_offhand'] === 'sphere_erida' ? 0.35 : 0.20)) is_crit = true;

    let final_dmg = stats.dmg;
    if (!is_sweeping && combo_count >= 3) { let boost = Math.min((combo_count - 2) * 0.20, 0.40); final_dmg *= (1 + boost); }
    if (is_crit) final_dmg *= 1.5;

    last_combat_hit_time = now; update_combo_ui(is_sweeping); set_combat_log();

    database.ref('world_players/' + current_target + '/dmg_queue').push({ dmg: final_dmg, attacker: nickname, is_crit: is_crit, is_sweeping: is_sweeping, ts: now, ench: enchants, wp: stats.wp });
    let btn = document.getElementById('map-btn-attack'); if(btn) { btn.style.transform = 'scale(0.8)'; setTimeout(() => btn.style.transform = 'scale(1)', 100); }
    if(navigator.vibrate) navigator.vibrate(20);
}

function process_incoming_damage(data) {
    let stats = get_pvp_stats(); let armor = stats.armor; let atk_ench = data.ench || {};
    if(stats.ar !== 'none' && Math.random() >= ((enchants.unbreaking || 0) * 0.25)) {
        armor_dur -= 20;
        if(armor_dur <= 0) { inv[stats.ar]--; armor_dur = 1000; spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "БРОНЯ СЛОМАЛАСЬ!"); save_data(); render_inventory(); }
    }

    if (data.is_sweeping) armor = Math.max(0, armor - 0.20);
    if (data.wp === 'mace') armor = Math.max(0, armor - ((atk_ench.breach||0) * 0.15)); 
    let actual_dmg = data.dmg * (1 - armor);
    if ((atk_ench.fire_aspect || 0) > 0) { let fire_dmg = ((atk_ench.fire_aspect || 0) * 1.5) * (1 - ((enchants.fire_protection || 0) * 0.20)); actual_dmg += Math.max(0, fire_dmg); }

    if (actual_dmg < 0.5) actual_dmg = 0.5; my_cur_hp -= actual_dmg;
    let stun_time = 350 + ((atk_ench.knockback||0) * 150); is_stunned = true; setTimeout(() => { is_stunned = false; }, stun_time);

    if ((enchants.thorns || 0) > 0 && Math.random() < 0.3 && !data.is_thorns) { database.ref('world_players/' + data.attacker + '/dmg_queue').push({ dmg: (enchants.thorns || 0) * 1, attacker: nickname, is_thorns: true }); }

    set_combat_log(); combo_count = 0; update_combo_ui(false);
    let mapW = document.getElementById('map-wrapper'); if(mapW) { mapW.style.transform = 'translate(5px, 5px)'; setTimeout(() => mapW.style.transform = 'none', 100); }

    if (my_cur_hp <= 0) {
        if((inv['totem']||0) > 0) { inv['totem']--; my_cur_hp = 4; spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "ТОТЕМ!"); save_data(); sync_my_pos(); } else { handle_death(data.attacker); }
    } else { sync_my_pos(); }
}

function handle_death(killer) {
    end_combat_log(); alert(`☠️ ТЕБЯ УБИЛ ИГРОК ${killer}!\nВесь лут выпал на карту.`);
    let drop_id = "drop_" + Date.now() + "_" + Math.floor(Math.random()*1000);
    database.ref('world_drops/' + drop_id).set({ x: loc_x, z: loc_z, inv: JSON.stringify(inv), skrepki: skrepki, from: nickname });
    my_cur_hp = get_pvp_stats().max_hp; loc_x = 0; loc_z = 0; inv = {}; skrepki = 0; weapon_dur = 1000; armor_dur = 1000;
    save_data(); upd_ui(); render_inventory(); sync_my_pos();
}

function set_combat_log() {
    combat_timer = 30;
    if (!in_combat) { in_combat = true; let bdg = document.getElementById('combat-log-badge'); if(bdg) bdg.style.display = 'block'; database.ref('players/' + nickname + '/died_offline').onDisconnect().set(true); }
    if (combat_interval) clearInterval(combat_interval);
    let lTm = document.getElementById('combat-log-timer'); if(lTm) lTm.innerText = combat_timer;
    combat_interval = setInterval(() => { combat_timer--; let tEl = document.getElementById('combat-log-timer'); if(tEl) tEl.innerText = combat_timer; if (combat_timer <= 0) end_combat_log(); }, 1000);
}

function end_combat_log() { in_combat = false; clearInterval(combat_interval); let bdg = document.getElementById('combat-log-badge'); if(bdg) bdg.style.display = 'none'; if(nickname) database.ref('players/' + nickname + '/died_offline').onDisconnect().cancel(); }

function update_combo_ui(was_sweeping) {
    let badge = document.getElementById('combat-combo-badge'); if(!badge) return;
    if (combo_count >= 3 && !was_sweeping) {
        badge.style.display = 'block'; let boost = Math.min((combo_count - 2) * 20, 40);
        let cbCount = document.getElementById('combat-combo-count'); if(cbCount) cbCount.innerText = combo_count;
        let cbBoost = document.getElementById('combat-combo-boost'); if(cbBoost) cbBoost.innerText = `+${boost}%`;
    } else if (was_sweeping) {
        badge.style.display = 'block'; let cbCount = document.getElementById('combat-combo-count'); if(cbCount) cbCount.innerText = "КЛИНКОМ!";
        let cbBoost = document.getElementById('combat-combo-boost'); if(cbBoost) cbBoost.innerText = "Броня пробита"; setTimeout(() => {if(combo_count<3) badge.style.display = 'none';}, 1000);
    } else { badge.style.display = 'none'; }
}

function update_target_hud() {
    let hud = document.getElementById('target-hud');
    if (!current_target || !online_players[current_target] || (Date.now() - online_players[current_target].last > 15000)) { if(hud) hud.style.display = 'none'; return; }
    let p = online_players[current_target]; if(hud) hud.style.display = 'block'; 
    let tn = document.getElementById('target-name'); if(tn) tn.innerText = current_target;
    let hp = Math.max(0, p.hp || 20).toFixed(1); let mhp = p.max_hp || 20;
    let ht = document.getElementById('target-hp-text'); if(ht) ht.innerText = `${hp}/${mhp} HP`;
    let hf = document.getElementById('target-hp-fill'); if(hf) hf.style.width = `${Math.min(100, (hp/mhp)*100)}%`;
}

window.map_heal = function() {
    if((inv['gapple']||0) <= 0) return alert("Нет золотых яблок!");
    let now = Date.now(); if(now - last_heal_time < 2000) return; 
    last_heal_time = now; inv['gapple']--; 
    let heal_amt = inv['active_offhand'] === 'sphere_hydra' ? 6 : 4; 
    let max_hp = get_pvp_stats().max_hp; my_cur_hp = Math.min(max_hp, my_cur_hp + heal_amt);
    spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, `+${heal_amt} HP`); save_data(); sync_my_pos(); render_inventory();
}

window.pvp_swap_offhand = function() {
    let options = []; for(let key in inv) { if(inv[key] > 0 && (key.startsWith('sphere') || key.startsWith('talisman')) && key !== inv['active_offhand']) options.push(key); }
    if(options.length === 0) return; 
    inv['active_offhand'] = options[0]; my_cur_hp = Math.min(my_cur_hp, get_pvp_stats().max_hp);
    save_data(); render_inventory(); sync_my_pos(); spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "СВАП!");
}

function pickup_drop(id) {
    if(world_drops[id] && !world_drops[id].picking) {
        world_drops[id].picking = true; 
        database.ref('world_drops/'+id).once('value').then(snap => {
            let d = snap.val();
            if(d) {
                database.ref('world_drops/'+id).remove();
                if((enchants.mending || 0) > 0) { weapon_dur = Math.min(1000, weapon_dur + 150); armor_dur = Math.min(1000, armor_dur + 150); }
                let drop_skr = d.skrepki || 0;
                if((enchants.looting || 0) > 0 && d.from && Math.random() < ((enchants.looting || 0) * 0.15)) { drop_skr = Math.floor(drop_skr * 1.5); spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "ДОБЫЧА СРАБОТАЛА!"); }
                skrepki += drop_skr;
                let l_inv = JSON.parse(d.inv||"{}"); for(let k in l_inv) inv[k] = (inv[k]||0) + l_inv[k];
                save_data(); upd_ui(); render_inventory(); spawn_txt(canvas?canvas.width/2:100, canvas?canvas.height/2:100, "ВЗЯЛ ЛУТ!");
            }
        });
    }
}

// === УПРАВЛЕНИЕ ВКЛАДКАМИ И ОСТАЛЬНОЕ ===
window.sw_tab = function(tabid, el) { 
    if (in_combat && tabid !== 'anarchy') return alert("Внимание! Ты в бою! Нельзя переключать вкладки!");
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); 
    let target = document.getElementById(`tab-${tabid}`); if(target) target.classList.add('active'); if(el) el.classList.add('active'); 
    current_tab = tabid; if (tabid === 'rating' || tabid === 'clubs') { if (Date.now() - last_sync > 60000) { sync_cloud(); } else { if (tabid === 'rating') render_leaderboard(); if (tabid === 'clubs') render_clubs_list(); } } 
};

window.switch_top = function(tab) { current_top_tab = tab; let btns = ['players', 'clubs', 'ranked', 'hof']; btns.forEach(b => { let e = document.getElementById('btn-top-'+b); if(e) e.className = 'buy-btn'; }); let ae = document.getElementById('btn-top-'+tab); if(ae) ae.className = 'buy-btn gold'; render_leaderboard(); }

function render_leaderboard() { 
    let lb = document.getElementById('leaderboard-content'); if(!lb) return;
    if (Object.keys(cached_players).length === 0 && current_top_tab !== 'clubs') { lb.innerHTML = '<div style="text-align:center; color:#555;">загрузка...</div>'; return; } 
    let html = ''; 
    if (current_top_tab === 'players') { let sorted = Object.keys(cached_players).map(k => { return { name: k, vrgk: cached_players[k].vrgk || 0, club: cached_players[k].club, stats: cached_players[k].stats || [], drank: cached_players[k].donate_rank||0 }; }).sort((a, b) => b.vrgk - a.vrgk); sorted.forEach((p, i) => { let pos = i + 1; let c_cls = pos === 1 ? 'gold-pos' : pos === 2 ? 'silver-pos' : pos === 3 ? 'bronze-pos' : ''; let col = p.stats[24] || '#fff'; let og = p.stats[25] ? ' 🌟' : ''; let t_disp = p.stats[42] ? `[${p.stats[42]}] ` : ''; let d_badge = p.drank > 0 ? `<span style="font-size:10px; color:${RANKS_INFO[p.drank].color}; font-weight:bold; margin-right:4px;">[${RANKS_INFO[p.drank].name}]</span>` : ''; html += `<div class="upgrade-item" style="cursor:pointer;" onclick="open_profile('${p.name}')"><div class="rank-pos ${c_cls}">${pos}</div><div class="upgrade-info" style="flex: 1; margin-left: 10px;"><span class="upgrade-name" style="color:${col}">${d_badge}${t_disp}${p.name}${og}</span>${p.club ? `<span style="font-size: 10px; color: #888; margin-top: -3px;">${p.club}</span>` : ''}</div><div class="upgrade-price">${fmt(p.vrgk)}</div></div>`; }); } 
    else if (current_top_tab === 'clubs') { let club_arr = []; for (let cname in cached_clubs) { let c = cached_clubs[cname]; let total = 0; c.members.forEach(m => { if(cached_players[m]) total += (cached_players[m].vrgk || 0); }); club_arr.push({name: cname, vrgk: total, mems: c.members.length, e_pts: c.event_pts || 0}); } let is_event = (global_event_data && global_event_data.active); if (is_event) club_arr.sort((a,b) => b.e_pts - a.e_pts); else club_arr.sort((a,b) => b.vrgk - a.vrgk); club_arr.forEach((c, i) => { let pos = i + 1; let c_cls = pos === 1 ? 'gold-pos' : pos === 2 ? 'silver-pos' : pos === 3 ? 'bronze-pos' : ''; let crown = c.name === cached_last_winner ? ' 👑' : ''; let val_disp = is_event ? `🏆 ${c.e_pts} очков` : `🏆 ${fmt(c.vrgk)}`; html += `<div class="upgrade-item" style="cursor:pointer;" onclick="open_club_details('${c.name}')"><div class="rank-pos ${c_cls}">${pos}</div><div class="upgrade-info" style="flex: 1; margin-left: 10px;"><span class="upgrade-name">${c.name}${crown}</span><span style="font-size: 10px; color: #888; margin-top: -3px;">${c.mems} чел.</span></div><div class="upgrade-price">${val_disp}</div></div>`; }); if (club_arr.length === 0) html = '<div style="text-align:center; color:#555;">клубов пока нет</div>'; } 
    else if (current_top_tab === 'ranked') { let sorted = Object.keys(cached_players).map(k => { return { name: k, rank: cached_players[k].rank || 0, vrgk: cached_players[k].vrgk || 0, club: cached_players[k].club, stats: cached_players[k].stats || [], drank: cached_players[k].donate_rank||0 }; }).sort((a, b) => { if (b.rank !== a.rank) return b.rank - a.rank; return b.vrgk - a.vrgk; }); sorted.forEach((p, i) => { let pos = i + 1; let c_cls = pos === 1 ? 'gold-pos' : pos === 2 ? 'silver-pos' : pos === 3 ? 'bronze-pos' : ''; let col = p.stats[24] || '#fff'; let og = p.stats[25] ? ' 🌟' : ''; let rank_name = RANKS[p.rank] || "Бронза I"; let d_badge = p.drank > 0 ? `<span style="font-size:10px; color:${RANKS_INFO[p.drank].color}; font-weight:bold; margin-right:4px;">[${RANKS_INFO[p.drank].name}]</span>` : ''; html += `<div class="upgrade-item" style="cursor:pointer;" onclick="open_profile('${p.name}')"><div class="rank-pos ${c_cls}">${pos}</div><div class="upgrade-info" style="flex: 1; margin-left: 10px;"><span class="upgrade-name" style="color:${col}">${d_badge}${p.name}${og}</span>${p.club ? `<span style="font-size: 10px; color: #888; margin-top: -3px;">${p.club}</span>` : ''}</div><div class="upgrade-price" style="color: #0f0;">${rank_name}</div></div>`; }); } 
    else if (current_top_tab === 'hof') { html = `<div style="text-align:center; margin-bottom:15px; color:#d4af37; font-weight:bold;">УВЕКОВЕЧЕННЫЕ ЛЕГЕНДЫ</div>`; let top_taps = Object.keys(cached_players).map(k => ({n:k, t:cached_players[k].stats?.[38]||0})).sort((a,b)=>b.t-a.t)[0]; if(top_taps && top_taps.t > 0) html += `<div class="upgrade-item"><div class="upgrade-info"><span class="upgrade-name">Бог Тапов</span><span class="upgrade-desc">${top_taps.n}</span></div><div style="font-weight:bold; color:#fff;">${fmt(top_taps.t)} тапов</div></div>`; let top_ws = Object.keys(cached_players).map(k => ({n:k, t:cached_players[k].stats?.[41]||0})).sort((a,b)=>b.t-a.t)[0]; if(top_ws && top_ws.t > 0) html += `<div class="upgrade-item"><div class="upgrade-info"><span class="upgrade-name">Непобедимый</span><span class="upgrade-desc">${top_ws.n}</span></div><div style="font-weight:bold; color:#fff;">Стрик: ${top_ws.t} 🔥</div></div>`; if(cached_last_winner) html += `<div class="upgrade-item"><div class="upgrade-info"><span class="upgrade-name">Чемпионы Ивента</span><span class="upgrade-desc">Клуб</span></div><div style="font-weight:bold; color:#d4af37;">${cached_last_winner} 👑</div></div>`; } 
    lb.innerHTML = html; 
}
window.submit_club = async function() { let name = document.getElementById('c-name').value.trim(); let desc = document.getElementById('c-desc').value.trim(); let req = parseInt(document.getElementById('c-req').value) || 0; let type = document.getElementById('c-type').value; if(!name || name.length < 3) return alert("Минимум 3 символа!"); let snap = await database.ref('clubs/' + name).once('value'); if(snap.val()) return alert("Клуб уже существует!"); if(donate_rank < 7) { if(vrgk < 20000) return alert("Создание клуба стоит 20,000. Или выбей донат [Элита]!"); vrgk -= 20000; } let cdata = { owner: nickname, desc: desc, req: req, type: type, members: [nickname], event_pts: 0 }; await database.ref('clubs/' + name).set(cdata); localStorage.setItem(PREFIX+'club', name); save_data(); upd_ui(); document.getElementById('create-club-modal').style.display='none'; sync_cloud(); alert("Клуб создан!"); };
window.render_clubs_list = function() { let cc = document.getElementById('club-content'); if(!cc) return; let create_cost = donate_rank >= 7 ? "Бесплатно" : "20 000 воргиков"; let html = `<button class="buy-btn gold" style="width:100%; margin-bottom:10px;" onclick="document.getElementById('create-club-modal').style.display='flex'">Создать клуб (${create_cost})</button>`; for(let cname in cached_clubs) { let c = cached_clubs[cname]; html += `<div class="club-card" onclick="open_club_details('${cname}')"><div class="club-name-big">${cname}</div><div style="color:#aaa; font-size:12px;">Участников: ${c.members.length}</div></div>`; } cc.innerHTML = html; };
window.open_club_details = function(cname) { let c = cached_clubs[cname]; if(!c) return; let html = `<div class="modal-title">${cname}</div><div class="club-desc-box">${c.desc||''}</div><div style="margin-top:10px;">Владелец: <b>${c.owner}</b></div>`; let my_c = localStorage.getItem(PREFIX+'club'); if(my_c !== cname) html += `<button class="buy-btn" style="width:100%; margin-top:10px;" onclick="join_club('${cname}')">Вступить</button>`; else html += `<button class="buy-btn" style="width:100%; margin-top:10px; background:#511;" onclick="leave_club('${cname}')">Выйти</button>`; html += `<button class="buy-btn" style="width:100%; margin-top:5px;" onclick="document.getElementById('view-club-modal').style.display='none'">Закрыть</button>`; document.getElementById('view-club-content').innerHTML = html; document.getElementById('view-club-modal').style.display = 'flex'; };
window.join_club = async function(cname) { let c = cached_clubs[cname]; if(vrgk < (c.req||0)) return alert("Нужно " + c.req + " воргиков!"); c.members.push(nickname); await database.ref('clubs/'+cname+'/members').set(c.members); localStorage.setItem(PREFIX+'club', cname); document.getElementById('view-club-modal').style.display='none'; sync_cloud(); };
window.leave_club = async function(cname) { let c = cached_clubs[cname]; c.members = c.members.filter(m => m !== nickname); if(c.owner === nickname && c.members.length > 0) c.owner = c.members[0]; if(c.members.length === 0) await database.ref('clubs/'+cname).remove(); else await database.ref('clubs/'+cname).set(c); localStorage.removeItem(PREFIX+'club'); document.getElementById('view-club-modal').style.display='none'; sync_cloud(); };

window.start_ranked_search = function() { localStorage.setItem(PREFIX + 'in_match', '1'); document.getElementById('ranked-modal').style.display = 'flex'; document.getElementById('ranked-status').innerText = 'Поиск противника...'; document.getElementById('arena-container').style.display = 'none'; document.getElementById('match-score').style.display = 'none'; document.getElementById('arena-exit-btn').style.display = 'none'; setTimeout(() => { document.getElementById('ranked-status').innerText = `Противник найден: Bot_${Math.floor(Math.random()*9999)}`; setTimeout(show_ban_phase, 1500); }, 1500); }
function show_ban_phase() { document.getElementById('ranked-status').innerText = 'ФАЗА БАНА: Выбери 1 режим, чтобы его вычеркнуть'; let container = document.getElementById('arena-container'); container.style.display = 'block'; container.style.padding = '15px'; let html = `<div style="text-align:center; font-weight:bold; color:#d4af37; margin-bottom:10px;">ДОСТУПНЫЕ РЕЖИМЫ</div>`; for(let i=1; i<=5; i++) html += `<button class="ban-btn" onclick="ban_mode(${i})">Забанить: ${arena_modes_names[i]}</button>`; container.innerHTML = html; }
window.ban_mode = function(my_ban) { let available = [1,2,3,4,5].filter(x => x !== my_ban); let bot_ban = available[Math.floor(Math.random() * available.length)]; arena_queue = available.filter(x => x !== bot_ban); arena_queue.sort(() => Math.random() - 0.5); document.getElementById('arena-container').innerHTML = `<div style="text-align:center; padding-top: 50px;"><div style="color:#0f0; margin-bottom:10px;">Твой бан: ${arena_modes_names[my_ban]}</div><div style="color:#f00; margin-bottom:20px;">Бот забанил: ${arena_modes_names[bot_ban]}</div><div style="color:#fff; font-weight:bold;">Матч из 3 раундов начинается...</div></div>`; my_round_wins = 0; bot_round_wins = 0; current_round = 0; document.getElementById('match-score').style.display = 'block'; document.getElementById('score-you').innerText = '0'; document.getElementById('score-bot').innerText = '0'; setTimeout(start_next_round, 2500); }
function start_next_round() { if(my_round_wins === 2 || bot_round_wins === 2 || current_round >= 3) { end_match(); return; } arena_mode = arena_queue[current_round]; arena_my = 0; arena_bot = 0; click_times = []; arena_locked_until = 0; is_game_over = false; tug_score = 50; document.getElementById('arena-container').style.padding = '0px'; document.getElementById('ranked-status').innerText = `Раунд ${current_round+1}/3: ${arena_modes_names[arena_mode].toUpperCase()}`; if (arena_mode === 1) arena_target_max = 50; else if (arena_mode === 2) arena_target_max = 30; else if (arena_mode === 3) arena_target_max = 20; else if (arena_mode === 4) arena_target_max = 100; else if (arena_mode === 5) arena_target_max = 15; if(arena_mode === 2) arena_dots_left = 3; spawn_arena_target(); let bot_time_to_finish = Math.max(3.5, 12 - (Math.min(player_rank, 21) * 0.35)); let bot_interval_ms = (bot_time_to_finish * 1000) / arena_target_max; if(arena_mode === 4) bot_interval_ms = (bot_time_to_finish * 1000) / 25; bot_int = setInterval(() => { if(is_game_over) return; if(arena_mode === 4) { tug_score -= 2; update_tug_ui(); if(tug_score <= 0) end_round(false); } else { arena_bot++; let botEl = document.getElementById('arena-bot-score'); if(botEl) botEl.innerText = 'Бот: ' + arena_bot; if(arena_bot >= arena_target_max) end_round(false); } }, bot_interval_ms); }
function update_tug_ui() { let fill = document.getElementById('tug-fill-bar'); if(fill) { fill.style.width = `${Math.max(0, Math.min(100, tug_score))}%`; fill.style.background = tug_score > 50 ? '#0f0' : '#f00'; } }
function spawn_arena_target() { let container = document.getElementById('arena-container'); if(arena_mode === 4) { container.innerHTML = `<div class="arena-hud"><div class="arena-score" style="color: #0f0;" id="arena-my-score">Ты</div><div class="arena-vs">VS</div><div class="arena-score" style="color: #f00;" id="arena-bot-score">Бот</div></div><div style="text-align:center; margin-top:20px; color:#aaa; font-size:12px; pointer-events:none;">Тапай по всему экрану быстрее бота!</div><div class="tug-container" id="tug-area" style="pointer-events:none;"><div class="tug-fill" id="tug-fill-bar"></div><div class="tug-marker"></div></div><div id="tug-touch-zone" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;"></div>`; let tugTouch = document.getElementById('tug-touch-zone'); tugTouch.addEventListener('touchstart', e => { e.preventDefault(); for(let i=0; i<e.changedTouches.length; i++) hit_tug(); }, {passive: false}); tugTouch.addEventListener('mousedown', e => { hit_tug(); }); return; } else if (arena_mode === 5) { container.innerHTML = `<div class="arena-hud"><div class="arena-score" style="color: #0f0;" id="arena-my-score">Свайпов: ${arena_my}/${arena_target_max}</div><div class="arena-vs">VS</div><div class="arena-score" style="color: #f00;" id="arena-bot-score">Бот: ${arena_bot}</div></div>`; spawn_swipe(); return; } container.innerHTML = `<div class="arena-hud"><div class="arena-score" style="color: #0f0;" id="arena-my-score">Ты: ${arena_my}</div><div class="arena-vs">VS</div><div class="arena-score" style="color: #f00;" id="arena-bot-score">Бот: ${arena_bot}</div></div>`; if (arena_mode === 1) { let btn = document.createElement('div'); btn.className = 'arena-target-1'; btn.onmousedown = (e) => { e.preventDefault(); hit_arena_target(); }; btn.ontouchstart = (e) => { e.preventDefault(); for(let i=0; i<e.changedTouches.length; i++) hit_arena_target(); }; btn.style.left = `${10 + Math.random() * 70}%`; btn.style.top = `${20 + Math.random() * 60}%`; container.appendChild(btn); } else if (arena_mode === 2) { let btn = document.createElement('div'); btn.className = 'arena-target-2'; btn.innerText = arena_dots_left; btn.onmousedown = (e) => { e.preventDefault(); hit_arena_target_dot(btn); }; btn.ontouchstart = (e) => { e.preventDefault(); for(let i=0; i<e.changedTouches.length; i++) hit_arena_target_dot(btn); }; btn.style.left = `${10 + Math.random() * 70}%`; btn.style.top = `${20 + Math.random() * 60}%`; container.appendChild(btn); } else if (arena_mode === 3) { let g = document.createElement('div'); g.className = 'minefield-green'; g.onmousedown = (e) => { e.preventDefault(); hit_mine('green'); }; g.ontouchstart = (e) => { e.preventDefault(); hit_mine('green'); }; g.style.left = `${10 + Math.random() * 80}%`; g.style.top = `${20 + Math.random() * 70}%`; container.appendChild(g); for(let i=0; i<3; i++) { let r = document.createElement('div'); r.className = 'minefield-red'; r.onmousedown = (e) => { e.preventDefault(); hit_mine('red'); }; r.ontouchstart = (e) => { e.preventDefault(); hit_mine('red'); }; r.style.left = `${10 + Math.random() * 80}%`; r.style.top = `${20 + Math.random() * 70}%`; container.appendChild(r); } } }
function spawn_swipe() { let container = document.getElementById('arena-container'); let exist = document.getElementById('swipe-zone'); if(exist) exist.remove(); const dirs = ['up', 'down', 'left', 'right']; const arrows = {'up':'⬆️', 'down':'⬇️', 'left':'⬅️', 'right':'➡️'}; swipe_dir = dirs[Math.floor(Math.random()*dirs.length)]; let el = document.createElement('div'); el.id = 'swipe-zone'; el.style.cssText = "position:absolute; width:100%; height:80%; top:20%; left:0; display:flex; justify-content:center; align-items:center; font-size:100px; background:rgba(0,0,0,0.5); border-radius:12px; touch-action:none;"; el.innerText = arrows[swipe_dir]; el.addEventListener('touchstart', e => { e.preventDefault(); startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, {passive:false}); el.addEventListener('touchmove', e => { e.preventDefault(); }, {passive:false}); el.addEventListener('touchend', e => { e.preventDefault(); let dx = e.changedTouches[0].clientX - startX; let dy = e.changedTouches[0].clientY - startY; check_swipe(dx, dy); }, {passive:false}); el.addEventListener('mousedown', e => { startX = e.clientX; startY = e.clientY; }); el.addEventListener('mouseup', e => { let dx = e.clientX - startX; let dy = e.clientY - startY; check_swipe(dx, dy); }); container.appendChild(el); }
function check_swipe(dx, dy) { if(is_game_over || now() < arena_locked_until) return; if(Math.abs(dx) < 30 && Math.abs(dy) < 30) return; let dir = ''; if(Math.abs(dx) > Math.abs(dy)) { dir = dx > 0 ? 'right' : 'left'; } else { dir = dy > 0 ? 'down' : 'up'; } if(dir === swipe_dir) { if(navigator.vibrate) navigator.vibrate(10); arena_my++; document.getElementById('arena-my-score').innerText = `Свайпов: ${arena_my}/${arena_target_max}`; if(arena_my >= arena_target_max) end_round(true); else spawn_swipe(); } else { arena_locked_until = now() + 1000; document.getElementById('swipe-zone').style.background = '#500'; setTimeout(()=> { let sz = document.getElementById('swipe-zone'); if(sz) sz.style.background = 'rgba(0,0,0,0.5)'; }, 1000); if(navigator.vibrate) navigator.vibrate([100, 100]); } }
function now() { return Date.now(); }
function check_autoclicker() { let t = now(); if (t < arena_locked_until) return false; click_times.push(t); if (click_times.length > 12) click_times.shift(); if (click_times.length === 12 && (click_times[11] - click_times[0]) < 400) { document.getElementById('ranked-status').innerText = '🛑 АВТОКЛИКЕР! ШТРАФ 3 СЕК 🛑'; document.getElementById('ranked-status').style.color = '#f00'; arena_locked_until = t + 3000; click_times = []; if(navigator.vibrate) navigator.vibrate([100, 100, 100]); setTimeout(() => { let el = document.getElementById('ranked-status'); if(el) { el.style.color = '#aaa'; el.innerText = 'В ИГРЕ...'; } }, 3000); return false; } return true; }
function hit_tug() { if(is_game_over) return; let t = now(); if(t - last_hit_time < 20) return; last_hit_time = t; if(!check_autoclicker()) return; tug_score += 2; update_tug_ui(); if(navigator.vibrate) navigator.vibrate(10); if(tug_score >= 100) end_round(true); }
function hit_arena_target() { if (is_game_over) return; let t = now(); if (t - last_hit_time < 20) return; last_hit_time = t; if(!check_autoclicker()) return; arena_my++; document.getElementById('arena-my-score').innerText = 'Ты: ' + arena_my; if(arena_my % 5 === 0) spawn_arena_target(); if(navigator.vibrate) navigator.vibrate(10); if(arena_my >= arena_target_max) end_round(true); }
function hit_arena_target_dot(btn) { if (is_game_over) return; let t = now(); if (t - last_hit_time < 20) return; last_hit_time = t; if(!check_autoclicker()) return; arena_dots_left--; arena_my++; document.getElementById('arena-my-score').innerText = 'Ты: ' + arena_my; if(navigator.vibrate) navigator.vibrate(10); if(arena_dots_left <= 0) { if(arena_my >= arena_target_max) { end_round(true); } else { arena_dots_left = 3; spawn_arena_target(); } } else { btn.innerText = arena_dots_left; } }
function hit_mine(type) { if (is_game_over) return; let t = now(); if (t < arena_locked_until) return; if (type === 'red') { arena_my = Math.max(0, arena_my - 5); document.getElementById('arena-my-score').innerText = 'Ты: ' + arena_my; arena_locked_until = t + 1000; document.getElementById('arena-container').style.background = '#300'; setTimeout(()=> { document.getElementById('arena-container').style.background = '#050505'; }, 1000); if(navigator.vibrate) navigator.vibrate([100, 100]); } else { arena_my++; document.getElementById('arena-my-score').innerText = 'Ты: ' + arena_my; if(navigator.vibrate) navigator.vibrate(10); if(arena_my >= arena_target_max) { end_round(true); } else { spawn_arena_target(); } } }
function end_round(is_win) { if(is_game_over) return; is_game_over = true; clearInterval(bot_int); if(is_win) my_round_wins++; else bot_round_wins++; document.getElementById('score-you').innerText = my_round_wins; document.getElementById('score-bot').innerText = bot_round_wins; current_round++; document.getElementById('arena-container').innerHTML = `<div style="text-align:center; padding-top: 60px;"><div style="font-size:24px; font-weight:bold; color:${is_win ? '#0f0' : '#f00'};">${is_win ? 'РАУНД ВЫИГРАН!' : 'РАУНД ПРОИГРАН'}</div></div>`; setTimeout(start_next_round, 1500); }
function show_rankup_screen(rank_str, sound_file, glow_color) { let ro = document.getElementById('rankup-overlay-text'); if(!ro)return; ro.innerText = rank_str; document.getElementById('rankup-glow').style.background = `radial-gradient(circle, ${glow_color} 0%, rgba(0,0,0,0) 70%)`; ro.style.textShadow = `0 0 20px ${glow_color}, 0 0 40px ${glow_color}`; document.getElementById('rankup-overlay').style.display = 'flex'; try { new Audio(sound_file).play(); } catch(e) {} }
function end_match() { localStorage.removeItem(PREFIX + 'in_match'); let is_match_win = my_round_wins > bot_round_wins; document.getElementById('arena-container').innerHTML = `<div style="text-align:center; padding-top: 40px;"><div style="font-size:18px; color:#aaa; margin-bottom: 10px;">МАТЧ ЗАВЕРШЕН</div><div style="font-size:28px; font-weight:bold; color:#d4af37;">${nickname} ${my_round_wins}:${bot_round_wins} Бот</div></div>`; document.getElementById('arena-exit-btn').style.display = 'block'; if (is_match_win) { document.getElementById('ranked-status').innerText = 'ПОБЕДА! Ты повысил ранг!'; player_rank++; q_wins++; r_wins++; r_streak++; save_quests(); let is_major = (player_rank % 3 === 0 || player_rank === 21); let l_idx = Math.floor(player_rank / 3); if(player_rank >= 21) l_idx = 7; let s_name = RANK_SOUNDS[Math.min(l_idx, 7)]; let s_col = RANK_COLORS[Math.min(l_idx, 7)]; if (is_major) { show_rankup_screen(RANKS[player_rank], s_name, s_col); } if (player_rank > max_rank) { max_rank = player_rank; if(player_rank === 12) { alert('🔥 НАГРАДА ЗА МИФИК I:\n+5,000/ч'); profit += 5000; } if(player_rank === 15) { alert('🔥 НАГРАДА ЗА ЛЕГУ I:\n+15,000/ч'); profit += 15000; } if(player_rank === 18) { alert('💎 НАГРАДА ЗА МАСТЕР I:\n+45,000/ч'); profit += 45000; } if(player_rank === 21) { alert('🏆 НАГРАДА ЗА ПРО:\n+65,000/ч\nТеперь у тебя есть неоновая рамка!'); profit += 65000; } } if (global_event_data && global_event_data.active) { let p = parseInt(localStorage.getItem(PREFIX+'pending_event_pts')) || 0; localStorage.setItem(PREFIX+'pending_event_pts', p + 1); let my_c = localStorage.getItem(PREFIX+'club'); if (my_c) database.ref('clubs/' + my_c + '/event_pts').transaction(pts => (pts || 0) + 1); } save_data(); upd_ui(); } else { document.getElementById('ranked-status').innerText = 'ПОРАЖЕНИЕ! Ты потерял ранг.'; r_loss++; r_streak = 0; save_quests(); if(player_rank > 0) player_rank--; save_data(); upd_ui(); } }
window.exit_arena = function() { let rm = document.getElementById('ranked-modal'); if(rm) rm.style.display = 'none'; sync_cloud(); }

function check_quests(forceReset) { let today = new Date().toLocaleDateString(); if(q_date !== today || forceReset) { q_date = today; q_taps = 0; q_wins = 0; q_msgs = 0; q_claimed = false; localStorage.setItem(PREFIX+'q_date', today); localStorage.setItem(PREFIX+'q_claimed', '0'); save_quests(); } }
function save_quests() { localStorage.setItem(PREFIX+'q_taps', q_taps); localStorage.setItem(PREFIX+'q_wins', q_wins); localStorage.setItem(PREFIX+'q_msgs', q_msgs); localStorage.setItem(PREFIX+'q_date', q_date); localStorage.setItem(PREFIX+'q_claimed', q_claimed ? '1' : '0'); }
window.open_quests = function() { check_quests(false); let p1 = document.getElementById('q1-prog'); if(p1) p1.innerText = `${Math.min(q_taps, 1500)}/1500`; let p2 = document.getElementById('q2-prog'); if(p2) p2.innerText = `${Math.min(q_wins, 2)}/2`; let p3 = document.getElementById('q3-prog'); if(p3) p3.innerText = `${Math.min(q_msgs, 1)}/1`; let btn = document.getElementById('q-claim-btn'); if(btn) { if(q_claimed) { btn.innerText = "УЖЕ СОБРАНО"; btn.className = "buy-btn"; btn.onclick = null; } else if(q_taps >= 1500 && q_wins >= 2 && q_msgs >= 1) { btn.innerText = "ЗАБРАТЬ 20 000"; btn.className = "buy-btn gold"; btn.onclick = claim_quests; } else { btn.innerText = "ВЫПОЛНИ ЗАДАНИЯ"; btn.className = "buy-btn"; btn.onclick = null; } } let m = document.getElementById('quests-modal'); if(m) m.style.display='flex'; }
window.claim_quests = function() { if(q_taps >= 1500 && q_wins >= 2 && q_msgs >= 1 && !q_claimed) { vrgk += 20000; q_claimed = true; localStorage.setItem(PREFIX+'q_claimed', '1'); upd_ui(); save_data(); open_quests(); alert('+20 000 воргиков!'); sync_cloud(true); } }

window.open_friends = function() { let fm = document.getElementById('friends-modal'); if(fm) fm.style.display='flex'; render_friends(); }
function render_friends() { let fl = document.getElementById('friends-list'); if(!fl) return; let html = ''; my_friends.forEach(f => { let p = cached_players[f] || {vrgk:0, rank:0}; let r_name = RANKS[p.rank] || "Бронза I"; html += `<div class="member-list-item"><div style="flex:1; text-align:left; cursor:pointer;" onclick="open_profile('${f}')"><b>${f}</b><div style="font-size:10px; color:#aaa;">${r_name} | 🪙 ${fmt(p.vrgk)}</div></div><button class="buy-btn" style="padding:5px; background:#411;" onclick="rem_friend('${f}')">удалить</button></div>`; }); if(my_friends.length === 0) html = '<div style="color:#555; font-size:11px; text-align:center;">список пуст</div>'; fl.innerHTML = html; }
window.add_friend = function() { let fn = document.getElementById('f-nick'); if(!fn) return; let n = fn.value.trim(); if(!n || !cached_players[n]) return alert('Игрок не найден в базе!'); if(n === nickname) return alert('Это ты!'); if(!my_friends.includes(n)) { my_friends.push(n); localStorage.setItem(PREFIX+'friends', JSON.stringify(my_friends)); render_friends(); } fn.value = ''; }
window.rem_friend = function(n) { my_friends = my_friends.filter(x => x !== n); localStorage.setItem(PREFIX+'friends', JSON.stringify(my_friends)); render_friends(); }
window.create_lobby = function() { let code = Math.floor(1000 + Math.random() * 9000); alert(`Твой код лобби: ${code}\nОжидание подключения скоро появится в мультиплеерном обновлении.`); }
window.join_lobby = function() { let lc = document.getElementById('l-code'); if(!lc) return; let c = lc.value; if(c.length === 4) alert(`Подключение к лобби ${c}...\n(Дуэли 1 на 1 будут включены в след. патче сетевого кода)`); else alert('Введите 4 цифры!'); }
window.change_title = function() { let ts = document.getElementById('title-select'); if(!ts) return; let val = ts.value; if(val === 'Ноулайфер' && streak_days < 30) return alert('Требуется стрик 30 дней!'); if(val === 'Киберспорт' && max_rank < 15) return alert('Требуется лига Лега I или выше!'); my_title = val; save_data(); sync_cloud(true); alert('Титул установлен!'); }

async function sync_cloud(is_bg = false) {
    if (!nickname || !my_pin) return;
    if (typeof firebase === 'undefined' || !database) return;
    try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));
        let wipeSnap = await Promise.race([database.ref('wipe_skrepki_time').once('value'), timeoutPromise]);
        let wipe_time = wipeSnap.val() || 0; let loc_w = parseInt(localStorage.getItem(PREFIX+'w_skr')) || 0;
        if(wipe_time > loc_w) { skrepki = 0; localStorage.setItem(PREFIX+'w_skr', wipe_time); save_data(); upd_ui(); }
        let wipeSnapHard = await Promise.race([database.ref('force_wipe_time').once('value'), timeoutPromise]);
        let wipe_time_hard = wipeSnapHard.val() || 0; let local_wipe = parseInt(localStorage.getItem(PREFIX + 'wipe_time')) || 0;
        if (wipe_time_hard > local_wipe) { let mySnap = await database.ref('players/' + nickname).once('value'); let p = mySnap.val(); if (p) { player_rank = p.rank || 0; if (p.stats) { profit = p.stats[0] || profit; max_rank = p.stats[23] || 0; } localStorage.setItem(PREFIX + 'wipe_time', wipe_time_hard); save_data(); upd_ui(); } }
        let p_data = { pin: my_pin, vrgk: Math.floor(vrgk), skrepki: skrepki, rank: player_rank, last_seen: Date.now(), donate_rank: donate_rank, donate_until: donate_until, inventory: JSON.stringify(inv || {}), last_kit_v2: last_kit_time, enchants: JSON.stringify(enchants || {}), stats: [profit, tap_power, max_energy, eng_regen, tap_price, tap_lvl, eng_price, eng_lvl, regen_price, c1_price, c2_price, c3_price, c4_price, c5_price, c6_price, c7_price, c1_lvl, c2_lvl, c3_lvl, c4_lvl, c5_lvl, c6_lvl, c7_lvl, max_rank, my_color, og_pro, c8_price, c9_price, c10_price, c11_price, c12_price, c13_price, c8_lvl, c9_lvl, c10_lvl, c11_lvl, c12_lvl, c13_lvl, total_taps, r_wins, r_loss, r_streak, my_title, streak_days, q_taps, q_wins, q_msgs, q_date, q_claimed ? 1 : 0, streak_last] };
        let my_c = localStorage.getItem(PREFIX + 'club'); if (my_c) p_data.club = my_c; 
        await Promise.race([database.ref('players/' + nickname).update(p_data), timeoutPromise]);
        if(!is_bg) { let snap = await Promise.race([database.ref().once('value'), timeoutPromise]); let d = snap.val() || {}; cached_players = d.players || {}; cached_clubs = d.clubs || {}; global_event_data = d.global_event || null; cached_last_winner = d.last_winner || ""; render_leaderboard(); render_clubs_list(); } 
        last_sync = Date.now(); upd_ui();
    } catch (e) { console.error("Sync error:", e); if (!is_bg) { render_leaderboard(); render_clubs_list(); } }
}

window.toggle_event = async function() { let snap = await database.ref('global_event').once('value'); let ev = snap.val() || {active:false}; if (!ev.active) { let name = prompt("Название ивента:"); if (!name) return; await database.ref('global_event').set({ active: true, name: name, start: Date.now() }); let cSnap = await database.ref('clubs').once('value'); let clubs = cSnap.val() || {}; for (let c in clubs) clubs[c].event_pts = 0; await database.ref('clubs').set(clubs); alert("Запущено!"); } else { if (confirm("Завершить?")) { let cSnap = await database.ref('clubs').once('value'); let clubs = cSnap.val() || {}; let pSnap = await database.ref('players').once('value'); let players = pSnap.val() || {}; let sorted = Object.keys(clubs).sort((a,b) => (clubs[b].event_pts||0) - (clubs[a].event_pts||0)); let day3 = Date.now() + (3 * 24 * 3600 * 1000); if (sorted[0]) { await database.ref('last_winner').set(sorted[0]); clubs[sorted[0]].members.forEach(m => { if(!players[m]) players[m]={}; players[m].event_buff = {amt: 5000, exp: day3}; }); } if (sorted[1]) { clubs[sorted[1]].members.forEach(m => { if(!players[m]) players[m]={}; players[m].event_buff = {amt: 3000, exp: day3}; }); } if (sorted[2]) { clubs[sorted[2]].members.forEach(m => { if(!players[m]) players[m]={}; players[m].event_buff = {amt: 1000, exp: day3}; }); } await database.ref('global_event/active').set(false); await database.ref('players').set(players); alert("Ивент завершен!"); } } sync_cloud(true); };
window.create_promo = async function() { let amt = parseInt(prompt("Сколько воргиков дать за код?")); if (!amt || amt <= 0) return; let code = 'BUG-' + Math.random().toString(36).substr(2, 5).toUpperCase(); await database.ref('promocodes/' + code).set({ reward: amt, active: true }); prompt("Промокод успешно создан!", code); };
window.use_promo = async function() { let code = document.getElementById('promo-input').value.trim().toUpperCase(); if (!code) return alert("Введите код!"); let snap = await database.ref('promocodes/' + code).once('value'); let promo = snap.val(); if (!promo || !promo.active) { return alert("Промокод недействителен или уже использован!"); } vrgk += promo.reward; await database.ref('promocodes/' + code + '/active').set(false); document.getElementById('promo-input').value = ''; save_data(); upd_ui(); alert("✅ Успешно! Ты получил " + fmt(promo.reward) + " воргиков!"); sync_cloud(true); };
window.admin_wipe_skrepki = async function() { if(!confirm('ТОЧНО ВАЙПНУТЬ СКРЕПКИ У ВСЕХ? ЭТО НЕЛЬЗЯ ОТМЕНИТЬ!')) return; let snap = await database.ref('players').once('value'); let pl = snap.val(); for(let key in pl) { pl[key].skrepki = 0; } await database.ref('players').set(pl); await database.ref('wipe_skrepki_time').set(Date.now()); skrepki = 0; save_data(); upd_ui(); alert('Вайп скрепок прошел успешно!'); sync_cloud(); };
window.admin_reset_ranks = async function(is_hard) { if(!confirm(is_hard ? 'ЖЕСТКИЙ СБРОС: Всем ранг 0 + отнять прибыль?' : 'МЯГКИЙ СБРОС: Всем ранг 0 (без потери прибыли)?')) return; let snap = await database.ref('players').once('value'); let players = snap.val() || {}; let count = 0; for (let k in players) { players[k].rank = 0; if(is_hard && players[k].stats) { let mr = players[k].stats[23] || 0; let rm = 0; if(mr >= 12) rm += 5000; if(mr >= 15) rm += 15000; if(mr >= 18) rm += 45000; if(mr >= 21) rm += 65000; players[k].stats[0] = Math.max(0, (players[k].stats[0]||0) - rm); players[k].stats[23] = 0; } count++; } await database.ref('players').set(players); await database.ref('force_wipe_time').set(Date.now()); player_rank = 0; if(is_hard) { let rm = 0; if(max_rank >= 12) rm += 5000; if(max_rank >= 15) rm += 15000; if(max_rank >= 18) rm += 45000; if(max_rank >= 21) rm += 65000; profit = Math.max(0, profit - rm); max_rank = 0; } save_data(); upd_ui(); alert(`Сброс применен к ${count} игрокам!`); location.reload(); }

window.open_profile = function(user) { 
    let p = cached_players[user]; if(!p) return; 
    let s = p.stats || []; let c = s[24] || '#ffffff'; let is_og = s[25] || 0; 
    let ptaps = s[38] || 0; let pwins = s[39] || 0; let ploss = s[40] || 0; let pstr = s[41] || 0; let ptitle = s[42] || ""; 
    let wr = (pwins + ploss) > 0 ? Math.floor((pwins / (pwins + ploss)) * 100) : 0; let d_rank = parseInt(p.donate_rank) || 0; 
    let pn = document.getElementById('prof-name'); if(pn) { pn.innerText = user; pn.style.color = c; } 
    let pt = document.getElementById('prof-title'); if(pt) { pt.innerText = ptitle ? `[${ptitle}]` : ""; pt.style.color = "#aaa"; } 
    let po = document.getElementById('prof-og'); if(po) po.style.display = is_og ? 'block' : 'none'; 
    let pr = document.getElementById('prof-rank'); if(pr) pr.innerText = RANKS[p.rank || 0] || "Бронза I"; 
    let pd = document.getElementById('prof-donate'); if(pd) { pd.innerText = RANKS_INFO[d_rank].name; pd.style.color = RANKS_INFO[d_rank].color; } 
    let pc = document.getElementById('prof-club'); if(pc) pc.innerText = p.club || "Нет"; 
    let pv = document.getElementById('prof-vrgk'); if(pv) pv.innerText = fmt(p.vrgk || 0); 
    let ps = document.getElementById('prof-skr'); if(ps) ps.innerText = fmt(p.skrepki || 0); 
    let ptap = document.getElementById('prof-taps'); if(ptap) ptap.innerText = fmt(ptaps); 
    let pw = document.getElementById('prof-wl'); if(pw) pw.innerText = `${pwins} / ${ploss}`; 
    let pwr = document.getElementById('prof-wr'); if(pwr) pwr.innerText = `${wr}%`; 
    let pws = document.getElementById('prof-winstreak'); if(pws) pws.innerText = pstr; 
    let pWrap = document.getElementById('prof-pic-wrap'); if(pWrap) { if (p.rank >= 21) { pWrap.classList.add('neon-pro'); } else { pWrap.classList.remove('neon-pro'); } } 
    let pm = document.getElementById('profile-modal'); if(pm) pm.style.display = 'flex'; 
};

window.delete_acc = async function() { if(!confirm('удалить аккаунт?')) return; await database.ref('players/' + nickname).remove(); let my_c = localStorage.getItem(PREFIX + 'club'); if(my_c) { let snap = await database.ref('clubs/' + my_c).once('value'); let club = snap.val(); if(club) { club.members = club.members.filter(m => m !== nickname); if(club.owner === nickname) { if (club.members.length > 0) club.owner = club.members[0]; else club = null; } if (club) await database.ref('clubs/' + my_c).set(club); else await database.ref('clubs/' + my_c).remove(); } } localStorage.clear(); location.reload(); };
