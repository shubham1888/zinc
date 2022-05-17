// const inquirer = require('inquirer');

// inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'reptile',
//       message: 'Which is better?',
//       choices: ['alligator', 'crocodile'],
//     },
//   ])
//   .then(answers => {
//     console.info('Answer:', answers.reptile);
//   });

// const inquirer = require('inquirer');

// inquirer
//   .prompt([
//     {
//       type: 'password',
//       name: 'secret',
//       message: 'Tell me a secret',
//     },
//   ])
//   .then(answers => {
//     // Displaying the password for debug purposes only.
//     console.info('Answer:', answers.secret);
//   });

// const inquirer = require('inquirer');

// inquirer
//   .prompt([
//     {
//       type: 'editor',
//       name: 'story',
//       message: 'Tell me a story, a really long one!',
//     },
//   ])
//   .then(answers => {
//     console.info('Answer:', answers.story);
//   });

const os = require('os');
setTimeout(() => {
    
    console.log(os.platform());
}, 6000);
