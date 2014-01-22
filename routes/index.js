var dataArray = [];
var counter  = 0;
var async = require('async');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login');
};


/*
 *  * GET login page.
 *   */

exports.login = function(req, res) {
	  res.render('login');
};

/*
 *  * GET register page.
 *   */

//exports.view = function(req, res) {
//	  res.render('view');
//};


/*
 *   * Called on a POST request in the login page.
 *   * Called when the LOGIN button is pressed on the screen.
 *   */

exports.loginUser = function(req, res) {

	//get Username that was pushed. Note: *username* is the "name" 
	//tag used in the HTML form for the Username field(views/login.jade)
	u = req.body.username;
	//get Password that was pushed. Note: *password* is the "name" 
	//tag used in the HTML form for the Password field(views/login.jade)
	p = req.body.password;

	//Create an empty object, associative array type to associate
	//the username(key) with the password(value)
	var obj = {};
        obj[u] = p;

	//Push the object into the dataArray (global)
	dataArray.push(obj);
	console.log('Pushed!'+  JSON.stringify(dataArray[counter]));

	//counter ++;
	
	//Render the login screen when the "LOGIN" button is pressed
	//so that the user can continue rapid-firing the uname, pword.
	res.render('login');
};



exports.viewUser = function(req, res) {
	//Split the dataArray which contains elements in {:},{:} format on every '}'	
	var u = JSON.stringify(dataArray).split('}');
	
	//Function to print each element passed(num) after a random delay
	//and call the <doneCallback> function while returning. This
	//<doneCallback> function is the same callback function defined in async.map() below.
	var printStuff = function(num, doneCallback)
	{
		//variable to generate random delay between 5 and 50 seconds.		
	    var delay = Math.floor((Math.random()*45000)+5000);

	    //check if the num variable is not null.
	    //num contains the uname:password key:value pair
	    if(num.trim() != null)
		{
		    //Call the setTimeout function to display num after a delay.
		    setTimeout(function()
			{
				//First check if the uname:password in num are both valid
				num = num.replace('[','');
				num = num.replace('{','');
				num = num.replace(']','');
				num = num.replace(',','');
			   var boolValidation =  validateUsernameAndPassword(num);

				//Print valid if the validation is successful
			   if(boolValidation)
			   {
				   var myString = num + "Valid";
                                   if(myString.length > "Valid".length)
                                   {
                                           res.write(myString + " Delay  " + delay + "\n");
                                           console.log(myString + " Delay  " + delay + "\n");
                                   }
                                   counter += 1;

			   }
				//Print invalid if the validation is unsuccessful
		    	   else
		           {
					var myString = num + "Invalid";
                                   if(myString.length > "Invalid".length)
                                   {
                                           res.write(myString + " Delay  " + delay + "\n");
                                           console.log(myString + " Delay  " + delay + "\n");
                                   }
                                   counter += 1;

			   }
				//Callback after each element is processed
				//*callback made with error being null*
			    return doneCallback(null, num);
		    }, delay);
	    }
     };

	/*
	 *
	 *  async.map(array,iterator,callback) :
	 *  produces a new array by iterating each element of the
	 *  passed array(u) through the iterator function(printStuff)
	 *  and after processing each element, calls the callback function.
	 */
	async.map(u,printStuff,function(err, results)
	{
		if(counter >= u.length - 1)
		{
			console.log("DONE!");
			res.end();
		}
	});
/*
 * *Validate the username and password
 */
	function validateUsernameAndPassword(num1)
	{
		//num1 contains username and password in the format uname:pword
		var u = num1.split(":");
		var valid = true;

		//u[0] = Username
		//u[1] = Password
		//Check if either is blank, since that would mean the 
		//entry is invalid
		if(u[0] == "" || u[1] == "")
        {
			valid =  false;
        }
        else
        {
		/*
		 *
		 * USERNAME VALIDITY
		 * */
			//Make a feeble attempt with regular expressions
			//to check the validity of the username
			//<alphabet><Between 7-15 alphanumeric characters>
			var result = u[0].search(/[A-Za-z][A-Za-z0-9]{7,15}/);
			if(result == -1)
				valid = false;
		/*
		 * *
		 * * PASSWORD VALIDITY
		 * */
			//Start testing the validity of the password.
			//Check if password contains atleast one number
			result = /[0-9]/.test(u[1]);
			if(!result)
				valid = false;

			//Check if password contains at least one uppercase letter.
			result = /[A-Z]/.test(u[1]);
			if(!result)
				valid =  false;
			//Check if the length of the password is atleast 8
			if(u[1].length < 8)
				valid = false;
		}
		return valid;
	}
}
