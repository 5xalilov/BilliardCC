// Source dictionary (Uzbek, Latin). Add every new UI string here first; use {name}
// placeholders for values. Other languages translate these keys.
export const uz = {
  "biz.billiard": "Bilyard",
  "biz.snooker": "Snuker",
  "biz.tableTennis": "Stol tennisi",
  "biz.tennis": "Tennis korti",
  "biz.padel": "Padel",
  "biz.badminton": "Badminton",
  "biz.football": "Mini-futbol",
  "biz.playstation": "PlayStation / Xbox",
  "biz.computer": "Kompyuter klub",
  "biz.vr": "VR klub",
  "biz.bowling": "Bouling",
  "biz.karaoke": "Karaoke",
  "biz.kids": "Bolalar xonasi",
  "biz.sauna": "Sauna",
  "biz.other": "Boshqa",

  "unit.billiard": "Stol",
  "unit.snooker": "Stol",
  "unit.tableTennis": "Stol",
  "unit.tennis": "Kort",
  "unit.padel": "Kort",
  "unit.badminton": "Kort",
  "unit.football": "Maydon",
  "unit.playstation": "Konsol",
  "unit.computer": "Kompyuter",
  "unit.vr": "Shlem",
  "unit.bowling": "Yo'lak",
  "unit.karaoke": "Xona",
  "unit.kids": "Xona",
  "unit.sauna": "Xona",
  "unit.other": "Joy",

  "unitSheet.name": "Nomi",
  "unitSheet.type": "Turi",
  "unitSheet.clubType": "Klub turi",
  "unitSheet.rate": "Soat narxi",
  "unitSheet.vipRate": "VIP soat narxi",
  "unitSheet.vip": "VIP stol",
  "unitSheet.custom": "Alohida",
  "unitSheet.reset": "Klub sozlamalariga qaytarish",
};

export type Dict = Record<keyof typeof uz, string>;
export type TKey = keyof typeof uz;
