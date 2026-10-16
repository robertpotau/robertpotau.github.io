// Joc d'eines — (c) 2026 Robert Potau Nuñez. Tots els drets reservats.
const EINES_DATA = {
 "families": [
  {
   "id": "percussio",
   "nom": "Eines de percussió",
   "curt": "percussió",
   "def": "Colpejar un material per trencar-lo, aixafar-lo o modificar-lo.",
   "color": "#e4572e"
  },
  {
   "id": "tall",
   "nom": "Eines de tall",
   "curt": "tall",
   "def": "Seccionar un material per mitjà d’una fulla.",
   "color": "#17a2b8"
  },
  {
   "id": "abrasio",
   "nom": "Eines d’abrasió o fricció",
   "curt": "abrasió",
   "def": "Fregar un material amb un altre de més dur per polir-lo o erosionar-lo.",
   "color": "#a0522d"
  },
  {
   "id": "perforacio",
   "nom": "Eines de perforació",
   "curt": "perforació",
   "def": "Fer un forat que pot travessar o no el material.",
   "color": "#6f42c1"
  },
  {
   "id": "agafar",
   "nom": "Eines d’agafar o retenir",
   "curt": "agafar",
   "def": "Subjectar un material de manera fixa o subjectar-lo imprimint-li una altra acció (doblegar, estirar, etc).",
   "color": "#2e8b57"
  },
  {
   "id": "cargolar",
   "nom": "Eines de cargolar",
   "curt": "cargolar",
   "def": "Imprimir un moviment de rotació en una peça o accessori.",
   "color": "#f0a202"
  },
  {
   "id": "passives",
   "nom": "Eines passives",
   "curt": "passives",
   "def": "Suportar els materials quan estan sotmesos a l’acció d’una eina.",
   "color": "#7d8597"
  },
  {
   "id": "mesurar",
   "nom": "Eines de mesurar, traçar i marcar",
   "curt": "mesurar",
   "def": "Projectar, acotar, dibuixar o assenyalar contorns i formes, i fer operacions de control i calibratge.",
   "color": "#1d6fd1"
  },
  {
   "id": "soldar",
   "nom": "Eines de soldar o d’adherir",
   "curt": "soldar",
   "def": "Unir dues superfícies per forces intermoleculars.",
   "color": "#d6336c"
  },
  {
   "id": "proteccio",
   "nom": "Elements de protecció",
   "curt": "protecció",
   "def": "Garantir una correcta seguretat en el treball amb les eines.",
   "color": "#2fb344"
  }
 ],
 "eines": [
  {
   "id": "01",
   "nom": "Martell de bola",
   "familia": "percussio",
   "alies": [],
   "fotos": [
    {
     "f": "img/01/2.jpg",
     "neta": true
    },
    {
     "f": "img/01/3.jpg",
     "neta": true
    },
    {
     "f": "img/01/4.jpg",
     "neta": true
    },
    {
     "f": "img/01/5.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/01.png"
  },
  {
   "id": "02",
   "nom": "Maceta de niló",
   "familia": "percussio",
   "alies": [
    "Maceta"
   ],
   "fotos": [
    {
     "f": "img/02/1.jpg",
     "neta": true
    },
    {
     "f": "img/02/3.jpg",
     "neta": true
    },
    {
     "f": "img/02/4.jpg",
     "neta": true
    },
    {
     "f": "img/02/5.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/02.png"
  },
  {
   "id": "03",
   "nom": "Tisores d’electricista",
   "familia": "tall",
   "alies": [],
   "fotos": [
    {
     "f": "img/03/2.jpg",
     "neta": true
    },
    {
     "f": "img/03/3.jpg",
     "neta": true
    },
    {
     "f": "img/03/4.jpg",
     "neta": true
    },
    {
     "f": "img/03/5.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/03.png"
  },
  {
   "id": "04",
   "nom": "Tisores de planxa",
   "familia": "tall",
   "alies": [],
   "fotos": [
    {
     "f": "img/04/1.jpg",
     "neta": true
    },
    {
     "f": "img/04/2.jpg",
     "neta": true
    },
    {
     "f": "img/04/3.jpg",
     "neta": true
    },
    {
     "f": "img/04/4.jpg",
     "neta": true
    },
    {
     "f": "img/04/5.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/04.png"
  },
  {
   "id": "05",
   "nom": "Serra d’arquet",
   "familia": "tall",
   "alies": [],
   "fotos": [
    {
     "f": "img/05/1.jpg",
     "neta": true
    },
    {
     "f": "img/05/2.jpg",
     "neta": true
    },
    {
     "f": "img/05/3.jpg",
     "neta": true
    },
    {
     "f": "img/05/4.jpg",
     "neta": true
    },
    {
     "f": "img/05/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/05.png"
  },
  {
   "id": "06",
   "nom": "Xerrac",
   "familia": "tall",
   "alies": [],
   "fotos": [
    {
     "f": "img/06/1.jpg",
     "neta": true
    },
    {
     "f": "img/06/2.jpg",
     "neta": true
    },
    {
     "f": "img/06/3.jpg",
     "neta": true
    },
    {
     "f": "img/06/4.jpg",
     "neta": true
    },
    {
     "f": "img/06/5.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/06.png"
  },
  {
   "id": "07",
   "nom": "Serra de marqueteria",
   "familia": "tall",
   "alies": [],
   "fotos": [
    {
     "f": "img/07/1.jpg",
     "neta": true
    },
    {
     "f": "img/07/2.jpg",
     "neta": true
    },
    {
     "f": "img/07/3.jpg",
     "neta": true
    },
    {
     "f": "img/07/4.jpg",
     "neta": false
    },
    {
     "f": "img/07/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/07.png"
  },
  {
   "id": "08",
   "nom": "Serra de vogir elèctrica",
   "familia": "tall",
   "alies": [
    "Serra de calar"
   ],
   "fotos": [
    {
     "f": "img/08/1.jpg",
     "neta": true
    },
    {
     "f": "img/08/2.jpg",
     "neta": true
    },
    {
     "f": "img/08/3.jpg",
     "neta": true
    },
    {
     "f": "img/08/4.jpg",
     "neta": false
    },
    {
     "f": "img/08/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/08.png"
  },
  {
   "id": "09",
   "nom": "Alicates per pelar fils",
   "familia": "tall",
   "alies": [
    "Alicates de pelar fils"
   ],
   "fotos": [
    {
     "f": "img/09/1.jpg",
     "neta": true
    },
    {
     "f": "img/09/2.jpg",
     "neta": true
    },
    {
     "f": "img/09/3.jpg",
     "neta": true
    },
    {
     "f": "img/09/4.jpg",
     "neta": true
    },
    {
     "f": "img/09/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/09.png"
  },
  {
   "id": "10",
   "nom": "Llima",
   "familia": "abrasio",
   "alies": [],
   "fotos": [
    {
     "f": "img/10/2.jpg",
     "neta": true
    },
    {
     "f": "img/10/3.jpg",
     "neta": true
    },
    {
     "f": "img/10/4.jpg",
     "neta": true
    },
    {
     "f": "img/10/5.jpg",
     "neta": true
    },
    {
     "f": "img/10/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/10.png"
  },
  {
   "id": "11",
   "nom": "Raspa",
   "familia": "abrasio",
   "alies": [],
   "fotos": [
    {
     "f": "img/11/2.jpg",
     "neta": true
    },
    {
     "f": "img/11/3.jpg",
     "neta": true
    },
    {
     "f": "img/11/4.jpg",
     "neta": true
    },
    {
     "f": "img/11/6.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/11.png"
  },
  {
   "id": "12",
   "nom": "Barrina",
   "familia": "perforacio",
   "alies": [],
   "fotos": [
    {
     "f": "img/12/1.jpg",
     "neta": true
    },
    {
     "f": "img/12/2.jpg",
     "neta": true
    },
    {
     "f": "img/12/3.jpg",
     "neta": true
    },
    {
     "f": "img/12/4.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/12.png"
  },
  {
   "id": "13",
   "nom": "Trepant portàtil",
   "familia": "perforacio",
   "alies": [],
   "fotos": [
    {
     "f": "img/13/1.jpg",
     "neta": true
    },
    {
     "f": "img/13/2.jpg",
     "neta": true
    },
    {
     "f": "img/13/3.jpg",
     "neta": true
    },
    {
     "f": "img/13/4.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/13.png"
  },
  {
   "id": "14",
   "nom": "Trepant de sobretaula",
   "familia": "perforacio",
   "alies": [],
   "fotos": [
    {
     "f": "img/14/1.jpg",
     "neta": true
    },
    {
     "f": "img/14/2.jpg",
     "neta": true
    },
    {
     "f": "img/14/4.jpg",
     "neta": false
    },
    {
     "f": "img/14/5.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/14.png"
  },
  {
   "id": "15",
   "nom": "Broca",
   "familia": "perforacio",
   "alies": [],
   "fotos": [
    {
     "f": "img/15/1.jpg",
     "neta": true
    },
    {
     "f": "img/15/2.jpg",
     "neta": false
    },
    {
     "f": "img/15/3.jpg",
     "neta": true
    },
    {
     "f": "img/15/4.jpg",
     "neta": false
    },
    {
     "f": "img/15/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/15.png"
  },
  {
   "id": "16",
   "nom": "Alicates universals",
   "familia": "agafar",
   "alies": [],
   "fotos": [
    {
     "f": "img/16/1.jpg",
     "neta": true
    },
    {
     "f": "img/16/2.jpg",
     "neta": true
    },
    {
     "f": "img/16/3.jpg",
     "neta": true
    },
    {
     "f": "img/16/4.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/16.png"
  },
  {
   "id": "17",
   "nom": "Alicates de boca rodona",
   "familia": "agafar",
   "alies": [],
   "fotos": [
    {
     "f": "img/17/1.jpg",
     "neta": true
    },
    {
     "f": "img/17/2.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/17.png"
  },
  {
   "id": "18",
   "nom": "Alicates de boca plana",
   "familia": "agafar",
   "alies": [],
   "fotos": [
    {
     "f": "img/18/1.jpg",
     "neta": false
    },
    {
     "f": "img/18/2.jpg",
     "neta": true
    },
    {
     "f": "img/18/3.jpg",
     "neta": true
    },
    {
     "f": "img/18/4.jpg",
     "neta": true
    },
    {
     "f": "img/18/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/18.png"
  },
  {
   "id": "19",
   "nom": "Serjant",
   "familia": "agafar",
   "alies": [],
   "fotos": [
    {
     "f": "img/19/1.jpg",
     "neta": true
    },
    {
     "f": "img/19/2.jpg",
     "neta": true
    },
    {
     "f": "img/19/3.jpg",
     "neta": true
    },
    {
     "f": "img/19/4.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/19.png"
  },
  {
   "id": "20",
   "nom": "Serjant de marqueteria",
   "familia": "agafar",
   "alies": [],
   "fotos": [
    {
     "f": "img/20/1.jpg",
     "neta": false
    },
    {
     "f": "img/20/2.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/20.png"
  },
  {
   "id": "21",
   "nom": "Tornavís de boca plana",
   "familia": "cargolar",
   "alies": [],
   "fotos": [
    {
     "f": "img/21/1.jpg",
     "neta": true
    },
    {
     "f": "img/21/2.jpg",
     "neta": true
    },
    {
     "f": "img/21/3.jpg",
     "neta": true
    },
    {
     "f": "img/21/5.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/21.png"
  },
  {
   "id": "22",
   "nom": "Tornavís d’estrella",
   "familia": "cargolar",
   "alies": [
    "Tornavís Phillips"
   ],
   "fotos": [
    {
     "f": "img/22/1.jpg",
     "neta": true
    },
    {
     "f": "img/22/2.jpg",
     "neta": true
    },
    {
     "f": "img/22/3.jpg",
     "neta": false
    },
    {
     "f": "img/22/4.jpg",
     "neta": true
    },
    {
     "f": "img/22/5.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/22.png"
  },
  {
   "id": "23",
   "nom": "Clau fixa",
   "familia": "cargolar",
   "alies": [],
   "fotos": [
    {
     "f": "img/23/1.jpg",
     "neta": true
    },
    {
     "f": "img/23/2.jpg",
     "neta": true
    },
    {
     "f": "img/23/3.jpg",
     "neta": false
    },
    {
     "f": "img/23/5.jpg",
     "neta": true
    },
    {
     "f": "img/23/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/23.png"
  },
  {
   "id": "24",
   "nom": "Clau d’estrella colzada",
   "familia": "cargolar",
   "alies": [],
   "fotos": [
    {
     "f": "img/24/1.jpg",
     "neta": false
    },
    {
     "f": "img/24/2.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/24.png"
  },
  {
   "id": "25",
   "nom": "Clau sisavada",
   "familia": "cargolar",
   "alies": [
    "Clau Allen"
   ],
   "fotos": [
    {
     "f": "img/25/1.jpg",
     "neta": true
    },
    {
     "f": "img/25/2.jpg",
     "neta": false
    },
    {
     "f": "img/25/3.jpg",
     "neta": true
    },
    {
     "f": "img/25/4.jpg",
     "neta": true
    },
    {
     "f": "img/25/6.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/25.png"
  },
  {
   "id": "26",
   "nom": "Cargol de banc",
   "familia": "passives",
   "alies": [],
   "fotos": [
    {
     "f": "img/26/1.jpg",
     "neta": true
    },
    {
     "f": "img/26/2.jpg",
     "neta": true
    },
    {
     "f": "img/26/3.jpg",
     "neta": true
    },
    {
     "f": "img/26/4.jpg",
     "neta": true
    },
    {
     "f": "img/26/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/26.png"
  },
  {
   "id": "27",
   "nom": "Cinta mètrica",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/27/1.jpg",
     "neta": true
    },
    {
     "f": "img/27/2.jpg",
     "neta": true
    },
    {
     "f": "img/27/3.jpg",
     "neta": true
    },
    {
     "f": "img/27/4.jpg",
     "neta": true
    },
    {
     "f": "img/27/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/27.png"
  },
  {
   "id": "28",
   "nom": "Regle graduat d’acer",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/28/1.jpg",
     "neta": true
    },
    {
     "f": "img/28/2.jpg",
     "neta": true
    },
    {
     "f": "img/28/3.jpg",
     "neta": true
    },
    {
     "f": "img/28/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/28.png"
  },
  {
   "id": "29",
   "nom": "Escaire",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/29/2.jpg",
     "neta": true
    },
    {
     "f": "img/29/3.jpg",
     "neta": true
    },
    {
     "f": "img/29/4.jpg",
     "neta": true
    },
    {
     "f": "img/29/5.jpg",
     "neta": true
    },
    {
     "f": "img/29/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/29.png"
  },
  {
   "id": "30",
   "nom": "Peu de rei",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/30/1.jpg",
     "neta": true
    },
    {
     "f": "img/30/2.jpg",
     "neta": true
    },
    {
     "f": "img/30/4.jpg",
     "neta": true
    },
    {
     "f": "img/30/5.jpg",
     "neta": true
    },
    {
     "f": "img/30/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/30.png"
  },
  {
   "id": "31",
   "nom": "Centenella",
   "familia": "mesurar",
   "alies": [
    "Goniòmetre"
   ],
   "fotos": [
    {
     "f": "img/31/1.jpg",
     "neta": false
    },
    {
     "f": "img/31/2.jpg",
     "neta": true
    },
    {
     "f": "img/31/3.jpg",
     "neta": true
    },
    {
     "f": "img/31/4.jpg",
     "neta": false
    },
    {
     "f": "img/31/5.jpg",
     "neta": false
    },
    {
     "f": "img/31/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/31.png"
  },
  {
   "id": "32",
   "nom": "Puntes de senyalar",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/32/1.jpg",
     "neta": true
    },
    {
     "f": "img/32/2.jpg",
     "neta": true
    },
    {
     "f": "img/32/3.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/32.png"
  },
  {
   "id": "33",
   "nom": "Compàs de punta",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/33/1.jpg",
     "neta": true
    },
    {
     "f": "img/33/3.jpg",
     "neta": true
    },
    {
     "f": "img/33/4.jpg",
     "neta": false
    },
    {
     "f": "img/33/5.jpg",
     "neta": true
    },
    {
     "f": "img/33/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/33.png"
  },
  {
   "id": "34",
   "nom": "Nivell",
   "familia": "mesurar",
   "alies": [],
   "fotos": [
    {
     "f": "img/34/1.jpg",
     "neta": true
    },
    {
     "f": "img/34/3.jpg",
     "neta": true
    },
    {
     "f": "img/34/4.jpg",
     "neta": true
    },
    {
     "f": "img/34/5.jpg",
     "neta": false
    },
    {
     "f": "img/34/6.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/34.png"
  },
  {
   "id": "35",
   "nom": "Soldador elèctric",
   "familia": "soldar",
   "alies": [],
   "fotos": [
    {
     "f": "img/35/1.jpg",
     "neta": true
    },
    {
     "f": "img/35/2.jpg",
     "neta": true
    },
    {
     "f": "img/35/3.jpg",
     "neta": true
    },
    {
     "f": "img/35/5.jpg",
     "neta": true
    },
    {
     "f": "img/35/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/35.png"
  },
  {
   "id": "36",
   "nom": "Bufador",
   "familia": "soldar",
   "alies": [],
   "fotos": [
    {
     "f": "img/36/1.jpg",
     "neta": true
    },
    {
     "f": "img/36/3.jpg",
     "neta": true
    },
    {
     "f": "img/36/5.jpg",
     "neta": true
    },
    {
     "f": "img/36/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/36.png"
  },
  {
   "id": "37",
   "nom": "Guants de protecció",
   "familia": "proteccio",
   "alies": [],
   "fotos": [
    {
     "f": "img/37/1.jpg",
     "neta": true
    },
    {
     "f": "img/37/2.jpg",
     "neta": true
    },
    {
     "f": "img/37/3.jpg",
     "neta": true
    },
    {
     "f": "img/37/4.jpg",
     "neta": false
    },
    {
     "f": "img/37/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/37.png"
  },
  {
   "id": "38",
   "nom": "Ulleres de protecció",
   "familia": "proteccio",
   "alies": [],
   "fotos": [
    {
     "f": "img/38/1.jpg",
     "neta": true
    },
    {
     "f": "img/38/2.jpg",
     "neta": true
    },
    {
     "f": "img/38/3.jpg",
     "neta": true
    },
    {
     "f": "img/38/4.jpg",
     "neta": true
    },
    {
     "f": "img/38/6.jpg",
     "neta": false
    }
   ],
   "esquema": "img/esq/38.png"
  },
  {
   "id": "39",
   "nom": "Davantal protector",
   "familia": "proteccio",
   "alies": [],
   "fotos": [
    {
     "f": "img/39/1.jpg",
     "neta": true
    },
    {
     "f": "img/39/2.jpg",
     "neta": true
    },
    {
     "f": "img/39/3.jpg",
     "neta": true
    },
    {
     "f": "img/39/5.jpg",
     "neta": true
    },
    {
     "f": "img/39/6.jpg",
     "neta": true
    }
   ],
   "esquema": "img/esq/39.png"
  }
 ]
};
