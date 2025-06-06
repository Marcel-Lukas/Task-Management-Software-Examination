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
    email: "adalove99@mailbox.org",
    id: 1,
    initials: "AL",
    name: "Ada Lovelace",
    phone: "0176-8165542",
  },
  {
    color: "#59C248",
    email: "bill67@microsoft.com",
    id: 2,
    initials: "BG",
    name: "Bill Gates",
    phone: "0152-3456692",
  },
  {
    color: "#ED4F01",
    email: "rocketman777@spacex.org",
    id: 3,
    initials: "EM",
    name: "Elon Musk",
    phone: "0178-3412342",
  },
  {
    color: "#1C7B2B",
    email: "jeff69@gmail.com",
    id: 4,
    initials: "JB",
    name: "Jeff Bezos",
    phone: "0159-9341234",
  },
  {
    color: "#523C5A",
    email: "linus.torvalds@gmail.com",
    id: 5,
    initials: "LT",
    name: "Linus Torvalds",
    phone: "0172-3418343",
  },
  {
    color: "#59C248",
    email: "zuckerguy99@facebook.com",
    id: 6,
    initials: "MZ",
    name: "Mark Zuckerberg",
    phone: "0151-3472311",
  },
  {
    color: "#BA6C74",
    email: "satya.nadella@mailbox.org",
    id: 7,
    initials: "SN",
    name: "Satya Nadella",
    phone: "0160-3414322",
  },
  {
    color: "#130994",
    email: "stevhot72@apple.com",
    id: 8,
    initials: "SJ",
    name: "Steve Jobs",
    phone: "0170-1234123",
  },
  {
    color: "#2A3A33",
    email: "sundarpi29@gmail.com",
    id: 9,
    initials: "SP",
    name: "Sundar Pichai",
    phone: "0156-3349946",
  },
  {
    color: "#FD5B4F",
    email: "tim.berner731@gmx.net",
    id: 10,
    initials: "TB",
    name: "Tim Berners-Lee",
    phone: "0159-3777328",
  },
];
