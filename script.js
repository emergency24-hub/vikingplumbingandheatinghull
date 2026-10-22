// COMPANY DETAILS — edit only this object to update the whole website.
const COMPANY = {
  name: 'Viking Plumbing And Heating Hull Ltd',
  phone: '07520 659236', // UK format; the clickable +44 number is generated automatically.
  email: 'info@vikingplumbingandheatinghull.co.uk',
  address: 'Flat 9 St James Court, Lock Keepers Court, Hull, England, HU9 1RF',
  companyNumber: '17450472',
  shortName: 'Viking',
  brandName: 'Viking Plumbing & Heating',
  town: 'Hull',
  region: 'East Yorkshire'
};

// Update brand and location wording in headings, navigation and image labels too.
const wording = [
  ['Viking Plumbing & Heating', COMPANY.brandName],
  ['VIKING PLUMBING & HEATING', COMPANY.brandName.toUpperCase()],
  ['East Yorkshire', COMPANY.region], ['EAST YORKSHIRE', COMPANY.region.toUpperCase()],
  ['Viking', COMPANY.shortName], ['Hull', COMPANY.town], ['HULL', COMPANY.town.toUpperCase()]
];
const updateWording = text => wording.reduce((value, [original, replacement]) => value.split(original).join(replacement), text);
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
let node;
while ((node = walker.nextNode())) {
  if (!['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) node.nodeValue = updateWording(node.nodeValue);
}
document.querySelectorAll('[alt], [aria-label]').forEach(element => {
  ['alt', 'aria-label'].forEach(attribute => {
    if (element.hasAttribute(attribute)) element.setAttribute(attribute, updateWording(element.getAttribute(attribute)));
  });
});

const digits = COMPANY.phone.replace(/[^\d+]/g, '');
const internationalPhone = digits.startsWith('0') ? '+44' + digits.slice(1) : digits;
document.querySelectorAll('[data-company]').forEach(element => {
  element.textContent = COMPANY[element.dataset.company] ?? '';
});
document.querySelectorAll('[data-phone-link]').forEach(link => {
  link.href = 'tel:' + internationalPhone;
});
document.querySelectorAll('[data-email-link]').forEach(link => {
  link.href = 'mailto:' + COMPANY.email;
});
document.title = `${COMPANY.name} | Call ${COMPANY.phone}`;
document.querySelector('meta[name="description"]').content = `Plumbing and heating in ${COMPANY.town} and ${COMPANY.region}. Call ${COMPANY.name} on ${COMPANY.phone} to book.`;

const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.querySelector('header').classList.toggle('nav-open', open);
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('header').classList.remove('nav-open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Open menu');
}));
document.getElementById('year').textContent = new Date().getFullYear();

// Search and social metadata stay aligned with shared company contact settings.
const SEO_PAGES = {"index.html":{"title":"Plumber & Heating Services in Hull | Viking Plumbing","description":"Plumbing, heating repairs and bathroom plumbing in Hull and East Yorkshire. Call Viking Plumbing And Heating Hull Ltd on 07520 659236 to book."}};
const pageFile = location.pathname.split('/').pop() || 'index.html';
const pageSEO = SEO_PAGES[pageFile] || SEO_PAGES['index.html'];
document.title = pageSEO.title;
document.querySelector('meta[name="description"]').content = pageSEO.description;
const structuredData = document.getElementById('business-schema');
if (structuredData) {
 const schema = JSON.parse(structuredData.textContent);
 const business = schema['@graph'].find(item => item['@type'] === 'Plumber');
 business.name = COMPANY.name;
 business.telephone = COMPANY.phone.replace(/[^+\d]/g, '').replace(/^0/, '+44');
 business.email = COMPANY.email;
 business.identifier.value = COMPANY.companyNumber;
 structuredData.textContent = JSON.stringify(schema);
}
