/*
 * ReadyPH mock data (Valenzuela City).
 * EVERYTHING here is fictional sample data for an HCI class prototype:
 * capacities, addresses, distances, alerts. Center names are realistic-sounding
 * but not an official list. Do not use for real emergencies.
 */
window.READY = (function () {
  'use strict';

  /* Map coordinates are in the SVG viewBox (340 x 440). "You" sits on a street intersection. */
  const you = { x: 200, y: 310 };

  /* km = distance shown to the user (the schematic map is not to scale).
     updatedMins = "last updated by CDRRMO X min ago" at page load.
     fac = facilities: pwd, medical, pets, food. */
  const centers = [
    { id: 'malinta', name: 'Brgy. Malinta Covered Court', short: 'Malinta', address: 'Malinta Rd., Brgy. Malinta', km: 0.4,
      current: 250, max: 250, updatedMins: 3, x: 130, y: 310, fac: ['food'],
      tip: 'Stay on the raised sidewalk. The low side street is flooded.' },
    { id: 'dnhs', name: 'Dalandanan National High School', short: 'Dalandanan', address: 'Dalandanan Rd., Brgy. Dalandanan', km: 0.9,
      current: 140, max: 400, updatedMins: 5, x: 200, y: 230, fac: ['pwd', 'food', 'medical'],
      tip: 'Flat road with a ramp at the gate. Good for seniors with a cane.' },
    { id: 'marulas', name: 'Marulas Elementary School', short: 'Marulas', address: 'Gen. T. de Leon Rd., Brgy. Marulas', km: 1.2,
      current: 180, max: 450, updatedMins: 12, x: 270, y: 230, fac: ['pwd', 'food'],
      tip: 'Cross at the covered footbridge, not the low road.' },
    { id: 'karuhatan', name: 'Karuhatan Sports Complex', short: 'Karuhatan', address: 'Karuhatan Rd., Brgy. Karuhatan', km: 1.6,
      current: 460, max: 500, updatedMins: 8, x: 270, y: 150, fac: ['pwd', 'medical', 'pets', 'food'],
      tip: 'Higher ground. A medical team is on site.' },
    { id: 'pdb', name: 'Paso de Blas Multi-Purpose Hall', short: 'Paso de Blas', address: 'Tagalag Rd., Brgy. Paso de Blas', km: 2.1,
      current: 90, max: 300, updatedMins: 21, x: 270, y: 390, fac: ['pets', 'food'],
      tip: 'Pets are kept in the covered side area.' },
    { id: 'lingunan', name: 'Lingunan Barangay Gym', short: 'Lingunan', address: 'Maysan Rd., Brgy. Lingunan', km: 2.4,
      current: 240, max: 260, updatedMins: 15, x: 130, y: 150, fac: ['pwd', 'medical'],
      tip: 'The entrance is on the east side, away from the expressway.' },
    { id: 'vcsc', name: 'Valenzuela City Sports Complex', short: 'City Sports', address: 'Polo Rd., Brgy. Poblacion (Polo)', km: 2.9,
      current: 800, max: 1000, updatedMins: 6, x: 200, y: 70, fac: ['pwd', 'medical', 'pets', 'food'],
      tip: 'Largest center. Follow the volunteers in orange vests.' },
    { id: 'arkong', name: 'Arkong Bato Barangay Gym', short: 'Arkong Bato', address: 'Polo Rd., Brgy. Arkong Bato', km: 3.4,
      current: 150, max: 200, updatedMins: 30, x: 270, y: 70, fac: ['food', 'pwd'],
      tip: 'Use the side gate. The main gate may be crowded.' }
  ];

  /* Street names on the schematic map (sample layout, not geographically exact; used for generated directions). */
  const streets = {
    v: { 130: 'Maysan Rd.', 200: 'MacArthur Hwy.', 270: 'Gen. T. de Leon Rd.' },
    h: { 70: 'Polo Rd.', 150: 'Karuhatan Rd.', 230: 'Dalandanan Rd.', 310: 'Malinta Rd.', 390: 'Tagalag Rd.' }
  };

  /* Only 911 (national emergency) is real. SAMPLE – replace with official Valenzuela CDRRMO numbers.
     Every local number below is an obvious placeholder (0000 pattern), not a working line. */
  const hotlines = [
    { id: 'n911', name: 'National Emergency 911', desc: 'Police, fire and medical, nationwide', number: '911', tel: '911', verified: true, emergency: true },
    { id: 'cdrrmo', name: 'Valenzuela CDRRMO / Rescue', desc: 'City disaster office: rescue and shelters', number: '(02) 0000-0101', tel: '0200000101', verified: false, emergency: true }, // SAMPLE – replace with official Valenzuela CDRRMO numbers
    { id: 'bfp', name: 'BFP Valenzuela', desc: 'Bureau of Fire Protection: fire and rescue', number: '(02) 0000-0102', tel: '0200000102', verified: false }, // SAMPLE – replace with official numbers
    { id: 'pnp', name: 'PNP Valenzuela', desc: 'Police: peace and order, missing persons', number: '(02) 0000-0103', tel: '0200000103', verified: false }, // SAMPLE – replace with official numbers
    { id: 'health', name: 'Valenzuela City Health Office', desc: 'Medicine, first aid, outbreaks', number: '(02) 0000-0104', tel: '0200000104', verified: false }, // SAMPLE – replace with official numbers
    { id: 'vmc', name: 'Valenzuela Medical Center', desc: 'Hospital emergency room', number: '(02) 0000-0105', tel: '0200000105', verified: false }, // SAMPLE – replace with official numbers
    { id: 'brgy', name: 'Brgy. Malanday Hall', desc: 'Your barangay: tanod and relief goods', number: '(02) 0000-0106', tel: '0200000106', verified: false } // SAMPLE – replace with official numbers
  ];

  /* sev: warning | advisory | info. mins = how long ago. */
  const alerts = [
    { id: 'a1', sev: 'warning', mins: 14, title: 'Typhoon Signal No. 3 – Tullahan River rising; residents of low-lying barangays (Tagalag, Coloong, Wawang Pulo, Isla) advised to evacuate',
      body: 'Strong winds and heavy rain are expected. The Tullahan River is rising.', todo: 'Families in low-lying barangays should go to an evacuation center now. Bring IDs, medicine and water.' },
    { id: 'a2', sev: 'warning', mins: 40, title: 'Mandatory evacuation: riverside areas of Brgy. Malanday and Brgy. Tagalag',
      body: 'The city ordered evacuation of homes close to the river.', todo: 'Leave now. Use the Find Nearest button. Seniors and PWD get priority at the gate.' },
    { id: 'a3', sev: 'advisory', mins: 95, title: 'Classes suspended, all levels',
      body: 'Classes in public and private schools are suspended until further notice.', todo: 'Some schools are being used as evacuation centers.' },
    { id: 'a4', sev: 'info', mins: 180, title: 'Relief packs available at Dalandanan National High School',
      body: 'Food and water packs are given out from 4 PM.', todo: 'Bring a valid ID or your barangay certificate.' }
  ];

  /* UI strings. Missing Filipino keys fall back to English. */
  const i18n = {
    en: {
      'nav.home': 'Home', 'nav.map': 'Map', 'nav.hotlines': 'Hotlines', 'nav.alerts': 'Alerts', 'nav.settings': 'Settings',
      'conn.online': 'Online – live data from CDRRMO', 'conn.offline': 'Offline – using saved data, updated {x}',
      'st.available': 'Available', 'st.almost': 'Almost Full', 'st.full': 'Full',
      'st.left': '{n} spaces left', 'st.none': 'No space left',
      'ago': '{x} ago', 'justNow': 'just now',
      'back': 'Back', 'cancel': 'Cancel', 'undo': 'Undo', 'close': 'Close',
      'home.loc': 'Your area: Brgy. Malanday, Valenzuela City', 'home.alert': 'Active alert',
      'home.find': 'Find Nearest Available Center', 'home.findSub': 'We check free space first, then show a safe route',
      'home.recent': 'Recent center', 'home.resume': 'Resume route',
      'home.qmap': 'Map & list', 'home.qcall': 'Call 911', 'home.qshare': 'Share my status',
      'home.nearby': 'Nearby centers', 'home.seeAll': 'See all', 'home.managed': 'Data managed by Valenzuela CDRRMO',
      'map.title': 'Evacuation centers', 'map.map': 'Map', 'map.list': 'List',
      'map.count': '{n} centers shown', 'map.tapPin': 'Tap a pin to see details.',
      'map.you': 'You', 'map.clear': 'Clear filters', 'map.cleared': 'Filters cleared', 'map.filter': 'Show only centers with',
      'map.none': 'No center has all of those facilities.', 'map.noneHelp': 'Remove one filter to see more centers.',
      'fac.pwd': 'PWD access', 'fac.medical': 'Medical aid', 'fac.pets': 'Pet-friendly', 'fac.food': 'Food & water',
      'fac.yes': 'Available', 'fac.no': 'Not available',
      'c.route': 'Get Safe Route', 'c.details': 'Details', 'c.pick': 'Go to {name} instead',
      'c.updated': 'Updated by CDRRMO {x}', 'c.saved': 'saved copy', 'c.walk': '{m} min walk',
      'c.walkSenior': 'About {m} min at a slow pace with a senior',
      'c.fullWarn': 'This center is full', 'c.fullWarnBody': 'You may be turned away at the gate. The nearest center with space is {name} ({km} km).',
      'c.goAnyway': 'Go anyway', 'c.share': 'Share my status', 'c.facilities': 'Facilities', 'c.info': 'Details',
      'near.title': 'Nearest available', 'near.loading': 'Checking the latest capacity…', 'near.loadingOff': 'Using saved data from {x}…',
      'near.closestFull': 'The closest center is full', 'near.skipped': 'Skipped because it is full.', 'near.best': 'Best choice for you',
      'near.others': 'Other centers with space', 'near.allFull': 'All centers are full right now.', 'near.allFullHelp': 'Call 911 or the city CDRRMO for help.',
      'route.title': 'Safe route', 'route.step': 'Step {a} of {b}', 'route.next': 'Next step', 'route.prev': 'Previous step',
      'route.arrive': "I've arrived", 'route.stop': 'Stop navigation', 'route.safe': 'Avoids flooded roads · no stairs',
      'route.leaveTitle': 'Leave navigation?', 'route.leaveBody': 'Your route is still active. You can keep it saved and come back, or stop it.',
      'route.stay': 'Stay on route', 'route.keep': 'Leave, keep route', 'route.stopConfirm': 'Stop navigation',
      'route.stopped': 'Navigation stopped', 'route.paused': 'Navigating to {name}', 'route.resume': 'Resume',
      'arr.title': "You've arrived", 'arr.sub': 'You are at {name}. Stay calm and follow the volunteers.',
      'arr.next': 'What to do next', 'arr.n1': 'Check in with the barangay volunteer at the entrance.',
      'arr.n2': 'Register everyone in your family at the help desk.', 'arr.n3': 'Ask for the priority area for seniors and PWD.',
      'arr.n4': 'Tell your family you are safe.', 'arr.home': 'Back to Home',
      'share.title': 'Share my status', 'share.where': 'Which center are you at?', 'share.msg': 'Your message (you can edit it)',
      'share.sms': 'Send by SMS', 'share.share': 'Share…', 'share.copy': 'Copy message', 'share.reset': 'Reset message',
      'share.note': 'No account needed. ReadyPH sends nothing by itself: you choose who gets the message.',
      'share.smsOk': 'Opening your messaging app', 'share.shared': 'Shared. Thank you for letting them know.', 'share.copied': 'Message copied. Paste it in any app.',
      'share.copyFail': 'Could not copy. Select the text and copy it by hand.', 'share.resetOk': 'Message reset',
      'hot.title': 'City hotlines', 'hot.sub': 'Tap Call to dial. Standard call rates may apply.', 'hot.note': 'Numbers shown are for prototype demo.', 'hot.call': 'Call', 'hot.sample': 'Sample number',
      'alerts.title': 'Disaster alerts', 'alerts.sub': 'From Valenzuela CDRRMO and PAGASA (sample)', 'alerts.todo': 'What to do',
      'sev.warning': 'Warning', 'sev.advisory': 'Advisory', 'sev.info': 'Info',
      'set.title': 'Settings', 'set.size': 'Text size', 'set.size.normal': 'Normal', 'set.size.large': 'Large', 'set.size.xl': 'Extra large',
      'set.lang': 'Language', 'set.contrast': 'High contrast', 'set.contrastHelp': 'Darker text and stronger borders',
      'set.offline': 'Offline mode (demo)', 'set.offlineHelp': 'Pretend there is no signal. The app keeps working with saved data.',
      'set.replay': 'Replay onboarding', 'set.demo': 'Prototype: all data is sample data.', 'set.on': 'On', 'set.off': 'Off', 'set.display': 'Display', 'set.demoTools': 'Demo tools',
      'toast.offlineOn': 'Offline mode on. Showing saved data.', 'toast.offlineOff': 'Back online. Data refreshed.',
      'toast.lang': 'Language: English', 'toast.unpinned': 'Pinned center removed', 'pin.label': 'Your center', 'pin.remove': 'Remove pinned center',
      'ob.step': 'Step {a} of {b}', 'ob.skip': 'Skip', 'ob.next': 'Next',
      'ob.cityTitle': 'Choose your city', 'ob.cityBody': 'Each city’s disaster office manages its own centers and updates.',
      'ob.soon': 'coming soon', 'ob.locTitle': 'Allow your location', 'ob.locBody': 'We use it only to find the closest center. You can also choose your barangay by hand.',
      'ob.locAllow': 'Allow location', 'ob.locLater': 'Not now', 'ob.locOk': 'Location allowed (demo)',
      'ob.dlTitle': 'Download offline data', 'ob.dlBody': 'Save centers, the map and hotlines so they work without signal. About 2 MB.',
      'ob.dl': 'Download now', 'ob.dlCancel': 'Cancel download', 'ob.dlDone': 'Ready. ReadyPH works offline now.', 'ob.start': 'Start using ReadyPH',
      'ob.skipped': 'Setup skipped. You can replay it in Settings.'
    },
    fil: {
      'nav.home': 'Home', 'nav.map': 'Mapa', 'nav.hotlines': 'Hotline', 'nav.alerts': 'Babala', 'nav.settings': 'Setting',
      'conn.online': 'Online – live na datos mula sa CDRRMO', 'conn.offline': 'Offline – naka-save na datos, huling update {x}',
      'st.available': 'May Espasyo', 'st.almost': 'Halos Puno', 'st.full': 'Puno',
      'st.left': '{n} pang espasyo', 'st.none': 'Wala nang espasyo',
      'ago': '{x} na ang nakaraan', 'justNow': 'ngayon lang',
      'back': 'Bumalik', 'cancel': 'Kanselahin', 'undo': 'I-undo', 'close': 'Isara',
      'home.loc': 'Lugar mo: Brgy. Malanday, Valenzuela City', 'home.alert': 'Aktibong babala',
      'home.find': 'Hanapin ang Pinakamalapit na Bakanteng Center', 'home.findSub': 'Sinusuri muna namin ang espasyo, saka ang ligtas na daan',
      'home.recent': 'Huling center', 'home.resume': 'Ituloy ang ruta',
      'home.qmap': 'Mapa at listahan', 'home.qcall': 'Tawagan ang 911', 'home.qshare': 'Ibahagi ang kalagayan ko',
      'home.nearby': 'Mga center na malapit', 'home.seeAll': 'Lahat', 'home.managed': 'Pinamamahalaan ng Valenzuela CDRRMO',
      'map.title': 'Mga evacuation center', 'map.map': 'Mapa', 'map.list': 'Listahan',
      'map.count': '{n} center ang makikita', 'map.tapPin': 'Pindutin ang pin para sa detalye.',
      'map.you': 'Ikaw', 'map.clear': 'Alisin ang filter', 'map.cleared': 'Naalis ang mga filter', 'map.filter': 'Ipakita lang ang may',
      'map.none': 'Walang center na may lahat ng iyan.', 'map.noneHelp': 'Mag-alis ng isang filter para dumami ang makita.',
      'fac.pwd': 'Para sa PWD', 'fac.medical': 'Tulong medikal', 'fac.pets': 'Pwede ang alaga', 'fac.food': 'Pagkain at tubig',
      'fac.yes': 'Mayroon', 'fac.no': 'Wala',
      'c.route': 'Ligtas na Ruta', 'c.details': 'Detalye', 'c.pick': 'Pumunta sa {name} na lang',
      'c.updated': 'In-update ng CDRRMO {x}', 'c.saved': 'naka-save na kopya', 'c.walk': '{m} min lakad',
      'c.walkSenior': 'Mga {m} min kung mabagal ang lakad kasama ang senior',
      'c.fullWarn': 'Puno na ang center na ito', 'c.fullWarnBody': 'Baka hindi ka na papasukin. Pinakamalapit na may espasyo: {name} ({km} km).',
      'c.goAnyway': 'Ituloy pa rin', 'c.share': 'Ibahagi ang kalagayan ko', 'c.facilities': 'Mga pasilidad', 'c.info': 'Detalye',
      'near.title': 'Pinakamalapit na bakante', 'near.loading': 'Sinusuri ang pinakabagong espasyo…', 'near.loadingOff': 'Gamit ang naka-save na datos mula {x}…',
      'near.closestFull': 'Puno ang pinakamalapit na center', 'near.skipped': 'Nilaktawan dahil puno.', 'near.best': 'Pinakamainam para sa iyo',
      'near.others': 'Iba pang center na may espasyo', 'near.allFull': 'Puno ang lahat ng center ngayon.', 'near.allFullHelp': 'Tawagan ang 911 o ang CDRRMO.',
      'route.title': 'Ligtas na ruta', 'route.step': 'Hakbang {a} sa {b}', 'route.next': 'Susunod na hakbang', 'route.prev': 'Nakaraang hakbang',
      'route.arrive': 'Nakarating na ako', 'route.stop': 'Ihinto ang ruta', 'route.safe': 'Iwas-baha · walang hagdan',
      'route.leaveTitle': 'Aalis sa ruta?', 'route.leaveBody': 'Aktibo pa ang ruta mo. Pwede mo itong i-save at bumalik, o ihinto.',
      'route.stay': 'Manatili sa ruta', 'route.keep': 'Umalis, i-save ang ruta', 'route.stopConfirm': 'Ihinto ang ruta',
      'route.stopped': 'Natigil ang ruta', 'route.paused': 'Papunta sa {name}', 'route.resume': 'Ituloy',
      'arr.title': 'Nakarating ka na', 'arr.sub': 'Nasa {name} ka na. Huminahon at sundin ang mga volunteer.',
      'arr.next': 'Ano ang susunod', 'arr.n1': 'Mag-check in sa volunteer ng barangay sa pasukan.',
      'arr.n2': 'Ipatala ang buong pamilya sa help desk.', 'arr.n3': 'Hingin ang priority area para sa senior at PWD.',
      'arr.n4': 'Ipaalam sa pamilya na ligtas ka.', 'arr.home': 'Balik sa Home',
      'share.title': 'Ibahagi ang kalagayan ko', 'share.where': 'Saang center ka?', 'share.msg': 'Mensahe mo (pwedeng baguhin)',
      'share.sms': 'Ipadala sa SMS', 'share.share': 'Ibahagi…', 'share.copy': 'Kopyahin ang mensahe', 'share.reset': 'Ibalik ang mensahe',
      'share.note': 'Walang account. Walang ipinapadala ang ReadyPH nang kusa: ikaw ang pipili kung sino ang makakatanggap.',
      'share.smsOk': 'Binubuksan ang messaging app', 'share.shared': 'Naibahagi na. Salamat sa pagpapaalam.', 'share.copied': 'Nakopya. I-paste sa kahit anong app.',
      'share.copyFail': 'Hindi makopya. Piliin ang teksto at kopyahin nang mano-mano.', 'share.resetOk': 'Naibalik ang mensahe',
      'hot.title': 'Mga hotline ng lungsod', 'hot.sub': 'Pindutin ang Tawag para mag-dial.', 'hot.note': 'Numero para sa prototype demo lang.', 'hot.call': 'Tawag', 'hot.sample': 'Sample na numero',
      'alerts.title': 'Mga babala sa sakuna', 'alerts.sub': 'Mula sa Valenzuela CDRRMO at PAGASA (sample)', 'alerts.todo': 'Ano ang gagawin',
      'sev.warning': 'Babala', 'sev.advisory': 'Paalala', 'sev.info': 'Impormasyon',
      'set.title': 'Setting', 'set.size': 'Laki ng letra', 'set.size.normal': 'Normal', 'set.size.large': 'Malaki', 'set.size.xl': 'Pinakamalaki',
      'set.lang': 'Wika', 'set.contrast': 'Mataas na contrast', 'set.contrastHelp': 'Mas matingkad na letra at gilid',
      'set.offline': 'Offline mode (demo)', 'set.offlineHelp': 'Kunwari walang signal. Gumagana pa rin ang app gamit ang naka-save na datos.',
      'set.replay': 'Ulitin ang onboarding', 'set.demo': 'Prototype: sample lang ang lahat ng datos.', 'set.on': 'Naka-on', 'set.off': 'Naka-off', 'set.display': 'Display', 'set.demoTools': 'Mga gamit sa demo',
      'toast.offlineOn': 'Naka-on ang offline mode. Naka-save na datos ang gamit.', 'toast.offlineOff': 'Online na ulit. Na-refresh ang datos.',
      'toast.lang': 'Wika: Filipino', 'toast.unpinned': 'Tinanggal ang naka-pin na center', 'pin.label': 'Center mo', 'pin.remove': 'Alisin ang naka-pin na center',
      'ob.step': 'Hakbang {a} sa {b}', 'ob.skip': 'Laktawan', 'ob.next': 'Susunod',
      'ob.cityTitle': 'Piliin ang lungsod mo', 'ob.cityBody': 'Bawat lungsod ang may hawak ng sarili nitong mga center at update.',
      'ob.soon': 'malapit na', 'ob.locTitle': 'Payagan ang lokasyon', 'ob.locBody': 'Gagamitin lang ito para hanapin ang pinakamalapit na center. Pwede ring pumili ng barangay.',
      'ob.locAllow': 'Payagan ang lokasyon', 'ob.locLater': 'Mamaya na', 'ob.locOk': 'Pinayagan ang lokasyon (demo)',
      'ob.dlTitle': 'I-download ang offline na datos', 'ob.dlBody': 'I-save ang mga center, mapa at hotline para gumana kahit walang signal. Mga 2 MB.',
      'ob.dl': 'I-download na', 'ob.dlCancel': 'Ihinto ang download', 'ob.dlDone': 'Handa na. Gumagana na ang ReadyPH offline.', 'ob.start': 'Simulan ang ReadyPH',
      'ob.skipped': 'Nilaktawan ang setup. Pwede itong ulitin sa Setting.'
    }
  };

  return { you: you, centers: centers, streets: streets, hotlines: hotlines, alerts: alerts, i18n: i18n };
})();
