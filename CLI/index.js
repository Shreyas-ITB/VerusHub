import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import axios from 'axios';
import CoinGecko from "coingecko-api";
import io from 'socket.io-client';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const intentsfilepath = path.join(__dirname, 'data', 'intents.json');
const data = fs.readFileSync(intentsfilepath);
const { intents } = JSON.parse(data);
const securecipherkey = "ASuperSecureCipherKey"
var lastRandomIndex = -1;
const CoinGeckoClient = new CoinGecko();
const socket = io('http://localhost:9000');
var username = null

function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

function generateKey(password) {
    return crypto.createHash('sha256').update(password).digest();
}

function getdata() {
    const filePath = path.join(__dirname, 'data', 'data.txt');
    const encryptedData = fs.readFileSync(filePath, 'utf-8');
    const key = generateKey(securecipherkey);
    const data = decryptdata(encryptedData, key);
    const jsond = JSON.parse(data);
    return jsond;
}

function chatbot(userInput) {
    let intent;
    for (const item of intents) {
        if (item.patterns.some(pattern => userInput.toLowerCase().includes(pattern.toLowerCase()))) {
            intent = item;
            break;
        }
    }
    let response;
    try {
        response = getRandomResponse(intent.responses);
    } catch (error) {
        response = "Sorry, I didn't get that!";
    }

    return response;
}

const mainMenu = [
    {
        name: 'choice',
        type: 'list',
        message: `${chalk.blue("VerusHub Navigation:")}`,
        choices: ['Chat', 'Portfolio', 'Settings', 'Support', 'Donate', 'Exit'],
    }
];

const settingsMenu = [
    {
        name: 'choice',
        type: 'list',
        message: `${chalk.blue("VerusHub Settings:")}`,
        choices: ['Change your username', 'Change your address', 'Back to navigation'],
    }
];

function getRandomSentence() {
    var sentences = [
        "The only way to do great work is to love what you do.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "The way to get started is to quit talking and begin doing.",
        "Your time is limited, so don't waste it living someone else's life.",
        "If life gives you lemons, make lemonade.",
        "The secret of getting ahead is getting started.",
        "The best way to predict the future is to create it.",
        "Did you know that VerusHub is also called as VH in the Verus Community?!",
        "Did you know that VerusHub was once called VerusConnect before the project began its development?",
        "Did you know that the term 'Verus' actually means true, actual, genuine, and real in latin?",
        "Did you know that there is a tip bot in the Verus Community which gives you free veruscoins?",
        "A journey of a thousand miles begins with a single step.",
        "All that glitters is not gold.",
        "Actions speak louder than words.",
        "Where there's a will, there's a way.",
        "A penny for your thoughts.",
        "Every cloud has a silver lining.",
        "Did you know that Oink in the Verus Community was once a pirate?"
    ];
    
    var randomIndex = Math.floor(Math.random() * sentences.length);
    while (randomIndex === lastRandomIndex) {
        randomIndex = Math.floor(Math.random() * sentences.length);
    }
    lastRandomIndex = randomIndex;
    return sentences[randomIndex];
}

function showChat() {
    inquirer.prompt([
        {
            name: 'question',
            type: 'input',
            message: 'You:',
        }
    ]).then(answer => {
        if (answer.question.toLowerCase() === 'back') {
            console.clear();
            socket.on('disconnect', function() {
                socket.emit('disconnect')
            });
            showMainMenu();
        }
        else if (answer.question.toLowerCase() === 'exit') {
            console.clear();
            socket.on('disconnect', function() {
                socket.emit('disconnect')
            });
            console.log(chalk.red('Exiting VerusHub... Hope to see you again!'));
            process.exit();
        } else {
            socket.on('connect', () => {
                username = getdata()['usrnme'];
            })  
            socket.on('message', (data) => {
                const { cmd, username } = data
                console.log(chalk.green(username) + ': ' + chalk.blue(cmd.split('\n')[0]));
            })
            socket.send({ cmd: answer.question, username })
            showChat();
        }
    });

}

function showMainMenu() {
    inquirer.prompt(mainMenu).then(answer => {
        handleMainMenu(answer.choice);
    });
}

function showsettings() {
    console.clear();
    inquirer.prompt(settingsMenu).then(answer => {
        handlesettings(answer.choice);
    });
}

function handlesettings(choice) {
    switch (choice) {
        case 'Change your username':
            const currentusername = getdata()['usrnme'];
            const currentaddress = getdata()['usraddr'];
            const filePath = path.join(__dirname, 'data', 'data.txt');
            console.log(chalk.blue(`Current username: ${chalk.yellow(currentusername)}`));
            inquirer.prompt([
                {
                    name: 'newusername',
                    type: 'input',
                    message: 'What would you like your new username to be:',
                }
            ])
            .then(answer => {
                if (answer.newusername == "" || answer.newusername.length < 5 || answer.newusername.length > 15) {
                    console.log(chalk.red("Please enter a username that is 5 to 15 characters long!"));
                    console.log(chalk.yellow("Redirecting you back to the Settings page in 5 seconds..."));
                    setTimeout(() => {
                        showsettings();
                    }, 5000)
                }
                else {
                const key = generateKey(securecipherkey);
                const data = { usrnme: answer.newusername, usraddr: currentaddress };
                const encryptedText = encryptdata(JSON.stringify(data), key);
                fs.writeFile(filePath, encryptedText, (err) => {
                    if (err) {
                        console.error(chalk.red('Error writing information:', err));
                        process.exit(1);
                    } else {
                        console.log(chalk.green(`You have now changed your username from ${currentusername} to ${answer.newusername}, people might have trouble figuring out you due to your new username.`));
                        console.log(chalk.yellow("Redirecting you back to the Settings page in 8 seconds..."));
                        setTimeout(() => {
                            showsettings();
                        }, 8000)
                    }
                });
            }
            });
            break;
        case 'Change your address':
            const username = getdata()['usrnme'];
            const curraddress = getdata()['usraddr'];
            const filepth = path.join(__dirname, 'data', 'data.txt');
            console.log(chalk.blue(`Current veruscoin address: ${chalk.yellow(curraddress)}`));
            inquirer.prompt([
                {
                    name: 'newaddress',
                    type: 'input',
                    message: 'What would you like your new VerusCoin address to be:',
                }
            ])
            .then(answer => {
                if (answer.newaddress == "" || answer.newaddress.length != 34 || answer.newaddress.startsWith('R') == false) {
                    console.log(chalk.red("Please enter a valid VerusCoin address that starts with 'R'!"));
                    console.log(chalk.yellow("Redirecting you back to the Settings page in 5 seconds..."));
                    setTimeout(() => {
                        showsettings();
                    }, 5000)
                }
                else {
                const key = generateKey(securecipherkey);
                const data = { usrnme: username, usraddr: answer.newaddress };
                const encryptedText = encryptdata(JSON.stringify(data), key);
                fs.writeFile(filepth, encryptedText, (err) => {
                    if (err) {
                        console.error(chalk.red('Error writing information:', err));
                        process.exit(1);
                    } else {
                        console.log(chalk.green(`You have now changed your VerusCoin address from ${curraddress} to ${answer.newaddress}.`));
                        console.log(chalk.yellow("Redirecting you back to the Settings page in 8 seconds..."));
                        setTimeout(() => {
                            showsettings();
                        }, 8000)
                    }
                });
            }
            });
            break;
        case 'Back to navigation':
            console.clear();
            showMainMenu();
            break;
    }
} 

function handleSupport() {
    inquirer.prompt([
        {
            name: 'question',
            type: 'input',
            message: 'You:',
        }
    ]).then(answer => {
        if (answer.question.toLowerCase() === 'back') {
            console.clear();
            showMainMenu();
        }
        else if (answer.question.toLowerCase() === 'exit') {
            console.clear();
            console.log(chalk.red('Exiting VerusHub... Hope to see you again!'));
            process.exit();
        } else {
            console.log(chalk.green(`OinkBot: ${chatbot(answer.question)}`));
            handleSupport(); 
        }
    });
}

function getbalance() {
    const address = getdata()['usraddr'];
    return axios.get(`https://explorer.verus.io/ext/getaddress/${address}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.message;
        });
}

function encryptdata(text, password) {
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(password), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptdata(text, password) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function handleMainMenu(choice) {
    switch (choice) {
        case 'Chat':
            console.clear(); // Clear the console
            console.log(chalk.blue("Type a message to start a conversation, 'exit' to quit or 'back' to go back"));
            console.log(chalk.yellow("Remember you are talking with everyone in the public room, keep your secrets safe, do not share anything sensitive..."));
            console.log("")
            showChat()
            break;
        case 'Portfolio':
            console.clear();
            const animate = chalkAnimation.rainbow("View your portfolio here, all the wallet details will be listed down below.");
            animate.start();
            animate.stop();
            console.log(chalk.yellow("You will be redirected to the navigation menu in 10 seconds..."))
            console.log("")
                CoinGeckoClient.coins.fetch('verus-coin', {
                    localization: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false,
                    sparkline: false
                  })
                    .then(response => {
                      const verusCoinData = response.data;
                      const usdValue = verusCoinData.market_data.current_price.usd;
                      const usd24hChange = verusCoinData.market_data.price_change_percentage_24h;
                      getbalance()
                        .then(response => {
                            console.log(chalk.blue("Wallet address: ", chalk.green(getdata()['usraddr'])));
                            console.log(chalk.blue("Balance: ", chalk.green(response['balance'])));
                            console.log(chalk.blue("Total received: ", chalk.green(response['received'])));
                            console.log(chalk.blue("Total sent: ", chalk.green(response['sent'])));
                            console.log(chalk.blue(`VerusCoin price in USD (in $): ${chalk.green(usdValue)}$`));
                            console.log(chalk.blue(`VerusCoin 24h change (in %): ${chalk.green(usd24hChange)}%`));
                            console.log(chalk.blue(`VerusCoin Balance in USD (in $): ${chalk.green(usdValue * response['balance'])}$`));
                            console.log(chalk.blue(`VerusCoin Received in USD (in $): ${chalk.green(usdValue * response['received'])}$`));
                            console.log(chalk.blue(`VerusCoin Sent in USD (in $): ${chalk.green(usdValue * response['sent'])}$`));
                    })
                    .catch(error => {
                      console.error(chalk.red(`Error getting VerusCoin data ${error.message}`));
                    });
                setTimeout(() => {
                    console.clear()
                    showMainMenu();
                } , 10000);
            })
            .catch(error => {
                console.log(chalk.red(`Error getting portfolio information ${error.message}`));
                showMainMenu();
            });
            break;
        case 'Settings':
            showsettings();
            break;
        case 'Support':
            console.clear();
            const animation = chalkAnimation.rainbow("VerusHub CLI has a built in mini artificial intelligence system which will assist you with any queries you may have.");
            animation.start();
            animation.stop();
            console.log(chalk.blue("Ask a question or type 'Back' to go back to the navigation menu and Exit to exit VH."))
            console.log("")
            console.log(chalk.green("OinkBot: Hello, I'm the mighty Oinkbot. How can I help you today?"))
            handleSupport();
            break;
        case 'Donate':
            console.clear();
            console.log(chalk.blue("Welcome to the VerusHub Donation Guide!"));
            console.log(chalk.blue("If you want to support this project (VerusHub) by any means possible you can donate to us."));
            console.log(chalk.yellow(`You can donate any amount of veruscoins you are comfortable with to this ${chalk.green("VerusHub@")} VerusID. Your donations will be heartly appreciated!.`));
            console.log("");
            console.log(chalk.yellow("You will be automatically redirected to the navigation menu in 20 seconds..."));
            setTimeout(() => {
                console.clear();
                showMainMenu();
            }, 20000)
            break;
        case 'Exit':
            console.clear();
            console.log(chalk.red('Exiting VerusHub... Hope to see you again!'));
            process.exit(0);
            break;
    }
}

function init() {
    console.clear();
    const spinner = createSpinner('Loading VerusHub Messenger (VH)...').start();
    const sentence = getRandomSentence();
    const animation = chalkAnimation.rainbow(sentence);
    
    setTimeout(() => {
        try {
            spinner.success({ text: 'Starting VerusHub Messenger (VH)...' });
            animation.stop();
            setTimeout(() => {
                console.clear()
                const filePath = path.join(__dirname, 'data', 'data.txt');
                fs.access(filePath, fs.constants.F_OK, () => {
                    if (fs.existsSync(filePath)) {
                        console.log(chalk.blue("Welcome back to VerusHub!"));
                        showMainMenu();
                    } else {
                        console.log(chalk.blue("Looks like you are new to VerusHub!, please enter your Verus Wallet Address and your name to proceed:"));
                        return inquirer.prompt([
                            {
                            name: 'username',
                            type: 'input',
                            message: 'What is your name (username)?',
                            },
                            {
                            name: 'verus_wallet_address',
                            type: 'input',
                            message: 'What is your VerusCoin Wallet Address (R address)?',
                            }
                        ]).then(answers => {
                            const username = answers.username;
                            const address = answers.verus_wallet_address;
                            if (username == "" || address == "" || username.length < 5 || username.length > 15 || address.length != 34 || address.startsWith('R') == false) {
                                console.log(chalk.red("Please enter a username that is 5 to 15 characters long and a valid VerusCoin address that starts with 'R'!"));
                                process.exit(1)
                            }
                            else {
                                const key = generateKey(securecipherkey);
                                const data = { usrnme: username, usraddr: address };
                                const encryptedText = encryptdata(JSON.stringify(data), key);
                                fs.writeFile(filePath, encryptedText, (err) => {
                                    if (err) {
                                        console.error(chalk.red('Error writing information:', err));
                                        process.exit(1);
                                    } else {
                                        console.log(chalk.green("You are now logged in to VerusHub Messenger (VH)!"));
                                        console.log(chalk.yellow("VerusHub CLI will now automatically restart for you to continue using it in the next 10 seconds."));
                                        setTimeout(() => {
                                            init();
                                        }, 10000);
                                    }
                                });
                            }
                        })
                    }
                });
            }, 5000);
        } catch (err) {
            spinner.error({ text: 'Error loading VerusHub CLI, Please restart and try again!' });
            console.log(chalk.red(err));
        }
    }, 5000)
}

init();