// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import figlet from 'figlet-promised';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import Table from 'cli-table';
import ora from 'ora';

import { searchItems } from './requests.js';

const table = new Table({
  head: ['Name', 'Market Price', 'Trader Price'],
  colWidths: [20, 20, 20],
});

/**
 * Displays a stylized Tarki message in the console.
 */
async function welcome() {
  console.clear();

  const text = await figlet(`Tarki`);
  console.log(gradient.passion.multiline(text) + '\n');

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
    message: 'Searched item: ',
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

  table.push([
    item.itemName,
    item.prices.market.price,
    `${item.prices.trader.price} @ ${item.prices.trader.name}`,
  ]);
}

async function test() {
  const a = await inquirer.prompt({
    name: 'test',
    type: 'list',
    message: 'Type comma-separated items',
  });

  console.log(a);

  // TODO: use enquirer instead of inquierer
  // TODO: use autocomplete for items
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
      'Test command',
      '❌ Quit CLI',
    ],
  });

  // TODO: improve this
  switch (command.selected) {
    case '🔎 Search Items':
      await search();
      break;
    case '🧼 Clear Table':
      table.splice(0, table.length);
      break;
    case 'Test command':
      await test();
      break;
    case '❌ Quit CLI':
      process.exit(0);
  }

  await menu();
}

await menu();
