const mysql = require('mysql');
require('dotenv').config();  // To load environment variables from a .env file

const db_host = process.env['DB_HOST'];
const db_username = process.env['DB_USER'];
const db_password = process.env['DB_PASSWORD'];
const db_name = process.env['DB_NAME'];

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: db_host,
            user: db_username,
            password: db_password,
            database: db_name,
            charset: 'utf8mb4',
            port:3306
        });
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to database: ' + err.stack);
                return;
            }
            console.log('Bot connected to database ' + db_name);
        });
    }

   async get_response(query, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Database query error: ' + err.stack);
                    reject(err);
                    return;
                }

                if (fetch) {
                    resolve(results);
                } else {
                    resolve(results.affectedRows);
                }
            });
        });
    }

    static async select(query, values = null, fetch = true) {
        const database = new Database();
        database.connect();
        try {
            const result = await database.get_response(query, values, fetch);
            return result;
        } catch (error) {
            throw error;
        } finally {
            database.connection.end();
        }
    }

    static async insert(query, values = null, many_entities = false) {
        const database = new Database();
        database.connect();
        try {
            const result = await database.get_response(query, values, false, many_entities);
            return result;
        } catch (error) {
            throw error;
        } finally {
            database.connection.end();
        }
    }

    static async update(query, values = null) {
        const database = new Database();
        database.connect();
        try {
            const result = await database.get_response(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            database.connection.end();
        }
    }

    static async delete(query, values = null) {
        const database = new Database();
        database.connect();
        try {
            const result = await database.get_response(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            database.connection.end();
        }
    }


    
}
class Query{
    constructor(){
    }
    
    


    async GET_PROFILE(userID){
        const sql = `CALL generateProfile(?)`;
        const params = [userID];
        return{
            sql, params
        }
    }

    // Query for Business Requirement 2 -- Implemented in Models.js class User function: getRecommendations()
    async DETERMINE_FAV_GENRE(username){
        const sql = `CALL determineFavoriteGenre("?");`;
        const params = [username];
        return{
            sql, params
        }
    }
    // Query for Business Requirement 3 -- Implemented in Models.js class Film function: get()
    async Up_To_Date_Movie_Info(movieTitle){
        const sql = `CALL getUpToDateMovieInfo("?");`;
        const params = [movieTitle];
        return{
            sql, params
        }
    }
    // Query for Business Requirement 4 -- Implemented in Models.js class Ticket function: update()
    async UPDATE_TICKET(ticketID, showtimeID){
        const sql = `CALL updateTicket(?,?);`;
        const params = [ticketID, showtimeID];
        return{
            sql, params
        }
    }
    //Query for Business Requirement 5 -- Implemented in Models.js class Reviews function: get()
    async GET_REVIEWS_BY_MOVIE(movieTitle){
        const sql = `CALL getReviews("?")`;
        const params = [movieTitle];
        return{
            sql, params
        }
    }
    //Query for Business Requirement 6 -- Implemented in Models.js class Promo function: get()
    async GET_PROMO(date){
        const sql = 'CALL getPromo(?);';
        const params = [date]; 

        return {
            sql,
            params
        };
    }
    //Query for Business Requirement 7 -- Implemented in Models.js class Admin function: search()
    async SEARCH(tableName, columnName){
        const sql = `CALL search("?","?");`;
        const params = [tableName, columnName];
        return {
            sql,
            params
        };
    }

    //Query for Business Requirement 8 -- Implemented in Models.js class Payment function: refundPayment()
    async REFUND_PAYMENT(paymentID){
        const sql = `CALL refundPayment(?);`;
        const params = [paymentID];
        return {
            sql,
            params
        }
    }

    //Query for Business Requirement 9 -- Implemented in Models.js class User function: shareUserActivity()
    async SHARE_USER_ACTIVITY(username){
       const sql = `CALL shareUserActivity("?");`;
        const params = [username];
        return{
            sql, params
        }
    }

    //Query for Business Requirement 10 -- Implemented in Models.js class Admin function: get()
    async GET_MANAGER(ticketID){
        const sql = `CALL getManager(?);`;
        const params = [ticketID];
        return{
            sql, params
        }
    }
    
    //Query for Business Requirement 11 -- Implemented in Models.js class User function: customerHistoryLog()
    async CUSTOMER_HISTORY_LOG(customer){
        const sql = `CALL customerHistoryLog("?");`;
        const params = [customer];
        return{
            sql, params
        }
    }
    //Query for Business Requirement 12 -- Implemented in Models.js class Film function: getMostSeenMovie()
    async GET_MOST_SEEN_MOVIE(movie_theater_id){
        const sql = `CALL getMostSeenMovie(?)`;
        const params = [movie_theater_id];
        return{
            sql, params
        }
        
    }
    //Query for Business Requirement 13 -- Implemented in Models.js class Ticket function: getSalesPerTheater()
    async GET_SALES_PER_THEATER(movie_theater_id){
        const sql = `CALL getTicketSalesPerTheater(?);`;
        const params = [movie_theater_id];
        return{
            sql, params
        }
    }
    //Query for Business Requirement 14 -- Implemented in Models.js in class User function: addUser()
    async NEW_USER(username, birthday, password, email){
        const sql = `CALL newUser("?", "?", "?", "?}");`;
        const params = [username, birthday, password, email];
        return{
            sql, params
        }
    }
    //Query for Business Requirement 15 -- Implemented in Models.js class Feedback function: get()
    async AVERAGE_FEEDBACK_RATING(user_id){
        const sql = `CALL averageFeedbackRating(?);`;
        const params = [user_id];
        return{
            sql, params
        }
    }
    
}

module.exports = {Database, Query};


