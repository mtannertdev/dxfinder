<?php

	include("countries.php");

	if(isset($_POST["submit"]))
	{
		$uploaded_file = ProcessUpload();
		
	}
	else
	{
		ShowForm();
	}

	function ProcessUpload()
	{
		$HASH_SECRET = "a1f9296dfb46c852d811743cadd9fc657aa0a32b9c8cfa77856efd1833528479";
		
		if (trim($_POST["pin"]) == "")
		{
			throw new RuntimeException('Invalid PIN.');
		}
		
		if (!isset($_FILES['upfile']['error']) || is_array($_FILES['upfile']['error']))
		{
			throw new RuntimeException('Invalid parameters.');
		}
		
		switch ($_FILES['upfile']['error']){
			case UPLOAD_ERR_OK:
				break;
			case UPLOAD_ERR_NO_FILE:
				throw new RuntimeException('No file sent.');
			case UPLOAD_ERR_INI_SIZE:
			case UPLOAD_ERR_FORM_SIZE:
				throw new RuntimeException('Exceeded filesize limit.');
			default:
				throw new RuntimeException('Unknown errors.');
		}
		
		//if ($_FILES['upfile']['size'] > 1000000) {
		//	throw new RuntimeException('Exceeded filesize limit.');
		//}
		
		
		//date_default_timezone_set('UTC');
		$dest_filename = hash('sha256', $HASH_SECRET . trim($_POST["pin"]));
		
		//if (!move_uploaded_file($_FILES['upfile']['tmp_name'], './logs/' . $dest_filename)) {
		//	throw new RuntimeException('Failed to move uploaded file.');
		//}
		
		$WorkedEntities = array();

		$log_data = file_get_contents($_FILES['upfile']['tmp_name']);
		$end_of_header =  strpos($log_data, "<EOH>");
		$log_data = substr($log_data, $end_of_header + 5);
		$log_array = explode("<EOR>", strtoupper($log_data));
		
		foreach ($log_array as $entry)
		{
			$entry = trim($entry);
			if (!(strpos($entry, "<QSL_RCVD:") === false))
            {
				$COUNTRY = "";
				$CALL = "";
				$BAND = "";
				$MODE_SPECIFIC = "";
				$MODE = "";
				
				if (!(strpos($entry, "<CALL:") === false))
				{
					$call_length_start = strpos($entry, "<CALL:") + strlen("<CALL:");
					$call_length_end = strpos($entry, ">", $call_length_start);
					$call_length = intval(substr($entry, $call_length_start, $call_length_end - $call_length_start));
					$CALL = substr($entry, $call_length_end + 1, $call_length);
					$COUNTRY = GetCountryFromCall($CALL);
				}
				if (!(strpos($entry, "<BAND:") === false))
				{
					$band_length_start = strpos($entry, "<BAND:") + strlen("<BAND:");
					$band_length_end = strpos($entry, ">", $band_length_start);
					$band_length = intval(substr($entry, $band_length_start, $band_length_end - $band_length_start));
					$BAND = substr($entry, $band_length_end + 1, $band_length);
				}
				if (!(strpos($entry, "<MODE:") === false))
				{
					$mode_length_start = strpos($entry, "<MODE:") + strlen("<MODE:");
					$mode_length_end = strpos($entry, ">", $mode_length_start);
					$mode_length = intval(substr($entry, $mode_length_start, $mode_length_end - $mode_length_start));
					$MODE_SPECIFIC = substr($entry, $mode_length_end + 1, $mode_length);
					$MODE = GetGenericMode($MODE_SPECIFIC);
				}
				
//				echo "Country: " . $COUNTRY . "<br>";
//				echo "Call: " . $CALL . "<br>";
//				echo "Band: " . $BAND . "<br>";
//				echo "Mode (Specific): " . $MODE_SPECIFIC . "<br>"; 
//				echo "Mode: " . $MODE . "<br>"; 
//				echo array_key_exists($COUNTRY . "_" . $BAND, $WorkedEntities) . "<br>";

				if (!(array_key_exists($COUNTRY . "_" . $BAND, $WorkedEntities)))
				{
					$WorkedEntities[$COUNTRY . "_" . $BAND] = $COUNTRY . "_" . $BAND;
				}
				if (!(array_key_exists($COUNTRY . "_" . $MODE, $WorkedEntities)))
				{
					$WorkedEntities[$COUNTRY . "_" . $MODE] = $COUNTRY . "_" . $MODE;
				}
				if (!(array_key_exists($COUNTRY, $WorkedEntities)))
				{
					$WorkedEntities[$COUNTRY] = $COUNTRY;
				}
			}
		}
		
		if (file_put_contents("logs/" . $dest_filename, json_encode($WorkedEntities)) === false) {
			throw new RuntimeException('Unable to write to file');
		}
		
		echo "Upload Successful. <a href=\"index.html\">Return to DX Finder</a>.";
	}
	
	function GetGenericMode($mode) {
		if ($mode == "SSB")
		{
			$mode = "PHONE";
		}
        if ($mode == "RTTY")
        {
            $mode = "DIGI";
        }
        if ($mode == "PSK31")
        {
            $mode = "DIGI";
        }
        if ($mode == "PSK63")
        {
            $mode = "DIGI";
        }
        if ($mode == "JT65")
        {
            $mode = "DIGI";
        }
        if ($mode == "JT9")
        {
            $mode = "DIGI";
        }
        return $mode;
	}
	
	function ShowForm()
	{
		echo '<html>';
		echo '<head>';
		echo '<title>Upload N3FJP Log File</title>';
		echo '</HEAD>';
		echo '<head>';
		echo '<form action="' . htmlentities($_SERVER['PHP_SELF']) . '" method="post" enctype="multipart/form-data">';
		echo '<p>Select Log File:	<input type="file" name="upfile" id="upfile" accept=".adi"></p>';
		echo '<p>Enter PIN:	<input type="text" id="pin" name="pin"></p>';
		echo '<p><input type="submit" value="Upload" name="submit"></p>';
		echo '</form>';
		echo '</body>';
		echo '</html>';
	}
?>

