function submit() {
	// var file = document.getElementById("selectedFile").files[0];
	const file = $('#selectedFile').val();

	if(file) {
		// var owner = document.getElementById("owner").value;
		const owner = $('#owner').val();
		if(owner == "") {
			alert("Please enter owner name");
		} else {
			var reader = new FileReader();
			reader.onload = function (event) {
		  		var hash = sha1(event.target.result);

		  		$.get("/submit?hash=" + hash + "&owner=" + owner, function(data){
		  			if(data == "Error") {
		  				$("#message").text("An error occured.");
		  			} else {
		  				$("#message").html("Transaction hash: " + data);
						
		  			}
		    	});
			};
			reader.readAsArrayBuffer(file);
		}
	}
	else {
		alert("Please select a file");
	}
}

function getInfo() {
	var file = document.getElementById("selectedFile").files[0];
	
	// console.log(file)
	if(file) {
		var reader = new FileReader();
		reader.onload = function (event) {
	  		var hash = sha1(event.target.result);

	  		$.get("/getInfo?hash=" + hash, function(data) {
	  			if(data[0] == 0 && data[1] == "") {
	  				$("#message").html("File not found");
	  			} else {
	  				$("#message").html("Timestamp: " + data[0] + " Owner: " + data[1]);
	  			}
	    	});
		};
		reader.readAsArrayBuffer(file);
	}
	else {
		alert("Please select a file");
	}
}

function resetInput() {
	$("#selectedFile").next('.custom-file-label').html('Choose File');
	$('#owner').val('');
	$('#infoBtn').prop('disabled',true);
	$('#submitBtn').prop('disabled', true);
	noName = true;
}



resetInput();
$('#selectedFile').on('change',function(){
	//get the file name
	var fileName = $(this).val();
	var fileNameIndex = fileName.lastIndexOf("\\") + 1;
	fileName = fileName.substring(fileNameIndex);
	//replace the "Choose a file" label
	$(this).next('.custom-file-label').html(fileName);
	$('#infoBtn').prop('disabled',false);
});

$('#owner').on('change', function() {
	const file = $('#selectedFile').val();
	// console.log(file);
	// if( file != '')
	// 	$('#submitBtn').prop('disabled', false);
	// else
	// 	$('#submitBtn').prop('disabled', true);
	alert(file);
});

var socket = io("http://localhost:8080");

socket.on("connect", function () {
	socket.on("message", function (msg) {
		if($("#events_list").text() == "No Transaction Found")
		{
			$("#events_list").html("<li>Txn Hash: " + msg.transactionHash + "\nOwner: " + msg.args.owner + "\nFile Hash: " + msg.args.fileHash + "</li>");
		}
		else 
		{
			$("#events_list").prepend("<li>Txn Hash: " + msg.transactionHash + "\nOwner: " + msg.args.owner + "\nFile Hash: " + msg.args.fileHash + "</li>");
		}
    });
});