<?php
	$inData = getRequestInfo();
	
	$firstName  = $inData["firstName"];
    $lastName   = $inData["lastName"];
	$phone      = $inData["phone"];
    $email      = $inData["email"];
    $userID     = $inData["userID"];
	$birthDay	= $inData["birthDay"];

    $conf = json_decode(file_get_contents('conf.json'), true);
    $conn = new mysqli($conf['hostname'], $conf['username'], $conf['password'], $conf['database']);

	if ($conn->connect_error)
	{
			returnWithError( $conn->connect_error );
	}
	else
	{
			$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID, Birthday) VALUES(?,?,?,?,?,?)");
			$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userID, $birthDay);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>