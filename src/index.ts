// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import figlet from 'figlet-promised';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import Table from 'cli-table';
import ora from 'ora';

import { ItemSearchResult } from 'tarki-definitions';
import { searchItems } from './requests.js';

const table = new Table({
  head: [
    'Name',
    'Market Price',
    'Trader Price',
    'Quests',
    //'Crafts',
    //'Barters',
    'Upgrades',
  ],
  colWidths: [25, 25, 25, 25, 25, 25, 25],
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'RUB',
  maximumSignificantDigits: 1,
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
  const spinner = ora('Requesting item data').start();

  const request = await searchItems(query);
  spinner.stop();

  if (request.length > 1) {
    // select item from list
  }

  const item = request[0];
  if (!item) return;

  addItemToTable(item);
}

function addItemToTable(item: ItemSearchResult) {
  const marketPrice =
    item.prices.market.price > 0
      ? formatter.format(item.prices.market.price)
      : 'Cannot be sold';

  const quests = item.quests
    .map((q) => `${q.itemQty}x for ${q.title}`)
    .join('\n');

  //const crafts = '';
  //const barters = ''; //item.barters.map((b) => `${b.rewardItems}`).join('\n');

  const upgrades = item.hideoutUpgrades
    .map((u) => `${u.name} level ${u.level}`)
    .join('\n');

  table.push([
    item.itemName,
    marketPrice,
    `${formatter.format(item.prices.trader.price)} @ ${
      item.prices.trader.name
    }`,
    quests,
    //crafts,
    //barters,
    upgrades,
  ]);
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
    choices: ['🔎 Search Items', '🧼 Clear Table', '❌ Quit CLI'],
  });

  // TODO: improve this
  switch (command.selected) {
    case '🔎 Search Items':
      await search();
      break;
    case '🧼 Clear Table':
      table.splice(0, table.length);
      break;
    case '❌ Quit CLI':
      process.exit(0);
  }

  await menu();
}

await menu();
