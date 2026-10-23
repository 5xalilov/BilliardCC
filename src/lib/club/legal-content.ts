// Maxfiylik siyosati va ommaviy oferta matnlari (uz, ru, en; uz-Cyrl — tools/uz-cyrl.py qoidalari bilan).
// {operator}, {contact}, {requisites} — LEGAL_OPERATOR dan qo'yiladi (src/lib/club/legal.ts).
import type { LegalLang, LegalSection } from "@/lib/club/legal";

export const PRIVACY: Record<LegalLang, readonly LegalSection[]> = {
  "uz": [
    { title: "1. Umumiy qoidalar", body: [
      "Ushbu siyosat Orde ilovasi (Telegram Mini App va veb-versiya, keyingi o'rinlarda — «Ilova») foydalanuvchilarining ma'lumotlari qanday yig'ilishi, ishlatilishi va himoya qilinishini belgilaydi.",
      "Ilovadan foydalanish orqali siz ushbu siyosatga rozilik bildirasiz. Siyosat O'zbekiston Respublikasining «Shaxsga doir ma'lumotlar to'g'risida»gi Qonuniga muvofiq tuzilgan.",
    ] },
    { title: "2. Qanday ma'lumotlar yig'iladi", body: [
      "• Telegram ma'lumotlari: Telegram ID, ism va familiya, username. Ularni Telegram ilova ochilganda beradi.",
      "• Klub ma'lumotlari: klub nomi, joylar soni, ilova oxirgi marta ochilgan vaqt, Premium holati va so'rovlari.",
      "• Yordam so'rovlari: siz yozgan matn, tanlangan bo'lim va ixtiyoriy skrinshot.",
    ] },
    { title: "3. Faqat qurilmada qoladigan ma'lumotlar", body: [
      "Hisoblar, tarix, menyu, narxlar va sozlamalar faqat sizning qurilmangizda (Telegram yoki brauzer xotirasida) saqlanadi va serverga yuborilmaydi. Ularning zaxira nusxasi olinmaydi.",
    ] },
    { title: "4. Ma'lumotlar nima uchun ishlatiladi", body: [
      "• Ilova va Premium tarifni ishlatish.",
      "• Yordam so'rovlariga javob berish.",
      "• Xizmatni yaxshilash va suiiste'molning oldini olish.",
      "Ma'lumotlar reklama uchun ishlatilmaydi va sotilmaydi.",
    ] },
    { title: "5. Saqlash va himoya", body: [
      "Serverdagi ma'lumotlar Telegram Serverless infratuzilmasida saqlanadi. Ularga faqat Ilova administratori kira oladi.",
      "Yordam so'rovlari 12 oy, klub yozuvi esa Ilovadan foydalanayotgan davringizda yoki o'chirishni so'ragunizcha saqlanadi.",
    ] },
    { title: "6. Uchinchi shaxslar", body: [
      "Ma'lumotlar uchinchi shaxslarga berilmaydi. Istisno: Telegram platforma sifatida (o'z maxfiylik siyosatiga ko'ra) va qonunda nazarda tutilgan hollarda vakolatli davlat organlari.",
    ] },
    { title: "7. Sizning huquqlaringiz", body: [
      "Ma'lumotlaringiz haqida bilish, ularni tuzatish yoki o'chirishni so'rash huquqiga egasiz. Buning uchun Yordam → So'rov qoldirish orqali yozing. O'chirish so'rovi 30 kun ichida bajariladi.",
    ] },
    { title: "8. O'zgartirishlar", body: [
      "Siyosat yangilanganda bu Ilovada e'lon qilinadi. Yangi tahrir e'lon qilingan kundan kuchga kiradi.",
    ] },
    { title: "9. Aloqa", body: [
      "Savollar bo'yicha: Yordam → So'rov qoldirish yoki {contact}.",
    ] },
  ],
  "uz-Cyrl": [
    { title: "1. Умумий қоидалар", body: [
      "Ушбу сиёсат Orde иловаси (Телеграм Мини Апп ва веб-версия, кейинги ўринларда — «Илова») фойдаланувчиларининг маълумотлари қандай йиғилиши, ишлатилиши ва ҳимоя қилинишини белгилайди.",
      "Иловадан фойдаланиш орқали сиз ушбу сиёсатга розилик билдирасиз. Сиёсат Ўзбекистон Республикасининг «Шахсга доир маълумотлар тўғрисида»ги Қонунига мувофиқ тузилган.",
    ] },
    { title: "2. Қандай маълумотлар йиғилади", body: [
      "• Телеграм маълумотлари: Телеграм ИД, исм ва фамилия, усернаме. Уларни Телеграм илова очилганда беради.",
      "• Клуб маълумотлари: клуб номи, жойлар сони, илова охирги марта очилган вақт, Premium ҳолати ва сўровлари.",
      "• Ёрдам сўровлари: сиз ёзган матн, танланган бўлим ва ихтиёрий скриншот.",
    ] },
    { title: "3. Фақат қурилмада қоладиган маълумотлар", body: [
      "Ҳисоблар, тарих, меню, нархлар ва созламалар фақат сизнинг қурилмангизда (Телеграм ёки браузер хотирасида) сақланади ва серверга юборилмайди. Уларнинг захира нусхаси олинмайди.",
    ] },
    { title: "4. Маълумотлар нима учун ишлатилади", body: [
      "• Илова ва Premium тарифни ишлатиш.",
      "• Ёрдам сўровларига жавоб бериш.",
      "• Хизматни яхшилаш ва суиистеъмолнинг олдини олиш.",
      "Маълумотлар реклама учун ишлатилмайди ва сотилмайди.",
    ] },
    { title: "5. Сақлаш ва ҳимоя", body: [
      "Сервердаги маълумотлар Телеграм Серверлесс инфратузилмасида сақланади. Уларга фақат Илова администратори кира олади.",
      "Ёрдам сўровлари 12 ой, клуб ёзуви эса Иловадан фойдаланаётган даврингизда ёки ўчиришни сўрагунизча сақланади.",
    ] },
    { title: "6. Учинчи шахслар", body: [
      "Маълумотлар учинчи шахсларга берилмайди. Истисно: Телеграм платформа сифатида (ўз махфийлик сиёсатига кўра) ва қонунда назарда тутилган ҳолларда ваколатли давлат органлари.",
    ] },
    { title: "7. Сизнинг ҳуқуқларингиз", body: [
      "Маълумотларингиз ҳақида билиш, уларни тузатиш ёки ўчиришни сўраш ҳуқуқига эгасиз. Бунинг учун Ёрдам → Сўров қолдириш орқали ёзинг. Ўчириш сўрови 30 кун ичида бажарилади.",
    ] },
    { title: "8. Ўзгартиришлар", body: [
      "Сиёсат янгиланганда бу Иловада эълон қилинади. Янги таҳрир эълон қилинган кундан кучга киради.",
    ] },
    { title: "9. Алоқа", body: [
      "Саволлар бўйича: Ёрдам → Сўров қолдириш ёки {contact}.",
    ] },
  ],
  "ru": [
    { title: "1. Общие положения", body: [
      "Настоящая политика определяет, как собираются, используются и защищаются данные пользователей приложения Orde (Telegram Mini App и веб-версия, далее — «Приложение»).",
      "Пользуясь Приложением, вы соглашаетесь с этой политикой. Политика составлена в соответствии с Законом Республики Узбекистан «О персональных данных».",
    ] },
    { title: "2. Какие данные собираются", body: [
      "• Данные Telegram: Telegram ID, имя и фамилия, username. Их передаёт Telegram при открытии приложения.",
      "• Данные клуба: название клуба, количество мест, время последнего открытия, статус и запросы Premium.",
      "• Обращения в поддержку: ваш текст, выбранный раздел и, по желанию, скриншот.",
    ] },
    { title: "3. Данные, которые остаются на устройстве", body: [
      "Счета, история, меню, цены и настройки хранятся только на вашем устройстве (в памяти Telegram или браузера) и не отправляются на сервер. Резервные копии этих данных не создаются.",
    ] },
    { title: "4. Для чего используются данные", body: [
      "• Работа Приложения и тарифа Premium.",
      "• Ответы на обращения в поддержку.",
      "• Улучшение сервиса и предотвращение злоупотреблений.",
      "Данные не используются для рекламы и не продаются.",
    ] },
    { title: "5. Хранение и защита", body: [
      "Данные на сервере хранятся в инфраструктуре Telegram Serverless. Доступ к ним есть только у администратора Приложения.",
      "Обращения хранятся 12 месяцев, запись клуба — пока вы пользуетесь Приложением или до запроса на удаление.",
    ] },
    { title: "6. Третьи лица", body: [
      "Данные не передаются третьим лицам. Исключение: Telegram как платформа (по своей политике конфиденциальности) и уполномоченные государственные органы в случаях, предусмотренных законом.",
    ] },
    { title: "7. Ваши права", body: [
      "Вы можете узнать, исправить или удалить свои данные. Напишите через Помощь → Оставить запрос. Запрос на удаление выполняется в течение 30 дней.",
    ] },
    { title: "8. Изменения", body: [
      "Об обновлении политики сообщается в Приложении. Новая редакция действует с даты публикации.",
    ] },
    { title: "9. Контакты", body: [
      "По вопросам: Помощь → Оставить запрос или {contact}.",
    ] },
  ],
  "en": [
    { title: "1. General", body: [
      "This policy explains how data of users of the Orde app (Telegram Mini App and web version, the «App») is collected, used and protected.",
      "By using the App you agree to this policy. It follows the Law of the Republic of Uzbekistan «On Personal Data».",
    ] },
    { title: "2. What we collect", body: [
      "• Telegram data: Telegram ID, first and last name, username. Telegram provides them when the App opens.",
      "• Club data: club name, number of spots, time the App was last opened, Premium status and requests.",
      "• Support requests: your text, the chosen topic and an optional screenshot.",
    ] },
    { title: "3. Data that stays on your device", body: [
      "Bills, history, menu, prices and settings are stored only on your device (in Telegram or browser storage) and are never sent to the server. No backup of them is made.",
    ] },
    { title: "4. Why we use data", body: [
      "• To run the App and the Premium plan.",
      "• To answer support requests.",
      "• To improve the service and prevent abuse.",
      "Data is not used for advertising and is never sold.",
    ] },
    { title: "5. Storage and protection", body: [
      "Server data is stored on Telegram Serverless infrastructure. Only the App administrator can access it.",
      "Support requests are kept for 12 months; the club record while you use the App or until you ask to delete it.",
    ] },
    { title: "6. Third parties", body: [
      "Data is not shared with third parties, except Telegram as the platform (under its own privacy policy) and authorities where the law requires.",
    ] },
    { title: "7. Your rights", body: [
      "You may ask to see, correct or delete your data via Help → Leave a request. Deletion requests are completed within 30 days.",
    ] },
    { title: "8. Changes", body: [
      "Updates to this policy are announced in the App and take effect on the date they are published.",
    ] },
    { title: "9. Contact", body: [
      "Questions: Help → Leave a request or {contact}.",
    ] },
  ],
};

export const OFFER: Record<LegalLang, readonly LegalSection[]> = {
  "uz": [
    { title: "1. Umumiy qoidalar", body: [
      "Ushbu hujjat {operator} (keyingi o'rinlarda — «Ijrochi») tomonidan Orde ilovasidan (keyingi o'rinlarda — «Ilova») foydalanish bo'yicha ommaviy oferta hisoblanadi (O'zbekiston Respublikasi Fuqarolik kodeksining 367, 369 va 370-moddalari).",
      "Ilovani ochib, undan foydalanishni boshlash ofertaning to'liq qabul qilinishi (aksept) hisoblanadi.",
    ] },
    { title: "2. Atamalar", body: [
      "• Ilova — Orde: Telegram Mini App va veb-versiya.",
      "• Foydalanuvchi — Ilovadan foydalanayotgan shaxs yoki tadbirkor.",
      "• Joy — stol, kort, xona va boshqa soatlik xizmat birligi.",
      "• Premium — kengaytirilgan tarif.",
    ] },
    { title: "3. Xizmat mazmuni", body: [
      "Ilova joylar vaqtini hisoblash, bar buyurtmalari, chegirma, to'lov turlarini qayd etish va kunlik tarixni yuritish imkonini beradi.",
      "Ilova fiskal kassa (onlayn-NKM) va buxgalteriya hisobi o'rnini bosmaydi.",
    ] },
    { title: "4. Tariflar", body: [
      "• Bepul tarif: 3 tagacha joy.",
      "• Premium: 30 tagacha joy. Premium so'rov orqali yoqiladi; narxi va to'lov tartibi Foydalanuvchi bilan alohida kelishiladi.",
      "Ijrochi tariflarni Ilovada oldindan e'lon qilgan holda o'zgartirishi mumkin.",
    ] },
    { title: "5. Foydalanuvchi majburiyatlari", body: [
      "• Ilovadan qonuniy faoliyat uchun foydalanish.",
      "• Narxlar va hisob-kitoblarni o'zi tekshirish.",
      "• Qurilmasi va Telegram akkaunti xavfsizligini ta'minlash.",
    ] },
    { title: "6. Ijrochi majburiyatlari", body: [
      "• Ilovaning uzluksiz ishlashini ta'minlashga harakat qilish.",
      "• Yordam so'rovlariga imkon qadar tez javob berish.",
      "• Maxfiylik siyosatiga rioya qilish.",
    ] },
    { title: "7. Ma'lumotlar", body: [
      "Hisoblar va tarix Foydalanuvchi qurilmasida saqlanadi. Qurilma yo'qolsa yoki uning xotirasi tozalansa, Ijrochi bu ma'lumotlarni tiklay olmaydi.",
    ] },
    { title: "8. Javobgarlik", body: [
      "Ilova «boricha» taqdim etiladi. Ijrochi bilvosita zarar, boy berilgan foyda va qurilmadagi ma'lumot yo'qolishi uchun javobgar emas.",
      "Ijrochining javobgarligi Foydalanuvchi oxirgi 3 oyda Premium uchun to'lagan summadan oshmaydi.",
    ] },
    { title: "9. Amal qilish muddati", body: [
      "Oferta Foydalanuvchi Ilovadan foydalanayotgan davrda amal qiladi. Foydalanuvchi istalgan vaqt foydalanishni to'xtatishi mumkin.",
      "Ushbu shartlar buzilsa, Ijrochi Premium'ni o'chirishi yoki xizmat ko'rsatishni to'xtatishi mumkin.",
    ] },
    { title: "10. Nizolar", body: [
      "Nizolar muzokara yo'li bilan hal qilinadi. Kelishuvga erishilmasa, nizo O'zbekiston Respublikasi qonunchiligiga muvofiq Ijrochi joylashgan joydagi sudda ko'rib chiqiladi.",
    ] },
    { title: "11. Ijrochi rekvizitlari", body: [
      "{requisites}",
    ] },
  ],
  "uz-Cyrl": [
    { title: "1. Умумий қоидалар", body: [
      "Ушбу ҳужжат {operator} (кейинги ўринларда — «Ижрочи») томонидан Orde иловасидан (кейинги ўринларда — «Илова») фойдаланиш бўйича оммавий оферта ҳисобланади (Ўзбекистон Республикаси Фуқаролик кодексининг 367, 369 ва 370-моддалари).",
      "Иловани очиб, ундан фойдаланишни бошлаш офертанинг тўлиқ қабул қилиниши (аксепт) ҳисобланади.",
    ] },
    { title: "2. Атамалар", body: [
      "• Илова — Orde: Телеграм Мини Апп ва веб-версия.",
      "• Фойдаланувчи — Иловадан фойдаланаётган шахс ёки тадбиркор.",
      "• Жой — стол, корт, хона ва бошқа соатлик хизмат бирлиги.",
      "• Premium — кенгайтирилган тариф.",
    ] },
    { title: "3. Хизмат мазмуни", body: [
      "Илова жойлар вақтини ҳисоблаш, бар буюртмалари, чегирма, тўлов турларини қайд этиш ва кунлик тарихни юритиш имконини беради.",
      "Илова фискал касса (онлайн-НКМ) ва бухгалтерия ҳисоби ўрнини босмайди.",
    ] },
    { title: "4. Тарифлар", body: [
      "• Бепул тариф: 3 тагача жой.",
      "• Premium: 30 тагача жой. Premium сўров орқали ёқилади; нархи ва тўлов тартиби Фойдаланувчи билан алоҳида келишилади.",
      "Ижрочи тарифларни Иловада олдиндан эълон қилган ҳолда ўзгартириши мумкин.",
    ] },
    { title: "5. Фойдаланувчи мажбуриятлари", body: [
      "• Иловадан қонуний фаолият учун фойдаланиш.",
      "• Нархлар ва ҳисоб-китобларни ўзи текшириш.",
      "• Қурилмаси ва Телеграм аккаунти хавфсизлигини таъминлаш.",
    ] },
    { title: "6. Ижрочи мажбуриятлари", body: [
      "• Илованинг узлуксиз ишлашини таъминлашга ҳаракат қилиш.",
      "• Ёрдам сўровларига имкон қадар тез жавоб бериш.",
      "• Махфийлик сиёсатига риоя қилиш.",
    ] },
    { title: "7. Маълумотлар", body: [
      "Ҳисоблар ва тарих Фойдаланувчи қурилмасида сақланади. Қурилма йўқолса ёки унинг хотираси тозаланса, Ижрочи бу маълумотларни тиклай олмайди.",
    ] },
    { title: "8. Жавобгарлик", body: [
      "Илова «борича» тақдим этилади. Ижрочи билвосита зарар, бой берилган фойда ва қурилмадаги маълумот йўқолиши учун жавобгар эмас.",
      "Ижрочининг жавобгарлиги Фойдаланувчи охирги 3 ойда Premium учун тўлаган суммадан ошмайди.",
    ] },
    { title: "9. Амал қилиш муддати", body: [
      "Оферта Фойдаланувчи Иловадан фойдаланаётган даврда амал қилади. Фойдаланувчи исталган вақт фойдаланишни тўхтатиши мумкин.",
      "Ушбу шартлар бузилса, Ижрочи Premiumъни ўчириши ёки хизмат кўрсатишни тўхтатиши мумкин.",
    ] },
    { title: "10. Низолар", body: [
      "Низолар музокара йўли билан ҳал қилинади. Келишувга эришилмаса, низо Ўзбекистон Республикаси қонунчилигига мувофиқ Ижрочи жойлашган жойдаги судда кўриб чиқилади.",
    ] },
    { title: "11. Ижрочи реквизитлари", body: [
      "{requisites}",
    ] },
  ],
  "ru": [
    { title: "1. Общие положения", body: [
      "Настоящий документ является публичной офертой {operator} (далее — «Исполнитель») об использовании приложения Orde (далее — «Приложение») в соответствии со статьями 367, 369 и 370 Гражданского кодекса Республики Узбекистан.",
      "Открытие Приложения и начало работы в нём означает полное принятие оферты (акцепт).",
    ] },
    { title: "2. Термины", body: [
      "• Приложение — Orde: Telegram Mini App и веб-версия.",
      "• Пользователь — лицо или предприниматель, использующий Приложение.",
      "• Место — стол, корт, комната и другая единица почасовой услуги.",
      "• Premium — расширенный тариф.",
    ] },
    { title: "3. Предмет", body: [
      "Приложение позволяет учитывать время мест, заказы бара, скидки, способы оплаты и вести дневную историю.",
      "Приложение не заменяет фискальную кассу (онлайн-ККМ) и бухгалтерский учёт.",
    ] },
    { title: "4. Тарифы", body: [
      "• Бесплатный тариф: до 3 мест.",
      "• Premium: до 30 мест. Включается по запросу; стоимость и порядок оплаты согласуются с Пользователем отдельно.",
      "Исполнитель может изменить тарифы, заранее сообщив об этом в Приложении.",
    ] },
    { title: "5. Обязанности Пользователя", body: [
      "• Использовать Приложение для законной деятельности.",
      "• Самостоятельно проверять цены и расчёты.",
      "• Обеспечивать безопасность своего устройства и аккаунта Telegram.",
    ] },
    { title: "6. Обязанности Исполнителя", body: [
      "• Стремиться обеспечить бесперебойную работу Приложения.",
      "• Отвечать на обращения как можно быстрее.",
      "• Соблюдать политику конфиденциальности.",
    ] },
    { title: "7. Данные", body: [
      "Счета и история хранятся на устройстве Пользователя. При утере устройства или очистке его памяти Исполнитель не может восстановить эти данные.",
    ] },
    { title: "8. Ответственность", body: [
      "Приложение предоставляется «как есть». Исполнитель не отвечает за косвенные убытки, упущенную выгоду и потерю данных на устройстве.",
      "Ответственность Исполнителя ограничена суммой, уплаченной Пользователем за Premium за последние 3 месяца.",
    ] },
    { title: "9. Срок действия", body: [
      "Оферта действует, пока Пользователь пользуется Приложением. Пользователь может прекратить использование в любое время.",
      "При нарушении условий Исполнитель может отключить Premium или прекратить обслуживание.",
    ] },
    { title: "10. Споры", body: [
      "Споры решаются путём переговоров. Если соглашение не достигнуто, спор рассматривается судом по месту нахождения Исполнителя в соответствии с законодательством Республики Узбекистан.",
    ] },
    { title: "11. Реквизиты Исполнителя", body: [
      "{requisites}",
    ] },
  ],
  "en": [
    { title: "1. General", body: [
      "This document is a public offer by {operator} (the «Provider») for the use of the Orde app (the «App») under Articles 367, 369 and 370 of the Civil Code of the Republic of Uzbekistan.",
      "Opening the App and starting to use it means full acceptance of this offer.",
    ] },
    { title: "2. Terms", body: [
      "• App — Orde: Telegram Mini App and web version.",
      "• User — a person or business using the App.",
      "• Spot — a table, court, room or other unit of an hourly service.",
      "• Premium — the extended plan.",
    ] },
    { title: "3. Subject", body: [
      "The App tracks time of spots, bar orders, discounts and payment methods, and keeps a daily history.",
      "The App does not replace a fiscal cash register or accounting.",
    ] },
    { title: "4. Plans", body: [
      "• Free plan: up to 3 spots.",
      "• Premium: up to 30 spots. It is enabled on request; price and payment are agreed with the User separately.",
      "The Provider may change plans after announcing it in the App.",
    ] },
    { title: "5. User obligations", body: [
      "• Use the App for lawful activity.",
      "• Check prices and calculations.",
      "• Keep the device and Telegram account secure.",
    ] },
    { title: "6. Provider obligations", body: [
      "• Strive to keep the App running without interruptions.",
      "• Answer support requests as soon as possible.",
      "• Follow the privacy policy.",
    ] },
    { title: "7. Data", body: [
      "Bills and history are stored on the User's device. If the device is lost or its storage is cleared, the Provider cannot restore them.",
    ] },
    { title: "8. Liability", body: [
      "The App is provided «as is». The Provider is not liable for indirect damage, lost profit or loss of data on the device.",
      "The Provider's liability is limited to the amount the User paid for Premium in the last 3 months.",
    ] },
    { title: "9. Term", body: [
      "The offer is valid while the User uses the App. The User may stop at any time.",
      "If these terms are breached, the Provider may disable Premium or stop the service.",
    ] },
    { title: "10. Disputes", body: [
      "Disputes are settled by negotiation; otherwise by the court at the Provider's location under the laws of the Republic of Uzbekistan.",
    ] },
    { title: "11. Provider details", body: [
      "{requisites}",
    ] },
  ],
};
