
<?php
	$inData = getRequestInfo();

	$id = 0;
	$firstName = "";
	$lastName = "";

	$conf = json_decode(file_get_contents('conf.json'), true);
	$conn = new mysqli($conf['hostname'], $conf['username'], $conf['password'], $conf['database']);

	if( $conn->connect_error ) // fail connection to the database
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Prepare a SQL statement template and parameters for login and password
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Login=? AND Password =?");
		// i - int, d - double, s - string, b - BLOB
		$stmt->bind_param("ss", $inData["username"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		// Fetch a result row as an associative array
		if( $row = $result->fetch_assoc() )
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
