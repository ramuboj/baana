'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type Language = 'en' | 'te';

const LANGUAGE_KEY = 'bukka_language';

const teluguTranslations: Record<string, string> = {
  About: 'మా గురించి',
  'Bukka Ayyavarlu': 'బుక్క అయ్యవార్లు',
  Bukka: 'బుక్క',
  Ayyavarlu: 'అయ్యవార్లు',
  'Bukka Ayyavarlu community welcome video': 'బుక్క అయ్యవార్ల సమాజ స్వాగత వీడియో',
  'All rights reserved.': 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.',
  'Our Heritage': 'మన వారసత్వం',
  Heritage: 'వారసత్వం',
  Practice: 'ఆచారాలు',
  History: 'చరిత్ర',
  Values: 'విలువలు',
  'Join Us': 'మాతో చేరండి',
  Contact: 'సంప్రదించండి',
  News: 'వార్తలు',
  Dashboard: 'డ్యాష్‌బోర్డ్',
  'India News': 'భారత వార్తలు',
  'USA News': 'అమెరికా వార్తలు',
  Login: 'లాగిన్',
  'Sign in': 'సైన్ ఇన్',
  Register: 'నమోదు',
  'Register as a Member': 'సభ్యుడిగా నమోదు చేసుకోండి',
  'A Living Legacy — Since Ancient Times': 'ప్రాచీన కాలం నుంచి వస్తున్న సజీవ వారసత్వం',
  'Guardians of tradition, keepers of culture — a proud community woven through the centuries of Telangana heritage.':
    'సంప్రదాయాల సంరక్షకులు, సంస్కృతికి వారసులు — తెలంగాణ వారసత్వంతో ముడిపడిన గర్వించదగిన సమాజం.',
  'Discover Our Story': 'మన కథను తెలుసుకోండి',
  Scroll: 'క్రిందికి చూడండి',
  'Who We Are': 'మేము ఎవరం',
  'A Community Rooted in Pride & Purpose': 'గర్వం, లక్ష్యంతో వేళ్లూనుకున్న సమాజం',
  'Traditional Kolam — Symbol of Prosperity & Welcome': 'సాంప్రదాయ ముగ్గు — శ్రేయస్సు, స్వాగతానికి చిహ్నం',
  'Years of Heritage': 'సంవత్సరాల వారసత్వం',
  'Cast Community': 'కుల సమాజం',
  Account: 'ఖాతా',
  'Personal details': 'వ్యక్తిగత వివరాలు',
  min: 'కనీసం',
  characters: 'అక్షరాలు',
  'City / Town': 'నగరం / పట్టణం',
  'State / Region': 'రాష్ట్రం / ప్రాంతం',
  'State or Region': 'రాష్ట్రం లేదా ప్రాంతం',
  'Select current country': 'ప్రస్తుత దేశాన్ని ఎంచుకోండి',
  'Phone / Mobile': 'ఫోన్ / మొబైల్',
  'Authentication conflict: your account is registered in the United States. India content is unavailable for this session.':
    'మీ ఖాతా యునైటెడ్ స్టేట్స్‌లో నమోదు చేయబడింది. ఈ సెషన్‌లో భారతదేశ కంటెంట్ అందుబాటులో లేదు.',
  'Authentication conflict: your account is registered in India. United States content is unavailable for this session.':
    'మీ ఖాతా భారతదేశంలో నమోదు చేయబడింది. ఈ సెషన్‌లో అమెరికా కంటెంట్ అందుబాటులో లేదు.',
  'Authentication conflict: your account is registered in the United States. India news is unavailable for this account.':
    'మీ ఖాతా అమెరికాలో నమోదు చేయబడింది. ఈ ఖాతాకు భారత వార్తలు అందుబాటులో లేవు.',
  'Authentication conflict: your account is registered in India. USA news is unavailable for this account.':
    'మీ ఖాతా భారతదేశంలో నమోదు చేయబడింది. ఈ ఖాతాకు అమెరికా వార్తలు అందుబాటులో లేవు.',
  'Unable to verify your region': 'మీ ప్రాంతాన్ని నిర్ధారించలేకపోయాం',
  'Registration failed': 'నమోదు విఫలమైంది',
  'Login failed': 'లాగిన్ విఫలమైంది',
  'No token received': 'టోకెన్ అందలేదు',
  'Network error. Is the backend running?': 'నెట్‌వర్క్ సమస్య. బ్యాకెండ్ నడుస్తోందో చూడండి.',
  'Signing in…': 'సైన్ ఇన్ అవుతోంది…',
  'The Bukka Ayyavarlu are a distinguished community with deep roots in the Andhra and Telangana regions of India. Known for their craftsmanship, valor, and devotion, they have shaped the social, cultural, and economic fabric of South Indian civilization across countless generations.':
    'బుక్క అయ్యవార్లు ఆంధ్రప్రదేశ్, తెలంగాణ ప్రాంతాల్లో లోతైన మూలాలు కలిగిన విశిష్ట సమాజం. కళానైపుణ్యం, ధైర్యం, భక్తికి పేరుగాంచిన ఈ సమాజం తరతరాలుగా దక్షిణ భారత సామాజిక, సాంస్కృతిక, ఆర్థిక జీవనాన్ని తీర్చిదిద్దింది.',
  'The name itself carries meaning — "Bukka" refers to the sacred vermillion used in worship, while "Ayyavarlu" denotes respected elders and honorable persons. Together, they speak of a people blessed with dignity and purpose.':
    'ఈ పేరులోనే అర్థం ఉంది — పూజలో ఉపయోగించే పవిత్ర కుంకుమను “బుక్క” సూచిస్తుంది; గౌరవనీయులైన పెద్దలను “అయ్యవార్లు” సూచిస్తుంది. ఈ రెండూ గౌరవం, లక్ష్యంతో కూడిన సమాజాన్ని ప్రతిబింబిస్తాయి.',
  'Spread across Andhra Pradesh, Telangana, and beyond, the Bukka Ayyavarlu community continues to thrive — honoring its ancient customs while embracing the promise of a modern future.':
    'ఆంధ్రప్రదేశ్, తెలంగాణతో పాటు ప్రపంచవ్యాప్తంగా విస్తరించిన బుక్క అయ్యవార్ల సమాజం, ప్రాచీన ఆచారాలను గౌరవిస్తూ ఆధునిక భవిష్యత్తును ఆహ్వానిస్తూ అభివృద్ధి చెందుతోంది.',
  'Pillars of Identity': 'మన గుర్తింపు స్తంభాలు',
  'Devotion & Worship': 'భక్తి, ఆరాధన',
  'Craft & Artistry': 'కళా నైపుణ్యం',
  'Oral & Literary Tradition': 'మౌఖిక, సాహిత్య సంప్రదాయం',
  'A Living Faith': 'సజీవ విశ్వాసం',
  'Sacred Practice, Shared Together': 'కలిసి పంచుకునే పవిత్ర ఆచారాలు',
  'Our religious life is carried through everyday acts of devotion, family remembrance, and service to one another. Across India and the United States, members keep these values alive in homes, temples, and community gatherings.':
    'దైనందిన భక్తి, కుటుంబ స్మరణ, పరస్పర సేవ ద్వారా మన ఆధ్యాత్మిక జీవనం కొనసాగుతుంది. భారతదేశం, అమెరికాలోని సభ్యులు ఇళ్లలో, ఆలయాల్లో, సమాజ సమావేశాల్లో ఈ విలువలను సజీవంగా ఉంచుతున్నారు.',
  'Prayer & Reflection': 'ప్రార్థన, మననం',
  'Celebration & Ritual': 'వేడుకలు, సంప్రదాయాలు',
  'Service & Compassion': 'సేవ, కరుణ',
  'Our Timeline': 'మన కాలక్రమం',
  'Through the Ages': 'యుగాల ప్రయాణం',
  'Ancient Era': 'ప్రాచీన యుగం',
  'Origins in Ancient Andhra': 'ప్రాచీన ఆంధ్రలో ఆవిర్భావం',
  'Medieval Period · 10th–14th Century': 'మధ్యయుగం · 10–14వ శతాబ్దం',
  'Early Modern · 15th–18th Century': 'ఆధునిక పూర్వ యుగం · 15–18వ శతాబ్దం',
  'Modern Era · 19th Century – Present': 'ఆధునిక యుగం · 19వ శతాబ్దం నుంచి నేటి వరకు',
  Tradition: 'సంప్రదాయం',
  Devotion: 'భక్తి',
  Craftsmanship: 'కళానైపుణ్యం',
  Unity: 'ఐక్యత',
  Wisdom: 'జ్ఞానం',
  Honor: 'గౌరవం',
  Service: 'సేవ',
  'Family & Kinship': 'కుటుంబం, బంధుత్వం',
  'Sacred Duty': 'పవిత్ర కర్తవ్యం',
  'Knowledge & Learning': 'జ్ఞానం, విద్య',
  'Unity in Diversity': 'వైవిధ్యంలో ఐక్యత',
  'Be Part of the Legacy': 'వారసత్వంలో భాగమవ్వండి',
  'Connect With Your Roots': 'మీ మూలాలతో అనుసంధానం అవ్వండి',
  'Contact Us': 'మమ్మల్ని సంప్రదించండి',
  'Learn Our History': 'మన చరిత్ర తెలుసుకోండి',
  'Bukka Ayyavarlu Community': 'బుక్క అయ్యవార్ల సమాజం',
  'Bukka Ayyavarlu Community · India & United States': 'బుక్క అయ్యవార్ల సమాజం · భారతదేశం, అమెరికా',
  Announcement: 'ప్రకటన',
  'Sign in for details': 'వివరాల కోసం సైన్ ఇన్ చేయండి',
  'View regional details': 'ప్రాంతీయ వివరాలు చూడండి',
  'Join us for devotional songs, family games, shared food, and a joyful day of community togetherness.':
    'భక్తి పాటలు, కుటుంబ ఆటలు, విందు భోజనం, సమాజ ఐక్యతతో ఆనందంగా గడిపే రోజులో మాతో చేరండి.',
  'Deeply connected to temple traditions and sacred practices, the community has long served as custodians of ritual, ceremony, and devotion — particularly in the veneration of Shiva and Shakti.':
    'ఆలయ సంప్రదాయాలు, పవిత్ర ఆచారాలతో ముడిపడిన ఈ సమాజం, ముఖ్యంగా శివశక్తుల ఆరాధనలో పూజలు, వేడుకలు, భక్తి సంప్రదాయాలను తరతరాలుగా కాపాడుతోంది.',
  'Master artisans by tradition, the Bukka Ayyavarlu have contributed intricate works in metal, stone, and textile — crafts passed lovingly from hand to hand across generations.':
    'సంప్రదాయంగా నిపుణులైన కళాకారులైన బుక్క అయ్యవార్లు లోహం, రాతి, వస్త్ర కళల్లో అద్భుత సృష్టి చేశారు. ఈ కళలు తరతరాలుగా ప్రేమతో అందించబడ్డాయి.',
  'A community of storytellers and scholars, preserving wisdom through poetry, song, and spoken word — sustaining a rich Telugu literary heritage that predates the written record.':
    'కథకులు, పండితుల సమాజంగా కవిత్వం, పాటలు, మౌఖిక సంప్రదాయాల ద్వారా జ్ఞానాన్ని కాపాడుతూ, లిఖిత చరిత్రకు ముందునుంచే తెలుగు సాహిత్య వారసత్వాన్ని కొనసాగిస్తున్నారు.',
  'Make space for gratitude, remembrance, and a quiet connection with the divine.':
    'కృతజ్ఞత, స్మరణ, దైవంతో ప్రశాంత అనుబంధం కోసం సమయం కేటాయించండి.',
  'Gather with family and community to honor festivals, traditions, and sacred milestones.':
    'పండుగలు, సంప్రదాయాలు, పవిత్ర సందర్భాలను గౌరవించేందుకు కుటుంబం, సమాజంతో కలుసుకోండి.',
  'Let devotion become action through generosity, hospitality, and care for the community.':
    'దాతృత్వం, ఆతిథ్యం, సమాజ శ్రేయస్సు ద్వారా భక్తిని కార్యరూపంలో చూపండి.',
  'The origins of the Bukka Ayyavarlu community are traced to ancient Andhra, where they established themselves as skilled artisans, devout worshippers, and respected community leaders in the earliest Telugu-speaking settlements.':
    'బుక్క అయ్యవార్ల సమాజ మూలాలు ప్రాచీన ఆంధ్రలో ఉన్నాయి. తొలి తెలుగు నివాసాల్లో నైపుణ్యం కలిగిన కళాకారులుగా, భక్తులుగా, గౌరవనీయ నాయకులుగా గుర్తింపు పొందారు.',
  'Rise Under the Kakatiya & Vijayanagara Empires': 'కాకతీయ, విజయనగర సామ్రాజ్యాల కాలంలో అభ్యున్నతి',
  'During the golden age of the Kakatiya and Vijayanagara kingdoms, the community flourished under royal patronage. Their skills in ritual, craft, and administration made them indispensable to the royal courts and temple economies of the Deccan.':
    'కాకతీయ, విజయనగర రాజ్యాల స్వర్ణయుగంలో రాజాదరణతో ఈ సమాజం అభివృద్ధి చెందింది. ఆచారాలు, కళలు, పరిపాలనలోని నైపుణ్యంతో దక్కన్ రాజదర్బార్లు, ఆలయ ఆర్థిక వ్యవస్థల్లో కీలకపాత్ర పోషించారు.',
  'Custodians of Temple Culture': 'ఆలయ సంస్కృతి సంరక్షకులు',
  'As great temple complexes expanded across the Telugu lands, Bukka Ayyavarlu families became integral to their upkeep and ceremony — maintaining traditions of sacred service that continue to this day.':
    'తెలుగు ప్రాంతాల్లో మహా ఆలయాలు విస్తరించినప్పుడు, వాటి నిర్వహణ, వేడుకల్లో బుక్క అయ్యవార్ల కుటుంబాలు కీలకంగా నిలిచాయి. పవిత్ర సేవా సంప్రదాయాలు నేటికీ కొనసాగుతున్నాయి.',
  'Adaptation & Expansion': 'మార్పులకు అనుగుణంగా అభివృద్ధి',
  'Through the colonial era and into independent India, the community adapted with resilience — embracing education, professional life, and civic engagement while holding steadfast to the values and customs that define them.':
    'వలస పాలన నుంచి స్వతంత్ర భారతం వరకు విద్య, వృత్తి, పౌర భాగస్వామ్యాన్ని స్వీకరిస్తూ, తమ విలువలు, ఆచారాలను నిలబెట్టుకుని సమాజం దృఢంగా ముందుకు సాగింది.',
  'The roots of our ancestors are the branches of our future.': 'మన పూర్వీకుల మూలాలే మన భవిష్యత్తు కొమ్మలు.',
  '— Community Proverb': '— సమాజ నానుడి',
  'The family unit is the bedrock of community life — every celebration, ceremony, and ritual reinforces bonds across generations.':
    'కుటుంబమే సమాజ జీవనానికి పునాది. ప్రతి వేడుక, కార్యక్రమం, ఆచారం తరతరాల బంధాలను బలపరుస్తుంది.',
  'Dharmic responsibility runs deep. From daily worship to community service, duty is not obligation — it is identity.':
    'ధర్మబద్ధమైన బాధ్యత మనలో లోతుగా ఉంది. రోజువారీ ఆరాధన నుంచి సమాజ సేవ వరకు, కర్తవ్యం భారమేమీ కాదు — అదే మన గుర్తింపు.',
  'Education is revered as much as tradition. The community prizes both ancient wisdom and contemporary scholarship equally.':
    'సంప్రదాయంతో సమానంగా విద్యకూ గౌరవం ఉంది. ప్రాచీన జ్ఞానం, ఆధునిక విద్య రెండింటినీ సమాజం సమానంగా ఆదరిస్తుంది.',
  'Spread across states and countries, the Bukka Ayyavarlu remain one — bound by shared customs, language, and a living cultural memory.':
    'రాష్ట్రాలు, దేశాలుగా విస్తరించినా బుక్క అయ్యవార్లు ఒకటిగానే ఉంటారు — ఉమ్మడి ఆచారాలు, భాష, సజీవ సాంస్కృతిక జ్ఞాపకాలతో బంధించబడి.',
  'Whether you are a proud member of the Bukka Ayyavarlu community or someone drawn to our heritage — this is your home. Join us in preserving, celebrating, and continuing a legacy that spans millennia.':
    'మీరు బుక్క అయ్యవార్ల సమాజ సభ్యులైనా, మన వారసత్వంపై ఆసక్తి ఉన్నవారైనా — ఇది మీ ఇల్లు. వేల సంవత్సరాల వారసత్వాన్ని కాపాడుతూ, జరుపుకుంటూ, కొనసాగించడంలో మాతో చేరండి.',
  Email: 'ఈమెయిల్',
  Password: 'పాస్‌వర్డ్',
  'Confirm password': 'పాస్‌వర్డ్‌ను నిర్ధారించండి',
  'First name': 'పేరు',
  'Last name': 'ఇంటి పేరు',
  'Date of birth': 'పుట్టిన తేదీ',
  'Place of birth': 'పుట్టిన స్థలం',
  'Current location': 'ప్రస్తుత నివాసం',
  City: 'నగరం',
  'Registration region': 'నమోదు ప్రాంతం',
  'Current country': 'ప్రస్తుత దేశం',
  "Father's name": 'తండ్రి పేరు',
  "Mother's name": 'తల్లి పేరు',
  'Contact number': 'ఫోన్ నంబర్',
  'Already have an account?': 'ఇప్పటికే ఖాతా ఉందా?',
  'Log in': 'లాగిన్ చేయండి',
  'Create account': 'ఖాతా సృష్టించండి',
  'Community Portal': 'సమాజ పోర్టల్',
  Welcome: 'స్వాగతం',
  India: 'భారతదేశం',
  'United States': 'అమెరికా',
  Home: 'హోమ్',
  Chat: 'చాట్',
  'Log out': 'లాగ్ అవుట్',
  Settings: 'సెట్టింగులు',
  Cancel: 'రద్దు చేయండి',
  'Account Settings': 'ఖాతా సెట్టింగులు',
  'Need help? Contact us': 'సహాయం కావాలా? మమ్మల్ని సంప్రదించండి',
  'Your message will open in your email client. We will respond as soon as possible.':
    'మీ ఈమెయిల్ యాప్‌లో సందేశం తెరుచుకుంటుంది. వీలైనంత త్వరగా స్పందిస్తాము.',
  'Send a message': 'సందేశం పంపండి',
  'Send message': 'సందేశం పంపండి',
  'Your name': 'మీ పేరు',
  Region: 'ప్రాంతం',
  Subject: 'విషయం',
  Message: 'సందేశం',
  'Select region': 'ప్రాంతాన్ని ఎంచుకోండి',
  'General enquiries': 'సాధారణ విచారణలు',
  Phone: 'ఫోన్',
  'Registered address': 'నమోదిత చిరునామా',
  'Bukka Ayyavarlu Community Trust': 'బుక్క అయ్యవార్ల సమాజ ట్రస్ట్',
  'Bukka Ayyavarlu Community (US)': 'బుక్క అయ్యవార్ల సమాజం (అమెరికా)',
  '[Address line 1]': '[చిరునామా వరుస 1]',
  '[City], [State] – [PIN]': '[నగరం], [రాష్ట్రం] – [పిన్]',
  '[City], [State] [ZIP]': '[నగరం], [రాష్ట్రం] [జిప్ కోడ్]',
  Address: 'చిరునామా',
  'Member registration': 'సభ్యత్వ నమోదు',
  'Get in touch': 'మమ్మల్ని సంప్రదించండి',
  'Whether you have questions about the community, wish to register as a member, or want to connect with fellow Bukka Ayyavarlu — we are here to help. We serve members in India and the United States. Reach out through the details below or send us a message.':
    'సమాజం గురించి ప్రశ్నలు ఉన్నా, సభ్యుడిగా నమోదు కావాలన్నా లేదా తోటి బుక్క అయ్యవార్లతో అనుసంధానం కావాలన్నా — మేము సహాయం చేస్తాము. భారతదేశం, అమెరికాలోని సభ్యులకు సేవలందిస్తున్నాం. దిగువ వివరాల ద్వారా లేదా సందేశం పంపి మమ్మల్ని సంప్రదించండి.',
  'For membership, events, and general information.': 'సభ్యత్వం, కార్యక్రమాలు, సాధారణ సమాచారం కోసం.',
  'Mon–Sat, 10:00 AM – 6:00 PM IST': 'సోమ–శని, ఉదయం 10:00 – సాయంత్రం 6:00 IST',
  'Mon–Fri, 9:00 AM – 5:00 PM EST': 'సోమ–శుక్ర, ఉదయం 9:00 – సాయంత్రం 5:00 EST',
  'New members from India or the US can register online via the Registration page. Select your country during registration. For assistance with the process or verification, use the contact email for your region above.':
    'భారతదేశం లేదా అమెరికా నుంచి కొత్త సభ్యులు నమోదు పేజీ ద్వారా ఆన్‌లైన్‌లో నమోదు చేసుకోవచ్చు. నమోదు సమయంలో దేశాన్ని ఎంచుకోండి. సహాయం లేదా ధృవీకరణ కోసం, మీ ప్రాంతానికి సంబంధించిన పై ఈమెయిల్‌ను ఉపయోగించండి.',
  'Full name': 'పూర్తి పేరు',
  'Brief subject': 'విషయాన్ని సంక్షిప్తంగా రాయండి',
  'Your message…': 'మీ సందేశం…',
  'Spring break family picnic': 'వసంత విరామ కుటుంబ వనభోజనం',
  'Members only': 'సభ్యులకు మాత్రమే',
  'Access restricted': 'ప్రవేశం పరిమితం',
  'India region': 'భారత ప్రాంతం',
  'USA region': 'అమెరికా ప్రాంతం',
  'Verifying your community region…': 'మీ సమాజ ప్రాంతాన్ని నిర్ధారిస్తున్నాం…',
  'Sign in to view regional news': 'ప్రాంతీయ వార్తలు చూడటానికి సైన్ ఇన్ చేయండి',
  'Go to login': 'లాగిన్‌కు వెళ్లండి',
  'Return to profile': 'ప్రొఫైల్‌కు తిరిగి వెళ్లండి',
  'Regional authentication conflict': 'ప్రాంతీయ ఖాతా ధృవీకరణ సమస్య',
  Profile: 'ప్రొఫైల్',
  Location: 'నివాసం',
  Parents: 'తల్లిదండ్రులు',
  Father: 'తండ్రి',
  Mother: 'తల్లి',
  'Not set': 'సెట్ చేయలేదు',
  'Community support': 'సమాజ సహాయం',
  'Ask a question or start a conversation.': 'ప్రశ్న అడగండి లేదా సంభాషణ ప్రారంభించండి.',
  'Send a message to start the conversation.': 'సంభాషణ ప్రారంభించడానికి సందేశం పంపండి.',
  'Type a message…': 'సందేశం టైప్ చేయండి…',
  Send: 'పంపండి',
  'Network error. Is the API running?': 'నెట్‌వర్క్ సమస్య. API నడుస్తోందో చూడండి.',
  'Your Profile': 'మీ ప్రొఫైల్',
  'Signed in as': 'లాగిన్ అయిన ఖాతా',
  'Member since': 'సభ్యత్వ ప్రారంభం',
  'Sign out of this account': 'ఈ ఖాతా నుంచి సైన్ అవుట్ చేయండి',
  'Edit profile': 'ప్రొఫైల్ సవరించండి',
  'Saving…': 'సేవ్ అవుతోంది…',
  'Save changes': 'మార్పులను సేవ్ చేయండి',
  'Creating account…': 'ఖాతా సృష్టిస్తోంది…',
  'Passwords do not match': 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు',
  'Password must be at least 8 characters': 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి',
  'Select India or United States as your region': 'ప్రాంతంగా భారతదేశం లేదా అమెరికాను ఎంచుకోండి',
  'Don’t have an account?': 'ఖాతా లేదా?',
  'Back to home': 'హోమ్‌కు తిరిగి వెళ్లండి',
  'Welcome to our community': 'మన సమాజానికి స్వాగతం',
  'Please sign in with your India community account to continue.': 'కొనసాగించడానికి మీ భారత సమాజ ఖాతాతో సైన్ ఇన్ చేయండి.',
  'Please sign in with your USA community account to continue.': 'కొనసాగించడానికి మీ అమెరికా సమాజ ఖాతాతో సైన్ ఇన్ చేయండి.',
  'Festival calendar': 'పండుగల క్యాలెండర్',
  'India holiday observances': 'భారత సెలవుల విశేషాలు',
  'Plan ahead': 'ముందుగా ప్రణాళిక చేసుకోండి',
  'Families are preparing for Ugadi, Diwali, and other sacred holidays with prayer, temple visits, and community meals. Watch this space for local gathering details.':
    'ఉగాది, దీపావళి వంటి పర్వదినాలను ప్రార్థనలు, ఆలయ సందర్శనలు, సమాజ విందులతో జరుపుకునేందుకు కుటుంబాలు సిద్ధమవుతున్నాయి. స్థానిక సమావేశాల వివరాల కోసం ఈ పేజీని చూడండి.',
  'Family gathering': 'కుటుంబ సమావేశం',
  'Registration opening soon': 'నమోదు త్వరలో ప్రారంభమవుతుంది',
  'Join fellow families for a spring break picnic with devotional songs, traditional games, shared food, and children’s activities. India-region members will receive the venue and schedule by email.':
    'భక్తి పాటలు, సంప్రదాయ ఆటలు, విందు భోజనం, పిల్లల కార్యక్రమాలతో జరిగే వసంత విరామ వనభోజనానికి కుటుంబాలతో కలిసి రండి. ప్రదేశం, సమయ వివరాలు భారత ప్రాంత సభ్యులకు ఈమెయిల్ ద్వారా పంపబడతాయి.',
  'Temple life': 'ఆలయ జీవనం',
  'Gathering in devotion': 'భక్తితో సమాగమం',
  'Community update': 'సమాజ సమాచారం',
  'Members and families continue to preserve prayer, festival, and temple traditions across Andhra Pradesh and Telangana.':
    'ఆంధ్రప్రదేశ్, తెలంగాణ అంతటా సభ్యులు, కుటుంబాలు ప్రార్థన, పండుగ, ఆలయ సంప్రదాయాలను కాపాడుతున్నారు.',
  'Passing wisdom forward': 'జ్ఞానాన్ని తరువాతి తరాలకు అందించడం',
  'Elders and young members are creating new opportunities to share Telugu heritage, stories, and sacred customs.':
    'తెలుగు వారసత్వం, కథలు, పవిత్ర ఆచారాలను పంచుకునేందుకు పెద్దలు, యువ సభ్యులు కొత్త అవకాశాలను సృష్టిస్తున్నారు.',
  'India Community News': 'భారత సమాజ వార్తలు',
  'Faith, family, and service across our homeland': 'మన మాతృభూమిలో భక్తి, కుటుంబం, సేవ',
  'Holiday calendar': 'పండుగల క్యాలెండర్',
  'USA holiday observances': 'అమెరికా సెలవుల విశేషాలు',
  'Members are planning community gatherings around Independence Day, Thanksgiving, and the holiday season while honoring our shared religious traditions.':
    'మన ఉమ్మడి మత సంప్రదాయాలను గౌరవిస్తూ స్వాతంత్ర్య దినోత్సవం, థాంక్స్‌గివింగ్, పండుగల కాలంలో సమాజ సమావేశాలకు సభ్యులు ప్రణాళిక చేస్తున్నారు.',
  'Bring the family for a spring break picnic with prayer, cultural activities, traditional games, and a community potluck. USA-region members will receive the venue and schedule by email.':
    'ప్రార్థనలు, సాంస్కృతిక కార్యక్రమాలు, సంప్రదాయ ఆటలు, అందరూ పంచుకునే విందుతో జరిగే వసంత విరామ వనభోజనానికి కుటుంబంతో రండి. ప్రదేశం, సమయ వివరాలు అమెరికా ప్రాంత సభ్యులకు ఈమెయిల్ ద్వారా పంపబడతాయి.',
  'Growing together': 'కలిసి ఎదుగుదాం',
  'Our US members are building welcoming gatherings that keep family, devotion, and cultural memory close to home.':
    'కుటుంబం, భక్తి, సాంస్కృతిక జ్ఞాపకాలను దగ్గరగా ఉంచే ఆత్మీయ సమావేశాలను అమెరికా సభ్యులు నిర్వహిస్తున్నారు.',
  'A spirit of seva': 'సేవాభావం',
  'Community volunteers are connecting families through service, hospitality, and celebrations throughout the year.':
    'సమాజ స్వచ్ఛంద సేవకులు ఏడాది పొడవునా సేవ, ఆతిథ్యం, వేడుకల ద్వారా కుటుంబాలను అనుసంధానిస్తున్నారు.',
  'USA Community News': 'అమెరికా సమాజ వార్తలు',
  'Faith and fellowship for families across America': 'అమెరికా అంతటా కుటుంబాల భక్తి, స్నేహబంధం',
  'Manage your community account and keep your profile information up to date.':
    'మీ సమాజ ఖాతాను నిర్వహించి, ప్రొఫైల్ వివరాలను నవీకరించండి.',
  Menu: 'మెను',
  'Close menu': 'మెనును మూసివేయండి',
  'Your community region': 'మీ సమాజ ప్రాంతం',
  Admin: 'నిర్వాహకుడు',
  'Community members': 'సమాజ సభ్యులు',
  'Your community, wherever you are': 'మీరు ఎక్కడున్నా మీ సమాజం',
  'Sign in to see the community news, gatherings, and resources for your registered region.':
    'మీరు నమోదు చేసిన ప్రాంతానికి సంబంధించిన సమాజ వార్తలు, సమావేశాలు, వనరులను చూడటానికి సైన్ ఇన్ చేయండి.',
  'Sign in with your India account to view India contact information.':
    'భారత సంప్రదింపు వివరాలను చూడటానికి మీ భారత ఖాతాతో సైన్ ఇన్ చేయండి.',
  'Sign in with your USA account to view USA contact information.':
    'అమెరికా సంప్రదింపు వివరాలను చూడటానికి మీ USA ఖాతాతో సైన్ ఇన్ చేయండి.',
  'This contact information is assigned to another region.':
    'ఈ సంప్రదింపు సమాచారం మరొక ప్రాంతానికి కేటాయించబడింది.',
  'Unable to verify regional access. Please try again later.':
    'ప్రాంతీయ అనుమతిని నిర్ధారించలేకపోయాం. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.',
  'No regional updates have been published yet.': 'ఈ ప్రాంతానికి ఇంకా వార్తలు ప్రచురించబడలేదు.',
  'Loading administrator tools…': 'నిర్వాహక సాధనాలు లోడ్ అవుతున్నాయి…',
  'Restricted area': 'పరిమిత ప్రాంతం',
  'Administrator access required': 'నిర్వాహక అనుమతి అవసరం',
  'This account does not have permission to manage the community site.':
    'ఈ ఖాతాకు సమాజ వెబ్‌సైట్‌ను నిర్వహించే అనుమతి లేదు.',
  'Community administration': 'సమాజ నిర్వహణ',
  'Administrator dashboard': 'నిర్వాహక డ్యాష్‌బోర్డ్',
  'Manage member access, regional updates, and site settings.':
    'సభ్యుల అనుమతులు, ప్రాంతీయ వార్తలు, వెబ్‌సైట్ సెట్టింగ్‌లను నిర్వహించండి.',
  'Access control': 'ప్రవేశ నియంత్రణ',
  'Members and roles': 'సభ్యులు మరియు పాత్రలు',
  members: 'సభ్యులు',
  Member: 'సభ్యుడు',
  Role: 'పాత్ర',
  Joined: 'చేరిన తేదీ',
  'Member access updated.': 'సభ్యుని అనుమతులు నవీకరించబడ్డాయి.',
  'Unable to update member access': 'సభ్యుని అనుమతులను నవీకరించలేకపోయాం',
  'Regional publishing': 'ప్రాంతీయ ప్రచురణ',
  'News and announcements': 'వార్తలు మరియు ప్రకటనలు',
  'Add regional content': 'ప్రాంతీయ కంటెంట్‌ను జోడించండి',
  'Content type': 'కంటెంట్ రకం',
  Category: 'వర్గం',
  Title: 'శీర్షిక',
  'Date or status': 'తేదీ లేదా స్థితి',
  Details: 'వివరాలు',
  Publishing: 'ప్రచురిస్తోంది',
  Publish: 'ప్రచురించండి',
  'Regional content published.': 'ప్రాంతీయ కంటెంట్ ప్రచురించబడింది.',
  'Unable to publish content': 'కంటెంట్‌ను ప్రచురించలేకపోయాం',
  'Publishing…': 'ప్రచురిస్తోంది…',
  'Regional content saved.': 'ప్రాంతీయ కంటెంట్ సేవ్ చేయబడింది.',
  'Unable to save content': 'కంటెంట్‌ను సేవ్ చేయలేకపోయాం',
  'Regional content deleted.': 'ప్రాంతీయ కంటెంట్ తొలగించబడింది.',
  'Unable to delete content': 'కంటెంట్‌ను తొలగించలేకపోయాం',
  Published: 'ప్రచురించబడింది',
  Save: 'సేవ్ చేయండి',
  Delete: 'తొలగించండి',
  'No content has been added for this region yet.': 'ఈ ప్రాంతానికి ఇంకా కంటెంట్ జోడించబడలేదు.',
  'Site configuration': 'వెబ్‌సైట్ అమరికలు',
  'Site settings': 'వెబ్‌సైట్ సెట్టింగ్‌లు',
  'Allow new member registration': 'కొత్త సభ్యుల నమోదును అనుమతించండి',
  'Homepage notice': 'హోమ్‌పేజీ ప్రకటన',
  'Site settings saved.': 'వెబ్‌సైట్ సెట్టింగ్‌లు సేవ్ చేయబడ్డాయి.',
  'Unable to save site settings': 'వెబ్‌సైట్ సెట్టింగ్‌లను సేవ్ చేయలేకపోయాం',
  'Save settings': 'సెట్టింగ్‌లను సేవ్ చేయండి',
  'Administrator': 'నిర్వాహకుడు',
  'Registration is currently closed': 'ప్రస్తుతం సభ్యుల నమోదు నిలిపివేయబడింది',
  'English': 'ఇంగ్లీష్',
  'Telugu': 'తెలుగు',
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (englishText: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    document.cookie = `${LANGUAGE_KEY}=${nextLanguage}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    document.documentElement.lang = nextLanguage;
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback(
    (englishText: string) =>
      language === 'te' ? teluguTranslations[englishText] || englishText : englishText,
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return value;
}
