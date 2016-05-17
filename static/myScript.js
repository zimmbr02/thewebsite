var showData = false;
var showChangePassword = false;
var showDeleteAccount = false;

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

changePassword = function() {
	oldPassword = document.querySelector('#oldPassword').value;
	
	var req = new XMLHttpRequest();
	req.open("POST", "/confirmPassword", true);
	req.setRequestHeader("Content-type", "application/json");
	var data = {sentPassword:oldPassword};
	data.done = true;
	req.send(JSON.stringify(data));
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			confirmation = JSON.parse(req.responseText);
			if (confirmation.tasklist[0] != true) {
				p = document.querySelector('.incorrect');
				p.innerHTML = 'Incorrect password';
				p.style.color = "red";
			}
					
			else {
				settings = document.querySelector('#accountSettings');
				settings.innerHTML = "";
				
				form = document.createElement('form');
				form.role = "form";
				newDiv = document.createElement('div');
				newDiv.classList.add("form-group");
				newLabel = document.createElement('label');
				newLabel.htmlFor = "password";
				newLabel.id = "checkPassword";
				newLabel.innerHTML = "New Password:";
				newInput = document.createElement('input');
				newInput.type = "password";
				newInput.classList.add("form-control");
				newInput.id = "password";
				newInput.oninput = passwordMatch;
				
				newDiv.appendChild(newLabel);
				newDiv.appendChild(newInput);
				form.appendChild(newDiv);
				
				confirmDiv = document.createElement('div');
				confirmDiv.classList.add("form-group");
				confirmLabel = document.createElement('label');
				confirmLabel.htmlFor = "password";
				confirmLabel.id = "checkConfirmPassword";
				confirmLabel.innerHTML = "Confirm Password:";
				confirmInput = document.createElement('input');
				confirmInput.type = "password";
				confirmInput.classList.add("form-control");
				confirmInput.id = "confirmPassword";
				confirmInput.oninput = passwordMatch;
				
				confirmDiv.appendChild(confirmLabel);
				confirmDiv.appendChild(confirmInput);
				form.appendChild(confirmDiv);
				
				
				button = document.createElement('button');
				button.type = "button";
				button.classList.add("btn");
				button.classList.add("btn-primary");
				button.onclick = updatePassword;
				button.innerHTML = "Change Password";
				p = document.createElement('p');
				p.classList.add("incorrect");

				settings.appendChild(form);
				settings.appendChild(button);
				settings.appendChild(p);
				
			}
		}
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

deleteAccount = function() {
	oldPassword = document.querySelector('#oldPassword').value;
	
	var req = new XMLHttpRequest();
	req.open("POST", "/confirmPassword", true);
	req.setRequestHeader("Content-type", "application/json");
	var data = {sentPassword:oldPassword};
	data.done = true;
	req.send(JSON.stringify(data));
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			confirmation = JSON.parse(req.responseText);
			if (confirmation.tasklist[0] != true) {
				p = document.querySelector('.incorrect');
				p.innerHTML = 'Incorrect password';
				p.style.color = "red";
			}
					
			else {
				if (confirm("Are you sure you wish to delete your account? This action CANNOT be undone!")) {
					var req2 = new XMLHttpRequest();
					req2.open("POST", "/deleteAccount", true);
					req2.setRequestHeader("Content-type", "application/json");
					var data2 = {};
					data2.done = true;
					req2.send(JSON.stringify(data2));
					req2.onreadystatechange = function() {
						if (req2.readyState == 4 && req2.status == 200) {
							confirmation = JSON.parse(req2.responseText);
							if (confirmation.tasklist[0] == true) {
								alert("Account Deleted.");
								window.location = "/";
							}
								
							else {
								alert("Oops! Something went wrong!");
							}
						}
					}
				}
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
	alert("Oops! This isn't working yet :/");
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

showAllUsersPersonalInfo = function() {
	tbody = document.querySelector('#personalDataBody');
	
	var req = new XMLHttpRequest();
	req.open("GET", "/personalData", true);
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			users = JSON.parse(req.responseText);
			if (! showData) {
				for (user in users.tasklist) {
					tr = document.createElement('tr');
					columnUsername = document.createElement('td');
					columnPassword = document.createElement('td');
					columnUsername.appendChild(document.createTextNode(users.tasklist[user].sentUsername));
					columnPassword.appendChild(document.createTextNode(users.tasklist[user].sentPassword));
					tr.appendChild(columnUsername);
					tr.appendChild(columnPassword);
					tbody.appendChild(tr);
				}
				table = document.querySelector('#personalData');
				table.style.display = "table";
				showData = true;
			}
			else {}
		}
	}
	req.send()
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

showChangePasswordInput = function() {

	settings = document.querySelector('#accountSettings');
	
	//settings.innerHTML = "";
	
	if (! showChangePassword) {
	
		form = document.createElement('form');
		form.role = "form";
		div = document.createElement('div');
		div.classList.add("form-group");
		label = document.createElement('label');
		label.htmlFor = "oldPassword";
		label.innerHTML = "Old Password:";
		input = document.createElement('input');
		input.type = "password";
		input.classList.add("form-control");
		input.id = "oldPassword";
		button = document.createElement('button');
		button.type = "button";
		button.classList.add("btn");
		button.classList.add("btn-primary");
		button.onclick = changePassword;
		button.innerHTML = "Change Password";
		p = document.createElement('p');
		p.classList.add("incorrect");
		
		div.appendChild(label);
		div.appendChild(input);
		form.appendChild(div);
		settings.appendChild(form);
		settings.appendChild(button);
		settings.appendChild(p);
		showChangePassword = true;
	}
	
	else {}
}

showDeleteAccountInput = function() {

	settings = document.querySelector('#accountSettings');
	
	//settings.innerHTML = "";
	
	if (! showDeleteAccount) {
	
		form = document.createElement('form');
		form.role = "form";
		div = document.createElement('div');
		div.classList.add("form-group");
		label = document.createElement('label');
		label.htmlFor = "oldPassword";
		label.innerHTML = "Password:";
		input = document.createElement('input');
		input.type = "password";
		input.classList.add("form-control");
		input.id = "oldPassword";
		button = document.createElement('button');
		button.type = "button";
		button.classList.add("btn");
		button.classList.add("btn-danger");
		button.onclick = deleteAccount;
		button.innerHTML = "Delete Account";
		p = document.createElement('p');
		p.classList.add("incorrect");
		
		div.appendChild(label);
		div.appendChild(input);
		form.appendChild(div);
		settings.appendChild(form);
		settings.appendChild(button);
		settings.appendChild(p);
		showDeleteAccount = true;
	}
	
	else {}
}

updatePassword = function() {
	checkPassword = document.querySelector('#checkPassword');
	checkConfirmPassword = document.querySelector('#checkConfirmPassword');
	
	if (checkPassword.style.color == checkConfirmPassword.style.color && checkPassword.style.color == "green") {
	
		password = document.querySelector('#password').value;
	
		var req = new XMLHttpRequest();
		req.open("POST", "/updatePassword", true);
		req.setRequestHeader("Content-type", "application/json");
		var data = {sentPassword:password};
		data.done = true;
		req.send(JSON.stringify(data));
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				confirmation = JSON.parse(req.responseText);
				if (confirmation.tasklist[0] == true) {
					p = document.querySelector('.incorrect');
					p.innerHTML = 'Password Updated Successfully!';
					p.style.color = "green";
				}
					
				else {
					alert("Oops! Something went wrong!");
				}
			}
		}
	}
	
	else {
		p = document.querySelector('.incorrect');
		p.innerHTML = 'Passwords do not match!';
		p.style.color = "red";
	}
}