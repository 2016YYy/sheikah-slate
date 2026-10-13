#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 JSON 数据转换为《希卡石板》项目所需的 TS 数据模块。"""
import json
import re
import os

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, '..', 'data')
OUT = os.path.join(BASE, '..', 'src', 'data')

def load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f)

def jstr(v):
    return json.dumps(v, ensure_ascii=False, indent=2)

def ts_export(name, items, fields_comment=''):
    arr = json.dumps(items, ensure_ascii=False, indent=2)
    return f"// 数据由《希卡石板》数据整理脚本生成，基于网络公开资料整理\n{fields_comment}\nexport const {name} = {arr} as const;\n"

weapons = load('weapons.json')
armors = load('armor.json')
monsters = load('monsters.json')
food = load('food.json')
collect = load('collect.json')
quests = load('quests.json')

# ---------- weapons ----------
w_items = []
for i, it in enumerate(weapons, 1):
    w_items.append({
        'id': i,
        'name': it['name'],
        'type': it['type'],
        'atk': it.get('atk', it.get('guard', 0)),
        'guard': it.get('guard', it.get('atk', 0)),
        'dur': it.get('dur', ''),
        'special': it.get('special', ''),
        'obtain': it.get('obtain', ''),
        'note': it.get('note', ''),
    })

# ---------- armors ----------
a_items = []
for i, it in enumerate(armors, 1):
    a_items.append({
        'id': i,
        'name': it['name'],
        'set': it.get('set', ''),
        'def': it['def'],
        'effect': it.get('effect', ''),
        'bonus': it.get('bonus', ''),
        'upgrade': it.get('upgrade', ''),
        'obtain': it.get('obtain', ''),
        'note': it.get('note', ''),
    })

# ---------- monsters ----------
def monster_type(name):
    if '丘丘' in name: return '元素生物'
    if '波克布林' in name or '莫力布林' in name: return '布林族'
    if '蜥蜴' in name: return '蜥蜴族'
    if '守护者' in name: return '古代兵器'
    if '莱尼尔' in name: return '白银强敌'
    if '西诺克斯' in name or '岩石巨人' in name or '莫尔德拉吉克' in name: return '大型魔物'
    if '盖侬' in name: return '灾厄化身'
    if '基斯' in name or '蝙蝠' in name: return '飞行魔物'
    if '骷髅' in name or '骸骨' in name: return '不死魔物'
    return '普通魔物'

m_items = []
for i, it in enumerate(monsters, 1):
    m_items.append({
        'id': i,
        'name': it['name'],
        'type': monster_type(it['name']),
        'hp': it.get('hp', ''),
        'drops': it.get('drops', ''),
        'place': it.get('place', ''),
        'weak': it.get('weak', ''),
        'note': it.get('note', ''),
    })

# ---------- food ----------
def recipe_type(name, buff):
    b = buff or ''
    if '攻击' in b: return '攻击提升'
    if '防御' in b: return '防御提升'
    if '耐力' in b or '体力' in b or '精力' in b: return '耐力/精力提升'
    if '速度' in b: return '速度提升'
    if '潜行' in b or '安静' in b: return '潜行提升'
    if '抗寒' in b or '耐寒' in b: return '抗寒'
    if '抗热' in b or '耐热' in b: return '抗热'
    if '耐电' in b: return '耐电'
    if '耐火' in b: return '耐火'
    if '爱心' in name or '额外' in b: return '额外心'
    return '恢复料理'

r_items = []
for i, it in enumerate(food['recipes'], 1):
    buff = it.get('buff', '')
    r_items.append({
        'id': i,
        'name': it['name'],
        'type': recipe_type(it['name'], buff),
        'ingredients': it.get('ingredients', ''),
        'hp': it.get('hp', ''),
        'buff': buff,
        'effect': buff if buff else f"恢复料理（{it.get('hp','')}）",
        'note': it.get('note', ''),
    })

mat_items = []
for i, it in enumerate(food['materials'], 1):
    try:
        price = int(str(it.get('price', '0')).replace('卢比', '').strip() or 0)
    except ValueError:
        price = 0
    rarity = '★★★' if price >= 100 else ('★★' if price >= 30 else '★')
    mat_items.append({
        'id': i,
        'name': it['name'],
        'type': it.get('type', '材料'),
        'source': it.get('source', ''),
        'use': it.get('use', ''),
        'price': it.get('price', ''),
        'rarity': rarity,
        'effect': it.get('use', ''),
        'obtain': it.get('source', ''),
        'note': it.get('note', ''),
    })

# ---------- collect ----------
shrine_items = []
for i, it in enumerate(collect['shrines'], 1):
    shrine_items.append({
        'id': i,
        'name': it['name'],
        'region': it.get('region', ''),
        'trial': it.get('trial', ''),
        'reward': it.get('reward', ''),
        'hint': it.get('hint', ''),
        'note': it.get('note', ''),
    })
tower_items = []
for i, it in enumerate(collect['towers'], 1):
    tower_items.append({
        'id': i,
        'name': it['name'],
        'region': it.get('region', ''),
        'note': it.get('note', ''),
    })
memory_items = []
for i, it in enumerate(collect['memories'], 1):
    memory_items.append({
        'id': i,
        'name': it['name'],
        'hint': it.get('hint', ''),
        'note': it.get('note', ''),
    })
korok_types = collect.get('korok', {}).get('types', [])
horses = collect.get('horses', [])
completion = collect.get('completion', [])

# ---------- quests ----------
def split_steps(s):
    if not s:
        return []
    parts = re.split(r'[；;。]', s)
    return [p.strip() for p in parts if p.strip()]

main_items = []
for i, it in enumerate(quests['main'], 1):
    main_items.append({
        'id': i,
        'name': it['name'],
        'type': it.get('type', '主线'),
        'description': it.get('objective', ''),
        'steps': split_steps(it.get('steps', '')),
        'reward': it.get('reward', ''),
        'region': it.get('place', ''),
        'note': it.get('note', ''),
    })
shrineq_items = []
for i, it in enumerate(quests['shrine_quests'], 1):
    how = it.get('how', '')
    shrineq_items.append({
        'id': i,
        'name': it['name'],
        'type': '神庙挑战',
        'description': how,
        'steps': [how] if how else [],
        'reward': it.get('reward', ''),
        'region': it.get('place', ''),
        'note': it.get('note', ''),
    })
side_items = []
for i, it in enumerate(quests['side'], 1):
    how = it.get('how', '')
    npc = it.get('npc', '')
    note = it.get('note', '')
    note_full = (f"NPC：{npc}" if npc else '') + ('；' + note if note else '')
    side_items.append({
        'id': i,
        'name': it['name'],
        'type': '支线',
        'description': how,
        'steps': [how] if how else [],
        'reward': it.get('reward', ''),
        'region': it.get('place', ''),
        'note': note_full,
    })

# ---------- guides ----------
with open(os.path.join(DATA, 'guides.md'), encoding='utf-8') as f:
    md = f.read()

guide_blocks = re.split(r'(?m)^# ', md)
guide_blocks = [b for b in guide_blocks if b.strip()]
guides = []
cat_map = {
    1: '新手开局', 2: '生存机制', 3: '探索解谜',
    4: '战斗进阶', 5: '资源赚钱', 6: 'DLC 指南',
}
for idx, block in enumerate(guide_blocks, 1):
    lines = block.splitlines()
    title = lines[0].strip().rstrip('#').strip() if lines else ''
    chapters = []
    chapter = None
    for line in lines[1:]:
        if line.startswith('## '):
            if chapter:
                chapters.append(chapter)
            chapter = {'title': line[3:].strip(), 'content': ''}
        else:
            if chapter is None:
                continue
            chapter['content'] += line + '\n'
    if chapter:
        chapters.append(chapter)
    content = '\n'.join(lines)
    desc_map = {
        1: '从苏醒、初始台地试炼到出台地的优先级路线，最速开荒指南。',
        2: '温度、雷电、攀爬体力、烹饪、防具强化等核心机制详解。',
        3: '符文思路、神庙套路、呀哈哈寻找规律与隐藏宝箱技巧。',
        4: '盾反、林克时间、属性克制、莱尼尔与守护者打法。',
        5: '宝石、兽肉、古代零件、夜光石的收集与赚钱路线。',
        6: '剑之试炼、大师模式、英杰们的诗篇与实用 DLC 装备。',
    }
    guides.append({
        'id': idx,
        'title': title,
        'category': cat_map.get(idx, '攻略'),
        'description': desc_map.get(idx, ''),
        'chapters': chapters,
        'content': content,
    })

# ---------- write files ----------
os.makedirs(OUT, exist_ok=True)

with open(os.path.join(OUT, 'weapons.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_WEAPONS', w_items))

with open(os.path.join(OUT, 'armors.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_ARMORS', a_items))

with open(os.path.join(OUT, 'monsters.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_MONSTERS', m_items))

with open(os.path.join(OUT, 'food.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_RECIPES', r_items))
    f.write('\n')
    f.write(ts_export('MOCK_MATERIALS', mat_items))

with open(os.path.join(OUT, 'collect.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_SHRINES', shrine_items))
    f.write('\n')
    f.write(ts_export('MOCK_TOWERS', tower_items))
    f.write('\n')
    f.write(ts_export('MOCK_MEMORIES', memory_items))
    f.write('\n')
    f.write(ts_export('MOCK_KOROK_TYPES', korok_types))
    f.write('\n')
    f.write(ts_export('MOCK_HORSES', horses))
    f.write('\n')
    f.write(ts_export('MOCK_COMPLETION', completion))

with open(os.path.join(OUT, 'quests.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_MAIN_QUESTS', main_items))
    f.write('\n')
    f.write(ts_export('MOCK_SHRINE_QUESTS', shrineq_items))
    f.write('\n')
    f.write(ts_export('MOCK_SIDE_QUESTS', side_items))

with open(os.path.join(OUT, 'guides.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_export('MOCK_GUIDES', guides))

# ---------- summary ----------
print('武器:', len(w_items))
print('防具:', len(a_items))
print('怪物:', len(m_items))
print('料理:', len(r_items), '材料:', len(mat_items))
print('神庙:', len(shrine_items), '高塔:', len(tower_items), '回忆:', len(memory_items))
print('主线:', len(main_items), '神庙挑战:', len(shrineq_items), '支线:', len(side_items))
print('攻略册:', len(guides))
print('输出目录:', OUT)
