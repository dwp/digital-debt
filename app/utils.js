var _ = require('lodash');

/**
 * takes a file path and returns a computed relatative path and title based on
 * the first directory name after 'views'
 * @method function
 * @param  {string} path the file path of the thing you want to get a url from
 * @return {object}      process data object
 */
exports.getVersionName = function(path) {
  var sp = path.split('/');
  var computedPath = _.join( _.slice( sp, ( _.indexOf(sp, 'versions') +1 ) ), '/' );
  return {
    computedPath: computedPath,
    title: computedPath.split('/')[1],
  }
};

var toDecimal = function(num,p){
  if(num && typeof num == 'number'){
    return Number(num).toFixed(!! p ? p : 2);
  }
};

exports.toDecimal = toDecimal;

exports.getMinimalAmount = function(data) {
  if(data) {
    if(!! data.payment_frequency) {
      
      var finalAmount,
          minimalAmount = 3.40;
      
      // use the frequency to calculate the date
      switch(data.payment_frequency) {
        case 'weekly':
          finalAmount = minimalAmount;
        break;        
        case 'fortnightly': 
          // console.log("It's fortnightly");
          finalAmount = minimalAmount * 2;
        break;
        case 'four-weekly': 
          finalAmount = minimalAmount * 4;
        break;
        case 'monthly': 
          finalAmount = (minimalAmount * 4) + minimalAmount;
        break;
      }
      
      // return amount but converted to 2 decimal places
      return toDecimal(finalAmount);
      
    }
  } else {
    return console.log('There is no session data!');
  }
};

exports.humanInterval = function(data) {
  
  if (data) {
    // we need the payment frequency
    if(!! data.payment_frequency) {
    
      // use the frequency to calculate the date
      switch(data.payment_frequency) {
        case 'weekly':
          return data.payment_frequency;
        break;        
        case 'fortnightly': 
          return 'every two weeks';
        break;
        case 'four-weekly': 
          return 'Every four weeks';
        break;
        case 'monthly': 
          return data.payment_frequency;
        break;
      }
    };
   
   }
}

  /**
   * takes the session data object and calculates an end payment date based on
   * the users answers
   * @method calculateEndDate
   * @param  {object}         session the users data submitted in the form-hint
   * @return {String}                 Date string derived from the user's input
   */
exports.calculateEndDate = function(data) {  
    if (data) {
      // we need the payment frequency
      if(!! data.payment_frequency) {
        // calculate the number of payments that will need to be made
        var numberOfPayments = Math.ceil(data.debt_amount / data.payment_amount),
            endDate = new Date();
        
        // use the frequency to calculate the date
        switch(data.payment_frequency) {
          case 'weekly':
            endDate.setDate(numberOfPayments * 7);
          break;        
          case 'fortnightly': 
            // console.log("It's fortnightly");
            endDate.setDate(numberOfPayments * 14);
          break;
          case 'four-weekly': 
            endDate.setDate(numberOfPayments * 28);
          break;
          case 'monthly': 
            endDate.setMonth(endDate.getMonth() + numberOfPayments);
          break;
        }
        
        // return the date in a formatted string
        return ("1 " + endDate.toLocaleString("en-gb", { month: "long" }) + " " + endDate.getUTCFullYear());
        
      } else {
        return filters.log('There is no payment frequency in the session data!');
      }
    } else {
      return filters.log('There is no session data!');
    }
  };