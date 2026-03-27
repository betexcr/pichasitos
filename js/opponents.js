const OPPONENT_DATA = [
  // === CIRCUITO DEL PUEBLO ===
  {
    id:0, name:'DON CARLOS', title:'El Rey del Karaoke', circuit:0,
    quote:'DEJEME CANTAR ALMA DE ACERO\nY DESPUES LE PARTO EL ALMA\nA USTED TAMBIEN, MAE!',
    health:75, damage:{jab:10,power:18,special:26},
    speed:0.55, aggressiveness:0.35, blockChance:0.22, counterChance:0.08,
    build:'fat', skinColor:CONST.COLORS.SKIN_MEDIUM, hairColor:'#333',
    hairStyle:'balding', shirtColor:'#FFF', pantsColor:'#333', shoeColor:'#543', bellyColor:'#FFF',
    facialHair:'mustache', accessories:['goldChain','microphone'],
    patterns:[
      {type:'jab',side:'right',tellFrames:22,attackFrames:10,recoveryFrames:20,damage:10},
      {type:'haymaker',side:'left',tellFrames:30,attackFrames:12,recoveryFrames:24,damage:18},
      {type:'special',side:'both',tellFrames:38,attackFrames:16,recoveryFrames:32,damage:26,stun:true},
    ],
    signatures:[
      {name:'SERENATA MORTAL',phrase:'TOMESE ESTA SERENATA, PERRO!',type:'signature',side:'both',tellFrames:32,attackFrames:16,recoveryFrames:28,damage:24,stun:true,anim:'sig_swing',effect:'mic_trail'},
      {name:'PANZAZO',phrase:'PANZAZO DE CAMPEON!',type:'signature',side:'both',tellFrames:28,attackFrames:14,recoveryFrames:26,damage:20,unblockable:true,anim:'sig_rush',effect:'shockwave'},
    ],
    taunts:['YO CANTO Y PEGO, MAE!','ESTA VA CON DEDICATORIA!','COMO DICE LA CANCION: LE DOY!','APPLAUSE APPLAUSE!','MAS FUERTE QUE NOTA DE BAJO!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.35,
  },
  {
    id:1, name:'GRINGO', title:'El Turista Perdido', circuit:0,
    quote:'BRO I JUST WANTED A CERVEZA...\nWHY IS EVERYONE FIGHTING?!\nTHIS WASNT ON TRIPADVISOR!',
    health:70, damage:{jab:9,power:16,special:22},
    speed:0.6, aggressiveness:0.4, blockChance:0.18, counterChance:0.08,
    build:'average', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#DAA520',
    hairStyle:'blonde_short', shirtColor:'#FF6347', pantsColor:'#C2B280', shoeColor:'#8B4513',
    eyeColor:'#0A0', accessories:['fannyPack','backwardsCap'], capColor:'#C41E3A', sunburnt:true,
    patterns:[
      {type:'jab',side:'left',tellFrames:20,attackFrames:10,recoveryFrames:22,damage:9},
      {type:'jab',side:'right',tellFrames:20,attackFrames:10,recoveryFrames:22,damage:9},
      {type:'haymaker',side:'right',tellFrames:32,attackFrames:14,recoveryFrames:28,damage:16},
      {type:'special',side:'left',tellFrames:40,attackFrames:16,recoveryFrames:32,damage:22},
    ],
    signatures:[
      {name:'SAY CHEESE',phrase:'SAY CHEESE BRO! SELFIE TIME!',type:'signature',side:'both',tellFrames:26,attackFrames:8,recoveryFrames:30,damage:12,stun:true,anim:'sig_throw',effect:'flash'},
      {name:'FANNY WHACK',phrase:'TAKE THIS AMIGO! USA! USA!',type:'signature',side:'right',tellFrames:22,attackFrames:12,recoveryFrames:24,damage:18,anim:'sig_swing',effect:'dust_cloud'},
    ],
    taunts:['BRO THIS IS NOT COOL!','MY UBER RATING IS 4.9!','IM CALLING THE EMBASSY!','I KNOW KARATE... KINDA!','WAIT LET ME VLOG THIS!'],
    tellAnim:'taunt', enrageThreshold:0.35, enrageSpeedMult:1.4,
  },
  {
    id:2, name:'CLARISA', title:'La Chica Fresa', circuit:0,
    quote:'AY NO, QUE ASCO TOTAL!\nME VA A ARRUINAR LAS UNAS!\nSABE CUANTO ME COSTARON?!',
    health:65, damage:{jab:11,power:16,special:22},
    speed:0.75, aggressiveness:0.45, blockChance:0.18, counterChance:0.12,
    build:'average', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#1A1A0A',
    hairStyle:'long_straight', shirtColor:'#FF69B4', pantsColor:'#FFF', shoeColor:'#F00',
    accessories:['phone','hoopEarrings'],
    patterns:[
      {type:'jab',side:'left',tellFrames:16,attackFrames:7,recoveryFrames:16,damage:11},
      {type:'jab',side:'right',tellFrames:16,attackFrames:7,recoveryFrames:16,damage:11},
      {type:'combo',side:'both',tellFrames:20,attackFrames:14,recoveryFrames:20,damage:8,hits:3},
      {type:'special',side:'right',tellFrames:30,attackFrames:12,recoveryFrames:24,damage:22,stun:true},
    ],
    signatures:[
      {name:'UNAS DE GATA',phrase:'UNAS DE GATA GUCCI, BEBE!',type:'signature',side:'both',tellFrames:18,attackFrames:16,recoveryFrames:22,damage:9,hits:4,anim:'sig_combo',effect:'nail_slash'},
      {name:'NI ME TOQUES',phrase:'NI ME TOQUES, PIOJOSO!',type:'signature',side:'right',tellFrames:22,attackFrames:10,recoveryFrames:26,damage:16,anim:'sig_throw',effect:'phone_throw'},
    ],
    taunts:['AY QUE HORROR!','OSEA, HELLO?! NACO!','LO VOY A SUBIR A INSTA!','LITERAL QUE ASCO!','MI DADDY SE VA A ENTERAR!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.3,
  },
  // === CIRCUITO DE LA FERIA ===
  {
    id:3, name:'PANZAEPERRA', title:'El Arratado', circuit:1,
    quote:'AQUI NO HAY REGLAS, HIJUEPUTA.\nLA CALLE ES LA CALLE.\nY YO SOY EL REY DE ESTA CALLE!',
    health:85, damage:{jab:14,power:22,special:30},
    speed:0.75, aggressiveness:0.6, blockChance:0.22, counterChance:0.25,
    build:'thin', skinColor:CONST.COLORS.SKIN_DARK, hairColor:'#111',
    hairStyle:'cap', shirtColor:'#555', pantsColor:'#444', shoeColor:'#222', capColor:'#222',
    accessories:['goldTooth'],
    patterns:[
      {type:'jab',side:'left',tellFrames:14,attackFrames:6,recoveryFrames:14,damage:14},
      {type:'jab',side:'right',tellFrames:14,attackFrames:6,recoveryFrames:14,damage:14},
      {type:'headbutt',side:'both',tellFrames:16,attackFrames:8,recoveryFrames:18,damage:22,unblockable:true},
      {type:'special',side:'both',tellFrames:24,attackFrames:10,recoveryFrames:20,damage:30,stun:true},
      {type:'feint',side:'left',tellFrames:12,attackFrames:0,recoveryFrames:6,damage:0},
    ],
    signatures:[
      {name:'POLVAZO',phrase:'TOME POLVO, PERRO MALPARIDO!',type:'signature',side:'both',tellFrames:16,attackFrames:10,recoveryFrames:22,damage:10,stun:true,anim:'sig_throw',effect:'dust_cloud',condition:'health_below_50'},
      {name:'CABEZAZO CALLEJERO',phrase:'CABEZAZO DE LA CALLE!',type:'signature',side:'both',tellFrames:14,attackFrames:8,recoveryFrames:20,damage:26,unblockable:true,anim:'sig_rush',effect:'shockwave'},
    ],
    taunts:['YO SOY DE LA CALLE MAE!','AQUI SE PICHA SUCIO!','LE VOY A ENSENAR CALLE!','AGACHESE QUE VOY!','ESTO NO ES ESCUELA PIPI!'],
    tellAnim:'taunt', enrageThreshold:0.45, enrageSpeedMult:1.4,
  },
  {
    id:4, name:'MICHIQUITO', title:'El Chico Pipi', circuit:1,
    quote:'MAE USTED SABE QUIEN ES MI TATA?\nLO VOY A DEMANDAR!\nMI CARRO VALE MAS QUE SU CASA!',
    health:80, damage:{jab:13,power:20,special:26},
    speed:0.7, aggressiveness:0.5, blockChance:0.4, counterChance:0.2,
    build:'average', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#3A2A1A',
    hairStyle:'styled', shirtColor:'#FFB6C1', pantsColor:'#F5F5DC', shoeColor:'#DEB887',
    accessories:['expensiveWatch'], healsOnce:true,
    patterns:[
      {type:'jab',side:'right',tellFrames:16,attackFrames:8,recoveryFrames:16,damage:13},
      {type:'combo',side:'both',tellFrames:20,attackFrames:16,recoveryFrames:18,damage:9,hits:3},
      {type:'haymaker',side:'left',tellFrames:24,attackFrames:10,recoveryFrames:22,damage:20},
      {type:'special',side:'right',tellFrames:28,attackFrames:12,recoveryFrames:24,damage:26},
    ],
    signatures:[
      {name:'MI TATA ES ABOGADO',phrase:'MI TATA ES ABOGADO, PLAYO!',type:'signature',side:'right',tellFrames:22,attackFrames:10,recoveryFrames:24,damage:20,stun:true,anim:'sig_swing',effect:'money_rain'},
      {name:'LLUVIA DE ROJOS',phrase:'TOME ROJOS, MUERTO DE HAMBRE!',type:'signature',side:'both',tellFrames:20,attackFrames:14,recoveryFrames:26,damage:14,hits:3,anim:'sig_throw',effect:'money_rain'},
    ],
    taunts:['USTED NI PARA UBER SIRVE!','YO VENGO DEL COUNTRY!','NACO, NACO, NACO!','MI RELOJ VALE MAS QUE USTED!','VOY A LLAMAR A DADDY!'],
    tellAnim:'taunt', enrageThreshold:0.45, enrageSpeedMult:1.3,
  },
  {
    id:5, name:'HITMENA', title:'La Malabarista Peluda', circuit:1,
    quote:'EL PATRIARCADO SE DESTRUYE\nA PICHAZOS TAMBIEN, HERMANE!\nEL MACHISMO ACABA HOY!',
    health:80, damage:{jab:12,power:20,special:30},
    speed:0.8, aggressiveness:0.55, blockChance:0.28, counterChance:0.2,
    build:'average', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#8B6914',
    hairStyle:'dreads', shirtColor:'#800080', pantsColor:'#556B2F', shoeColor:CONST.COLORS.SKIN_LIGHT,
    accessories:['noseRing','juggling_clubs'],
    patterns:[
      {type:'jab',side:'left',tellFrames:16,attackFrames:7,recoveryFrames:14,damage:12},
      {type:'jab',side:'right',tellFrames:16,attackFrames:7,recoveryFrames:14,damage:12},
      {type:'haymaker',side:'left',tellFrames:22,attackFrames:10,recoveryFrames:20,damage:20},
      {type:'special',side:'both',tellFrames:28,attackFrames:14,recoveryFrames:24,damage:30,unblockable:true},
    ],
    signatures:[
      {name:'MACANAZO FEMINISTA',phrase:'MACANAZO FEMINISTA, MACHITO!',type:'signature',side:'both',tellFrames:22,attackFrames:12,recoveryFrames:24,damage:24,screenShake:true,anim:'sig_ground',effect:'shockwave'},
      {name:'MOLINETE',phrase:'MOLINETE ANTIPATRIARCAL!',type:'signature',side:'both',tellFrames:18,attackFrames:18,recoveryFrames:22,damage:12,hits:4,anim:'sig_combo',effect:'club_spin'},
    ],
    taunts:['ABAJO EL PATRIARCADO!','LA LUCHA ES CONSTANTE!','DESTRUYENDO MACHISMOS!','CON FURIA Y CON ARTE!','LAS CALLES SON NUESTRAS!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.45,
  },
  // === CIRCUITO DEL REDONDEL ===
  {
    id:6, name:'KAREN', title:'La Rude Girl', circuit:2,
    quote:'VENGA, VENGA, QUE YO LE PARTO\nLA CARA GRATIS, PAPISONGO!\nYO NO COBRO POR PICHAR!',
    health:95, damage:{jab:15,power:24,special:34},
    speed:0.9, aggressiveness:0.7, blockChance:0.3, counterChance:0.3,
    build:'stocky', skinColor:CONST.COLORS.SKIN_MEDIUM, hairColor:'#222',
    hairStyle:'buzzcut', shirtColor:'#8B0000', pantsColor:'#333', shoeColor:'#111', piercings:true,
    accessories:[],
    patterns:[
      {type:'jab',side:'left',tellFrames:10,attackFrames:5,recoveryFrames:11,damage:15},
      {type:'jab',side:'right',tellFrames:10,attackFrames:5,recoveryFrames:11,damage:15},
      {type:'combo',side:'both',tellFrames:12,attackFrames:16,recoveryFrames:16,damage:12,hits:4},
      {type:'headbutt',side:'both',tellFrames:14,attackFrames:6,recoveryFrames:16,damage:24,unblockable:true},
      {type:'special',side:'both',tellFrames:18,attackFrames:10,recoveryFrames:18,damage:34},
    ],
    signatures:[
      {name:'QUIERO AL GERENTE',phrase:'QUIERO AL GERENTE YA!',type:'signature',side:'both',tellFrames:14,attackFrames:18,recoveryFrames:20,damage:14,hits:5,anim:'sig_combo',effect:'nail_slash'},
      {name:'INADMISIBLE',phrase:'ESTO ES IN-AD-MI-SI-BLE!',type:'signature',side:'both',tellFrames:12,attackFrames:10,recoveryFrames:18,damage:28,anim:'sig_swing',effect:'shockwave'},
    ],
    taunts:['USTED NO SABE CON QUIEN SE METIO!','VOY A HACER UNA RESENA TERRIBLE!','NECESITO HABLAR CON SU SUPERIOR!','ESTO ES INACEPTABLE!','ME QUEJO EN REDES SOCIALES!'],
    tellAnim:'taunt', enrageThreshold:0.45, enrageSpeedMult:1.4,
  },
  {
    id:7, name:'CARRETASTAR', title:'El Tope Borracho', circuit:2,
    quote:'EN EL TOPE DE PALMARES\nYO TUMBE A TRES DE UN LAZO!\nY TODAVIA TENIA BIRRA EN MANO!',
    health:105, damage:{jab:14,power:26,special:36},
    speed:0.65, aggressiveness:0.6, blockChance:0.22, counterChance:0.25,
    build:'muscular', skinColor:CONST.COLORS.SKIN_MEDIUM, hairColor:'#5C3317',
    hairStyle:'cowboy_hat', shirtColor:'#8B4513', pantsColor:'#556B2F', shoeColor:'#654321',
    facialHair:'mustache', hatBandColor:CONST.COLORS.RED,
    accessories:['spurs','lasso'], drinksPowerUp:true,
    patterns:[
      {type:'jab',side:'right',tellFrames:16,attackFrames:8,recoveryFrames:14,damage:14},
      {type:'haymaker',side:'left',tellFrames:22,attackFrames:12,recoveryFrames:22,damage:26},
      {type:'special',side:'both',tellFrames:26,attackFrames:14,recoveryFrames:24,damage:36,unblockable:true},
      {type:'charge',side:'both',tellFrames:28,attackFrames:10,recoveryFrames:24,damage:28,unblockable:true},
    ],
    signatures:[
      {name:'LAZO DE TOPE',phrase:'LAZO DEL TOPE, COMPA!',type:'signature',side:'both',tellFrames:24,attackFrames:12,recoveryFrames:26,damage:18,stun:true,anim:'sig_grab',effect:'lasso_loop'},
      {name:'ESPUELAZO',phrase:'ESPUELAZO PA QUE APRENDA!',type:'signature',side:'right',tellFrames:16,attackFrames:8,recoveryFrames:20,damage:30,anim:'sig_rush',effect:'shockwave'},
    ],
    taunts:['YIJAAA HIJUEPUTA!','COMO EN EL TOPE!','JINETEANDO BOLOS DESDE EL 98!','LA ESPUELA NO PERDONA!','AQUI MANDO YO Y MI CABALLO!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.5,
  },
  {
    id:8, name:'PERSEFONE', title:'La Raver Cosmica', circuit:2,
    quote:'TODO ES ENERGIA, MAE.\nY LA MIA VIBRA MAS ALTO.\nSIENTE EL BEAT!',
    health:85, damage:{jab:14,power:22,special:30},
    speed:0.95, aggressiveness:0.65, blockChance:0.32, counterChance:0.25,
    build:'average', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#FF1493',
    hairStyle:'space_buns', shirtColor:'#000', pantsColor:'#111', shoeColor:'#FF1493',
    accessories:['glowsticks','pacifier'], rhythmBased:true,
    patterns:[
      {type:'jab',side:'left',tellFrames:10,attackFrames:5,recoveryFrames:12,damage:14},
      {type:'jab',side:'right',tellFrames:10,attackFrames:5,recoveryFrames:12,damage:14},
      {type:'combo',side:'both',tellFrames:14,attackFrames:14,recoveryFrames:16,damage:10,hits:4},
      {type:'special',side:'both',tellFrames:20,attackFrames:12,recoveryFrames:20,damage:30,stun:true},
    ],
    signatures:[
      {name:'BASS DROP',phrase:'BASS DROP, SIENTALO!',type:'signature',side:'both',tellFrames:22,attackFrames:10,recoveryFrames:24,damage:24,stun:true,screenShake:true,anim:'sig_ground',effect:'shockwave'},
      {name:'RAVE FURY',phrase:'RAVE FURY COSMICAAAA!',type:'signature',side:'both',tellFrames:16,attackFrames:18,recoveryFrames:20,damage:12,hits:5,anim:'sig_combo',effect:'club_spin'},
    ],
    taunts:['SIENTE LA VIBRACION!','EL UNIVERSO GOLPEA!','PLUR PERO CON PICHAZOS!','LA ENERGIA NO MIENTE!','BAILANDO Y PICHANDOOO!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.45,
  },
  // === CIRCUITO DE LA MUERTE ===
  {
    id:9, name:'DON ALVARO', title:'El Metalero', circuit:3,
    quote:'MUERTE Y DESTRUCCION!\n...DIAY, ES QUE ME GUSTA EL METAL.\nHOY TOCO SU REQUIEM!',
    health:120, damage:{jab:16,power:28,special:42},
    speed:0.6, aggressiveness:0.6, blockChance:0.38, counterChance:0.25,
    build:'fat', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#111',
    hairStyle:'long_black', shirtColor:'#111', pantsColor:'#222', shoeColor:'#000',
    facialHair:'beard', bellyColor:'#111', accessories:['patches','chains'], superArmor:true,
    patterns:[
      {type:'jab',side:'right',tellFrames:14,attackFrames:8,recoveryFrames:12,damage:16},
      {type:'haymaker',side:'left',tellFrames:20,attackFrames:12,recoveryFrames:20,damage:28},
      {type:'charge',side:'both',tellFrames:22,attackFrames:14,recoveryFrames:22,damage:30,unblockable:true},
      {type:'special',side:'both',tellFrames:24,attackFrames:16,recoveryFrames:24,damage:42},
    ],
    signatures:[
      {name:'ROCK N ROLL',phrase:'ROCK AND ROLL, HIJUEPUTA!',type:'signature',side:'both',tellFrames:20,attackFrames:14,recoveryFrames:22,damage:32,anim:'sig_swing',effect:'chain_whip'},
      {name:'ABRAZO DE OSO',phrase:'ABRAZO DE OSO METALERO!',type:'signature',side:'both',tellFrames:18,attackFrames:20,recoveryFrames:26,damage:38,unblockable:true,anim:'sig_grab',effect:'shockwave'},
    ],
    taunts:['ESTO ES METAL, MAE!','HEADBANG DE DOLOR!','VOY A HACER MOSH CON SU CARA!','SLAYER LE MANDA SALUDOS!','EL PIT NO PERDONA!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.5,
  },
  {
    id:10, name:'ANAI', title:'El Rasta de Limon', circuit:3,
    quote:'BREDDA, I&I NO BUSCA WAR...\nPERO SI VIENE, JAH ME PROTEGE.\nDE LIMON CON AMOR Y PICHAZOS!',
    health:95, damage:{jab:15,power:26,special:36},
    speed:1.0, aggressiveness:0.45, blockChance:0.45, counterChance:0.55,
    build:'thin', skinColor:CONST.COLORS.SKIN_BLACK, hairColor:'#222',
    hairStyle:'rasta_tam', shirtColor:'#2F4F2F', pantsColor:'#556B2F', shoeColor:CONST.COLORS.SKIN_BLACK,
    accessories:[], counterFighter:true,
    patterns:[
      {type:'counter_jab',side:'left',tellFrames:6,attackFrames:5,recoveryFrames:10,damage:15},
      {type:'counter_jab',side:'right',tellFrames:6,attackFrames:5,recoveryFrames:10,damage:15},
      {type:'haymaker',side:'left',tellFrames:16,attackFrames:8,recoveryFrames:16,damage:26},
      {type:'special',side:'both',tellFrames:20,attackFrames:12,recoveryFrames:18,damage:36,stun:true},
    ],
    signatures:[
      {name:'JAH GUIDE I',phrase:'JAH GUIDE I THROUGH FIRE!',type:'signature',side:'both',tellFrames:10,attackFrames:8,recoveryFrames:16,damage:22,anim:'sig_counter',effect:'war_paint_glow',condition:'on_player_punch'},
      {name:'ROOTS THUNDER',phrase:'ROOTS THUNDER FROM LIMON!',type:'signature',side:'both',tellFrames:20,attackFrames:12,recoveryFrames:22,damage:30,screenShake:true,anim:'sig_ground',effect:'shockwave'},
    ],
    taunts:['JAH RASTAFARI!','BABYLON FALL TODAY!','ROOTS AND CULTURE!','ONE LOVE, ONE PUNCH!','ZION AWAITS, BREDDA!'],
    tellAnim:'taunt', enrageThreshold:0.35, enrageSpeedMult:1.6,
  },
  {
    id:11, name:'SKIN', title:'La Muralla', circuit:3,
    quote:'NO OCUPO HABLAR.\nLOS PUNOS HABLAN POR MI.\nY HABLAN MUY FUERTE.',
    health:130, damage:{jab:16,power:28,special:40},
    speed:0.9, aggressiveness:0.8, blockChance:0.32, counterChance:0.35,
    build:'muscular', skinColor:CONST.COLORS.SKIN_LIGHT, hairColor:'#AAA',
    hairStyle:'bald', shirtColor:'#333', pantsColor:'#222', shoeColor:'#111',
    accessories:['earGauges','knuckleTattoos'], superArmor:true,
    patterns:[
      {type:'jab',side:'left',tellFrames:8,attackFrames:5,recoveryFrames:8,damage:16},
      {type:'jab',side:'right',tellFrames:8,attackFrames:5,recoveryFrames:8,damage:16},
      {type:'combo',side:'both',tellFrames:10,attackFrames:18,recoveryFrames:14,damage:14,hits:5},
      {type:'haymaker',side:'right',tellFrames:12,attackFrames:8,recoveryFrames:14,damage:28},
      {type:'special',side:'both',tellFrames:14,attackFrames:12,recoveryFrames:18,damage:40},
    ],
    signatures:[
      {name:'PUNO MARCADO',phrase:'PUNO MARCADO EN SU JETA!',type:'signature',side:'both',tellFrames:10,attackFrames:20,recoveryFrames:16,damage:16,hits:5,anim:'sig_combo',effect:'shockwave'},
      {name:'TATUAJE DE DOLOR',phrase:'LE TATUO EL DOLOR, MAE!',type:'signature',side:'both',tellFrames:14,attackFrames:10,recoveryFrames:20,damage:36,screenShake:true,anim:'sig_ground',effect:'shockwave'},
    ],
    taunts:['...','LOS PUNOS HABLAN.','SIN PIEDAD.','DOLOR PURO.','TINTA Y SANGRE.'],
    tellAnim:'taunt', enrageThreshold:0.45, enrageSpeedMult:1.4,
  },
  {
    id:12, name:'EL INDIO', title:'El Guerrero Ancestral', circuit:3,
    quote:'ESTA TIERRA ES DE MIS ANCESTROS.\nY USTED NO TIENE PERMISO.\nPREPARESE PARA EL JUICIO!',
    health:115, damage:{jab:16,power:28,special:42},
    speed:0.95, aggressiveness:0.6, blockChance:0.48, counterChance:0.45,
    build:'muscular', skinColor:CONST.COLORS.SKIN_DARK, hairColor:'#111',
    hairStyle:'indigenous', shirtColor:CONST.COLORS.SKIN_DARK, pantsColor:'#654321', shoeColor:CONST.COLORS.SKIN_DARK,
    facePaint:true, accessories:['jadeJewelry','feathers'], adapts:true,
    patterns:[
      {type:'jab',side:'left',tellFrames:8,attackFrames:5,recoveryFrames:10,damage:16},
      {type:'jab',side:'right',tellFrames:8,attackFrames:5,recoveryFrames:10,damage:16},
      {type:'combo',side:'both',tellFrames:10,attackFrames:14,recoveryFrames:12,damage:14,hits:4},
      {type:'charge',side:'both',tellFrames:16,attackFrames:8,recoveryFrames:14,damage:28,unblockable:true},
      {type:'special',side:'both',tellFrames:18,attackFrames:14,recoveryFrames:16,damage:42,unblockable:true},
    ],
    signatures:[
      {name:'SANGRE GUERRERA',phrase:'SANGRE DE GUERRERO, MAE!',type:'signature',side:'both',tellFrames:14,attackFrames:10,recoveryFrames:18,damage:35,unblockable:true,anim:'sig_rush',effect:'war_paint_glow'},
      {name:'ESPIRITU ANCESTRAL',phrase:'ESPIRITU DE MIS ANCESTROS!',type:'signature',side:'both',tellFrames:18,attackFrames:22,recoveryFrames:20,damage:18,hits:4,unblockable:true,screenShake:true,anim:'sig_combo',effect:'war_paint_glow'},
    ],
    taunts:['LA TIERRA ME DA FUERZA!','MIS ANCESTROS ME GUIAN!','USTED OFENDE ESTA TIERRA!','JUSTICIA ANCESTRAL!','EL JADE PROTEGE AL GUERRERO!'],
    tellAnim:'taunt', enrageThreshold:0.4, enrageSpeedMult:1.6,
  },
];

const TORO_DATA = {
  id:13, name:'EL TORO', title:'MALACRIANZA', circuit:4, quote:'MUUUUUUUUUU!!!',
  health:180, damage:{jab:18,power:34,special:48},
  speed:0.75, aggressiveness:0.7, blockChance:0, counterChance:0.15,
  build:'bull', bodyColor:'#4A3728', snoutColor:'#6B4F3A', skinColor:'#4A3728',
  patterns:[
    {type:'charge',side:'both',tellFrames:28,attackFrames:12,recoveryFrames:28,damage:34,unblockable:true},
    {type:'horn_left',side:'left',tellFrames:16,attackFrames:8,recoveryFrames:18,damage:22},
    {type:'horn_right',side:'right',tellFrames:16,attackFrames:8,recoveryFrames:18,damage:22},
    {type:'stomp',side:'both',tellFrames:20,attackFrames:10,recoveryFrames:22,damage:26,screenShake:true},
    {type:'special',side:'both',tellFrames:24,attackFrames:16,recoveryFrames:28,damage:48,unblockable:true,screenShake:true},
  ],
  signatures:[
    {name:'ESTAMPIDA',phrase:'MUUUUUUU HIJUEPUTA!',type:'signature',side:'both',tellFrames:22,attackFrames:14,recoveryFrames:30,damage:42,unblockable:true,screenShake:true,anim:'sig_rush',effect:'shockwave'},
    {name:'CORNADA MORTAL',phrase:'CORNADA MORTAL PA USTED!',type:'signature',side:'both',tellFrames:18,attackFrames:10,recoveryFrames:26,damage:48,unblockable:true,screenShake:true,anim:'sig_rush',effect:'horn_gore'},
  ],
  taunts:['MUUUU!','*RESOPLA*','*PATEA EL SUELO*','MUUUUUUUUU!','*CUERNOS LISTOS*'],
  enrageThreshold:0.5, enrageSpeedMult:1.6,
};

class OpponentAI {
  constructor(data) {
    this.data = data; this.health = data.health; this.maxHealth = data.health;
    this.state = 'idle'; this.stateTimer = 0; this.currentPattern = null;
    this.patternIndex = 0; this.comboHitsLeft = 0; this.actionCooldown = 0;
    this.enraged = false; this.hasHealed = false;
    this.swayOffset = 0; this.swayDir = 1; this.animFrame = 0; this.animTimer = 0;
    this.roundsWon = 0; this.playerDodgeCount = {left:0,right:0,duck:0};
    this.signaturePhrase = ''; this.signaturePhraseTimer = 0;
    this.signatureEffect = null; this.signatureEffectTimer = 0;
    this.lastSigUsedTick = -999;
  }

  reset() {
    this.health = this.maxHealth; this.state = 'idle'; this.stateTimer = 0;
    this.currentPattern = null; this.comboHitsLeft = 0; this.actionCooldown = 0;
    this.enraged = false; this.hasHealed = false;
    this.playerDodgeCount = {left:0,right:0,duck:0};
    this.signaturePhrase = ''; this.signaturePhraseTimer = 0;
    this.signatureEffect = null; this.signatureEffectTimer = 0; this.lastSigUsedTick = -999;
  }

  resetRound() {
    this.health = this.maxHealth; this.state = 'idle'; this.stateTimer = 0;
    this.currentPattern = null; this.comboHitsLeft = 0; this.actionCooldown = 15;
    this.signaturePhrase = ''; this.signaturePhraseTimer = 0;
  }

  update(playerState, tick) {
    this.swayOffset += 0.03*this.swayDir;
    if (Math.abs(this.swayOffset) > 1.2) this.swayDir *= -1;
    this.animTimer++;
    if (this.animTimer >= 10) { this.animTimer = 0; this.animFrame = (this.animFrame+1)%2; }
    if (this.signaturePhraseTimer > 0) this.signaturePhraseTimer--;
    if (this.signatureEffectTimer > 0) this.signatureEffectTimer--; else this.signatureEffect = null;
    if (!this.enraged && this.health <= this.maxHealth*(this.data.enrageThreshold||0.3)) this.enraged = true;

    if (this.data.healsOnce && !this.hasHealed && this.health < this.maxHealth*0.3) {
      this.hasHealed = true;
      this.health = Math.min(this.maxHealth, this.health+this.maxHealth*0.3);
      this.state = 'taunt'; this.stateTimer = 30; return;
    }

    if (this.stateTimer > 0) {
      this.stateTimer--;
      if (this.stateTimer <= 0) {
        if (this.state === 'ko') return;
        if (this.state === 'attack' && this.comboHitsLeft > 0) { this.comboHitsLeft--; this.stateTimer = this.currentPattern.attackFrames; return; }
        if (this.state === 'attack') { this.state = 'recovery'; this.stateTimer = this._adj(this.currentPattern.recoveryFrames); return; }
        if (this.state === 'tell') {
          this.state = 'attack'; this.stateTimer = this._adj(this.currentPattern.attackFrames);
          this.comboHitsLeft = (this.currentPattern.hits||1)-1;
          if (this.currentPattern.type === 'signature' && this.currentPattern.effect) { this.signatureEffect = this.currentPattern.effect; this.signatureEffectTimer = this.currentPattern.attackFrames+15; }
          return;
        }
        this.state = 'idle'; this.actionCooldown = this._cd();
      }
      return;
    }
    if (this.state === 'ko') return;
    if (this.actionCooldown > 0) {
      this.actionCooldown--;
      const playerPunching = playerState==='punch_left'||playerState==='punch_right';
      const playerWindup = playerState==='windup';
      if (playerWindup && Math.random() < this.data.blockChance * (this.enraged ? 1.5 : 0.8)) {
        this._startBlock(); return;
      }
      if (playerWindup && this.data.counterFighter && Math.random() < this.data.counterChance * (this.enraged ? 2 : 1)) {
        const csig = this.data.signatures && this.data.signatures.find(s => s.condition === 'on_player_punch');
        if (csig && Math.random() < 0.4) this._startAttack(csig);
        else this._startAttack(this.data.patterns.find(p => p.type === 'jab') || this.data.patterns[0]);
        return;
      }
      if (this.data.counterFighter && playerPunching) {
        if (Math.random() < this.data.counterChance*(this.enraged?1.5:1)) {
          const csig = this.data.signatures&&this.data.signatures.find(s=>s.condition==='on_player_punch');
          if (csig && Math.random()<0.4) this._startAttack(csig); else this._startBlock();
          return;
        }
      }
      return;
    }
    if (playerState==='windup'||playerState==='punch_left'||playerState==='punch_right'||playerState==='special') {
      if (Math.random()<this.data.blockChance) { this._startBlock(); return; }
      if (this.data.counterFighter && Math.random()<this.data.counterChance*2) {
        this._startAttack(this.data.patterns.find(p=>p.type.includes('counter'))||this.data.patterns[0]); return;
      }
    }
    if (Math.random()<this.data.aggressiveness*(this.enraged?1.4:1)) this._choose(playerState,tick);
    else this.actionCooldown = Math.floor(10+Math.random()*18);
  }

  _choose(playerState, tick) {
    const all = [...this.data.patterns];
    const sigs = this.data.signatures||[];
    const sigOk = (tick||0)-this.lastSigUsedTick > 90;
    sigs.forEach(sig => {
      if (!sigOk) return;
      if (sig.condition==='health_below_50' && this.health>this.maxHealth*0.5) return;
      if (sig.condition==='on_player_punch') return;
      all.push(sig);
    });
    let weights = all.map(p => {
      let w=1;
      if (p.type==='signature') w=this.enraged?0.35:0.15;
      else if (p.type==='special') w=this.enraged?0.3:0.1;
      else if (p.type==='jab') w=0.4;
      else if (p.type==='combo') w=this.enraged?0.3:0.15;
      else if (p.type==='haymaker') w=0.2;
      else if (p.type==='charge') w=this.enraged?0.25:0.1;
      else if (p.type==='headbutt') w=0.15;
      else if (p.type==='feint') w=0.1;
      else w=0.2;
      if (this.data.adapts) {
        if (p.side==='left'&&this.playerDodgeCount.right>3) w*=0.5;
        if (p.side==='right'&&this.playerDodgeCount.left>3) w*=0.5;
        if (p.unblockable&&this.playerDodgeCount.duck<2) w*=2;
      }
      return w;
    });
    const tw = weights.reduce((a,b)=>a+b,0);
    let r = Math.random()*tw; let chosen = all[0];
    for (let i=0;i<weights.length;i++) { r-=weights[i]; if(r<=0){chosen=all[i];break;} }
    this._startAttack(chosen);
  }

  _startAttack(p) {
    this.currentPattern = p;
    if (p.type==='signature') {
      this.lastSigUsedTick = Date.now();
      if (p.phrase) { this.signaturePhrase = p.phrase; this.signaturePhraseTimer = 50; }
    } else if (this.data.taunts && this.data.taunts.length > 0 && Math.random() < 0.18) {
      this.signaturePhrase = this.data.taunts[Math.floor(Math.random() * this.data.taunts.length)];
      this.signaturePhraseTimer = 35;
    }
    this.state = 'tell'; this.stateTimer = this._adj(p.tellFrames);
  }

  _startBlock() { this.state = 'block'; this.stateTimer = 12+Math.floor(Math.random()*8); }
  _adj(f) { const sm=this.enraged?(this.data.enrageSpeedMult||1.3):1; return Math.max(4,Math.floor(f/(this.data.speed*sm))); }
  _cd() { const b=this.enraged?6:14; return b+Math.floor(Math.random()*(this.enraged?10:22)); }

  takeHit(damage) {
    if (this.state==='block') damage=Math.floor(damage*0.2);
    if (this.data.superArmor&&this.state==='attack') damage=Math.floor(damage*0.5);
    this.health = Math.max(0, this.health-damage);
    if (this.state!=='attack'||!this.data.superArmor) { this.state='hurt'; this.stateTimer=10; this.currentPattern=null; }
    if (this.health<=0) { this.state='ko'; this.stateTimer=120; }
    return damage;
  }

  isAttacking() { return this.state==='attack'&&this.stateTimer>0; }
  getAttackDamage() { return this.currentPattern?this.currentPattern.damage:0; }
  isAttackUnblockable() { return this.currentPattern&&this.currentPattern.unblockable; }
  isAttackStun() { return this.currentPattern&&this.currentPattern.stun; }
  getAttackSide() { return this.currentPattern?this.currentPattern.side:'both'; }
  isVulnerable() { return this.state==='recovery'||this.state==='taunt'; }
  isBlocking() { return this.state==='block'; }
  isKO() { return this.state==='ko'; }
  isAlive() { return this.health>0; }

  getAnimState() {
    switch(this.state) {
      case 'tell':
        if (this.currentPattern&&this.currentPattern.type==='signature'&&this.currentPattern.anim) return this.currentPattern.anim;
        return this.data.tellAnim||'taunt';
      case 'attack':
        if (!this.currentPattern) return 'punch_right';
        if (this.currentPattern.type==='signature'&&this.currentPattern.anim) return this.currentPattern.anim;
        if (this.currentPattern.type==='charge') return 'charge';
        return this.currentPattern.side==='left'?'punch_left':this.currentPattern.side==='right'?'punch_right':'special';
      case 'recovery': return 'idle2'; case 'hurt': return 'hurt'; case 'block': return 'block';
      case 'ko': return 'ko'; case 'taunt': return 'taunt'; default: return 'idle';
    }
  }

  recordPlayerDodge(type) {
    if (type==='dodge_left') this.playerDodgeCount.left++;
    else if (type==='dodge_right') this.playerDodgeCount.right++;
    else if (type==='duck') this.playerDodgeCount.duck++;
  }
}
