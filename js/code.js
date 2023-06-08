const urlBase = 'LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ----- Navigation Functions -----

function goAdd()
{
	window.location.href = "add.html";
}

function goContacts()
{
	window.location.href = "contacts.html";
}

function goIndex()
{
	window.location.href = "index.html";
}

function goLogin()
{
	window.location.href = "login.html";
}

function goRegister()
{
	window.location.href = "register.html";
}

// ----- Login Functions -----

// Clears any displayed error of a matching field id
function clearError(field)
{
	let error = document.getElementById(field.id + "Error");
	error.innerHTML = "";
	error.style.display = "none";
}

// Checks that both password fields match when registering
function confirmPassword()
{
	let password = document.getElementById("registerPassword").value;
	let confirm = document.getElementById("confirmPassword").value;
	let confirmError = document.getElementById("confirmPasswordError");

	if (confirm != password)
	{
		confirmError.innerHTML = "Passwords don't match";
		confirmError.style.display = "inline-block";
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let username = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;
	let usernameError = document.getElementById("loginUsernameError");
	let passwordError = document.getElementById("loginPasswordError");
	// var hash = md5(password);

	// Placeholders
	// let user = "user";
	// let pass = "pass";

	// if (username == "")
	// {
	// 	usernameError.innerHTML = "Invalid username";
	// 	usernameError.style.display = "inline-block";
	// 	return;
	// }
	
	// if (username != user)
	// {
	// 	usernameError.innerHTML = "User not found"
	// 	usernameError.style.display = "inline-block";
	// 	return;
	// }

	// if (password != pass)
	// {
	// 	passwordError.innerHTML = "Incorrect password";
	// 	passwordError.style.display = "inline-block";
	// 	return;
	// }

	// goContacts(); // DEBUG

	// Do Login

	let tmp = {username:username, password:password};
	// var tmp = {username:username, password:hash};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/Login." + extension;
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1)
				{
					console.log("Incorrect login");
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				saveCookie();
				window.location.href = "contacts.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		console.log(err.message);
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	localStorage.setItem('logout', "true");
	window.location.href = "index.html";
}

function logoutSuccess()
{
	if (localStorage.getItem('logout') === "true")
	{
		document.getElementById("logoutSuccess").innerHTML = "Successfully logged out";
		document.getElementById("logoutSuccess").style.display = "inline-block";
		localStorage.setItem('logout', "false");
	}
}

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let username = document.getElementById("registerUsername").value;
	let firstname = document.getElementById("registerFirstName").value;
	let lastname = document.getElementById("registerLastName").value;
	let password = document.getElementById("registerPassword").value;
	let confirm = document.getElementById("confirmPassword").value;
	let usernameError = document.getElementById("registerUsernameError");
	let firstNameError = document.getElementById("registerFirstNameError");
	let lastNameError = document.getElementById("registerLastNameError");
	let passwordError = document.getElementById("registerPasswordError");
	let confirmError = document.getElementById("confirmPasswordError");
	
	// Validate that all fields have correct input data

	// Check in sequential order that no fields were left empty
	if (username == "")
	{
		usernameError.innerHTML = "Invalid username";
		usernameError.style.display = "inline-block";
	}
	else if (firstname == "")
	{
		firstNameError.innerHTML = "Invalid first name";
		firstNameError.style.display = "inline-block";
	}
	else if (lastname == "")
	{
		lastNameError.innerHTML = "Invalid last name";
		lastNameError.style.display = "inline-block";
	}
	else if (password == "")
	{
		passwordError.innerHTML = "Invalid password";
		passwordError.style.display = "inline-block";
	}
	else if (confirm == "")
	{
		confirmError.innerHTML = "Passwords don't match";
		confirmError.style.display = "inline-block";
	}

	// Check if there are any active errors still being displayed
	if (usernameError.style.display == "inline-block"
	|| firstNameError.style.display == "inline-block"
	|| lastNameError.style.display == "inline-block"
	|| passwordError.style.display == "inline-block"
	|| confirmError.style.display == "inline-block")
	{
		return;
	}

	// Do Register
	let tmp = {firstName:firstname, lastName:lastname, username:username, password:password};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.results[0].ID;

				firstName = firstname;
				lastName = lastname;
				saveCookie();
				goContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}
}

function registerFirstName()
{
	let firstname = document.getElementById("registerFirstName").value;
	let firstNameError = document.getElementById("registerFirstNameError");
}

function registerLastName()
{
	let lastname = document.getElementById("registerLastName").value;
	let lastNameError = document.getElementById("registerLastNameError");
}

function registerPassword()
{
	let password = document.getElementById("registerPassword").value;
	let passwordError = document.getElementById("registerPasswordError");
	let valid = new RegExp("(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})");

	// Checks that a password satisfies complexity requirement
	// If a password is currently failing, notifies the user what's wrong with it
	if (!valid.test(password))
	{
		passwordError.innerHTML = "Password must contain:";
		passwordError.style.display = "inline-block";

		let upper = new RegExp("(?=.*[A-Z])");
		let lower = new RegExp("(?=.*[a-z])");
		let number = new RegExp("(?=.*[0-9])");
		let symbol = new RegExp("(?=.*[^A-Za-z0-9])");
		let length = new RegExp("(?=.{8,})");
		
		if (!upper.test(password))
		{
			passwordError.innerHTML += "\r\nUppercase letter";
		}
		if (!lower.test(password))
		{
			passwordError.innerHTML += "\r\nLowercase letter";
		}
		if (!number.test(password))
		{
			passwordError.innerHTML += "\r\nNumber";
		}
		if (!symbol.test(password))
		{
			passwordError.innerHTML += "\r\nSymbol";
		}
		if (!length.test(password))
		{
			passwordError.innerHTML += "\r\nAt least 8 characters";
		}
	}
}

function registerUsername()
{
	let username = document.getElementById("registerUsername").value;
	let usernameError = document.getElementById("registerUsernameError");

	// Example feature
	if (username == "user")
	{
		usernameError.innerHTML = username + " already exists";
		usernameError.style.display = "inline-block";
	}
}

// ----- Event Functions -----

// Formats birthday input field as XX/XX or XX/XX/XXXX depending on number of digits
function birthday()
{
	let birthdayField = document.getElementById("birthday");
	let birthdayError = document.getElementById("birthdayError");
	let birthdayValue = birthdayField.value.replace(/\D/g, "");

	if (birthdayValue.length != 0 && birthdayValue.length != 4 && birthdayValue.length < 8)
	{
		birthdayError.innerHTML = "Invalid birthday";
		birthdayError.style.display = "inline-block";
	}

	if (birthdayValue.length >= 5)
	{
		birthdayField.value = birthdayValue.slice(0, 2) + "/" + birthdayValue.slice(2, 4) + "/" + birthdayValue.slice(4, 8);
	}
	else if (birthdayValue.length >= 3 && birthdayValue.length <= 4)
	{
		birthdayField.value = birthdayValue.slice(0, 2) + "/" + birthdayValue.slice(2);
	}
	else
	{
		birthdayField.value = birthdayValue.slice(0, 2);
	}
}

// Formats phone number input field as XXX-XXXX or (XXX) XXX-XXXX depending on number of digits
function phoneNumber()
{
	let phoneField = document.getElementById("phoneNumber");
	let phoneError = document.getElementById("phoneNumberError");
	let phoneValue = phoneField.value.replace(/\D/g, "");

	if (phoneValue.length != 0 && phoneValue.length != 7 && phoneValue.length < 10)
	{
		phoneError.innerHTML = "Invalid phone number";
		phoneError.style.display = "inline-block";
	}

	if (phoneValue.length >= 8)
	{
		phoneField.value = "(" + phoneValue.slice(0, 3) + ") " + phoneValue.slice(3, 6) + "-" + phoneValue.slice(6, 10);
	}
	else if (phoneValue.length >= 4 && phoneValue.length <= 7)
	{
		phoneField.value = phoneValue.slice(0, 3) + "-" + phoneValue.slice(3);
	}
	else
	{
		phoneField.value = phoneValue.slice(0, 3);
	}
}

// Allows for logging in and registering by pressing "Enter" on the final input field
// On other input fields, allows for moving focus to the next input field
function proceed(field)
{
	document.getElementById(field.id).addEventListener("keyup", function (event)
	{
		if (event.key === "Enter")
		{
			switch (field.id)
			{
				case "loginPassword":
					doLogin();
					break;
				case "confirmPassword":
					doRegister();
					break;
				default:
					let next = field.nextElementSibling;
					while (next.className != "inputText")
					{
						next = next.nextElementSibling;
					}
					next.focus();
			}
		}
	}, {once : true});
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if(tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if(tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if(tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}

	if(userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		console.log("Logged in as: " + firstName + " " + lastName);
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// ----- Action Functions -----

function addContact()
{
	readCookie();

	let first = document.getElementById("firstName").value;
	let last = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phoneNumber").value;
	let birthday = document.getElementById("birthday").value;
	let firstError = document.getElementById("firstNameError");
	let lastError = document.getElementById("lastNameError");
	let emailError = document.getElementById("emailError");
	let phoneError = document.getElementById("phoneNumberError");
	let birthdayError = document.getElementById("birthdayError");
	
	// Validate first name isn't empty
	if (first == "")
	{
		firstError.innerHTML = "Invalid first name";
		firstError.style.display = "inline-block";
	}

	// Check if there are any active errors still being displayed
	if (firstError.style.display == "inline-block"
	|| lastError.style.display == "inline-block"
	|| emailError.style.display == "inline-block"
	|| phoneError.style.display == "inline-block"
	|| birthdayError.style.display == "inline-block")
	{
		return;
	}

	// Add Contact
	
	// let newContact = document.getElementById("contactText").value;
	// document.getElementById("addContactResult").innerHTML = "";
	
	let tmp = {firstName:first, lastName:last, phone:phone, email:email, userID:userId};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/AddContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				goContacts();
				//document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}
}

function deleteContact(val)
{
	readCookie();

	let tmp = {userID:userId, ID:val};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById(val).innerHTML = "";
				//document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}
}

function editContact(val)
{
	let contactDiv = document.getElementById(val);
	let firstName = document.getElementById("FirstName_" + val).innerHTML;
	let lastName = document.getElementById("LastName_" + val).innerHTML;
	let phone = document.getElementById("Phone_" + val).innerHTML;
	let email = document.getElementById("Email_" + val).innerHTML;

	document.getElementById("FirstName_" + val).innerHTML =
		'<input type="text" class="editContact" id="FirstNameInput_' + val + '" ' + 'value="' + firstName + '"/>';
	document.getElementById("LastName_" + val).innerHTML =
		'<input type="text" class="editContact" id="LastNameInput_' + val + '" ' + 'value="' + lastName + '"/>';
	document.getElementById("Phone_" + val).innerHTML =
		'<input type="text" class="editContact" id="PhoneInput_' + val + '" ' + 'value="' + phone + '"/>';
	document.getElementById("Email_" + val).innerHTML =
		'<input type="text" class="editContact" id="EmailInput_' + val + '" ' + 'value="' + email + '"/>';

	document.getElementById("EditButton_" + val).setAttribute("onclick", "finalizeEdit(" + val + ");");
}

function finalizeEdit(val)
{
	let firstName = document.getElementById("FirstNameInput_" + val).value;
	let lastName = document.getElementById("LastNameInput_" + val).value;
	let phone = document.getElementById("PhoneInput_" + val).value;
	let email = document.getElementById("EmailInput_" + val).value;

	document.getElementById("FirstName_" + val).innerHTML = firstName;
	document.getElementById("LastName_" + val).innerHTML = lastName;
	document.getElementById("Phone_" + val).innerHTML = phone;
	document.getElementById("Email_" + val).innerHTML = email;

	let tmp = {firstName:firstName, lastName:lastName, phone:phone, email:email, ID:val, birthDay:0};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/UpdateContact.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("addContactResult").innerHTML = err.message;
	}

	document.getElementById("EditButton_" + val).setAttribute("onclick", "editContact(" + val + ");");
}

function onContactsLoad()
{
	readCookie();
	document.getElementById("username").innerHTML = firstName + " " + lastName;
}

function searchContacts()
{
	let srch = document.getElementById("searchContacts").value;
	document.getElementById("searchContactsResult").innerHTML = "";

	if (srch == "")
	{
		document.getElementById("contactList").innerHTML = "";
		return;
	}

	readCookie();

	let contactList = "";

	let tmp 	= {userId:userId, search:srch};
	let jsonPayload 				= JSON.stringify(tmp);
	let url 						= urlBase + '/SearchContact.' + extension;
	let xhr 			= new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	document.getElementById("contactList").innerHTML = "";

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchContactsResult").innerHTML = "Contact(s) has been retrieved";

				let jsonObject = JSON.parse( xhr.responseText );
				for( let i= 0; i < jsonObject.results.length; i++ )
				{
					let id = jsonObject.results[i].ID;

					contactList += '<tr id="' + id + '">' +
						'<th class="contactInformation" id="FirstName_' + id + '">' + jsonObject.results[i].FirstName + "</th>" +
						'<th class="contactInformation" id="LastName_' + id + '">' + jsonObject.results[i].LastName + "</th>" +
						'<th class="contactInformation" id = "Phone_' + id + '">' + jsonObject.results[i].Phone + "</th>" +
						'<th class="contactInformation" id = "Email_' + id + '">' + jsonObject.results[i].Email + "</th>" +
						'<th>' + '<button type="button" ' + 'onclick="editContact(' + id + ');" ' + 'id="EditButton_' + id + '" class="material-symbols-outlined">edit</button>' + "</th>" +
						'<th>' + '<button type="button" ' + 'onclick="deleteContact(' + id + ');" ' + 'id="EditButton_' + id + '" class="material-symbols-outlined">person_remove</button>' + "</th>" +
					"</tr>";
				}

				document.getElementById("contactList").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactList").innerHTML = err.message;
	}
}

// Shows or hides the text of a password input field
function toggleVisibility(field)
{
	let icon = document.getElementById(field.id);
	let str = field.id.slice(0, field.id.length - 10);
	let text = document.getElementById(str + "Password");

	if (text.type == "password")
	{
		icon.innerHTML = "visibility_off";
		icon.title = "Hide Password";
		text.type = "text";
	}
	else
	{
		icon.innerHTML = "visibility";
		icon.title = "Show Password";
		text.type = "password";
	}
}
