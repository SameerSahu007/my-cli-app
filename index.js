#!usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from 'gradient-string';
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createPromptModule } from "inquirer";
import { getallCountries, getallCapitals, getallLandLocked } from './utils/country.js'
import ora from 'ora';

let game_name;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow('Welcome to Geography Quiz \n')
  await sleep()
  rainbowTitle.stop();
}

async function chooseGame() {
  const answers = await inquirer.prompt({
    name: 'name',
    type: 'list',
    message: 'Which game you want to play? \n',
    choices: [
      'Name n number of countries',
      'Name capitals of differenct countries',
      'Tell whether a country is landlocked or not.',
      'Guess the countries starting with a specific letter',
    ],
  });
  return handleAnswers(answers.name);
}

function handleAnswers(answers) {
  switch (answers) {
    case 'Name n number of countries':
      gameOne();
      break;

    case 'Name capitals of differenct countries':
      gameTwo();
      break;

    case 'Tell whether a country is landlocked or not.':
      gameThree()
      break;

    case 'Guess the countries starting with a specific letter':
      gameFour()
      break;

    default:
      console.log('not a valid option')
  }
}

async function gameOne() {
  let countryCount = 0, strike = 0, score = 0;

  const spinner = ora('Fetching data').start();
  let country_lst = await getallCountries();
  spinner.succeed('Data fetched successfully');

  async function askCount() {
    const answers = await inquirer.prompt({
      name: 'count',
      type: 'input',
      message: 'How many countries can you name?',
      default() {
        return 0;
      },
    });
    countryCount = answers.count
  }
  await askCount()

  if (countryCount <= 0 || countryCount > country_lst.length) {
    console.log(chalk.red(`\n You cant choose a number less than 0 or greater than ${country_lst.len}`));
    return
  }
  console.log(chalk.green.bold(`\n  lets start you have to name ${countryCount} countries
  you can choose atmost three wrong answers 
  start writing :)`))

  while (strike <= 3 || score <= countryCount) {

    if (strike === 3) {
      console.log(chalk.bgRed(`\n You lost :\(`))
      return
    }
    else if (score == countryCount) {
      console.log(chalk.bgGreen(`\n You Won :\)`))
      return
    }

    let answer;
    async function askCountry() {
      const answers = await inquirer.prompt({
        name: 'userInput',
        type: 'input',
        message: 'Write the name of a country: ',
      });
      answer = answers.userInput
    }
    await askCountry()

    if (country_lst.includes(answer)) {
      score++
      country_lst = country_lst.filter(item => item !== answer);
      console.log(chalk.bgGreen.bold(`\n You are correct, Score: ${score}/${countryCount}`))
    }
    else {
      strike++;
      console.log(chalk.bgRed(`\n You are incorrect, Stike: ${strike}/3`))
    }

  }

}

async function gameTwo() {
  let capitalCount = 0, strike = 0, score = 0;

  const spinner = ora('Fetching data').start();
  let capitalMap = await getallCapitals();
  spinner.succeed('Data fetched successfully');

  async function askCount() {
    const answers = await inquirer.prompt({
      name: 'count',
      type: 'input',
      message: 'How many capitals can you name?',
    });
    capitalCount = answers.count
  }
  await askCount()

  if (capitalCount <= 0 || capitalCount > capitalMap.size) {
    console.log(chalk.red(`\n You cant choose a number less than 0 or greater than ${capitalMap.size}`));
    return
  }
  console.log(chalk.bgGreen.bold(`\n  lets start you have to name ${capitalCount} capitals
  you can choose atmost three wrong answers 
  start writing :)`))

  while (strike <= 3 || score <= capitalCount) {

    if (strike === 3) {
      console.log(chalk.bgRed(`\n You lost :\(`))
      return
    }
    else if (score == capitalCount) {
      console.log(chalk.bgGreen(`\n You Won :\)`))
      return
    }

    let answer;
    async function askCountry(country) {
      const answers = await inquirer.prompt({
        name: 'userInput',
        type: 'input',
        message: `What is the capital of ${country}: `,
      });
      answer = answers.userInput
    }

    function getRandomKey(map) {
      const keysArray = Array.from(map.keys());
      const randomIndex = Math.floor(Math.random() * keysArray.length);
      return keysArray[randomIndex];
    }
    const randomCountry = getRandomKey(capitalMap);
    await askCountry(randomCountry)

    if (capitalMap.get(randomCountry).includes(answer)) {
      score++
      capitalMap.delete(randomCountry)
      console.log(chalk.bgGreen.bold(`\n You are correct, Score: ${score}/${capitalCount}`))
    }
    else {
      strike++;
      console.log(chalk.bgRed(`\n You are incorrect, Stike: ${strike}/3`))
    }

  }

}

async function gameThree() {
  let landlockedCount = 0, strike = 0, score = 0;

  const spinner = ora('Fetching data').start();
  let landlockedMap = await getallLandLocked();
  spinner.succeed('Data fetched successfully');

  async function askCount() {
    const answers = await inquirer.prompt({
      name: 'count',
      type: 'input',
      message: 'How many landlock country can you identify?',
    });
    landlockedCount = answers.count
  }
  await askCount()

  if (landlockedCount <= 0 || landlockedCount > landlockedMap.size) {
    console.log(chalk.red(`\n You cant choose a number less than 0 or greater than ${landlockedMap.size}`));
    return
  }
  console.log(chalk.bgGreen.bold(`\n  lets start you have tell whether a country is landlocked or not.
  you can write atmost three wrong answers 
  start writing :)`))

  console.log(chalk.bgGreen.bold(`\n press the letter 'y' if a country is landlocked and 'n' if its not :)`))


  while (strike <= 3 || score <= landlockedCount) {

    if (strike === 3) {
      console.log(chalk.bgRed(`\n You lost :\(`))
      return
    }
    else if (score === landlockedCount) {
      console.log(chalk.bgGreen(`\n You Won :\)`))
      return
    }

    let answer;
    async function askCountry(country) {
      const answers = await inquirer.prompt({
        name: 'userInput',
        type: 'input',
        message: `${country} is a landlocked country: `,
      });
      answer = answers.userInput
    }

    function getRandomKey(map) {
      const keysArray = Array.from(map.keys());
      const randomIndex = Math.floor(Math.random() * keysArray.length);
      return keysArray[randomIndex];
    }
    const randomCountry = getRandomKey(landlockedMap);
    await askCountry(randomCountry)

    if (landlockedMap.get(randomCountry) === true && answer === 'y') {
      score++
      landlockedMap.delete(randomCountry)
      console.log(chalk.bgGreen.bold(`\n You are correct, Score: ${score}/${landlockedCount}`))
    }
    else if (landlockedMap.get(randomCountry) === false && answer === 'n') {
      score++
      landlockedMap.delete(randomCountry)
      console.log(chalk.bgGreen.bold(`\n You are correct, Score: ${score}/${landlockedCount}`))
    }
    else {
      strike++;
      console.log(chalk.bgRed(`\n You are incorrect, Stike: ${strike}/3`))
    }
  }

}


// await welcome()
await chooseGame()