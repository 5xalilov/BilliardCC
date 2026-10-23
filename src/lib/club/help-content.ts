// Yordam markazi: tez-tez uchraydigan muammolar va yechimlar.
// uz, ru, en qo'lda yozilgan; uz-Cyrl uz matnidan tools/uz-cyrl.py qoidalari bilan olingan.
// Boshqa tillar helpFor() dagi zaxira tilni ko'radi (src/lib/club/help.ts).
import type { HelpCategory, HelpLang } from "@/lib/club/help";

export const HELP_CONTENT: Record<HelpLang, readonly HelpCategory[]> = {
  "uz": [
    {
      id: "start",
      title: "Boshlash",
      articles: [
        { id: "startTable", q: "Stolni qanday yoqaman?", a: ["Stol raqamini bosing — vaqt darhol boshlanadi.", "Ishlayotgan stol tugmasida vaqt ko'rinib turadi."] },
        { id: "closeBill", q: "Hisobni qanday yopaman?", a: ["Ishlayotgan stolni yana bosing yoki HISOB tugmasini bosing.", "Naqd, Karta yoki Aralash to'lovni tanlang."] },
        { id: "walkin", q: "Stolsiz mijozga bar sotish", a: ["0 (tashqi) tugmasini bosing — vaqtsiz hisob ochiladi.", "Keyin BAR orqali mahsulot qo'shing."] },
        { id: "closedApp", q: "Ilova yopilsa vaqt to'xtaydimi?", a: ["Yo'q. Vaqt boshlangan paytdan hisoblanadi — ilovani qayta ochsangiz, vaqt to'g'ri bo'ladi."] },
      ],
    },
    {
      id: "time",
      title: "Vaqt va narx",
      articles: [
        { id: "wrongPrice", q: "Narx noto'g'ri hisoblanyapti", a: ["Klub → Narxlar: soat va VIP narxini tekshiring.", "Klub → Stollar → stol: alohida narx berilgan bo'lishi mumkin.", "Yangi narx faqat yangi ochilgan hisoblarga qo'yiladi."] },
        { id: "rounding", q: "Nega summa yaxlitlanadi?", a: ["Klub → Narxlar → Vaqt yaxlitlash: 1 daqiqa yoki 15 daqiqa.", "Vaqt doim yuqoriga yaxlitlanadi."] },
        { id: "pause", q: "Pauza qanday ishlaydi?", a: ["PAUZA — vaqt to'xtaydi, pauza vaqti hisobga kirmaydi.", "Yana bosing (DAVOM) — vaqt davom etadi."] },
        { id: "vip", q: "VIP narxni qanday qo'yaman?", a: ["Stolni tanlang va VIP tugmasini bosing.", "Doim VIP stol bo'lsa: Klub → Stollar → stol → VIP stol."] },
        { id: "move", q: "Mijozlar boshqa stolga o'tdi", a: ["Stolni tanlang, KO'CH tugmasini bosing va bo'sh stolni tanlang.", "Vaqt va buyurtmalar saqlanadi."] },
        { id: "lateStart", q: "Vaqtni kech yoqdim", a: ["Hisobni yopishdan oldin QO'SH bilan qolgan summani qo'shing."] },
      ],
    },
    {
      id: "bar",
      title: "Bar va menyu",
      articles: [
        { id: "addProduct", q: "Menyuga mahsulot qo'shish", a: ["Klub → Menyu → Mahsulot qo'shish.", "Narxni o'zgartirish uchun mahsulot ustiga bosing."] },
        { id: "wrongOrder", q: "Noto'g'ri buyurtma kiritdim", a: ["AYIR — oxirgi buyurtmani olib tashlaydi.", "Yoki BAR oynasida mahsulot yonidagi − tugmasini bosing."] },
        { id: "discount", q: "Chegirma qanday beriladi?", a: ["Hisobni tanlang va % tugmasini bosing — foizni tanlang.", "Chegirma vaqt va bar summasiga birga qo'llanadi."] },
      ],
    },
    {
      id: "bills",
      title: "Hisob va tarix",
      articles: [
        { id: "history", q: "Yopilgan hisoblar qayerda?", a: ["Chap yuqoridagi soat belgisi — Tarix.", "Bugun yoki Hammasi: tushum, naqd va karta jami."] },
        { id: "void", q: "Hisob adashib ochildi", a: ["Hisob → Hisobni bekor qilish.", "Bekor qilingan hisob tarixda «BEKOR» bo'lib qoladi, tushumga kirmaydi."] },
        { id: "editClosed", q: "Yopilgan hisobni o'zgartira olamanmi?", a: ["Yo'q — yopilgan hisob o'zgarmaydi. Xato bo'lsa, tarixdan ko'rib, keyingi hisobda to'g'rilang."] },
        { id: "undo", q: "⌫ va AC farqi nima?", a: ["⌫ — oxirgi amalni bekor qiladi.", "AC — ekranni tozalaydi, ochiq hisoblar saqlanadi."] },
      ],
    },
    {
      id: "data",
      title: "Ma'lumot va qurilma",
      articles: [
        { id: "whereData", q: "Ma'lumotlarim qayerda saqlanadi?", a: ["Hisoblar, tarix va menyu faqat shu qurilmada saqlanadi.", "Boshqa telefonda ular ko'rinmaydi."] },
        { id: "lostData", q: "Tarix yo'qolib qoldi", a: ["Telegram yoki brauzer ma'lumotlari tozalansa, tarix o'chadi.", "Boshqa qurilmadan kirgan bo'lsangiz — eski qurilmani oching.", "Tarixda oxirgi 300 ta hisob saqlanadi."] },
        { id: "blank", q: "Ilova ochilmayapti yoki oq ekran", a: ["Telegram'ni yangilang va botdan ilovani qayta oching.", "Birinchi ochilishda internet kerak."] },
        { id: "offline", q: "Internetsiz ishlaydimi?", a: ["Ha. Ochilgandan keyin internet bo'lmasa ham ishlaydi.", "Premium holati internet qaytganda yangilanadi."] },
      ],
    },
    {
      id: "premium",
      title: "Premium",
      articles: [
        { id: "locked", q: "Nega ba'zi stollar qulflangan?", a: ["Bepul tarifda 3 ta stol. Premium bilan 30 tagacha."] },
        { id: "getPremium", q: "Premium qanday olinadi?", a: ["Klub → Premium → Premium so'rash.", "So'rov adminga boradi. Yoqilgach, ilovani qayta oching."] },
        { id: "noAnswer", q: "So'rov yubordim, javob yo'q", a: ["Odatda bir kun ichida javob beramiz.", "Shoshilinch bo'lsa, pastdagi «So'rov qoldirish» orqali yozing."] },
      ],
    },
    {
      id: "settings",
      title: "Sozlamalar",
      articles: [
        { id: "language", q: "Tilni o'zgartirish", a: ["Klub → Umumiy → Til."] },
        { id: "theme", q: "Kun va Tun rejimi", a: ["Klub → Ko'rinish: Avto, Kun yoki Tun.", "Avto — telefon sozlamasiga ergashadi."] },
        { id: "arrange", q: "Tugmalar joyini o'zgartirish", a: ["Klub → Tugmalarni joylashtirish.", "Tugmani boshqa tugma ustiga suring — joyi almashadi."] },
        { id: "tour", q: "Ko'rsatmani qayta ko'rish", a: ["Yordam → Tugmalar → Ko'rsatmani qayta ko'rish."] },
      ],
    },
  ],
  "uz-Cyrl": [
    {
      id: "start",
      title: "Бошлаш",
      articles: [
        { id: "startTable", q: "Столни қандай ёқаман?", a: ["Стол рақамини босинг — вақт дарҳол бошланади.", "Ишлаётган стол тугмасида вақт кўриниб туради."] },
        { id: "closeBill", q: "Ҳисобни қандай ёпаман?", a: ["Ишлаётган столни яна босинг ёки ҲИСОБ тугмасини босинг.", "Нақд, Карта ёки Аралаш тўловни танланг."] },
        { id: "walkin", q: "Столсиз мижозга бар сотиш", a: ["0 (ташқи) тугмасини босинг — вақтсиз ҳисоб очилади.", "Кейин БАР орқали маҳсулот қўшинг."] },
        { id: "closedApp", q: "Илова ёпилса вақт тўхтайдими?", a: ["Йўқ. Вақт бошланган пайтдан ҳисобланади — иловани қайта очсангиз, вақт тўғри бўлади."] },
      ],
    },
    {
      id: "time",
      title: "Вақт ва нарх",
      articles: [
        { id: "wrongPrice", q: "Нарх нотўғри ҳисобланяпти", a: ["Клуб → Нархлар: соат ва VIP нархини текширинг.", "Клуб → Столлар → стол: алоҳида нарх берилган бўлиши мумкин.", "Янги нарх фақат янги очилган ҳисобларга қўйилади."] },
        { id: "rounding", q: "Нега сумма яхлитланади?", a: ["Клуб → Нархлар → Вақт яхлитлаш: 1 дақиқа ёки 15 дақиқа.", "Вақт доим юқорига яхлитланади."] },
        { id: "pause", q: "Пауза қандай ишлайди?", a: ["ПАУЗА — вақт тўхтайди, пауза вақти ҳисобга кирмайди.", "Яна босинг (ДАВОМ) — вақт давом этади."] },
        { id: "vip", q: "VIP нархни қандай қўяман?", a: ["Столни танланг ва VIP тугмасини босинг.", "Доим VIP стол бўлса: Клуб → Столлар → стол → VIP стол."] },
        { id: "move", q: "Мижозлар бошқа столга ўтди", a: ["Столни танланг, КЎЧ тугмасини босинг ва бўш столни танланг.", "Вақт ва буюртмалар сақланади."] },
        { id: "lateStart", q: "Вақтни кеч ёқдим", a: ["Ҳисобни ёпишдан олдин ҚЎШ билан қолган суммани қўшинг."] },
      ],
    },
    {
      id: "bar",
      title: "Бар ва меню",
      articles: [
        { id: "addProduct", q: "Менюга маҳсулот қўшиш", a: ["Клуб → Меню → Маҳсулот қўшиш.", "Нархни ўзгартириш учун маҳсулот устига босинг."] },
        { id: "wrongOrder", q: "Нотўғри буюртма киритдим", a: ["АЙИР — охирги буюртмани олиб ташлайди.", "Ёки БАР ойнасида маҳсулот ёнидаги − тугмасини босинг."] },
        { id: "discount", q: "Чегирма қандай берилади?", a: ["Ҳисобни танланг ва % тугмасини босинг — фоизни танланг.", "Чегирма вақт ва бар суммасига бирга қўлланади."] },
      ],
    },
    {
      id: "bills",
      title: "Ҳисоб ва тарих",
      articles: [
        { id: "history", q: "Ёпилган ҳисоблар қаерда?", a: ["Чап юқоридаги соат белгиси — Тарих.", "Бугун ёки Ҳаммаси: тушум, нақд ва карта жами."] },
        { id: "void", q: "Ҳисоб адашиб очилди", a: ["Ҳисоб → Ҳисобни бекор қилиш.", "Бекор қилинган ҳисоб тарихда «БЕКОР» бўлиб қолади, тушумга кирмайди."] },
        { id: "editClosed", q: "Ёпилган ҳисобни ўзгартира оламанми?", a: ["Йўқ — ёпилган ҳисоб ўзгармайди. Хато бўлса, тарихдан кўриб, кейинги ҳисобда тўғриланг."] },
        { id: "undo", q: "⌫ ва AC фарқи нима?", a: ["⌫ — охирги амални бекор қилади.", "AC — экранни тозалайди, очиқ ҳисоблар сақланади."] },
      ],
    },
    {
      id: "data",
      title: "Маълумот ва қурилма",
      articles: [
        { id: "whereData", q: "Маълумотларим қаерда сақланади?", a: ["Ҳисоблар, тарих ва меню фақат шу қурилмада сақланади.", "Бошқа телефонда улар кўринмайди."] },
        { id: "lostData", q: "Тарих йўқолиб қолди", a: ["Телеграм ёки браузер маълумотлари тозаланса, тарих ўчади.", "Бошқа қурилмадан кирган бўлсангиз — эски қурилмани очинг.", "Тарихда охирги 300 та ҳисоб сақланади."] },
        { id: "blank", q: "Илова очилмаяпти ёки оқ экран", a: ["Телеграмъни янгиланг ва ботдан иловани қайта очинг.", "Биринчи очилишда интернет керак."] },
        { id: "offline", q: "Интернетсиз ишлайдими?", a: ["Ҳа. Очилгандан кейин интернет бўлмаса ҳам ишлайди.", "Premium ҳолати интернет қайтганда янгиланади."] },
      ],
    },
    {
      id: "premium",
      title: "Premium",
      articles: [
        { id: "locked", q: "Нега баъзи столлар қулфланган?", a: ["Бепул тарифда 3 та стол. Premium билан 30 тагача."] },
        { id: "getPremium", q: "Premium қандай олинади?", a: ["Клуб → Premium → Premium сўраш.", "Сўров админга боради. Ёқилгач, иловани қайта очинг."] },
        { id: "noAnswer", q: "Сўров юбордим, жавоб йўқ", a: ["Одатда бир кун ичида жавоб берамиз.", "Шошилинч бўлса, пастдаги «Сўров қолдириш» орқали ёзинг."] },
      ],
    },
    {
      id: "settings",
      title: "Созламалар",
      articles: [
        { id: "language", q: "Тилни ўзгартириш", a: ["Клуб → Умумий → Тил."] },
        { id: "theme", q: "Кун ва Тун режими", a: ["Клуб → Кўриниш: Авто, Кун ёки Тун.", "Авто — телефон созламасига эргашади."] },
        { id: "arrange", q: "Тугмалар жойини ўзгартириш", a: ["Клуб → Тугмаларни жойлаштириш.", "Тугмани бошқа тугма устига суринг — жойи алмашади."] },
        { id: "tour", q: "Кўрсатмани қайта кўриш", a: ["Ёрдам → Тугмалар → Кўрсатмани қайта кўриш."] },
      ],
    },
  ],
  "ru": [
    {
      id: "start",
      title: "Начало работы",
      articles: [
        { id: "startTable", q: "Как включить стол?", a: ["Нажмите номер стола — время пойдёт сразу.", "На кнопке занятого стола видно время."] },
        { id: "closeBill", q: "Как закрыть счёт?", a: ["Нажмите занятый стол ещё раз или кнопку HISOB.", "Выберите наличные, карту или смешанную оплату."] },
        { id: "walkin", q: "Продажа бара без стола", a: ["Нажмите 0 (гость) — откроется счёт без времени.", "Добавьте товары через BAR."] },
        { id: "closedApp", q: "Время остановится, если закрыть приложение?", a: ["Нет. Время считается от начала — после открытия оно будет верным."] },
      ],
    },
    {
      id: "time",
      title: "Время и цена",
      articles: [
        { id: "wrongPrice", q: "Цена считается неверно", a: ["Клуб → Цены: проверьте цену за час и VIP.", "Клуб → Столы → стол: у стола может быть своя цена.", "Новая цена действует только для новых счетов."] },
        { id: "rounding", q: "Почему сумма округляется?", a: ["Клуб → Цены → Округление: 1 или 15 минут.", "Время всегда округляется вверх."] },
        { id: "pause", q: "Как работает пауза?", a: ["PAUZA — время останавливается и не оплачивается.", "Нажмите ещё раз (DAVOM) — время продолжится."] },
        { id: "vip", q: "Как поставить VIP-цену?", a: ["Выберите стол и нажмите VIP.", "Если стол всегда VIP: Клуб → Столы → стол → VIP место."] },
        { id: "move", q: "Гости перешли за другой стол", a: ["Выберите стол, нажмите KO'CH и свободный стол.", "Время и заказы сохраняются."] },
        { id: "lateStart", q: "Включил время поздно", a: ["Перед закрытием добавьте недостающую сумму кнопкой QO'SH."] },
      ],
    },
    {
      id: "bar",
      title: "Бар и меню",
      articles: [
        { id: "addProduct", q: "Добавить товар в меню", a: ["Клуб → Меню → Добавить товар.", "Чтобы изменить цену, нажмите на товар."] },
        { id: "wrongOrder", q: "Ошибся с заказом", a: ["AYIR — убирает последний заказ.", "Или нажмите − рядом с товаром в окне BAR."] },
        { id: "discount", q: "Как дать скидку?", a: ["Выберите счёт, нажмите % и процент.", "Скидка действует на время и бар вместе."] },
      ],
    },
    {
      id: "bills",
      title: "Счета и история",
      articles: [
        { id: "history", q: "Где закрытые счета?", a: ["Значок часов слева вверху — История.", "Сегодня или Все: выручка, наличные и карта."] },
        { id: "void", q: "Счёт открыт по ошибке", a: ["Счёт → Отменить счёт.", "Он останется в истории как «BEKOR» и не войдёт в выручку."] },
        { id: "editClosed", q: "Можно изменить закрытый счёт?", a: ["Нет — закрытый счёт не меняется. Исправьте в следующем счёте."] },
        { id: "undo", q: "Чем отличаются ⌫ и AC?", a: ["⌫ — отменяет последнее действие.", "AC — очищает экран, открытые счета остаются."] },
      ],
    },
    {
      id: "data",
      title: "Данные и устройство",
      articles: [
        { id: "whereData", q: "Где хранятся мои данные?", a: ["Счета, история и меню хранятся только на этом устройстве.", "На другом телефоне их не видно."] },
        { id: "lostData", q: "Пропала история", a: ["Если очистить данные Telegram или браузера, история удалится.", "Если вошли с другого устройства — откройте прежнее.", "В истории хранятся последние 300 счетов."] },
        { id: "blank", q: "Приложение не открывается или белый экран", a: ["Обновите Telegram и откройте приложение из бота заново.", "Для первого открытия нужен интернет."] },
        { id: "offline", q: "Работает без интернета?", a: ["Да. После открытия работает и без интернета.", "Статус Premium обновится, когда появится интернет."] },
      ],
    },
    {
      id: "premium",
      title: "Premium",
      articles: [
        { id: "locked", q: "Почему некоторые столы закрыты?", a: ["В бесплатном тарифе 3 стола. С Premium — до 30."] },
        { id: "getPremium", q: "Как получить Premium?", a: ["Клуб → Premium → Запросить Premium.", "Запрос уйдёт администратору. После включения откройте приложение заново."] },
        { id: "noAnswer", q: "Отправил запрос, ответа нет", a: ["Обычно отвечаем в течение дня.", "Если срочно — напишите через «Оставить запрос» ниже."] },
      ],
    },
    {
      id: "settings",
      title: "Настройки",
      articles: [
        { id: "language", q: "Сменить язык", a: ["Клуб → Основные → Язык."] },
        { id: "theme", q: "Дневной и ночной режим", a: ["Клуб → Оформление: Авто, День или Ночь.", "Авто — как в настройках телефона."] },
        { id: "arrange", q: "Поменять кнопки местами", a: ["Клуб → Расставить кнопки.", "Перетащите кнопку на другую — они поменяются."] },
        { id: "tour", q: "Посмотреть подсказки снова", a: ["Помощь → Кнопки → Показать подсказки снова."] },
      ],
    },
  ],
  "en": [
    {
      id: "start",
      title: "Getting started",
      articles: [
        { id: "startTable", q: "How do I start a table?", a: ["Tap the table number — the timer starts right away.", "A running table shows its time on the key."] },
        { id: "closeBill", q: "How do I close a bill?", a: ["Tap the running table again, or tap HISOB.", "Choose cash, card or mixed payment."] },
        { id: "walkin", q: "Selling bar items without a table", a: ["Tap 0 (walk-in) — a bill without time opens.", "Add items with BAR."] },
        { id: "closedApp", q: "Does the timer stop if I close the app?", a: ["No. Time counts from the start, so it is correct when you reopen."] },
      ],
    },
    {
      id: "time",
      title: "Time and price",
      articles: [
        { id: "wrongPrice", q: "The price looks wrong", a: ["Club → Prices: check the hourly and VIP rates.", "Club → Tables → a table: it may have its own rate.", "A new rate applies only to bills opened afterwards."] },
        { id: "rounding", q: "Why is the total rounded?", a: ["Club → Prices → Rounding: 1 or 15 minutes.", "Time is always rounded up."] },
        { id: "pause", q: "How does pause work?", a: ["PAUZA stops the timer; paused time is not charged.", "Tap again (DAVOM) to continue."] },
        { id: "vip", q: "How do I set the VIP rate?", a: ["Select the table and tap VIP.", "For a permanent VIP table: Club → Tables → table → VIP spot."] },
        { id: "move", q: "Guests moved to another table", a: ["Select the table, tap KO'CH, then pick a free table.", "Time and orders are kept."] },
        { id: "lateStart", q: "I started the timer late", a: ["Before closing, add the missing amount with QO'SH."] },
      ],
    },
    {
      id: "bar",
      title: "Bar and menu",
      articles: [
        { id: "addProduct", q: "Add a product to the menu", a: ["Club → Menu → Add item.", "Tap a product to change its price."] },
        { id: "wrongOrder", q: "I added a wrong order", a: ["AYIR removes the last order.", "Or tap − next to the item in the BAR sheet."] },
        { id: "discount", q: "How do I give a discount?", a: ["Select the bill, tap % and pick a percent.", "It applies to time and bar together."] },
      ],
    },
    {
      id: "bills",
      title: "Bills and history",
      articles: [
        { id: "history", q: "Where are closed bills?", a: ["The clock icon at top left — History.", "Today or All: revenue, cash and card totals."] },
        { id: "void", q: "A bill was opened by mistake", a: ["Bill → Void this bill.", "It stays in history as «BEKOR» and is not counted."] },
        { id: "editClosed", q: "Can I edit a closed bill?", a: ["No — closed bills don't change. Correct it on the next bill."] },
        { id: "undo", q: "What's the difference between ⌫ and AC?", a: ["⌫ undoes the last action.", "AC clears the screen; open bills stay."] },
      ],
    },
    {
      id: "data",
      title: "Data and device",
      articles: [
        { id: "whereData", q: "Where is my data stored?", a: ["Bills, history and menu are stored only on this device.", "They don't show on another phone."] },
        { id: "lostData", q: "My history is gone", a: ["Clearing Telegram or browser data deletes the history.", "If you opened Orde on another device, go back to the old one.", "History keeps the last 300 bills."] },
        { id: "blank", q: "The app won't open or shows a blank screen", a: ["Update Telegram and reopen the app from the bot.", "The first launch needs internet."] },
        { id: "offline", q: "Does it work offline?", a: ["Yes. Once opened it works without internet.", "Premium status refreshes when you're back online."] },
      ],
    },
    {
      id: "premium",
      title: "Premium",
      articles: [
        { id: "locked", q: "Why are some tables locked?", a: ["The free plan has 3 tables. Premium allows up to 30."] },
        { id: "getPremium", q: "How do I get Premium?", a: ["Club → Premium → Request Premium.", "The request goes to the admin. After it's enabled, reopen the app."] },
        { id: "noAnswer", q: "I sent a request but got no answer", a: ["We usually reply within a day.", "If it's urgent, write via «Leave a request» below."] },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      articles: [
        { id: "language", q: "Change the language", a: ["Club → General → Language."] },
        { id: "theme", q: "Day and night mode", a: ["Club → Appearance: Auto, Day or Night.", "Auto follows the phone setting."] },
        { id: "arrange", q: "Rearrange the keys", a: ["Club → Arrange keys.", "Drag a key onto another to swap them."] },
        { id: "tour", q: "Show the tips again", a: ["Help → Keys → Show the tips again."] },
      ],
    },
  ],
};
