var _ = require('lodash');
var moment = require('moment');
moment.locale('en-GB');

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
  if(num){
    if(num % 1 == 0) {
      return parseInt(num,10);
    } else {
      return parseFloat(num).toFixed(!! p ? p : 2);
    }
  }
};

exports.toDecimal = toDecimal;

exports.getMinimalAmount = function(data) {
  if(data) {
    if(!! data.allowance) {
      // return amount but converted to 2 decimal places
      return toDecimal((data.allownace/100*5));
    }
  } else {
    return console.log('There is no session data!');
  }
};

/**
 * take string and returns a predetermined 'humanised' version of it,
 * helpful for dealing with raw data we want outputting nicely.
 * @method humanise
 * @param  {string} string original string
 * @return {string}        hunmanised string
 */
exports.humanise = function(string) {
  if (string) {
      switch(string) {
        case 'weekly':
          return 'weekly';
        break;        
        case 'fortnightly': 
          return 'every two weeks';
        break;
        case 'four-weekly': 
          return 'Every four weeks';
        break;
        case 'monthly': 
          return 'monthly';
        break;
      }
   } else {
     console.log('You did not pass in a string');
   }
}

  /**
   * takes the session data object and calculates an end payment date based on
   * the users answers
   * @method calculateEndDate
   * @param  {object}         session the users data submitted in the form-hint
   * @return {String}                 Date string derived from the user's input
   */
exports.calculateEndDate = function(data, payment_amount, format) {  
    if (data) {
      // we need the payment frequency
      if(!! data.payment_frequency) {
        // calculate the number of payments that will need to be made
        var numberOfPayments = Math.ceil(data.debt_amount / (payment_amount ? payment_amount : data.payment_amount)),
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
        return moment(endDate).format(format ? format : 'll');
        
      } else {
        return filters.log('There is no payment frequency in the session data!');
      }
    } else {
      return filters.log('There is no session data!');
    }
  };
  
/**
 * returns current date formatted
 * @method currentDate
 * @param  {string}    format moment js api format
 * @return {string}           formatted version of today's date
 */
exports.formatDate = function(date, format) {
  var theDate = date == 'today' ? moment() : moment(date, 'DD MM YYYY');
  var humanDate = theDate.format(format ? format : 'll');
  return humanDate;
};