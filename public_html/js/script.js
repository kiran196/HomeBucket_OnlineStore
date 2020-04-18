// home page boxes. 
function clickbox_func() {
	location.href = 'products.html';
}

// Signup page button click
function signup_submit() {
	alert("Signup Completed. You have been registered");
	location = 'login.html';
	return false;
}

// Login page button click
function login_submit() {
	location = 'products.html';
	return false;
}

// Currency Convert Page, first box Litecoin -> CAD
function convert_cad() {
	var lcoinStr = document.getElementById("coins").value;
	var lcoin = parseFloat(lcoinStr);
	var cadval = lcoin * 84.62;
	document.getElementById("cad").value = cadval;
	return false;
}

// Currency convert page, second box. Currencies -> CAD
function convert_money() {
	var selection = document.getElementsByName("currencies");
	var money = parseFloat(document.getElementById("cur_amount").value);
	var sel = 0;
	for(var i = 0, length = selection.length; i < length; i++) {
		if(selection[i].checked) {
			sel = selection[i].value;
			break;
		}
	}
	
	switch (parseInt(sel)) {
		case 1:
			var total = money * 1.34;
			document.getElementById("cadamount").value = total;
			break;
		
		case 2:
			var total = money * 0.018;
			document.getElementById("cadamount").value = total;
			break;
			
		case 3:
			var total = money * 1.52;
			document.getElementById("cadamount").value = total;
			break;
			
		case 4:
			var total = money * 1.75;
			document.getElementById("cadamount").value = total;
			break;
			
		case 5:
			var total = money * 1.43;
			document.getElementById("cadamount").value = total;
			break;
			
		case 6:
			var total = money * 0.013;
			document.getElementById("cadamount").value = total;
			break;
			
		case 7:
			var total = money * 0.89;
			document.getElementById("cadamount").value = total;
			break;
			
		case 8:
			var total = money * 0.19;
			document.getElementById("cadamount").value = total;
			break;
			
		case 9:
			var total = money * 0.020;
			document.getElementById("cadamount").value = total;
			break;
			
		case 10:
			var total = money * 0.0011;
			document.getElementById("cadamount").value = total;
			break;
	}
	return false;
}

// Currency convert page, third box. Cryptocurrencies -> CAD
function convert_crypto() {
	var selection = document.getElementsByName("cryptocurrencies");
	var coins = parseFloat(document.getElementById("cur_coins").value);
	var sel = 0;
	for(var i = 0, length = selection.length; i < length; i++) {
		if(selection[i].checked) {
			sel = parseInt(selection[i].value);
			break;
		}
	}
	
	if(sel == 1) {
		var total = coins * 12248.89;
		document.getElementById("cad_amount").value = total;
	}

	if(sel == 2) {
		var total = coins * 327.63;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 3) {
		var total = coins * 0.323610;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 4) {
		var total = coins * 469.13;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 5) {
		var total = coins * 1.342123;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 6) {
		var total = coins * 315.282278;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 7) {
		var total = coins * 84.46;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 8) {
		var total = coins * 5.045763;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 9) {
		var total = coins * 26.770177;
		document.getElementById("cad_amount").value = total;
	}
	
	if(sel == 10) {
		var total = coins * 3.82;
		document.getElementById("cad_amount").value = total;
	}
	
	return false;
}

// Contact page submit button
function contact_submit() {
	alert("Thank you for contacting us. We will get back to you shortly.");
	location = 'index.html';
	return false;
}

// Functions page, Text color change
function change_black() {
	document.getElementById("colorchage").style.color = "black";
}
function change_blue() {
	document.getElementById("colorchage").style.color = "blue";
}
function change_yellow() {
	document.getElementById("colorchage").style.color = "yellow";
}
function change_red() {
	document.getElementById("colorchage").style.color = "red";
}
function change_green() {
	document.getElementById("colorchage").style.color = "green";
}

// Functions page. Text size change
function change_h1() {
	document.getElementById("sizechage").style.fontSize = "xx-large";
}
function change_h2() {
	document.getElementById("sizechage").style.fontSize = "x-large";
}
function change_h3() {
	document.getElementById("sizechage").style.fontSize = "large";
}
function change_h4() {
	document.getElementById("sizechage").style.fontSize = "medium";
}
function change_h5() {
	document.getElementById("sizechage").style.fontSize = "small";
}

// Functions page. Time display
function get_current_time() {
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":0" + today.getSeconds();
	document.getElementById("currenttime").innerHTML = time;
}

// Functions page. Date display
function get_current_date() {
	var today = new Date();
	var date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-0'+today.getDate();
	document.getElementById("currentdate").innerHTML = date;
}

// Functions page. Addition of two values
function add_values() {
	var no1 = parseFloat(document.getElementById("addno1").value);
	var no2 = parseFloat(document.getElementById("addno2").value);
	var answer = no1 + no2;
	document.getElementById("addanswer").value = answer;
}

// Functions page. Subtraction of two values
function sub_values() {
	var no1 = parseFloat(document.getElementById("subno1").value);
	var no2 = parseFloat(document.getElementById("subno2").value);
	var answer = no1 - no2;
	document.getElementById("subanswer").value = answer;
}

// Functions page. Multiplication of two values
function mul_values() {
	var no1 = parseFloat(document.getElementById("mulno1").value);
	var no2 = parseFloat(document.getElementById("mulno2").value);
	var answer = no1 * no2;
	document.getElementById("mulanswer").value = answer;
}

// Functions page. Division of two values
function div_values() {
	var no1 = parseFloat(document.getElementById("divno1").value);
	var no2 = parseFloat(document.getElementById("divno2").value);
	if (no2 == 0) {
		alert("Divide by zero is not possible");
		return;
	}
	var answer = no1 / no2;
	document.getElementById("divanswer").value = answer;
}

