//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //设置
    "Autoshipping will deliver 5% surplus": "自动航线盈余5%",
    "Ignore storage on autoroutes creation":"创建自动航线时不检查容量",
    //教程
    "232 years have passed since you boarded the Vitha, but finally you reached your new home Promision!": "距您登上维塔殖民船已经过去了232年，终于您来到了新家——普罗米修斯！",
    "Let's do a little briefing.":"让我为您做一个简要介绍——",
    "In this interface you can see basic infos about your planet.":"在这个界面您可以看到您的星球的基本情况。",
    "On the left you can see a list of resources that can be":"在左侧您将看到这个星球上可供",
    "extracted":"开采",
    "on this planet, like":"的资源，例如",
    "To open this tutorial again, click on the":"想要再次打开本教程，请单击",
    "icon in the bottom-right corner of the screen":"图标（位于屏幕右下角）",
    "Let's extract":"让我们开始挖掘",
    "! Click on the":"！单击位于底部菜单栏的",
    "icon in the bottom menu to access the":"图标来打开",
    "Extraction Tab":"资源采集页面",
    "In this interface, you can construct buildings to extract resources. By clicking on the desired building, you can see more details about it":"在这个页面下，您可以建造开采各类资源的建筑。单击建筑，您将看到关于各个建筑的详细信息",
    "On the left you can see how many resources are being produced every second.":"在左侧您可以看到每秒钟各项资源的生产速度",
    "Now click on the":"现在点击",
    "icon below the":"图标（位于",
    "to build 1 more":"下方）来建造另一个采矿场",
    "Perfect! You can now see on the right how iron production has doubled!":"干得好！您现在可以在右侧看到铁的产量已经翻倍",
    "Keep building Mining Plants, until you reach 10 of them. Should only take few seconds!":"继续建造直到您拥有10个采矿场，这应该不会花费太多时间",
    "Perfect! But Iron is not the only resource you will need. Let's build":"干得好！但是铁并不是您所需要的唯一资源，让我们建造",
    "(right below the":"（就在",
    ") to extract":"的正下方）来开采",
    "Great! But Methane alone is not that useful, we need":"很好！但是甲烷本身用处并不大，我们需要",
    "Production Tab":"生产页面",
    ". Click on the":"。单击位于页面底部的",
    "In this interface you can construct buildings that transform raw resources, like iron and methane, into more useful and advanced resources.":"在这个界面您可以建造能够把原材料加工成更加高级的资源的建筑",
    "Let's construct a":"让我们先建造一个",
    "to convert methane into fuel. By clicking on it, you can see that it consumes 2 methane every second to produce fuel.":"来把甲烷转化为燃料。通过点击它，您可以看到它每秒消耗 2 甲烷来生产燃料",
    "Well done! But wait, now your production of methane is negative, because the processer needs 2 methane every second! Build another":"干得好！但别着急，现在您的甲烷生产速度是负数，因为生产燃料每秒要消耗 2 甲烷。请再建造一座",
    "That's good! You can now produce fuel without running out of methane. You will need fuel to power":"不错！现在您可以生产燃料而不必担心耗尽甲烷了，您将需要燃料来运行",
    "Foundries":"铸造厂",
    "that in turn produce":"进而生产",

    //飞船
    "Battlecruiser":"战列巡航舰",
    "Fighter":"战斗机",
    "H.Fighter":"增强型战斗机",
    "Frigate":"护卫舰",
    "Assault-frigate":"突击护卫舰",
    "Destroyer":"驱逐舰",
    "Ballistic":"火炮",
    "Incursor":"巡洋舰",
    "Thermal":"热能武器",
    "Shield Ship":"防御",
    "Battlecruiser":"战列舰",
    "Admiral":"旗舰",
    "Laser":"激光",
    "Shields":"护盾",
        "Shields power is the amount of":"护盾数值大小代表了",
        "incoming damage that gets":"战斗中能够完全防御",
        "totally blocked":"的伤害大小",
    "Piercing Power":"穿透力",
        "Piercing power is the amount of":"穿透力的数值大小代表了",
        "damage reduction ignored while":"在战斗中无视敌方伤害减免",
        "damaging an enemy ship":"的能力",
    
    //贸易市场
    "Market":"市场",
    "Buy Price":"买入价格",
    "Sell Price":"卖出收益",
    "units":"单位",
    "Exported by":"主要出口方",
    "Imported by":"主要进口方",
    "Total available storage of orbiting fleets:":"当前轨道上所有飞船的总可用储存容量：",
    "Buy":"买入",
    "Sell":"卖出",

    //资源：
    "Iron": "铁",
    "Steel": "钢",
    "Titanium": "钛",
    "Silicon": "硅",
    "Graphite": "石墨",
    "Oil": "石油",
    "Fuel": "燃料",
    "Oxygen": "氧气",
    "Methane": "甲烷",
    "Water": "水",
    "Hydrogen": "氢气",
    "Osmium": "锇",
    "Technetium": "锝",
    "Rhodium": "铑",
    "Uranium": "铀",
    "Plastic": "塑料",
    "Circuit": "电路",
    "Nanotubes": "纳米管",
    "Ice": "冰",
    "Biomass": "生物质",
    "Ammunition": "弹药",
    "Sand": "沙子",
    "Empty cryocell": "空冷冻室",
    "Coolant": "冷却液",
    "Robots": "机器人",
    "Armor": "盔甲",
    "Engine": "引擎",
    "Batteries": "电池",
    "Empty battery": "空电池",
    "Full battery": "满电池",
    "U-ammunition": "U型弹药",
    "T-ammunition": "T型弹药",
    "Sulfur": "硫",
    "Antimatter": "反物质",
    "MK Embryo": "MK胚胎",
    "Superconductors": "超导体",
    "Caesium": "铯",
    "Thorium": "钍",
    "Ammonia": "氨",
    "Loaded cryocell": "加载的冷冻室",
    "Dark matter": "暗物质",

    //建筑
    "Mining Plant": "采矿厂",
    "Methane Extractor": "甲烷提取器",
    "Graphite Extractor": "石墨提取器",
    "Oil Pump": "油泵",
    "Metal Collector": "金属收集器",
    "Water Pump": "水泵",
    "Sand Quarry": "采砂场",
    "Hunting Spot": "狩猎点",
    "Methane Processer": "甲烷处理器",
    "Foundry": "铸造厂",
    "Oil Refinery": "炼油厂",
    "Plastic Factory": "塑料工厂",
    "Sand Smelter": "砂冶炼厂",
    "Electronic Facility": "电子设施",
    "Ammunition Factory": "弹药厂",
    "Water Freezer": "水冷柜",
    "Nanotubes Factory": "纳米管厂",
    "Coolant Factory": "冷却剂厂",
    "Robots Factory": "机器人工厂",
    "Armor Factory": "装甲工厂",
    "Ice Melter": "冰融化器",
    "Battery Factory": "电池厂",
    "Biofuel Refinery": "生物燃料炼油厂",
    "Bioplastic Synthesizer": "生物塑料合成器",
    "Electrolyzer": "电解槽",
    "Uranium Shell Assembler": "铀壳组装",
    "Technetium Fissor": "锝反应堆",
    "Halean A.I. Center": "哈伦AI中心",
    "Small Generator": "小发电机",
    "Thermal Plant": "热电厂",
    "Solar Central": "太阳能中心",
    "Nuclear Powerplant": "核电站",
    "Fusion Reactor": "聚变反应堆",
	"Fusion reactor": "聚变反应堆",
    "Battery Power Plant": "电池电厂",
    "Laboratory": "实验室",
    "Bioengineering Center": "生物工程中心",
    "Halean Laboratory": "哈伦实验室",
    "Shipyard": "船厂",
    "Greenhouse": "温室",
    "Battery Charger": "电池充电器",
    "Trade Hub": "贸易中心",
    "Submerged Metal Mine": "水下金属矿",
    "Submerged Sand Mine": "水下沙矿",
    "Sand Mine": "沙矿",
    "Algae Oil Farm": "藻类油田",
    "Polymerizer": "聚合",
    "Nanotubes Dome": "纳米管圆顶",
    "Methane Harvester": "甲烷收割机",
    "Ice Drill": "冰钻",
    "Arctic Fishing Outpost": "北极钓鱼前哨基地",
    "Floating Greenhouse": "浮动温室",
    "Pumping Platform": "泵送平台",
    "Submerged Oil Refinery": "水下炼油厂",
    "Cryogenic Laboratory": "低温实验室",
    "Oceanographic Center": "海洋学中心",
    "Hydrothermal Plant": "热液厂",
    "Hydroelectric Plant": "水电站",
    "Pressurized Water Reactor": "加压水反应堆",
	"Pressurized water reactor": "加压水反应堆",
    "Hydrogen Condenser": "氢冷凝器",
    "Floating Fuel Converter": "浮动燃油转换器",
    "Floating Generator": "浮动发电机",
    "Floating Reactor": "浮动反应堆",
    "Fluidodynamics Center": "流体动力学中心",

    //科技
    "Geology": "地质学",
    "Material Science": "材料科学",
    "Interstellar Travel": "星际航行",
    "Scientific Research": "科学研究",
    "Chemical Engineering": "化学工程",
    "Cryogenics": "低温技术",
    "Military Technology": "军事技术",
    "Electronics": "电子",
    "Nuclear Physics": "核物理",
    "Environmental Sciences": "环境科学",
    "Halean Technology": "哈伦技术",
    "Artificial Intelligence": "人工智能",
    "Hydrology": "水文学",

    //飞船
    "Vitha Colonial Ship": "维塔殖民船",
    "Vitha Colony Ship": "维塔殖民船",
    "ZB-03 Small Cargo": "ZB-03小货船",
    "ZB-04 Hauler": "ZB-04搬运工",
    "ARK-22": "方舟-22",
    "ARK-55": "方舟-55",
    "Foxar": "福克斯",
    "Sky Dragon": "天龙",
    "ZB-22 Transporter": "ZB-22运输车",
    "Babayaga": "巴巴亚加",
    "ZB-50 Big Cargo": "ZB-50大货船",
    "Luxis": "路西斯",
    "Muralla": "城墙",
    "Siber": "思博",
    "Mankind Gem": "人类的宝石",
    "Alkantara": "奥坎塔亚",
    "Glass Burson": "玻璃布森",
    "The Key": "天际",
    "Black Star": "黑星",
    "Marduk": "马杜克",
    "ARK-55b": "方舟-55b",
    "ARK-PRP": "方舟-PRP",
    "No Name Ship": "无名船",
    "Angel Eyes": "天使之眼",
    "Tuco Ramirez": "图库拉米雷斯",
    "Aurora": "极光",
    "Mastodon": "马斯托唐",
    "Die Schoene": "死亡司锲恩",
    "Alptraum": "奥普特",
    "Engel": "恩格尔",
    "U.N.I.T Natsumiko": "纳苏米克部队",
    "U.N.I.T Harumiko": "哈润米克部队",
    "U.N.I.T Akimiko": "艾克米克部队",
    "U.N.I.T Fuyumiko": "福允米克部队",
    "Auxilia": "奥西里",
    "Augustus": "奥格斯图",
    "Leonidas": "莱昂尼达斯",
    "Alexander": "亚历山大",
    "Cerberus": "地狱犬",
    "Charon": "卡戎",
    "Lucifer": "路西弗",
    "Dead Soul": "死魂",
    "Halean Spear": "哈伦斯派尔",
    "Halean Counselor Ship": "哈伦顾问船",
    "Juini's Daughter": "基尼之女",
    "Azure Huang": "天青黄",
    "Dream of Juini": "基尼之梦",
    "Siren": "思润",
    "Servant of the Swarm": "虫群之奴",
    "Enslaved Human Ship": "人类之奴",
    "Enslaved Quris Ship": "古里之奴",
    "Enslaved Halean Ship": "哈伦之奴",
    "Heart of the Swarm": "虫群之心",
    "Aurea Spina": "金叶脊柱",
    "Auxilia Beta": "奥西列贝塔",
    "Re-engineered Servant": "重新设计的仆人",
    "Cherub": "小天使",
    "Seraph": "六翼天使",
    "Jericho": "杰里科",
    "Sodom": "索多玛",
    "Gomorrah": "蛾摩拉",
    "Zion": "锡安",
    "Aster": "翠菊",
    "Azalea": "映山红",
    "Dahlia": "大丽花",
    "Freesia": "苍兰",
    "Castilla": "卡斯蒂利亚",
    "Devil in Disguise": "魔鬼伪装",
    "Salantara": "萨兰塔瑞",
    "Bellerophon": "柏勒罗丰",
    "Wings of Pegasus": "天马之翼",
    "Orion Cargo": "猎户座货运",
    "Orion League Delivery Vessel": "猎户座联赛发货船",
    "Anger of Perseus": "英仙座的愤怒",
    "Medusa Miner": "美杜莎矿工",
    "Nux": "纳克斯",
    "Max": "马克斯",
    "Furiosa": "芙莉欧莎指挥官",
    "Angharad": "安哈瑞达",
    "The Ace": "王牌",
    "Sean": "肖恩",
    "Dion": "迪翁",
    "Gradh": "格瑞达",
    "Alecto": "阿莱克托",
    "Maegera": "梅格瑞",
    "Tisiphon": "台思芬",
    "Light's Mexager": "光之麦格",
    "Light's Companion": "光之伴侣",
    "Vela": "维拉",
    "Yola": "约拉",
    "Ambjenze": "安本斯",
    "Zannsarig": "萨瑞格",
    "U.N.I.T Zero": "零部队",
    "U.N.I.T Reppu": "瑞普部队",
    "Glissard": "格勒萨德",
    "Nabonidus": "那波尼德",
    "The Heaven's Door": "天堂之门",
    "Koroleva": "考荣利娃",

    //星球
    "Promision": "普罗米修斯",
    "Vasilis": "瓦西利斯",
    "Aequoreas": "艾阔瑞",
    "Orpheus": "奥菲斯",
    "Antirion": "安提里奥",
    "The City": "城市",
    "Ishtar Gate": "伊什塔尔之门",
    "Traumland": "楚暮大陆",
    "Tataridu": "塔塔瑞都",
    "Zelera": "泽勒热",
    "Posirion": "方位",
    "Acanthus": "艾肯思",
    "Yin Raknar": "尹拉克纳尔",
    "Antaris": "安他瑞思",
    "Teleras": "特雷阿斯",
    "Jabir": "贾比尔",
    "Plus Caerul": "加凯瑞",
    "Zhura Nova": "朱拉诺瓦",
    "Epsilon Rutheni": "爱普森如森尼",
    "Phorun": "佛润",
    "Kitrion": "柯屯",
    "Mermorra": "蒙莫瓦",
    "Kandi": "坎迪",
    "Shin Sung": "新星",
    "Xora Tauri II": "西欧桃园II",
    "Tsartasis": "沙皇塔丝",
    "New Babilo": "新巴比伦",
    "Lone Nassaus": "孤独星球",

    "Buy with": "购买需求",
    "Atmosphere": "大气",
    "Balance": "平衡",
    "Buildings": "建筑",
    "Cost": "花费",
    "Day": "天",
    "Active": "激活",
    "Production": "生产",
    "production": "生产",
    "Energy Cons.": "电力消耗",
    "Energy Prod.": "电力产出",
    "Efficiency": "效率",
    "Research Points": "研究点",
    "Research points": "研究点",
    "Influence": "影响",
    "Capital": "首都",
    "Controlled by": "控制者——",
    "Extraction": "开采",
    "Game Saved in local!": "游戏已保存到本地",
    "Idle bonus for 10 minutes": "空闲加成10分钟",
    "If it doesn't work, try exporting the save.": "如果不能起作用，尝试导出存档",
    "Loading game...": "加载游戏…",
    "Year": "年",
    "Radius": "半径",
    "Status": "状态",
    "Temperature": "温度",
    "Terrestrial planet": "陆地星球",
	"Ice planet": "冰封星球",
	"Ocean planet": "海洋星球",
    "Type": "类型",
    "Orbital Distance": "轨道距离",
    "Collapse UI": "折叠界面",
    "Energy": "电力",
    "Fleets": "舰队",
    "Info": "信息",
    "Map": "地图",
    "New Human Horizons": "新人类领域",
    "Ok": "确认",
    "Other buildings": "其它建筑",
    "Overview": "概览",
    "player": "玩家",
    "Player Name": "玩家名字",
    "Research": "研究",
    "Research buildings": "研究建筑",
    "Save": "保存",
    "Save Export": "存档导出",
    "There are no buildings to show": "没有建筑可以显示",
    "Total cost for 1 buildings": "1个建筑的总花费",
    "Total cost for 10 buildings": "10个建筑的总花费",
    "Total cost for 50 buildings": "50个建筑的总花费",
    "You don't have 1 buildings": "当前建筑不足1个",
    "You don't have 10 buildings": "当前建筑不足10个",
    "You don't have 50 buildings": "当前建筑不足50个",
    "You get 50% of the cost back": "你将获得50%的资源返还",
    "Autosave": "自动保存",
    "Empire": "帝国",
    "Fleet": "舰队",
    "Initializing game...": "初始化游戏…",
    "Music": "音乐",
    "Other": "其它",
    "Settings": "设置",
    "Sound": "声音",
    "Version": "版本",
    "Wipe Data": "清除数据",
    "Automatic construction for building queue": "自动进行建造队列",
    "BE SURE BEFORE CLICKING!!": "点击之前请小心！",
    "Change logs": "更新日志",
    "Continue": "继续",
    "Correction for autoroutes calculation": "修正自动航线的计算",
    "Developed by Cheslava": "开发者——Cheslava",
    "Disable Tutorial": "关闭指引",
    "Effects Volume": "音效音量",
    "Enable building queue": "开启建造队列",
    "Engineering Notation": "使用工程计数法",
    "Game Settings": "游戏设置",
    "heartofgalaxy.com": "heartofgalaxy.com",
    "Hide tutorial": "隐藏指引",
    "Master Volume": "主音量",
    "Music Volume": "音乐音量",
    "Reset queues and shipping": "清除建造和运输队列",
    "Save settings": "存档设置",
    "Scientific Notation": "使用科学计数法",
    "Show advanced options for autoroutes": "显示自动运输的高级选项",
    "Show all resources in shipyard": "造船厂显示所有资源",
    "Show automatic delivery fleets": "显示自动运输舰队",
    "Show cost multipliers": "显示资源花费乘数",
    "Show graphical info on building hover": "指向建筑时图示资源",
    "Show hp left in battle report": "战报显示剩余血量",
    "Show toast popups on the right": "在右侧显示弹窗提示",
    "Sort resources by name": "以字母顺序（英文原文）排序资源",
    "Sort ships by shipyard level": "根据造船厂等级排列飞船",
    "Sound Settings": "声音设置",
    "Tech interface scale": "技能界面大小",
    "Tech Tree visualization": "技能树可视化",
    "Text size": "文字大小",
    "UI Settings": "界面设置",
    "Welcome Commander!": "欢迎，指挥官！",
    "You finally woke up after a long cryosleep": "您终于从长时间的冬眠中醒来",
    "Expand UI":"扩展界面",
    "Production ":"生产 ",
    "Shipping & Deliveries": "飞船和运输",
    "10 minutes idle bonus": "空闲奖励持续10分钟",
    "Hide overview": "隐藏概览",
    "Show overview": "显示概览",
    "Planets": "星球",
    "Import/Export": "导入/导出",
    "Level": "等级",
    "Lv.": "等级",
    "Pause the game": "暂停游戏",
    "This research requires": "这个研究需要",
    "production +": "产量 +",
    "You must research": "你必须研究",
    "Allows": "允许",
    "Allows to see planets at": "允许观察星球",
    "and": "和",
    "distance from": "距离",
    "construction": "建立",
    "Perseus Arm": "英仙座旋臂",
    "Auto-routes": "自动航线",
    "Cargo Fleets": "货运舰队",
    "There are no fleets to show": "没有舰队可显示",
    "Traveling Fleets": "航行中的舰队",
    "War Fleets": "战争舰队",
    "- Unlocked by Shipyard": "- 解锁于船厂",
    "Ammunitions": "弹药",
    "Cargoship": "货船",
    "Colonial Ship": "殖民船",
    "Damage Reduction": "伤害减免",
        "Damage reduction is the percentage": "伤害减免是吸收伤害的百分比",
        "of damage absorbed.": "飞船可以增加它，",
        "It can be boosted by equipping": "只要它们装备了",
    "Engines": "引擎",
    "Gives 100% of resources back": "获得100%资源返还",
    "HP": "血量",
        "HP is the amount of damage the": "血量是可以承担的伤害量，",
        "ship can sustain before": "飞船耗尽后将",
        "being destroyed": "被摧毁",
    "Information": "信息",
    "Power": "能力",
        "Power is the amount of RAW damage": "能力是飞船造成的原始伤害量，",
        "the ship can do. It can": "飞船可以提高它，",
        "be boosted by equipping": "只要它们装备了",
    "Speed": "速度",
        "Speed affects the travelling time of": "速度决定飞船的航行",
        "a ship. It also increases power": "时间，当它比敌军大",
        "if it is higher than enemy speed,": "时将增加飞船的能力，",
        "or decreases power if it is lower": "反之则减少",
        "than the enemy speed.": "飞船可以提高它，",
    "Storage": "存储",
        "Storage is the amount of": "存储是飞船可以",
        "resources that a ship can carry": "携带的资源总量",
    "Total cost for 0 spaceships": "0艘飞船总花费",
    "Total cost for 1 spaceships": "1艘飞船总花费",
    "Total cost for 10 spaceships": "10艘飞船总花费",
    "Total cost for 100 spaceships": "100艘飞船总花费",
    "Total cost for 1000 spaceships": "1000艘飞船总花费",
    "Total cost for 10000 spaceships": "10000艘飞船总花费",
    "Unarmed": "非武装",
    "Weapon": "武器",
    "Weight": "重量",
        "Weight affects the power's": "重量影响能力的",
        "bonus/malus given by speed. Also,": "基于速度的奖惩机制。同时，",
        "enemies focus damage on higher weight": "敌军会更侧重于高重量的",
        "targets": "目标",
    "You don't have 10 space ships": "你没有10艘飞船",
    "You don't have 100 space ships": "你没有100艘飞船",
    "You don't have 1000 space ships": "你没有1000艘飞船",
    "You don't have 10000 space ships": "你没有10000艘飞船",
    "You get 100% of the cost back": "你获得100%资源返还",
    "Unlock": "解锁",
    "All research points": "所有研究点",
    "speed +": "速度 +",
	"Civilization": "所属文明",
	"Military Value": "军事价值",
	"Experience": "经验值",
	"Total HP": "总血量",
	"Total Power": "总能力",
	"Total Storage": "总存储空间",
	"orbiting": "停留",
	"Storage left": "剩余存储空间",
	"Ships": "飞船",
	"Attack Fleet": "攻击舰队",
	"Automatic Route": "自动航线",
	"Delivery": "交付",
	"Load": "装载",
	"Load Ammunition": "装载弹药",
	"Merge Fleet": "合并舰队",
	"Merge with Autoroute": "与自动航线合并",
	"Move": "移动",
	"Rename Fleet": "重命名舰队",
	"Split Fleet": "拆分舰队",
	"Unload": "卸载",
	"Pick-up": "收取",
	"traveling to": "航行至",
	"will arrive in": "预计到达",
	"Total Travel Time": "总航行时间",
	"extraction and": "提炼 和",
	"Dmg Reduction": "伤害减免",
	"HPs": "血量",
	"Autoroutes": "自动航线",
	"Create Route": "创建航线",
	"Stock": "库存",
	"This fleet will give": "这个舰队将会给予",
	"Use %        (": "使用 % (",
	"Select the amount of resources": "设定你想在这个星",
	"you want to load in this planet": "球装载的资源数量",
	"Round Trip Time": "往返时间",
	"Fleet storage": "舰队存储空间",
	"(last seen in": "(最后发现于",
	"Hide resources": "隐藏资源",
	"Show resources": "显示资源",
	"Cancel automatic route": "取消自动航线",
	"Edit automatic route": "编辑自动航线",
	"Split automatic route": "拆分自动航线",
}

//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
	"Colonize ":"殖民",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    " ": "",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
	" Res. Pts": " 研究点",
	" has been colonized!": "已被成功殖民！",
}

//需排除的，正则匹配
var cnExcludeWhole= [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/,                                           //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/,                                          //12.34e+4
    /^\s*$/,                                                                //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/,    //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/,                         //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/,         //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/,         //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/,                                          //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/,  //: 12.34K, x1.5
]

//2.采集新词
//20190320@JAR

var cnItem = function () {

    //传参是否非空字串
    if (!arguments[0]) return;

    //检验传参是否对象
    let text = arguments[0],
        s = '';
    if (typeof (text) != "string")
        return text;
    else
        s = arguments[0].charCodeAt();

    //检验传参是否英文
    // if (
    //     s < 65 || (s > 90 && s < 97) || (s > 122)
    //
    // ) return text;

    //处理前缀
    let text_prefix = "";
    for(let prefix in cnPrefix){
        if (text.substr(0,prefix.length) === prefix){
            text_prefix = cnPrefix[prefix];
            text = text.substr(prefix.length);
        }
    }
    //处理后缀
    let text_postfix = "";
    for(let postfix in cnPostfix){
        if (text.substr(-postfix.length) === postfix){
            text_postfix = cnPostfix[postfix];
            text = text.substr(0,text.length-postfix.length);
        }
    }
    //处理正则后缀
    let text_reg_exclude_postfix = "";
    for(let reg of cnExcludePostfix){
        let result = text.match(reg);
        if (result){
            text_reg_exclude_postfix = result[0];
            text = text.substr(0, text.length-text_reg_exclude_postfix.length);
        }
    }

    //检验字典是否可存
    if (!cnItems._OTHER_) cnItems._OTHER_ = [];

    //检查是否排除
    for(let reg of cnExcludeWhole){
        if (reg.test(text)){
            return text_prefix + text + text_reg_exclude_postfix + text_postfix;
        }
    }

    //遍历尝试匹配
    for (let i in cnItems) {
        //字典已有词汇或译文、且译文不为空，则返回译文
        if (
            text == i || text == cnItems[i] &&
            cnItems[i] != ''
        )
            return text_prefix + cnItems[i] + text_reg_exclude_postfix + text_postfix;
    }

    //调整收录的词条，0=收录原文，1=收录去除前后缀的文本
    let save_cfg = 1;
    let save_text = save_cfg?text:arguments[0]
    //遍历生词表是否收录
    for (
        let i = 0; i < cnItems._OTHER_.length; i++
    ) {
        //已收录则直接返回
        if (save_text == cnItems._OTHER_[i])
            return arguments[0];
    }

    if (cnItems._OTHER_.length < 500){
        //未收录则保存
        cnItems._OTHER_.push(save_text);
        cnItems._OTHER_.sort(
            function (a, b) {
                return a.localeCompare(b)
            }
        );
    }

    /*
        //开启生词打印
        //console.log(
            '有需要汉化的英文：', text
        );
    */

    //返回生词字串
    return arguments[0];
};

function TransSubTextNode(node){
    if (node.childNodes.length > 0){
        for(let subnode of node.childNodes){
            if (subnode.nodeName === "#text") {
                subnode.textContent = cnItem(subnode.textContent);
                //console.log(subnode);
            }
            else if (subnode.nodeName !=="SCRIPT" && subnode.innerHTML && subnode.innerText){
                if (subnode.innerHTML === subnode.innerText){
                    subnode.innerText = cnItem(subnode.innerText);
                    //console.log(subnode);
                }
                else {
                    TransSubTextNode(subnode);
                }
            }
            else{
                // do nothing;
            }
        }
    }
}

!function(){
    console.log("加载汉化模块");

    let observer_config = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true
    };
    let targetNode = document.body;
    //汉化静态页面内容
    TransSubTextNode(targetNode);
    //监听页面变化并汉化动态内容
    let observer = new MutationObserver(function(e){
        observer.disconnect();
        for(let mutation of e){
            if (mutation.target.nodeName === "SCRIPT") continue;
            if (mutation.target.innerHTML && mutation.target.innerText && mutation.target.innerHTML === mutation.target.innerText){
                mutation.target.innerText = cnItem(mutation.target.innerText);
            }
            else if (mutation.addedNodes.length > 0){
                for(let node of mutation.addedNodes){
                    if (node.nodeName === "#text") {
                        node.textContent = cnItem(node.textContent);
                        //console.log(node);
                    }
                    else if (node.nodeName !=="SCRIPT" && node.innerHTML && node.innerText){
                        if (node.innerHTML === node.innerText){
                            node.innerText = cnItem(node.innerText);
                        }
                        else{
                            TransSubTextNode(node);
                        }
                    }
                }
            }
        }
        observer.observe(targetNode, observer_config);
    });
    observer.observe(targetNode, observer_config);
}();