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

exports.view = function(req, res) {
	  res.render('view');
};


/*
 *  * GET register page.
 *   */

exports.loginUser = function(req, res) {
	u = req.body.username;
	p = req.body.password;
	var obj = {};
        obj[u] = p;
        dataArray.push(obj);
	console.log('Pushed!'+  JSON.stringify(dataArray[counter]));
//	counter ++;
	res.render('login');
};

exports.viewUser = function(req, res) {
	var u = JSON.stringify(dataArray).split('}');
	//res.render('view');
	//res.set('Content-Type', 'text/html');
	var printStuff = function(num, doneCallback)
	{
		
	    var delay = Math.floor((Math.random()*45000)+5000); ;
	    if(num.trim() != null)
		{
		    setTimeout(function()
			{
				num = num.replace('[','');
				num = num.replace('{','');
				num = num.replace(']','');
				num = num.replace(',','');
			   var boolValidation =  validateUsernameAndPassword(num);
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
			    return doneCallback(null, num);
		    }, delay);
	    }
     };
	async.map(u,printStuff,function(err, results)
	{
	 //	    console.log("Finished");
	 //	    console.log(results);
		if(counter >= u.length - 1)
		{
			console.log("DONE!");
			res.end();
		}
	});

	function validateUsernameAndPassword(num1)
	{
		var u = num1.split(":");
		var valid = true;

		if(u[0] == "" || u[1] == "")
        {
			valid =  false;
        }
        else
        {

			var result = u[0].search(/[A-Za-z][A-Za-z0-9]{7,15}/);
			if(result == -1)
				valid = false;


			result = /[0-9]/.test(u[1]);
			
			if(!result)
				valid = false;
			result = /[A-Z]/.test(u[1]);
			if(!result)
				valid =  false;
			if(u[1].length < 8)
				valid = false;
		}
		return valid;
	}
}
