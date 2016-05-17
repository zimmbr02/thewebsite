answerPresent = function() {
	answer = document.querySelector('#answer').value;

	if (answer.length < 1 || answer.length > 19) {
		checkAnswer = document.querySelector('#checkAnswer');
		checkAnswer.innerHTML = "Answer: Answer must be between 1 and 19 characters long!";
		checkAnswer.style.color = "red";
	}
	
	else {
		checkAnswer = document.querySelector('#checkAnswer');
		checkAnswer.innerHTML = "Answer:";
		checkAnswer.style.color = "green";
	}
}

createAccount = function() {
	checkUsername = document.querySelector('#checkUsername');
	checkPassword = document.querySelector('#checkPassword');
	checkConfirmPassword = document.querySelector('#checkConfirmPassword');
	checkSecurity = document.querySelector('#checkSecurity');
	checkAnswer = document.querySelector('#checkAnswer');
	if (checkUsername.style.color == checkPassword.style.color && checkUsername.style.color == checkConfirmPassword.style.color
		&& checkUsername.style.color == checkSecurity.style.color && checkUsername.style.color == checkAnswer.style.color
		&& checkUsername.style.color == "green") {
		
		username = document.querySelector('#username').value;
		password = document.querySelector('#password').value;
		question = document.querySelector('#sel1').value;
		answer = document.querySelector('#answer').value;
				
		var req = new XMLHttpRequest();
		req.open("POST", "/sign-up", true);
		req.setRequestHeader("Content-type", "application/json");
		var data = {sentUsername:username,sentPassword:password,sentQuestion:question,
			sentAnswer:answer};
		data.done = true;
		req.send(JSON.stringify(data));
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				var confirmation = JSON.parse(req.responseText);
				if (confirmation.tasklist[0] == true) {
					alert("Account Created");
					window.location = "home.html/" + username;
				}
				
				else {
					p = document.querySelector('.incorrect');
					p.innerHTML = 'User Database is full. Try again later!';
					p.style.color = "red";
				}
			}
		}
	}
	
	else {
		p = document.querySelector('.incorrect');
		p.innerHTML = 'One or more forms are not filled out correctly';
		p.style.color = "red";
	}
}

checkQuestion = function() {
	select = document.querySelector('#sel1');
	checkSecurity = document.querySelector('#checkSecurity');
	
	if (select.value != 0) {
		checkSecurity.style.color = "green";
	}
	
	else {
		checkSecurity.style.color = "red";
	}
}

//The sign-up.html page calls this when a user starts typing in the New Username box
checkUsernameAvailability = function() {
	username = document.querySelector('#username').value;
				
	var req = new XMLHttpRequest();
	req.open("POST", "/checkUsernameAvailability", true);
	req.setRequestHeader("Content-type", "application/json");
	var data = {sentUsername:username};
	data.done = true;
	req.send(JSON.stringify(data));
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			confirmation = JSON.parse(req.responseText);
			
			if (username.length < 6 || username.length > 19) {
				checkUsername = document.querySelector('#checkUsername');
				checkUsername.innerHTML = 'New Username: Username must be between 6 and 19 characters long!';
				checkUsername.style.color = "red";
			}
						
			else if (confirmation.tasklist[0] == true) {
				checkUsername = document.querySelector('#checkUsername');
				checkUsername.innerHTML = 'New Username: Username already taken!';
				checkUsername.style.color = "red";
			}
			
			else {
				checkUsername = document.querySelector('#checkUsername');
				checkUsername.innerHTML = 'New Username: Username Available!';
				checkUsername.style.color = "green";
			}
		}
	}
}

/* The forgotPassword.html page calls this when a user clicks the fetchQuestion button.
	This function makes a request to the server to get the username's matching security question.
	If it finds a match, it will give the user a chance to answer the question. 
	If the user answers correctly, the user will be able to enter a new password.
	If any of the info is incorrect, an error message will be displayed. */
fetchQuestion = function() {
	
}

/* The index.html page calls this when the user clicks the logIn button.
	This function makes a request to the server to check the username and password entered by the user
	with the users database. If there is a match, the server will return true. If this is the case,
	the user will be redirected to the home page and stay logged in. If false is returned by the server,
	an error message will be displayed. */
logIn = function() {
	username = document.querySelector('#username').value;
	password = document.querySelector('#password').value;
				
	var req = new XMLHttpRequest();
	req.open("POST", "/login", true);
	req.setRequestHeader("Content-type", "application/json");
	var data = {sentUsername:username,sentPassword:password};
	data.done = true;
	req.send(JSON.stringify(data));
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			confirmation = JSON.parse(req.responseText);
			if (confirmation.tasklist[0] != true) {
				p = document.querySelector('.incorrect');
				p.innerHTML = 'Incorrect username or password';
				p.style.color = "red";
			}
					
			else {
				//checks to remember the username and password locally
				checkbox = document.querySelector('#rememberCheckbox');
				if (checkbox.checked) {	
					localStorage.setItem("username",JSON.stringify(username));
					localStorage.setItem("password",JSON.stringify(password));
				}
						
				window.location = "home.html/" + username;
			}
		}
	}
}

logInRedirector = function() {
	logButton = document.querySelector('#logButton');
	
	if (logButton.text == " Log-in") {
		window.location = "log-in.html";
	}
	
	else {
		window.location = "/";
	}
}

passwordMatch = function() {
	passwordOne = document.querySelector('#password').value;
	passwordTwo = document.querySelector('#confirmPassword').value;
	checkPassword = document.querySelector('#checkPassword');
	checkConfirmPassword = document.querySelector('#checkConfirmPassword');
	
	if (passwordOne.length < 6 || passwordOne.length > 19) {
		checkPassword.innerHTML = 'New Password: Password must be between 6 and 19 characters long!';
		checkPassword.style.color = "red";
	}
	
	else if (passwordOne == passwordTwo) {
		checkPassword.innerHTML = 'New Password: Passwords match!';
		checkPassword.style.color = "green";
		checkConfirmPassword.innerHTML = 'Confirm Password: Passwords match!';
		checkConfirmPassword.style.color = "green";
	}
	
	else {
		checkPassword.innerHTML = 'New Password: Passwords do not match!';
		checkPassword.style.color = "red";
		checkConfirmPassword.innerHTML = 'Confirm Password: Passwords do not match!';
		checkConfirmPassword.style.color = "red";
	}
}

//The index.html page calls this when the user loads the index.html to restore the locally saved user info, if any.		
restoreLocalUserInfo = function() {
	rememberedUsername = JSON.parse(localStorage.getItem("username"));
	rememberedPassword = JSON.parse(localStorage.getItem("password"));
			
	username = document.querySelector('#username');
	password = document.querySelector('#password');
			
	username.value = rememberedUsername;
	password.value = rememberedPassword;
}

//The sign-up.html page calls this when the user checks showPassword.
showPassword = function() {
	if (document.querySelector('#showPassword').checked) {
		document.querySelector('#password').type = "text";
		document.querySelector('#confirmPassword').type = "text";
	}
	else {
		document.querySelector('#password').type = "password";
		document.querySelector('#confirmPassword').type = "password";
	}
}

//The sign-up.html page calls this when the user checks showAnswer.		
showAnswer = function() {
	if (document.querySelector('#showAnswer').checked) {
		document.querySelector('#answer').type = "text";
	}
	else {
		document.querySelector('#answer').type = "password";
	}
}