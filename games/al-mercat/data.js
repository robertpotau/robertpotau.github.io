"use strict";
/* Al Mercat! — dades: productes, nivells, textos (ca/es), trofeus, rangs */
const VERSION="1.4", VERSION_DATE="2026-09-26";

/* Valors en CÈNTIMS (enters, per evitar errors de coma flotant) */
const COINS=[1,2,5,10,20,50,100,200];
const BILLS=[500,1000,2000,5000];

/* ───────── Productes ─────────
   n = venut per unitat (singular, plural) · k = venut per quilo (nom)
   uMax = preu màxim raonable per unitat (cèntims) · kp = preu per quilo [min,max] en euros */
const PRODUCTS=[
 // Pa, làctics i ous
 {id:"pa",     e:"🥖",cat:"pa",   uMin:100,uMax:300,n:{ca:["barra de pa","barres de pa"],es:["barra de pan","barras de pan"]}},
 {id:"llet",   e:"🥛",cat:"pa",   uMin:100,uMax:300,n:{ca:["bric de llet","brics de llet"],es:["brik de leche","briks de leche"]}},
 {id:"ous",    e:"🥚",cat:"pa",   uMax:300,n:{ca:["ou","ous"],es:["huevo","huevos"]}},
 {id:"formatge",e:"🧀",cat:"pa",  kp:[6,14],k:{ca:"formatge",es:"queso"}},
 // Begudes i snacks
 {id:"suc",    e:"🧃",cat:"beg",  uMin:100,uMax:400,n:{ca:["bric de suc","brics de suc"],es:["brik de zumo","briks de zumo"]}},
 {id:"aigua",  e:"💧",cat:"beg",  uMin:50,uMax:200,n:{ca:["ampolla d'aigua","ampolles d'aigua"],es:["botella de agua","botellas de agua"]}},
 {id:"refresc",e:"🥤",cat:"beg",  uMin:100,uMax:300,n:{ca:["refresc","refrescos"],es:["refresco","refrescos"]}},
 {id:"xips",   e:"🍟",cat:"snack",uMin:100,uMax:400,n:{ca:["bossa de xips","bosses de xips"],es:["bolsa de patatas fritas","bolsas de patatas fritas"]}},
 // Dolços
 {id:"caramel",e:"🍬",cat:"dolc", uMax:200,n:{ca:["caramel","caramels"],es:["caramelo","caramelos"]}},
 {id:"xocolata",e:"🍫",cat:"dolc",uMin:50,uMax:300,n:{ca:["xocolatina","xocolatines"],es:["chocolatina","chocolatinas"]}},
 {id:"galetes",e:"🍪",cat:"dolc", uMin:100,uMax:500,n:{ca:["paquet de galetes","paquets de galetes"],es:["paquete de galletas","paquetes de galletas"]}},
 {id:"donut",  e:"🍩",cat:"dolc", uMin:50,uMax:300,n:{ca:["dònut","dònuts"],es:["donut","donuts"]}},
 // Fruita i verdura (unitat i quilo)
 {id:"poma",   e:"🍎",cat:"fruita",uMax:200,kp:[2,5],n:{ca:["poma","pomes"],es:["manzana","manzanas"]},k:{ca:"pomes",es:"manzanas"}},
 {id:"platan", e:"🍌",cat:"fruita",uMax:200,kp:[2,4],n:{ca:["plàtan","plàtans"],es:["plátano","plátanos"]},k:{ca:"plàtans",es:"plátanos"}},
 {id:"taronja",e:"🍊",cat:"fruita",uMax:200,kp:[1,3],n:{ca:["taronja","taronges"],es:["naranja","naranjas"]},k:{ca:"taronges",es:"naranjas"}},
 {id:"tomaquet",e:"🍅",cat:"verd",kp:[2,5],k:{ca:"tomàquets",es:"tomates"}},
 {id:"pastanaga",e:"🥕",cat:"verd",kp:[1,3],k:{ca:"pastanagues",es:"zanahorias"}},
 {id:"patata", e:"🥔",cat:"verd", kp:[1,3],k:{ca:"patates",es:"patatas"}},
 {id:"raim",   e:"🍇",cat:"fruita",kp:[3,6],k:{ca:"raïm",es:"uvas"}},
 // Carn i peix
 {id:"pollastre",e:"🍗",cat:"carn",kp:[4,8],k:{ca:"pollastre",es:"pollo"}},
 {id:"peix",   e:"🐟",cat:"carn", kp:[6,12],k:{ca:"peix",es:"pescado"}},
 {id:"porc",   e:"🥩",cat:"carn", kp:[5,9],k:{ca:"carn de porc",es:"carne de cerdo"}},
 {id:"botiblanca",e:"🌭",cat:"carn",kp:[6,10],k:{ca:"botifarra blanca",es:"butifarra blanca"}},
 {id:"botinegra",e:"🌭",cat:"carn",kp:[6,10],k:{ca:"botifarra negra",es:"butifarra negra"}},
 {id:"pernil", e:"🍖",cat:"carn", kp:[10,20],k:{ca:"pernil salat",es:"jamón serrano"}},
 // Neteja i higiene
 {id:"sabo",   e:"🧼",cat:"neteja",uMin:100,uMax:500,n:{ca:["sabó","sabons"],es:["jabón","jabones"]}},
 {id:"paper",  e:"🧻",cat:"neteja",uMin:100,uMax:500,n:{ca:["rotlle de paper","rotlles de paper"],es:["rollo de papel","rollos de papel"]}},
 {id:"xampu",  e:"🧴",cat:"neteja",uMin:200,uMax:700,n:{ca:["xampú","xampús"],es:["champú","champús"]}},
 {id:"raspall",e:"🪥",cat:"neteja",uMin:100,uMax:500,n:{ca:["raspall de dents","raspalls de dents"],es:["cepillo de dientes","cepillos de dientes"]}},
];
const PMAP={};PRODUCTS.forEach(p=>PMAP[p.id]=p);

/* ───────── Nivells ─────────
   kind: pay (l'alumne compra i paga) · change (l'alumne és el botiguer i torna el canvi)
   ask: cal escriure el total abans de pagar · pool: preus unitaris possibles (cèntims)
   denoms: monedes/bitllets de la safata · mult: multiplicador d'XP */
const LEVELS=[
 {id:1, ic:"🍎×5 · 1 € = 5 €", icon:"🍎",color:"#22c55e",kind:"pay",   ask:false,mode:"u",lines:[1,1],pool:[100,100,100,200],qty:[2,5],max:1000,
  denoms:[100,200,500,1000],rounds:6,mult:1},
 {id:2, ic:"🥛×3 · 2 € = 6 €", icon:"🥛",color:"#3b82f6",kind:"pay",   ask:false,mode:"u",lines:[1,1],pool:[100,200,300,400,500,600,800,1000],qty:[2,5],max:3000,
  denoms:[100,200,500,1000,2000],rounds:6,mult:1},
 {id:3, ic:"🍎 + 🥛 + 🍬 = ?", icon:"📝",color:"#a855f7",kind:"pay",   ask:true, mode:"u",lines:[2,3],pool:[100,200,300,400,500],qty:[1,3],max:2500,
  denoms:[100,200,500,1000,2000],rounds:6,mult:1.5},
 {id:4, ic:"🍪×3 · 0,50 €", icon:"🪙",color:"#f59e0b",kind:"pay",   ask:true, mode:"u",lines:[1,2],pool:[50,150,250,350,450,50,150,250,100,200],qty:[2,4],max:2000,
  denoms:[50,100,200,500,1000,2000],rounds:6,mult:1.5},
 {id:5, ic:"🍎×4 · 1,25 €", icon:"💰",color:"#ec4899",kind:"pay",   ask:true, mode:"u",lines:[1,2],pool:[25,75,125,175,225,275,50,150,20,40],qty:[2,4],max:2000,
  denoms:[5,10,20,50,100,200,500,1000],rounds:8,mult:2},
 {id:6, ic:"5 € − 3,50 € = 🪙", icon:"🔄",color:"#14b8a6",kind:"change",ask:false,mode:"u",lines:[1,1],pool:[50,150,250,100,200,300,350,450,25,75,125],qty:[1,3],max:1900,
  denoms:[5,10,20,50,100,200,500,1000],rounds:8,mult:2},
 {id:7, ic:"🧾 ➜ 💶 − 🧾 = 🪙", icon:"🧾",color:"#ef4444",kind:"change",ask:true, mode:"u",lines:[2,3],pool:[25,50,75,100,125,150,200,250,300,350],qty:[1,3],max:4500,
  denoms:[1,2,5,10,20,50,100,200,500,1000,2000],rounds:8,mult:2.5},
 {id:8, ic:"⚖️ 2 kg · 3 €/kg", icon:"⚖️",color:"#84cc16",kind:"pay",   ask:true, mode:"kg",lines:[1,1],kgw:[1000,2000,3000],kgcap:6,max:3000,
  denoms:[50,100,200,500,1000,2000],rounds:8,mult:2.5},
 {id:9, ic:"⚖️ ½ kg · 3 €/kg", icon:"🧺",color:"#0ea5e9",kind:"pay",   ask:true, mode:"kg",lines:[1,1],kgw:[500,1500,2500],kgcap:10,max:3000,
  denoms:[5,10,20,50,100,200,500,1000,2000],rounds:8,mult:2.5},
 {id:10,ic:"⚖️ ¼ kg · 4 €/kg",icon:"🥩",color:"#f43f5e",kind:"pay",   ask:true, mode:"kg",lines:[1,1],kgw:[250,750,500,250,750],kgcap:12,max:3000,
  denoms:[1,2,5,10,20,50,100,200,500,1000,2000],rounds:8,mult:3},
];

/* ───────── Rangs (estàndard: 10 fixos) ───────── */
const RANKS=[
 {e:"🌱",xp:0,    m:"Novell",f:"Novella",n:"Novell/a",es:{m:"Novato",f:"Novata",n:"Novato/a"}},
 {e:"🗺️",xp:200,  m:"Explorador",f:"Exploradora",n:"Explorador/a",es:{m:"Explorador",f:"Exploradora",n:"Explorador/a"}},
 {e:"⚡",xp:500,  m:"Aventurer",f:"Aventurera",n:"Aventurer/a",es:{m:"Aventurero",f:"Aventurera",n:"Aventurero/a"}},
 {e:"🛡️",xp:900,  m:"Guerrer",f:"Guerrera",n:"Guerrer/a",es:{m:"Guerrero",f:"Guerrera",n:"Guerrero/a"}},
 {e:"🌟",xp:1500, m:"Campió",f:"Campiona",n:"Campió/ona",es:{m:"Campeón",f:"Campeona",n:"Campeón/ona"}},
 {e:"🦸",xp:2500, m:"Heroi",f:"Heroïna",n:"Heroi/ïna",es:{m:"Héroe",f:"Heroína",n:"Héroe/ína"}},
 {e:"🔮",xp:4000, m:"Guardià",f:"Guardiana",n:"Guardià/ana",es:{m:"Guardián",f:"Guardiana",n:"Guardián/ana"}},
 {e:"👑",xp:6500, m:"Mestre",f:"Mestra",n:"Mestre/a",es:{m:"Maestro",f:"Maestra",n:"Maestro/a"}},
 {e:"✨",xp:11000,m:"Gran Mestre",f:"Gran Mestra",n:"Gran Mestre/a",es:{m:"Gran Maestro",f:"Gran Maestra",n:"Gran Maestro/a"}},
 {e:"🏆",xp:18000,m:"Llegenda",f:"Llegenda",n:"Llegenda",es:{m:"Leyenda",f:"Leyenda",n:"Leyenda"}},
];

/* ───────── Avatars ───────── */
const AVATARS_MASC=["👦","🧒","👱","🧔","👨","🧑","🧓","🤴","👳","🦸","🥷","🧙"];
const AVATARS_FEM=["👧","👩","👱‍♀️","🧕","👳‍♀️","👸","👰","🧙‍♀️","💃","🦸‍♀️","🧚‍♀️","🧜‍♀️"];
const AVATARS_NEUT=["🦊","🐱","🐼","🤖","👾","🦄","🐸","🐧","🦋","🦁","🐯","🐺","🦖","🐉","🎭","🧸"];
const SKIN_SWATCHES=["#F5C518","#FDDBB4","#E8B88A","#C78B5C","#8D5524","#4A2912"];

/* ───────── Trofeus ───────── */
const TROPHIES=[
 {id:"first",  i:"🛒",t:p=>p.st.rounds>=1},
 {id:"r10",    i:"🧺",t:p=>p.st.rounds>=10},
 {id:"r50",    i:"🛍️",t:p=>p.st.rounds>=50},
 {id:"r150",   i:"🏪",t:p=>p.st.rounds>=150},
 {id:"perfect",i:"💯",t:p=>p.st.perfect>=1},
 {id:"streak5",i:"🔥",t:p=>p.st.best>=5},
 {id:"coins",  i:"👛",t:p=>p.st.coins>=200},
 {id:"change", i:"🔄",t:p=>p.st.changeOk>=10},
 {id:"kg",     i:"⚖️",t:p=>p.st.kgOk>=10},
 {id:"cents",  i:"🪙",t:p=>(p.lv[5]&&p.lv[5].stars>=3)},
 {id:"half",   i:"🧺",t:p=>(p.lv[9]&&p.lv[9].stars>=1)},
 {id:"daily1", i:"📅",t:p=>p.daily.total>=1},
 {id:"daily3", i:"🗓️",t:p=>p.daily.streak>=3},
 {id:"all",    i:"👑",t:p=>LEVELS.every(l=>p.lv[l.id]&&p.lv[l.id].stars>=1)},
];

/* ───────── Textos ───────── */
const I18N={
ca:{
 sub:"Mates amb monedes i bitllets",
 splash:["Suma, resta i multiplica al mercat! 🧺","Un euro, dos euros… i el canvi? 💶","Al mercat, els números tenen gust de fruita 🍎","Compta bé les monedes i seràs el rei del mercat! 👑","Cada cèntim compta! 🪙","Pa, llet, ous… i mates! 🥖"],
 whoPlays:"Qui juga?",newPlayer:"Nou jugador",yourName:"El teu nom",gender:"Ets…",boy:"Noi",girl:"Noia",neutral:"Neutre",
 skin:"Color de pell",avatar:"Escull el teu avatar",language:"Idioma",go:"Endavant!",
 langCA:"Català",langES:"Castellà",langIC:"Només icones + veu",
 langCAd:"Text en català",langESd:"Texto en castellano",langICd:"Dibuixos i veu, gairebé sense text",
 secDaily:"Repte del dia",secLevels:"Nivells",secProfile:"Perfil",trophies:"Trofeus",stats:"Estadístiques",switchProfile:"Canviar perfil",credits:"Crèdits",
 clear:"Buida",hint:"Ajuda",pay:"Paga",giveChange:"Torna el canvi",next:"Següent",finish:"Acaba",again:"Torna a jugar",nextLevel:"Nivell següent",menu:"Menú",
 qTotal:"Quant costa tot?",qPay:"Quant has de pagar? Posa els diners al mostrador.",qPay2:"Ara paga {n}.",
 qChange:"El client paga amb aquest bitllet. Torna-li el canvi!",custPays:"Paga amb",purchase:"Compra",total:"Total",change:"Canvi",toPay:"Diners al mostrador",toGive:"Canvi per al client",
 tooMuch:"Massa diners! Treu alguna moneda.",tooLittle:"Encara falten diners.",wrong:"No és correcte. Torna-ho a provar!",wrongTotal:"No és aquest total. Torna-ho a provar!",
 correct:"Molt bé!",answerIs:"La resposta és:",
 hAdd:"Suma:",hSub:"Resta:",hHalf:"Mig quilo = la meitat de {p}",hQuarter:"250 g = un quart de quilo = {p} ÷ 4",hFull:"1 kg = {p}",hUp:"Compta cap amunt fins al bitllet.",
 kg:"kg",each:"cada",
 dailyTitle:"Repte del dia",dailyDesc:"6 compres mesclades. Guanya XP extra!",dailyDone:"Repte fet! Torna demà.",dailyStreak:"dies seguits",
 level:"Nivell",resultTitle:"Compra acabada!",resultAcc:"Encerts a la primera",xpGot:"XP guanyats",newTrophy:"Trofeu nou!",
 rounds:"Compres",precision:"Precisió",bestStreak:"Millor ratxa",coinsUsed:"Monedes posades",sessions:"Partides",trophyCount:"Trofeus",rank:"Rang",xpTotal:"XP total",
 settings:"Configuració",palette:"Colors",sound:"Sons",voice:"Veu",autoRead:"Llegir sol",help:"Comptador d'ajuda",helpAuto:"Automàtic",helpAlways:"Sempre",helpNever:"Mai",
 voiceLang:"Idioma de la veu",on:"Sí",off:"No",close:"Tanca",teacher:"Panell del professor",
 roundsPer:"Compres per partida",auto:"Auto",export:"Exportar CSV",deleteAll:"Esborrar totes les dades",tapAgain:"Toca un altre cop per confirmar",
 tName:"Nom",tRank:"Rang",tXp:"XP",tRounds:"Compres",tAcc:"Precisió",tLevel:"Nivell màx.",noProfiles:"Encara no hi ha jugadors.",
 tapDel:"Toca un altre cop per esborrar",
 credRole:"Disseny, pedagogia i coordinació del projecte<br>Professor, ESO",credClaude:"Programació i implementació tècnica",
 lv:[
  {t:"Un euro cada un",d:"Preus d'1 € i 2 €. Multiplicar és sumar moltes vegades.",e:"5 pomes · 1 € cada poma = <strong>5 €</strong>"},
  {t:"Preus enters",d:"Preus fins a 10 €. Paga amb monedes i bitllets.",e:"3 llets · 2 € cada bric = <strong>6 €</strong>"},
  {t:"La llista de la compra",d:"Diversos productes. Suma el total i paga.",e:"2 × 1 € + 1 × 2 € = <strong>4 €</strong>"},
  {t:"Mig euro",d:"Preus amb ,50 €. Ja fan falta monedes petites!",e:"3 galetes · 1,50 € = <strong>4,50 €</strong>"},
  {t:"Cèntims",d:"Preus com 1,25 € o 0,75 €. Monedes de cèntims.",e:"4 pomes · 1,25 € = <strong>5 €</strong>"},
  {t:"El canvi",d:"Ara ets el botiguer! Torna el canvi al client.",e:"Compra 3,50 € · paga 5 € → canvi <strong>1,50 €</strong>"},
  {t:"Compra i canvi",d:"Calcula el total i després torna el canvi.",e:"Total 6,75 € · paga 10 € → canvi <strong>3,25 €</strong>"},
  {t:"Preu per quilo",d:"El preu és per quilo (kg). Amb 2 kg pagues el doble.",e:"2 kg de pomes · 3 € el kg = <strong>6 €</strong>"},
  {t:"Mig quilo",d:"Pesa 0,5 kg, 1,5 kg… la meitat del preu!",e:"0,5 kg · 3 € el kg = <strong>1,50 €</strong>"},
  {t:"Quarts de quilo",d:"250 g, 750 g… quarts de quilo.",e:"250 g · 4 € el kg = <strong>1 €</strong>"},
 ],
 tr:{first:["Primera compra","Fes la teva primera compra"],r10:["Client habitual","10 compres fetes"],r50:["Comprador expert","50 compres fetes"],r150:["Rei del mercat","150 compres fetes"],
  perfect:["Partida perfecta","Totes les compres bé a la primera"],streak5:["Ratxa de 5","5 compres seguides a la primera"],coins:["Moneder ple","Posa 200 monedes o bitllets"],
  change:["Botiguer atent","10 canvis ben tornats"],kg:["Mestre del quilo","10 compres per quilo correctes"],cents:["Rei dels cèntims","3 estrelles al nivell 5"],
  half:["Mig i mig","Supera el nivell 9"],daily1:["Repte superat","Fes un repte del dia"],daily3:["Tres dies seguits","3 dies seguits amb repte"],all:["Tot el mercat","Supera tots els nivells"]},
},
es:{
 sub:"Mates con monedas y billetes",
 splash:["¡Suma, resta y multiplica en el mercado! 🧺","Un euro, dos euros… ¿y la vuelta? 💶","En el mercado, los números saben a fruta 🍎","¡Cuenta bien las monedas y serás el rey del mercado! 👑","¡Cada céntimo cuenta! 🪙","Pan, leche, huevos… ¡y mates! 🥖"],
 whoPlays:"¿Quién juega?",newPlayer:"Nuevo jugador",yourName:"Tu nombre",gender:"Eres…",boy:"Chico",girl:"Chica",neutral:"Neutro",
 skin:"Color de piel",avatar:"Elige tu avatar",language:"Idioma",go:"¡Adelante!",
 langCA:"Català",langES:"Castellano",langIC:"Solo iconos + voz",
 langCAd:"Text en català",langESd:"Texto en castellano",langICd:"Dibujos y voz, casi sin texto",
 secDaily:"Reto del día",secLevels:"Niveles",secProfile:"Perfil",trophies:"Trofeos",stats:"Estadísticas",switchProfile:"Cambiar perfil",credits:"Créditos",
 clear:"Vaciar",hint:"Ayuda",pay:"Paga",giveChange:"Devuelve la vuelta",next:"Siguiente",finish:"Terminar",again:"Jugar otra vez",nextLevel:"Siguiente nivel",menu:"Menú",
 qTotal:"¿Cuánto cuesta todo?",qPay:"¿Cuánto tienes que pagar? Pon el dinero en el mostrador.",qPay2:"Ahora paga {n}.",
 qChange:"El cliente paga con este billete. ¡Devuélvele la vuelta!",custPays:"Paga con",purchase:"Compra",total:"Total",change:"Vuelta",toPay:"Dinero en el mostrador",toGive:"Vuelta para el cliente",
 tooMuch:"¡Demasiado dinero! Quita alguna moneda.",tooLittle:"Todavía falta dinero.",wrong:"No es correcto. ¡Inténtalo otra vez!",wrongTotal:"Este no es el total. ¡Inténtalo otra vez!",
 correct:"¡Muy bien!",answerIs:"La respuesta es:",
 hAdd:"Suma:",hSub:"Resta:",hHalf:"Medio kilo = la mitad de {p}",hQuarter:"250 g = un cuarto de kilo = {p} ÷ 4",hFull:"1 kg = {p}",hUp:"Cuenta hacia arriba hasta el billete.",
 kg:"kg",each:"cada",
 dailyTitle:"Reto del día",dailyDesc:"6 compras mezcladas. ¡Gana XP extra!",dailyDone:"¡Reto hecho! Vuelve mañana.",dailyStreak:"días seguidos",
 level:"Nivel",resultTitle:"¡Compra terminada!",resultAcc:"Aciertos a la primera",xpGot:"XP ganados",newTrophy:"¡Trofeo nuevo!",
 rounds:"Compras",precision:"Precisión",bestStreak:"Mejor racha",coinsUsed:"Monedas puestas",sessions:"Partidas",trophyCount:"Trofeos",rank:"Rango",xpTotal:"XP total",
 settings:"Configuración",palette:"Colores",sound:"Sonidos",voice:"Voz",autoRead:"Leer solo",help:"Contador de ayuda",helpAuto:"Automático",helpAlways:"Siempre",helpNever:"Nunca",
 voiceLang:"Idioma de la voz",on:"Sí",off:"No",close:"Cerrar",teacher:"Panel del profesor",
 roundsPer:"Compras por partida",auto:"Auto",export:"Exportar CSV",deleteAll:"Borrar todos los datos",tapAgain:"Toca otra vez para confirmar",
 tName:"Nombre",tRank:"Rango",tXp:"XP",tRounds:"Compras",tAcc:"Precisión",tLevel:"Nivel máx.",noProfiles:"Todavía no hay jugadores.",
 tapDel:"Toca otra vez para borrar",
 credRole:"Diseño, pedagogía y coordinación del proyecto<br>Profesor, ESO",credClaude:"Programación e implementación técnica",
 lv:[
  {t:"Un euro cada uno",d:"Precios de 1 € y 2 €. Multiplicar es sumar muchas veces.",e:"5 manzanas · 1 € cada manzana = <strong>5 €</strong>"},
  {t:"Precios enteros",d:"Precios hasta 10 €. Paga con monedas y billetes.",e:"3 leches · 2 € cada brik = <strong>6 €</strong>"},
  {t:"La lista de la compra",d:"Varios productos. Suma el total y paga.",e:"2 × 1 € + 1 × 2 € = <strong>4 €</strong>"},
  {t:"Medio euro",d:"Precios con ,50 €. ¡Ya hacen falta monedas pequeñas!",e:"3 paquetes · 1,50 € = <strong>4,50 €</strong>"},
  {t:"Céntimos",d:"Precios como 1,25 € o 0,75 €. Monedas de céntimos.",e:"4 manzanas · 1,25 € = <strong>5 €</strong>"},
  {t:"La vuelta",d:"¡Ahora eres el tendero! Devuelve la vuelta al cliente.",e:"Compra 3,50 € · paga 5 € → vuelta <strong>1,50 €</strong>"},
  {t:"Compra y vuelta",d:"Calcula el total y después devuelve la vuelta.",e:"Total 6,75 € · paga 10 € → vuelta <strong>3,25 €</strong>"},
  {t:"Precio por kilo",d:"El precio es por kilo (kg). Con 2 kg pagas el doble.",e:"2 kg de manzanas · 3 € el kg = <strong>6 €</strong>"},
  {t:"Medio kilo",d:"Pesa 0,5 kg, 1,5 kg… ¡la mitad del precio!",e:"0,5 kg · 3 € el kg = <strong>1,50 €</strong>"},
  {t:"Cuartos de kilo",d:"250 g, 750 g… cuartos de kilo.",e:"250 g · 4 € el kg = <strong>1 €</strong>"},
 ],
 tr:{first:["Primera compra","Haz tu primera compra"],r10:["Cliente habitual","10 compras hechas"],r50:["Comprador experto","50 compras hechas"],r150:["Rey del mercado","150 compras hechas"],
  perfect:["Partida perfecta","Todas las compras bien a la primera"],streak5:["Racha de 5","5 compras seguidas a la primera"],coins:["Monedero lleno","Pon 200 monedas o billetes"],
  change:["Tendero atento","10 vueltas bien devueltas"],kg:["Maestro del kilo","10 compras por kilo correctas"],cents:["Rey de los céntimos","3 estrellas en el nivel 5"],
  half:["Mitad y mitad","Supera el nivel 9"],daily1:["Reto superado","Haz un reto del día"],daily3:["Tres días seguidos","3 días seguidos con reto"],all:["Todo el mercado","Supera todos los niveles"]},
 credRole:"Diseño, pedagogía y coordinación del proyecto<br>Profesor, ESO",
},
};

/* Paraules per a la veu (TTS) */
const SAY={
 ca:{buy:"Compres",each:"cada",perKg:"el quilo",halfKg:"mig quilo",kgs:"quilos",kgOne:"un quilo",grams:"grams",euro:["euro","euros"],cent:["cèntim","cèntims"],with:"amb",
     of:(n)=>/^[aeiouàèéíòóúh]/i.test(n)?"d'"+n:"de "+n,minus:"menys",custPays:"El client paga amb",gives:"Torna-li el canvi.",paid:"Paga",q:"Quant costa tot?",costs:"costa",purchase:"La compra val"},
 es:{buy:"Compras",each:"cada",perKg:"el kilo",halfKg:"medio kilo",kgs:"kilos",kgOne:"un kilo",grams:"gramos",euro:["euro","euros"],cent:["céntimo","céntimos"],with:"con",
     of:(n)=>"de "+n,minus:"menos",custPays:"El cliente paga con",gives:"Devuélvele la vuelta.",paid:"Paga",q:"¿Cuánto cuesta todo?",costs:"cuesta",purchase:"La compra vale"},
};

/* ───────── v1.3: meta dels nivells (etiquetes, exemple animat, productes del nivell 1) ───────── */
const LEVEL_META={
 1:{ops:["mul"],acts:["pay"],cats:["pa","fruita","dolc"],ex:{kind:"pay",lines:[{pid:"poma",mode:"u",qty:5,price:100}],coins:[100,100,100,100,100]}},
 2:{ops:["mul"],acts:["pay"],ex:{kind:"pay",lines:[{pid:"llet",mode:"u",qty:3,price:200}],coins:[200,200,200]}},
 3:{ops:["add","mul"],acts:["total","pay"],ex:{kind:"pay",lines:[{pid:"pa",mode:"u",qty:2,price:100},{pid:"suc",mode:"u",qty:1,price:200}],coins:[200,200]}},
 4:{ops:["add","mul","dec"],acts:["total","pay"],ex:{kind:"pay",lines:[{pid:"galetes",mode:"u",qty:3,price:150}],coins:[200,200,50]}},
 5:{ops:["add","mul","dec"],acts:["total","pay"],ex:{kind:"pay",lines:[{pid:"poma",mode:"u",qty:3,price:75}],coins:[200,20,5]}},
 6:{ops:["sub"],acts:["change"],ex:{kind:"change",lines:[{pid:"suc",mode:"u",qty:1,price:150}],given:500,coins:[200,100,50]}},
 7:{ops:["add","mul","sub"],acts:["total","change"],ex:{kind:"change",lines:[{pid:"pa",mode:"u",qty:2,price:125},{pid:"galetes",mode:"u",qty:1,price:150}],given:1000,coins:[500,100]}},
 8:{ops:["mul"],acts:["kg","total","pay"],ex:{kind:"pay",lines:[{pid:"poma",mode:"kg",qty:1,price:300,grams:2000}],coins:[200,200,200]}},
 9:{ops:["mul","half"],acts:["kg","total","pay"],ex:{kind:"pay",lines:[{pid:"poma",mode:"kg",qty:1,price:300,grams:500}],coins:[100,50]}},
 10:{ops:["mul","quarter"],acts:["kg","total","pay"],ex:{kind:"pay",lines:[{pid:"poma",mode:"kg",qty:1,price:400,grams:250}],coins:[100]}},
};
LEVELS.forEach(L=>Object.assign(L,LEVEL_META[L.id]));
LEVELS.forEach(L=>{L.ex.lines.forEach(l=>{l.total=l.mode==="kg"?l.price*l.grams/1000:l.price*l.qty;});L.ex.total=L.ex.lines.reduce((a,l)=>a+l.total,0);if(L.ex.given)L.ex.change=L.ex.given-L.ex.total;});

const LVX={
ca:[
 {do:"Compra 2 a 5 productes iguals i paga amb monedes d'1 i 2 €.",learn:"Multiplicar és sumar molts cops: 5 × 1 € = 5 €."},
 {do:"Compra productes de fins a 10 € i paga amb monedes i bitllets.",learn:"Multiplicar amb preus més grans: 3 × 2 € = 6 €."},
 {do:"Escriu el total d'una llista de 2 o 3 productes i després paga.",learn:"Sumar preus i multiplicar: 2 × 1 € + 1 × 2 € = 4 €."},
 {do:"Preus amb mig euro (0,50 €, 1,50 €…). Escriu el total i paga amb monedes de 50 cèntims.",learn:"Decimals fàcils: 3 × 1,50 € = 4,50 €."},
 {do:"Preus com 1,25 € o 0,75 €. Escriu el total i paga amb monedes de cèntims.",learn:"Sumar i multiplicar amb cèntims: 3 × 0,75 € = 2,25 €."},
 {do:"Ets el botiguer! El client paga amb un bitllet: torna-li el canvi amb monedes.",learn:"Restar: 5 € − 3,50 € = 1,50 €."},
 {do:"Calcula el total d'una compra i després torna el canvi al client.",learn:"Sumar, multiplicar i restar, tot junt."},
 {do:"Compra productes pel seu pes (1, 2 o 3 kg). Escriu el total i paga.",learn:"Preu per quilo: 2 kg × 3 € = 6 €."},
 {do:"Pesa mig quilo o quilo i mig. Escriu el total i paga.",learn:"Mig quilo és la meitat del preu."},
 {do:"Pesa 250 g o 750 g. Escriu el total i paga.",learn:"250 g és un quart de quilo: el preu ÷ 4."},
],
es:[
 {do:"Compra de 2 a 5 productos iguales y paga con monedas de 1 y 2 €.",learn:"Multiplicar es sumar muchas veces: 5 × 1 € = 5 €."},
 {do:"Compra productos de hasta 10 € y paga con monedas y billetes.",learn:"Multiplicar con precios más grandes: 3 × 2 € = 6 €."},
 {do:"Escribe el total de una lista de 2 o 3 productos y luego paga.",learn:"Sumar precios y multiplicar: 2 × 1 € + 1 × 2 € = 4 €."},
 {do:"Precios con medio euro (0,50 €, 1,50 €…). Escribe el total y paga con monedas de 50 céntimos.",learn:"Decimales fáciles: 3 × 1,50 € = 4,50 €."},
 {do:"Precios como 1,25 € o 0,75 €. Escribe el total y paga con monedas de céntimos.",learn:"Sumar y multiplicar con céntimos: 3 × 0,75 € = 2,25 €."},
 {do:"¡Eres el tendero! El cliente paga con un billete: devuélvele la vuelta con monedas.",learn:"Restar: 5 € − 3,50 € = 1,50 €."},
 {do:"Calcula el total de una compra y luego devuelve la vuelta al cliente.",learn:"Sumar, multiplicar y restar, todo junto."},
 {do:"Compra productos por su peso (1, 2 o 3 kg). Escribe el total y paga.",learn:"Precio por kilo: 2 kg × 3 € = 6 €."},
 {do:"Pesa medio kilo o kilo y medio. Escribe el total y paga.",learn:"Medio kilo es la mitad del precio."},
 {do:"Pesa 250 g o 750 g. Escribe el total y paga.",learn:"250 g es un cuarto de kilo: el precio ÷ 4."},
]};
Object.assign(I18N.ca,{
 doLbl:"Què faràs",learnLbl:"Què aprens",play:"Juga!",close:"Tanca",
 opAdd:"Sumar",opMul:"Multiplicar",opSub:"Restar",opDec:"Decimals",opHalf:"Mig quilo",opQuarter:"Quart de quilo",
 actPay:"Pagar",actTotal:"Calcular el total",actChange:"Fer de botiguer",actKg:"Pesar",
 payWith:"Amb què jugues",nRounds:"compres",helpOn:"Amb ajuda",helpOff:"Sense ajuda",best:"Millor",
 grpEuros:"Euros",grpCents:"Cèntims",grpChange:"Canvi",grpKilos:"Quilos",
 xpMissing:"Et falten {n} XP per a {r}",xpMax:"Has arribat al rang màxim!",
 dataTitle:"Les meves dades",dataExport:"Exportar",dataImport:"Importar",dataHint:"Desa el teu progrés en un fitxer o recupera'l en un altre dispositiu.",
 dataExported:"Dades exportades",dataImported:"Perfils importats: {n}",dataBad:"Fitxer no vàlid",dataNoSlot:"No hi ha lloc: elimina un perfil",
 replay:"Torna a veure",watching:"Mira l'exemple",
});
Object.assign(I18N.es,{
 doLbl:"Qué harás",learnLbl:"Qué aprendes",play:"¡Juega!",close:"Cerrar",
 opAdd:"Sumar",opMul:"Multiplicar",opSub:"Restar",opDec:"Decimales",opHalf:"Medio kilo",opQuarter:"Cuarto de kilo",
 actPay:"Pagar",actTotal:"Calcular el total",actChange:"Hacer de tendero",actKg:"Pesar",
 payWith:"Con qué juegas",nRounds:"compras",helpOn:"Con ayuda",helpOff:"Sin ayuda",best:"Mejor",
 grpEuros:"Euros",grpCents:"Céntimos",grpChange:"Vuelta",grpKilos:"Kilos",
 xpMissing:"Te faltan {n} XP para {r}",xpMax:"¡Has llegado al rango máximo!",
 dataTitle:"Mis datos",dataExport:"Exportar",dataImport:"Importar",dataHint:"Guarda tu progreso en un archivo o recupéralo en otro dispositivo.",
 dataExported:"Datos exportados",dataImported:"Perfiles importados: {n}",dataBad:"Archivo no válido",dataNoSlot:"No hay sitio: elimina un perfil",
 replay:"Volver a ver",watching:"Mira el ejemplo",
});
SAY.ca.each="Cada";SAY.es.each="Cada";
