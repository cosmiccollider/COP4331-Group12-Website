<?php

	$inData = getRequestInfo();

    $newFirstName       = $inData["firstName"];
	$newLastName        = $inData["lastName"];
	$newPhoneNumber     = $inData["phone"];
	$newEmail           = $inData["email"];
	$ID                 = $inData["ID"];
	$newBirthDay		= $inData["birthDay"];

	$conf = json_decode(file_get_contents('conf.json'), true);
    $conn = new mysqli($conf['hostname'], $conf['username'], $conf['password'], $conf['database']);
	
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ?, Birthday = ? WHERE ID = ?");
		$stmt->bind_param("ssssss", $newFirstName, $newLastName, $newPhoneNumber, $newEmail, $newBirthDay, $ID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}


?>