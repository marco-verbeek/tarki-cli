// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import figlet from 'figlet-promised';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import Table from 'cli-table';

import { ItemSearchResult } from 'tarki-definitions';
import { searchItems } from './requests.js';

const table = new Table({
  head: [
    'Name',
    'Market Price',
    'Trader Price',
    'Quests',
    'Crafts',
    'Barters',
    'Upgrades',
  ],
  colWidths: [20, 20, 20, 20, 20, 20, 20],
});

/**
 * Displays a stylized Tarki message in the console.
 */
async function welcome() {
  console.clear();

  const text = await figlet(`Tarki`);
  console.log(gradient.passion.multiline(text));

  console.log(table.toString());
}

/**
 * Asks the user to input the search query.
 * @returns The user-input search query as a string
 */
async function askSearchQuery(): Promise<string> {
  const prompt = await inquirer.prompt({
    name: 'search_query',
    type: 'input',
    message: 'Search query: ',
  });

  return prompt.search_query;
}

/**
 * Asks the users' input in order to fetch
 * the items using Tarki API.
 */
async function search() {
  const query = await askSearchQuery();
  const request = await searchItems(query);

  if (request.length > 1) {
    // select item from list
  }

  const item = request[0];
  addItemToTable(item);
}

function addItemToTable(item: ItemSearchResult) {
  const quests = item.quests
    .map((q) => `${q.itemQty}x for ${q.title}`)
    .join('\n');

  table.push([
    item.itemName,
    `${item.prices.market.price} RUB`,
    `${item.prices.trader.price} RUB @ ${item.prices.trader.name}`,
    quests,
    'Crafts',
    'Barters',
    'Upgrades',
  ]);
}

async function test() {
  const a = await inquirer.prompt({
    name: 'test',
    type: 'input',
    message: 'Type comma-separated items: ',
  });

  table.push([a.test, '', '']);
}

/**
 * TODO
 */
async function menu() {
  await welcome();

  const command = await inquirer.prompt({
    name: 'selected',
    type: 'list',
    message: 'What would you like to do? \n',
    choices: [
      '🔎 Search Items',
      '🧼 Clear Table',
      '🔨 Test command',
      '❌ Quit CLI',
    ],
  });

  switch (command.selected) {
    case '🔎 Search Items':
      await search();
      break;
    case '🧼 Clear Table':
      table.splice(0, table.length);
      break;
    case '🔨 Test command':
      await test();
      break;
    case '❌ Quit CLI':
      process.exit(0);
  }

  await menu();
}

await menu();
