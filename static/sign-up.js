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
		
showAnswer = function() {
	if (document.querySelector('#showAnswer').checked) {
		document.querySelector('#answer').type = "text";
	}
	else {
		document.querySelector('#answer').type = "password";
	}
}