/**
 * An array of backup contact objects used for restoring or initializing the contacts database.
 * Each object represents a single contact with properties for name, email, phone, color, and initials.
 * 
 * @constant
 * @type {Array<Object>}
 * @property {number}    .id       - The unique identifier of the contact.
 * @property {string}    .name     - The contact's full name.
 * @property {string}    .email    - The contact's email address.
 * @property {string}    .phone    - The contact's phone number.
 * @property {string}    .color    - A hex color code representing the contact's display color.
 * @property {string}    .initials - The contact's initials derived from the name.
 */

let backupContacts = [
  {
    color: "#01687E",
    email: "alf.shumway@mailbox.org",
    id: 1,
    initials: "AS",
    name: "Alf Shumway",
    phone: "0176-8165542",
  },
  {
    color: "#3f8d33",
    email: "bob.marley@gmail.com",
    id: 2,
    initials: "BM",
    name: "Bob Marley",
    phone: "0152-3456692",
  },
  {
    color: "#ED4F01",
    email: "charlie.chaplin@web.de",
    id: 3,
    initials: "CC",
    name: "Charlie Chaplin",
    phone: "0178-3412342",
  },
  {
    color: "#f4b942",
    email: "charlie.brown@peanuts.com",
    id: 4,
    initials: "CB",
    name: "Charlie Brown",
    phone: "0157-2233445",
  },
  {
    color: "#9127a7",
    email: "dalai.lama@gmail.com",
    id: 5,
    initials: "DL",
    name: "Dalai Lama",
    phone: "0159-9341234",
  },
  {
    color: "#fd954f",
    email: "homer.simpson@moes.com",
    id: 6,
    initials: "HS",
    name: "Homer Simpson",
    phone: "0156-3349946",
  },
  {
    color: "#ff8fab",
    email: "heidi.alp@bergwelt.ch",
    id: 7,
    initials: "HA",
    name: "Heidi Alp",
    phone: "0162-5511223",
  },
  {
    color: "#4bd30c",
    email: "linus.torvalds@linux.org",
    id: 8,
    initials: "LT",
    name: "Linus Torvalds",
    phone: "0172-3418343",
  },
  {
    color: "#2ec4b6",
    email: "lara.croft@adventure.uk",
    id: 9,
    initials: "LC",
    name: "Lara Croft",
    phone: "0179-6644221",
  },
  {
    color: "#fd954f",
    email: "honey.love@gmx.net",
    id: 10,
    initials: "WP",
    name: "Winnie Puuh",
    phone: "0159-3777328",
  },
];
