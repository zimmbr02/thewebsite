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
				p = document.createElement('p');
				p.appendChild(document.createTextNode('Incorrect username or password'));
				p.style.color = "red";
						
				container = document.querySelector('#login_container');
				container.appendChild(p);
			}
					
			else {
				//checks to remember the username and password locally
				checkbox = document.querySelector('#rememberCheckbox');
				if (checkbox.checked) {	
					localStorage.setItem("username",JSON.stringify(username));
					localStorage.setItem("password",JSON.stringify(password));
				}
						
				window.location = "home.html";
			}
		}
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