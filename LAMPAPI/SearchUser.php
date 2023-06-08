
<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

    $conf = json_decode(file_get_contents('conf.json'), true);
    $conn = new mysqli($conf['hostname'], $conf['username'], $conf['password'], $conf['database']);

    if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $inData["username"]);
		$stmt->execute();
		$result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $searchResults .= ",";
            }
            $searchCount++;
            // $searchResults .= '"' . $row["FirstName"] . '"';
            //"." means add
            $searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "Login" : "' . $row["Login"]. '", "ID" : "' . $row["ID"]. '"}';
        }

        if( $searchCount == 0 )
        {
            returnWithNotFound( $searchResults);
        }
        else
        {
            returnWithInfo( $searchResults );
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
		$retValue = '{"Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
	}
    function returnWithNotFound($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>