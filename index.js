const { Client, Intents, messageLink} = require('discord.js');
require('dotenv').config();
const { Database, Query } = require('./db');
const TOKEN = process.env['TOKEN'];
const {ModelInterface, User, Film, Ticket, Reviews, Promo, Payment, Feedback, Admin} = require('./models');
const { log } = require('console');

const { MailtrapClient } = require("mailtrap");

const mailTOKEN = "ccfdaac31761577767e1c89bd0c6cc05";
const mailENDPOINT = "https://send.api.mailtrap.io/";
const mailClient = new MailtrapClient({ endpoint: mailENDPOINT, token: mailTOKEN });

const sender = {
  email: "mailtrap@ameensafi.com",
  name: "MovieBookingDB",
}

const models = {
  ModelInterface,
  User,
  Film, 
  Ticket,
  Reviews,
  Promo,
  Payment,
  Feedback, 
  Admin
};

const client = new Client({ 
    intents: 3276799
});

client.setMaxListeners(15);

// Your bot code here...
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  try{
    const database = new Database();
    database.connect();
    console.log(`${client.user.username} is connected to the remote db`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});


//Bot code for Business Requirement 1
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!profile')) {
    const regex = /!profile<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const userID = match[1]; 

      // Validate that userID is an integer
      if (!/^\d+$/.test(userID)) {
        message.channel.send('Invalid userID format. "userID" must be an integer. Please try again. Example: !profile<12345>');
        return;
      }

      console.log("UserID:", userID);

      try {
        const profile = await models.User.get(parseInt(userID, 10)); 
        console.log(profile);
        message.channel.send(`Customer Profile: ${JSON.stringify(profile)}`);
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.channel.send('Error fetching profile.');
      }
    } else {
      message.channel.send('Invalid command format. Use !profile<userID> where userID is the pk of a user in the table Users.');
    }
  }
});

//Bot code for Business Requirement 2
client.on('messageCreate', async (message) => {
  const startOfCommand = '!recommendations';
  if (message.content.startsWith(startOfCommand)){
    const regex = /!recommendations<([^>]+)>/;
    const match = message.content.match(regex);
    if (match){
      const username = match[1]; 
      console.log("Username:", username);
      
    try {
      
      const recommendations = await models.User.getRecommendations(username);
      console.log(recommendations);
      message.channel.send(`Recommendations: ${JSON.stringify(recommendations)}`);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      message.channel.send('Error fetching recommendations.');
    }
    }else{
      message.channel.send('Invalid command format. Use !recommendations<username> where username is the username of a user in the table Users.');
  }
  }
})
//Bot code for Business Requirement 3
client.on('messageCreate', async (message) => {
  const startOfCommand = '!movie';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!movie<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const movieTitle = match[1].trim();

      // Validate that movieTitle is a non-empty string
      if (typeof movieTitle === 'string' && movieTitle.length > 0) {
        console.log(movieTitle);

        try {
          const movieData = await models.Film.get(movieTitle);
          console.log(movieData);
          message.channel.send(`Movie Info: ${JSON.stringify(movieData)}`);
        } catch (error) {
          console.error('Error fetching movie info:', error);
          message.channel.send('Error fetching movie info.');
        }
      } else {
        message.channel.send('Invalid movie title. Please provide a valid movie title.');
      }
    } else {
      message.channel.send('Invalid command format. Use !movie<movieTitle> where movieTitle is the name of a movie.');
    }
  }
});


// Bot code for Business Requirement 4
client.on('messageCreate', async (message) => {
  const startOfCommand = '!updateTicket';
  if (message.content.startsWith(startOfCommand)) {
    await message.channel.send('Enter ticket ID number: ');
    const ticketIDresponse = await message.channel.awaitMessages({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
      time: 60000,
      errors: ['time']
    });

    const ticketID = parseInt(ticketIDresponse.first().content);
    if (isNaN(ticketID)) {
      message.reply('Invalid ticket ID. Please enter a valid number.');
      return;
    }
    console.log(ticketID);

    await message.reply('Enter new showtime ID: ');

    const showtimeIDresponse = await message.channel.awaitMessages({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
      time: 60000,
      errors: ['time']
    });

    const showtimeID = parseInt(showtimeIDresponse.first().content);
    if (isNaN(showtimeID)) {
      message.reply('Invalid showtime ID. Please enter a valid number.');
      return;
    }
    console.log(showtimeID);

    try {
      const result = await models.Ticket.update(ticketID, showtimeID);
      console.log(result);
      message.channel.send(`Ticket ${ticketID} updated to showtime ${showtimeID}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      message.channel.send('Error updating ticket.');
    }
  }
});

// Bot code for Business Requirement 5
client.on('messageCreate', async (message) => {
  const startOfCommand = '!getReview';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!getReview<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const movieTitle = match[1].trim();

      if (movieTitle.length > 0) {
        console.log(movieTitle);

        try {
          const reviews = await models.Reviews.get(movieTitle);
          console.log(reviews);
          message.channel.send(`Reviews: ${JSON.stringify(reviews)}`);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          message.channel.send('Error fetching reviews.');
        }
      } else {
        message.channel.send('Invalid movie title. Please provide a valid movie title.');
      }
    } else {
      message.channel.send('Invalid command format. Use !getReview<movieTitle> where movieTitle is the name of a movie.');
    }
  }
});

// Bot code for Business Requirement 6
client.on('messageCreate', async (message) => {
  const startOfCommand = '!getPromo';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!getPromo<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const promo_date = match[1].trim();

      if (promo_date.length > 0) {
        console.log(promo_date);

        try {
          const promo = await models.Promo.get(promo_date);
          console.log(promo);
          message.channel.send(`Promo: ${JSON.stringify(promo)}`);
        } catch (error) {
          console.error('Error fetching promo:', error);
          message.channel.send('Error fetching promo.');
        }
      } else {
        message.channel.send('Invalid promo date. Please provide a valid promo date.');
      }
    } else {
      message.channel.send('Invalid command format. Use !getPromo<promo_date> where promo_date is the date of the promotion.');
    }
  }
});



// Bot code for Business Requirement 7
client.on('messageCreate', async (message) => {
  const startOfCommand = '!search';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!search<([^>]+)><([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const [_, tableName, columnName] = match;

      if (tableName && columnName) {
        console.log('Table:', tableName);
        console.log('Column:', columnName);

        try {
          const searchResult = await models.Admin.search(tableName, columnName);
          console.log(searchResult);
          message.channel.send(`Search Result: ${JSON.stringify(searchResult)}`);
        } catch (error) {
          console.error('Error fetching search result:', error);
          message.channel.send('Error fetching search result.');
        }
      } else {
        message.channel.send('Invalid table or column name. Please provide valid names.');
      }
    } else {
      message.channel.send('Invalid command format. Use !search<tableName><columnName> where tableName is the name of the table and columnName is the name of the column.');
    }
  }
});

// Bot code for Business Requirement 8
client.on('messageCreate', async (message) => {
  const startOfCommand = '!refundPaymentID#';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!refundPaymentID#<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const paymentID = match[1].trim();

      if (paymentID.length > 0) {
        console.log(paymentID);

        try {
          const result = await models.Payment.refundPayment(paymentID);
          message.channel.send('Refund initiated.');
        } catch (error) {
          console.error('Could not process refund', error);
          message.channel.send('Error processing refund');
        }
      } else {
        message.channel.send('Invalid payment ID. Please provide a valid payment ID.');
      }
    } else {
      message.channel.send('Invalid command format. Use !refundPaymentID#<paymentID> where paymentID is the ID of the payment.');
    }
  }
});

// Bot code for Business Requirement 9
client.on('messageCreate', async (message) => {
  const startOfCommand = '!shareUserActivity';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!shareUserActivity<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const username = match[1].trim();

      if (username.length > 0) {
        console.log(username);

        try {
          const result = await models.User.shareUserActivity(username);
          message.channel.send('User activity shared.');
        } catch (error) {
          console.error('Could not share user activity', error);
          message.channel.send('Error sharing user activity');
        }
      } else {
        message.channel.send('Invalid username. Please provide a valid username.');
      }
    } else {
      message.channel.send('Invalid command format. Use !shareUserActivity<username> where username is the user\'s name.');
    }
  }
});
//Bot code for Business Requirement 10
client.on('messageCreate', async (message) => {
  const startOfCommand = '!getManager';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!getManager<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const ticketID = match[1].trim();

      if (ticketID.length > 0) {
        console.log(ticketID);

        try {
          const manager = await models.Admin.get(ticketID);
          message.channel.send(`Manager: ${JSON.stringify(manager)}`);
        } catch (error) {
          console.error('Could not fetch manager', error);
          message.channel.send('Error fetching manager');
        }
      } else {
        message.channel.send('Invalid ticket ID. Please provide a valid ticket ID.');
      }
    } else {
      message.channel.send('Invalid command format. Use !getManager<ticketID> where ticketID is your ticket ID number.');
    }
  }
});


// Bot code for Business Requirement 11
client.on('messageCreate', async (message) => {
  const startOfCommand = '!customerHistoryLog';
  if (message.content.startsWith(startOfCommand)) {
    const regex = /!customerHistoryLog<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const customer = match[1].trim();

      if (customer.length > 0) {
        console.log(customer);

        try {
          const result = await models.User.customerHistoryLog(customer);
          message.channel.send(`Customer History Log: ${JSON.stringify(result)}`);
        } catch (error) {
          console.error('Could not log customer history', error);
          message.channel.send('Error logging customer history');
        }
      } else {
        message.channel.send('Invalid customer. Please provide a valid customer.');
      }
    } else {
      message.channel.send('Invalid command format. Use !customerHistoryLog<customer> where customer is the name of the customer.');
    }
  }
});

// Bot code for Business Requirement 12
client.on('messageCreate', async (message) => {
  const command = '!getMostSeenMovie';
  if (message.content.startsWith(command)) {
    const regex = /!getMostSeenMovie<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const movieTheaterID = match[1].trim();

      if (!isNaN(parseInt(movieTheaterID))) {
        try {
          const result = await models.Film.getMostSeenMovie(movieTheaterID);
          console.log(result);
          message.channel.send(`Most Seen Movie: ${JSON.stringify(result)}`);
        } catch (error) {
          console.error('Could not get most seen movie', error);
          message.channel.send('Error getting most seen movie');
        }
      } else {
        message.channel.send('Invalid movie theater ID. Please provide a valid number.');
      }
    } else {
      message.channel.send('Invalid command format. Use !getMostSeenMovie<movieTheaterID> where movieTheaterID is the ID of the theater.');
    }
  }
});

// Bot code for Business Requirement 13
client.on('messageCreate', async (message) => {
  const command = '!getSalesPerTheater';
  if (message.content.startsWith(command)) {
    const regex = /!getSalesPerTheater<([^>]+)>/;
    const match = message.content.match(regex);

    if (match) {
      const movieTheaterID = match[1].trim();

      if (!isNaN(parseInt(movieTheaterID))) {
        try {
          const result = await models.Ticket.getSalesPerTheater(movieTheaterID);
          console.log(result);
          message.channel.send(`Ticket Sales Per Theater: ${JSON.stringify(result)}`);
        } catch (error) {
          console.error('Could not get ticket sales per theater', error);
          message.channel.send('Error getting ticket sales per theater');
        }
      } else {
        message.channel.send('Invalid movie theater ID. Please provide a valid number.');
      }
    } else {
      message.channel.send('Invalid command format. Use !getSalesPerTheater<movieTheaterID> where movieTheaterID is the ID of the theater.');
    }
  }
});

//Bot code for Business Requirement 14
client.on('messageCreate', async (message) => {
  const command = '!createNewUser';
  if(message.content.startsWith(command)){
    
    const regex = /!createNewUser<([^>]+)><([^>]+)><([^>]+)><([^>]+)>/;
    const match = message.content.match(regex);

    // Check if the command matches the expected format
    if (match) {
      const [, data1, data2, data3, data4] = match; // Destructuring the matched groups
      // Now you have param1, param2, param3, and param4 to work with
      console.log("Username:", data1);
      console.log("DOB:", data2);
      console.log("Password:", data3);
      console.log("Email:", data4);

      // Add your logic here to handle the command with parameters
      try{
        const result = await models.User.addUser(data1, data2, data3, data4);
        console.log(result);

        const recipient = [{
          email: data4,
        }]
        mailClient.send({
          from: sender,
          to: recipient,
          template_uuid: "496b510b-e80f-418f-a75a-de3a1424cc92",
          template_variables:{
            "user_name": data1,
            "next_step_link": "Test_Next_step_link",
            "get_started_link": "Test_Get_started_link",
            "onboarding_video_link": "Test_Onboarding_video_link"
          }
        })
        .then(console.log, console.error);


        
        message.channel.send(`New User Created. Check your email for next steps.`)
      }catch(error){
        console.error('Could not create new user', error);
        message.channel.send('Error creating new user');
      }
    } else {
      // If the command doesn't match the expected format
      console.log("Invalid command format");
    }
  }
});
// Bot code for Business Requirement 15
client.on('messageCreate', async (message) =>{
  const command = '!getAverageFeedback';
  if(message.content.startsWith(command)){
    const regex = /!getAverageFeedback<([^>]+)>/;
    const match = message.content.match(regex);

    if(match){
      const user_id = match[1].trim();

      if(!isNaN(parseInt(user_id))){
        try{
          const result = await models.Feedback.get(user_id);
          console.log(result);
          message.channel.send(`Average Feedback: ${JSON.stringify(result)}`);
        }catch(error){
          console.error('Could not get average feedback', error);
          message.channel.send('Error getting average feedback');
        }
      }else{
        message.channel.send('Invalid movie theater ID. Please provide a valid number.');
      }
    }else{
      message.channel.send('Invalid command format. Use !getAverageFeedback<movieTheaterID> where movieTheaterID is the ID of the theater.');
    }
  }
});


client.login(TOKEN);
