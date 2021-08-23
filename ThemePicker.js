function ThemePickerInit() {
	$("#AddRow").click(AddRow);
	
	$("#BeforePic").mousedown(function(e) {
		if (!this.canvas) {
			this.canvas = $canvas = $("<canvas />")[0];
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.canvas.getContext("2d").drawImage(this, 0, 0, this.width, this.height);
		}
		
		var pixelData = this.canvas.getContext("2d").getImageData(event.offsetX, event.offsetY, 1, 1).data;
		
		var pixelColorHex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
		
		$("input[type='radio'][name='SelectedRow']:checked").closest("tr").find(".FromColor").each(function() {
			this.value = pixelColorHex;
		});
		
		RedrawImage();
	});
	
	$(".FromColor").each(function() {
		$(this).mouseup(RedrawImage());
	});
	
	$(".ToColor").each(function() {
		$(this).mouseup(RedrawImage());
	});

	$("#SaveBtn").click(function() {
		var colors = GetColors();
		var str = "";
		
		for (var c = 0; c < colors.length; c++) {
			str += colors[c].oR.toString() + ",";
			str += colors[c].oG.toString() + ",";
			str += colors[c].oB.toString() + ",";
			str += colors[c].nR.toString() + ",";
			str += colors[c].nG.toString() + ",";
			str += colors[c].nB.toString();
			str += "\n";
		}

		$("#TextArea").val(str);
	});

	$("#LoadBtn").click(function() {		
		SetColors(StrToColors(document.getElementById("TextArea").value));
		RedrawImage();
	});

	$("#PreMade").append("\
		<option value='104,168,216,144,128,168\n128,216,144,144,144,232'>EB Battle</option>\
		<option value='104,168,216,96,208,184\n128,216,144,96,152,168\n240,240,240,248,232,168\n136,144,144,104,208,184\n16,16,16,56,48,80'>EB Mint</option>\
		<option value='104,168,216,248,136,168\n128,216,144,208,104,144\n240,240,240,248,232,200\n136,144,144,248,144,168\n16,16,16,64,32,72'>EB Strawberry</option>\
		<option value='104,168,216,216,224,48\n128,216,144,176,168,104\n240,240,240,248,248,208\n136,144,144,232,248,88\n16,16,16,72,48,80'>EB Banana</option>\
		<option value='104,168,216,176,104,112\n128,216,144,216,144,48\n240,240,240,248,232,168\n136,144,144,224,160,80\n16,16,16,64,24,40'>EB Peanut</option>\
		<option value='104,168,216,200,40,104\n128,216,144,168,32,56\n240,240,240,248,208,144\n136,144,144,192,64,72\n16,16,16,112,40,72'>EB Death</option>\
		<option value='104,168,216,251,203,213\n128,216,144,238,242,186\n240,240,240,255,235,248\n136,144,144,188,148,158\n16,16,16,60,37,45'>Strawberry Lemonade</option>\
		<option value='104,168,216,154,129,243\n128,216,144,230,186,242\n240,240,240,251,194,255\n136,144,144,177,105,232\n16,16,16,67,40,82'>Grape</option>\
		<option value='104,168,216,243,239,130\n128,216,144,169,241,136\n16,16,16,33,30,18\n136,144,144,200,193,95\n240,240,240,244,245,184'>Bronana</option>\
		<option value='104,168,216,205,135,232\n128,216,144,177,230,142\n240,240,240,253,255,224\n136,144,144,163,120,217\n16,16,16,57,46,61'>Spooky Grape</option>\
	");
	
	$("#PreMade").change(function() {
		var str = this.value;
		$("#TextArea").val(str);
	});
}

function StrToColors(str) {
	colors = [];
	
	var colorStr = str;

	var fileLineArr = colorStr.split("\n");
	for (var i = 0; i < fileLineArr.length; i++) {
		var tempColors = fileLineArr[i].split(",")
		
		if (tempColors.length == 6) {
			colors.push({
				oR: parseInt(tempColors[0]),
				oG: parseInt(tempColors[1]),
				oB: parseInt(tempColors[2]),
				nR: parseInt(tempColors[3]),
				nG: parseInt(tempColors[4]),
				nB: parseInt(tempColors[5])
			});
		}
	}

	return colors;
}

function SetColors(colors) {
	$(".ColorRow").each(function() {
		$(this).remove();
	});

	for (var c = 0; c < colors.length; c++) {
		AddRow(
			rgbToHex(colors[c].oR, colors[c].oG, colors[c].oB),
			rgbToHex(colors[c].nR, colors[c].nG, colors[c].nB)
		);
	}
}

function GetColors() {
	var colors = [];
	$(".ColorRow").each(function() {
		var fromColor = hexToRgb($(this).find(".FromColor").first().val());
		var toColor = hexToRgb($(this).find(".ToColor").first().val());
		
		colors.push({
			oR: parseInt(fromColor.r),
			oG: parseInt(fromColor.g),
			oB: parseInt(fromColor.b),
			nR: parseInt(toColor.r),
			nG: parseInt(toColor.g),
			nB: parseInt(toColor.b)
		});
	});
	
	return colors;
}

function RedrawImage() {
	var srcImg = document.getElementById("BeforePic");
	
	var colors = GetColors();
	
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	
	cvs.width = srcImg.width;
	cvs.height = srcImg.height;
	
	ctx.drawImage(srcImg, 0, 0, srcImg.width, srcImg.height);
	
	var imageData = ctx.getImageData(0, 0, srcImg.width, srcImg.height);
	
	for (var c = 0; c < colors.length; c++) {		
		for (var i = 0; i < imageData.data.length; i += 4) {			
			if ( imageData.data[i] == colors[c].oR &&
				 imageData.data[i+1] == colors[c].oG &&
				 imageData.data[i+2] == colors[c].oB ) {
				imageData.data[i] = colors[c].nR;
				imageData.data[i+1] = colors[c].nG;
				imageData.data[i+2] = colors[c].nB;
			}
		}
	}
	
	ctx.putImageData(imageData, 0, 0);
	document.getElementById("AfterPic").src = cvs.toDataURL("image/png");
}

function AddRow(fromHex, toHex) {
	$("#ColorList tr:last").after("\
		<tr class='ColorRow'>\
			<td><input type='radio' class='RowSelect' name='SelectedRow'></td>\
			<td><input type='color' class='FromColor' value='"+fromHex+"' onchange='RedrawImage();'></td>\
			<td><input type='color' class='ToColor' value='"+toHex+"' onchange='RedrawImage();'></td>\
			<td><input type='button' class='RowRemove' value='Remove'></td>\
		</tr>"
	);
	
	var lastRow = $("#ColorList tr:last");
	$(lastRow).find(".RowRemove").each(function() {
		$(this).click(RemoveRow);		
	});
}

function RemoveRow() {
	$(this).closest(".ColorRow").remove();
	RedrawImage();
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}