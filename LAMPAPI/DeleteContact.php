<?php
    $inData     = getRequestInfo();

    $userID     = $inData["userID"];
    $firstName  = $inData["firstName"];
    $lastName   = $inData["lastName"];
    $id         = $inData["ID"];

    $conf = json_decode(file_get_contents('conf.json'), true);
    $conn = new mysqli($conf['hostname'], $conf['username'], $conf['password'], $conf['database']);

    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName = ? AND LastName = ? AND UserID = ? AND ID = ?");
        $stmt->bind_param("ssss", $firstName, $lastName, $userID, $id);
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