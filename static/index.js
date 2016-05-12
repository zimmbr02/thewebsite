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
		
restoreLocalUserInfo = function() {
	rememberedUsername = JSON.parse(localStorage.getItem("username"));
	rememberedPassword = JSON.parse(localStorage.getItem("password"));
			
	username = document.querySelector('#username');
	password = document.querySelector('#password');
			
	username.value = rememberedUsername;
	password.value = rememberedPassword;
}