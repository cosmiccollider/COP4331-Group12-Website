const urlBase = 'http://127.0.0.1:5500/UCF/COP%204331/Small%20Project';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ----- Navigation Functions -----

function goContacts() // DEBUG ONLY
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

// ----- Account Functions -----

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let username = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {username:username,password:password};
//	var tmp = {username:username,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let username = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;
	let confirm = document.getElementById("confirmPassword").value;
}

// ----- Event Functions -----

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// ----- Action Functions -----

function addContact()
{
	let newContact = document.getElementById("contactText").value;
	document.getElementById("addContactResult").innerHTML = "";

	let tmp = {contact:newContact,userId,userId};
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
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

function deleteContact()
{
	//
}

function editContact()
{
	//
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("searchContactsResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchContactsResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchContactsResult").innerHTML = err.message;
	}
}

function toggleVisibility(confirmPassword)
{
	if (confirmPassword)
	{
		var icon = document.getElementById("confirmVisibility");
		var text = document.getElementById("confirmPassword");
	}
	else
	{
		var icon = document.getElementById("passwordVisibility");
		var text = document.getElementById("loginPassword");
	}

	if (text.type == "password")
	{
		icon.textContent = "visibility_off";
		icon.title = "Hide Password";
		text.type = "text";
	}
	else
	{
		icon.textContent = "visibility";
		icon.title = "Show Password";
		text.type = "password";
	}
}
