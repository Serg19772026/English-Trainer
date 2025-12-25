
import { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'travel',
    title: 'Travel & Tourism',
    icon: '✈️',
    sentences: [
      { id: 't1', text: 'Where is the nearest train station?', translation: 'Где находится ближайшая железнодорожная станция?', pronunciationTips: ["Focus on 'the'", "Long 'ee' in nearest", "Shun sound in station"] },
      { id: 't2', text: 'I would like to book a room for two nights.', translation: 'Я хотел бы забронировать номер на две ночи.', pronunciationTips: ["Soft 'd' in would", "Short 'oo' in book", "Silent 'gh' in nights"] },
      { id: 't3', text: 'Could you please show me the way on the map?', translation: 'Не могли бы вы показать мне дорогу на карте?', pronunciationTips: ["Link 'Could-ya'", "Long 'o' in show", "Wide 'a' in map"] },
      { id: 't4', text: 'Is there a good restaurant nearby?', translation: 'Есть ли поблизости хороший ресторан?', pronunciationTips: ["'ere' sounds like 'air'", "Swallow middle 'au' in restaurant", "Stress first syllable in nearby"] },
      { id: 't5', text: 'What time does the flight to London depart?', translation: 'Во сколько вылетает рейс в Лондон?', pronunciationTips: ["'does' sounds like 'duz'", "Silent 'gh' in flight", "Stress second syllable in depart"] },
      { id: 't6', text: 'I need to check in for my flight.', translation: 'Мне нужно зарегистрироваться на рейс.', pronunciationTips: ["Sharp 'ch' in check", "Link 'check-in'"] },
      { id: 't7', text: 'How much does a taxi to the airport cost?', translation: 'Сколько стоит такси до аэропорта?', pronunciationTips: ["'How much' ends in 'ch'", "Airport stress on first part"] },
      { id: 't8', text: 'Can you recommend a nice hotel?', translation: 'Можете порекомендовать хороший отель?', pronunciationTips: ["Stress third syllable: rec-om-MEND", "Hotel stress on second syllable"] },
      { id: 't9', text: 'Is breakfast included in the price?', translation: 'Завтрак включен в стоимость?', pronunciationTips: ["Breakfast sounds like 'brek-fust'", "Included ends with 'id'"] },
      { id: 't10', text: 'I have lost my suitcase.', translation: 'Я потерял свой чемодан.', pronunciationTips: ["Short 'o' in lost", "Suitcase starts with 'sut'"] }
    ]
  },
  {
    id: 'food',
    title: 'Food & Dining',
    icon: '🍕',
    sentences: [
      { id: 'f1', text: 'Can I see the menu, please?', translation: 'Можно мне меню, пожалуйста?', pronunciationTips: ["Short 'e' in menu", "Voiced 'z' in please"] },
      { id: 'f2', text: 'I am allergic to peanuts.', translation: 'У меня аллергия на арахис.', pronunciationTips: ["Stress second syllable: al-LER-gic", "Long 'ee' in peanuts"] },
      { id: 'f3', text: 'The food was absolutely delicious.', translation: 'Еда была совершенно потрясающей.', pronunciationTips: ["Stress first and third syllables in absolutely", "Ci in delicious sounds like 'sh'"] },
      { id: 'f4', text: 'Check please, we are ready to go.', translation: 'Счет, пожалуйста, мы готовы идти.', pronunciationTips: ["Sharp 'ch' in check", "Clear 'y' in ready"] },
      { id: 'f5', text: 'Do you have any vegetarian options?', translation: 'У вас есть вегетарианские блюда?', pronunciationTips: ["Soft 'j' in vegetarian", "Stress third syllable: veg-e-TAR-ian"] },
      { id: 'f6', text: 'A table for two, please.', translation: 'Столик на двоих, пожалуйста.', pronunciationTips: ["Long 'a' in table", "Short 'u' in two"] },
      { id: 'f7', text: 'What do you recommend for the main course?', translation: 'Что вы посоветуете на основное блюдо?', pronunciationTips: ["Rec-om-mend stress on last", "Course rhymes with horse"] },
      { id: 'f8', text: 'I would like a glass of red wine.', translation: 'Я бы хотел бокал красного вина.', pronunciationTips: ["Short 'a' in glass", "Wine rhymes with fine"] },
      { id: 'f9', text: 'Is the service charge included?', translation: 'Чаевые включены в счет?', pronunciationTips: ["Stress first syllable: SER-vice", "Charge ends with 'j'"] },
      { id: 'f10', text: 'This soup is a bit too salty.', translation: 'Этот суп немного пересолен.', pronunciationTips: ["Long 'oo' in soup", "Salty rhymes with faulty"] }
    ]
  },
  {
    id: 'work',
    title: 'Work & Office',
    icon: '💼',
    sentences: [
      { id: 'w1', text: 'Let’s schedule a meeting for tomorrow morning.', translation: 'Давайте запланируем встречу на завтрашнее утро.', pronunciationTips: ["Schedule starts with 'sk'", "Long 'ee' in meeting"] },
      { id: 'w2', text: 'I need to finish this report by Friday.', translation: 'Мне нужно закончить этот отчет к пятнице.', pronunciationTips: ["Soft 'sh' in finish", "Stress second syllable: re-PORT"] },
      { id: 'w3', text: 'Could you send me that file via email?', translation: 'Не могли бы вы прислать мне этот файл по электронной почте?', pronunciationTips: ["Long 'eye' in file", "Stress first syllable: E-mail"] },
      { id: 'w4', text: 'What is your current role in the company?', translation: 'Какова ваша текущая роль в компании?', pronunciationTips: ["'u' in current sounds like 'uh'", "Company sounds like 'kum-puh-nee'"] },
      { id: 'w5', text: 'We need to improve our team communication.', translation: 'Нам нужно улучшить коммуникацию в команде.', pronunciationTips: ["Stress second syllable: im-PROVE", "Stress fourth syllable: ca-tion"] },
      { id: 'w6', text: 'I will be out of the office on Monday.', translation: 'В понедельник меня не будет в офисе.', pronunciationTips: ["'out of' becomes 'outta'", "Monday ends in 'dee'"] },
      { id: 'w7', text: 'Can we discuss this during the break?', translation: 'Можем обсудить это во время перерыва?', pronunciationTips: ["Discuss stress on second", "Break rhymes with cake"] },
      { id: 'w8', text: 'I am looking forward to our collaboration.', translation: 'Я с нетерпением жду нашего сотрудничества.', pronunciationTips: ["Forward ends in 'erd'", "Col-lab-o-ra-tion stress on ra"] },
      { id: 'w9', text: 'The deadline is approaching very fast.', translation: 'Крайний срок приближается очень быстро.', pronunciationTips: ["Deadline stress on dead", "Approaching ends with 'ching'"] },
      { id: 'w10', text: 'Please send me the meeting minutes.', translation: 'Пожалуйста, пришлите мне протокол встречи.', pronunciationTips: ["Meeting ends in 'ing'", "Minutes sounds like 'min-its'"] }
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping',
    icon: '🛍️',
    sentences: [
      { id: 's1', text: 'How much is this blue sweater?', translation: 'Сколько стоит этот синий свитер?', pronunciationTips: ["How much ends in 'ch'", "Sweater sounds like 'swetter'"] },
      { id: 's2', text: 'Do you have this in a smaller size?', translation: 'У вас есть это в меньшем размере?', pronunciationTips: ["Smaller ends in 'er'", "Size ends with a voiced 'z'"] },
      { id: 's3', text: 'Where can I find the fitting room?', translation: 'Где я могу найти примерочную?', pronunciationTips: ["Fitting rhymes with sitting", "Room has a long 'oo'"] },
      { id: 's4', text: 'I would like to pay by credit card.', translation: 'Я хотел бы оплатить кредитной картой.', pronunciationTips: ["Stress first syllable: CRED-it", "Card has a long 'ar'"] },
      { id: 's5', text: 'Can I get a receipt, please?', translation: 'Можно мне чек, пожалуйста?', pronunciationTips: ["The 'p' in receipt is silent", "Please ends in a 'z' sound"] },
      { id: 's6', text: 'Is this item currently on sale?', translation: 'Этот товар сейчас на распродаже?', pronunciationTips: ["Item stress on first syllable", "Sale rhymes with mail"] },
      { id: 's7', text: 'I am just looking around, thank you.', translation: 'Я просто осматриваюсь, спасибо.', pronunciationTips: ["Just ends in 'st'", "Around ends in 'nd'"] },
      { id: 's8', text: 'Do you sell any local souvenirs?', translation: 'Вы продаете какие-нибудь местные сувениры?', pronunciationTips: ["Local stress on first syllable", "Souvenir stress on last syllable"] },
      { id: 's9', text: 'This jacket is a bit too expensive.', translation: 'Эта куртка немного дороговата.', pronunciationTips: ["Jacket starts with 'j'", "Expensive stress on second syllable"] },
      { id: 's10', text: 'What time does the shop close?', translation: 'Во сколько закрывается магазин?', pronunciationTips: ["Does sounds like 'duz'", "Close ends with a 'z' sound"] }
    ]
  },
  {
    id: 'health',
    title: 'Health & Wellness',
    icon: '🏥',
    sentences: [
      { id: 'h1', text: 'I have a really bad headache.', translation: 'У меня очень сильно болит голова.', pronunciationTips: ["Really has two syllables", "Headache ends with 'ake' like cake"] },
      { id: 'h2', text: 'Where is the nearest pharmacy?', translation: 'Где находится ближайшая аптека?', pronunciationTips: ["'ph' sounds like 'f'", "Nearest stress on first syllable"] },
      { id: 'h3', text: 'I need to make an appointment with a doctor.', translation: 'Мне нужно записаться на прием к врачу.', pronunciationTips: ["Ap-point-ment stress on point", "Doctor ends in 'ter' sound"] },
      // Fix: Used double quotes for the text property to correctly handle the apostrophe in "don't"
      { id: 'h4', text: "I don't feel very well today.", translation: 'Я не очень хорошо себя чувствую сегодня.', pronunciationTips: ["Feel has a long 'ee'", "Today stress on second syllable"] },
      { id: 'h5', text: 'Can you recommend something for a cold?', translation: 'Можете порекомендовать что-нибудь от простуды?', pronunciationTips: ["Stress last syllable: rec-om-MEND", "Cold rhymes with bold"] },
      { id: 'h6', text: 'Is it a serious medical condition?', translation: 'Это серьезное заболевание?', pronunciationTips: ["Serious stress on first", "Con-di-tion stress on di"] },
      { id: 'h7', text: 'I am allergic to some medications.', translation: 'У меня аллергия на некоторые лекарства?', pronunciationTips: ["Stress second syllable: al-LER-gic", "Med-i-ca-tion stress on ca"] },
      { id: 'h8', text: 'How often should I take this medicine?', translation: 'Как часто мне нужно принимать это лекарство?', pronunciationTips: ["The 't' in often is often silent", "Medicine has three syllables"] },
      { id: 'h9', text: 'I need a prescription for these pills.', translation: 'Мне нужен рецепт на эти таблетки.', pronunciationTips: ["Pre-scrip-tion stress on scrip", "Pills rhymes with fills"] },
      { id: 'h10', text: 'Where can I find a dentist?', translation: 'Где я могу найти стоматолога?', pronunciationTips: ["Find has a long 'i'", "Dentist stress on first syllable"] }
    ]
  },
  {
    id: 'hobbies',
    title: 'Hobbies & Interests',
    icon: '🎨',
    sentences: [
      { id: 'ho1', text: 'What do you like to do in your free time?', translation: 'Чем вы любите заниматься в свободное время?', pronunciationTips: ["Like rhymes with hike", "Free has a long 'ee'"] },
      { id: 'ho2', text: 'I am very interested in learning photography.', translation: 'Мне очень интересно изучать фотографию.', pronunciationTips: ["Stress first syllable: IN-ter-est-ed", "Pho-tog-ra-phy stress on tog"] },
      { id: 'ho3', text: 'Do you play any musical instruments?', pronunciationTips: ["Musical stress on first", "In-stru-ments stress on in"], translation: 'Вы играете на каких-нибудь музыкальных инструментах?' },
      { id: 'ho4', text: 'My favorite hobby is reading history books.', translation: 'Мое любимое хобби — чтение исторических книг.', pronunciationTips: ["Fa-vor-ite stress on fa", "History has three syllables"] },
      { id: 'ho5', text: 'I go to the gym three times a week.', translation: 'Я хожу в спортзал три раза в неделю.', pronunciationTips: ["Gym sounds like 'jim'", "Week rhymes with seek"] },
      { id: 'ho6', text: 'Have you seen any good movies lately?', translation: 'Вы видели какие-нибудь хорошие фильмы в последнее время?', pronunciationTips: ["Movies stress on first", "Lately stress on first"] },
      { id: 'ho7', text: 'I enjoy hiking in the mountains.', translation: 'Мне нравится ходить в походы в горы.', pronunciationTips: ["En-joy stress on joy", "Moun-tains stress on moun"] },
      { id: 'ho8', text: 'I love listening to jazz music.', translation: 'Я люблю слушать джаз.', pronunciationTips: ["Listen has a silent 't'", "Jazz has a short 'a'"] },
      { id: 'ho9', text: 'How long have you been painting?', translation: 'Как долго вы занимаетесь живописью?', pronunciationTips: ["Long has a nasal 'ng'", "Painting stress on first"] },
      { id: 'ho10', text: 'I prefer spending time outdoors.', translation: 'Я предпочитаю проводить время на свежем воздухе.', pronunciationTips: ["Pre-fer stress on second", "Out-doors stress on out"] }
    ]
  }
];
