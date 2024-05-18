const {Database, Query} = require('./db');
const db = new Database();
const query = new Query();

class ModelInterface {
    /**
     * This method will be implemented to synchronize data from the database
     */
    constructor() {
        this.was_deleted = false;
    }

    synchronize() {}

    signin(organization) {}

    update(attribute, value) {}

    delete() {}

    static add(data) {}

    static get(value) {}
  
}

class User extends ModelInterface{

    constructor(userID) {
        super();
        this.userID = userID;
        
    }
  //Model For Business Requirement 14
  static async addUser(data1, data2, data3, data4){
    try{
      const q1 = await query.NEW_USER(data1, data2, data3, data4);
      const result = await db.get_response(q1, [data1, data2, data3, data4]);
      console.log(result);
      return result;
    }catch(error){
      console.error('Error adding user', error);
    }
  }

  //Model Function Business Requirement 1
  static async get(value){
      
     

    const userID = value;
    console.log('User ID: ', userID);
    try{
      const q1 = await query.GET_PROFILE(userID);
      console.log('SQL Query:', q1); // Log the SQL query string
      const userData = await db.get_response(q1, [userID]);
      return userData;
    }catch(error){
      throw error;
    }
     
  }

  
  // Model Function Business Requirement 2
  static async getRecommendations(username){
    try{
      const q1 = await query.DETERMINE_FAV_GENRE(username);
      const recommendations = await db.get_response(q1, [username]);
      return recommendations;
    } catch (error){
      throw error;
    }
  }  
  // Model Function Business Requirement 9
  static async shareUserActivity(username){
    try{
      const q1 = await query.SHARE_USER_ACTIVITY(username);
      const result = await db.get_response(q1, [username]);
      return result;
    } catch (error){
      throw error;
    }
  }
  // Model Function Business Requirement 11
  static async customerHistoryLog(username){
    try{
      const q1 = await query.CUSTOMER_HISTORY_LOG(username);
      const result = await db.get_response(q1, [username]);
      return result;
    } catch (error){
      throw error;
    }
  }

}


class Film extends ModelInterface{
    constructor(filmID) {
        super();
        this.filmID = filmID;
    }

    //Model Function for Business Requirement 3
    static async get(value){
        const filmTitle = value;
        console.log('Film Title: ', filmTitle);  
        
        try{
          const q1 = await query.Up_To_Date_Movie_Info(filmTitle);
          const filmData = await db.get_response(q1, [filmTitle]);
          return filmData;
        }catch (error){
          throw error;
        }
    }
    //Model Function for Business Requirement 12
    static async getMostSeenMovie(movieTheaterID){
        try{
          const q1 = await query.GET_MOST_SEEN_MOVIE(movieTheaterID);
          const filmData = await db.get_response(q1, [movieTheaterID]);
          return filmData;
        }catch (error){
          throw error;
        }
    }
}
class Ticket extends ModelInterface{
    constructor(ticketID) {
        super();
        this.ticketID = ticketID;
    }
    //Model Function for Business Requirement 4
    static async update(ticketID, showtimeID){
        try{
          const q1 = await query.UPDATE_TICKET(ticketID, showtimeID);
          const result = await db.get_response(q1, [ticketID, showtimeID]);
          return result;
        } catch (error){
          throw error;
        }
    }
  //Model Function for Business Requirement 13
    static async getSalesPerTheater(movieTheaterID){
        try{
          const q1 = await query.GET_SALES_PER_THEATER(movieTheaterID);
          const result = await db.get_response(q1, [movieTheaterID]);
          return result;
        } catch (error){
          throw error;
        }
    }
    
}
class Reviews extends ModelInterface{
  constructor(reviewID){
    super();
    this.reviewID = reviewID;
  }
  //Model Function for Business Requirement 5
  static async get(movieTitle){
    try{
      const q1 = await query.GET_REVIEWS_BY_MOVIE(movieTitle);
      const reviews = await db.get_response(q1, [movieTitle]);
      return reviews;
    } catch (error){
      throw error;
    }
  }
}
class Promo extends ModelInterface{
  constructor(promoID){
    super();
    this.promoID = promoID;
  }
  //Model Function for Business Requirement 6
  static async get(date){
    try{
      const q1 = await query.GET_PROMO(date);
      const promo = await db.get_response(q1, [date]);
      return promo;
    } catch (error){
      throw error;
    }
  }
}
class Payment extends ModelInterface{
  constructor(paymentID){
    super();
    this.paymentID = paymentID;
  }
  //Model Function for Business Requirement 8
  static async refundPayment(paymentID){
    try{
      const q1 = await query.REFUND_PAYMENT(paymentID);
      const result = await db.get_response(q1, [paymentID]);
      return result;
    } catch (error){
      throw error;
    }
  }
}
class Admin extends ModelInterface{
  constructor(adminID){
    super();
    this.adminID = adminID;
  }
  //Model Function for Business Requirement 7
  static async search(tableName, columnName){
    try{
      const q1 = await query.SEARCH(tableName, columnName);
      const result = await db.get_response(q1, [tableName, columnName]);
      return result;
    }catch(error){
      throw error;
    }
  }
  //Model Function for Business Requirement 10
  static async get(ticketID){
    try{
      const q1 = await query.GET_MANAGER(ticketID);
      const result = await db.get_response(q1, [ticketID]);
      return result;
    }catch(error){
      throw error;
    }
  }
}
class Feedback extends ModelInterface{
  constructor(feedbackID){
    super();
    this.feedbackID = feedbackID;
  }
  //Model Function for Business Requirement 15
  static async get(user_id){
    try{
      const q1 = await query.AVERAGE_FEEDBACK_RATING(user_id);
      const result = await db.get_response(q1, [user_id]);
      return result;
    }catch(error){
      throw error;
    }
  }
}



 module.exports = {ModelInterface, User, Film, Ticket, Reviews, Promo, Payment, Feedback, Admin};
