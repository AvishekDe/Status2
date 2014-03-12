<!DOCTYPE html>
	<head>
		<title> Status2 : SDSLabs Application Status </title>
		<meta name="Author" content="SDSLabs">
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="styles.css">
		<script src="public/jquery-1.11.0.min.js"></script>
		<base target="_blank"></base>
		
	</head>

	<body>
		<div id="titlebar">
			SDSLabs StatusBoard
		</div>

		<div id="resultDiv">
		</div>

		<script>
			var html;
			resultDiv.innerHTML = "";
			$.get("public/output.json" , function(data){
				for(var i in data)
				{
					 html = i;
					 if(data[i][0] == "OK")
					 	html += " Working Fine ";
					 else
					 	html += " Currently Down "+data[i][0];
					 html+="<br>";
					 $("#resultDiv").append(html);
				}
				html="";
			} , "json");
		</script>

		<br><br><br>


	</body>
</html>
