
var hslToRgb = function(h, s, l){
	var r, g, b;

	if(s == 0){
		r = g = b = l; // achromatic
	}else{
		var hue2rgb = function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};


function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}


var fill_RGBcanvas = function(s, W, H, sat, hue, table=[], drawImg, img){

	let d = s.getImageData(0, 0, W, H);
	
	let p = d.data;
	
	let x,y, i, _p, rgb;
	
	let _5t8 = tbl_5bits_to_8bits;
	
	let put_pixel = (table.length===256) ?
		(function(){
			let T = table;
			p[_p+0] = _5t8[ T[ rgb[0] ] ];
			p[_p+1] = _5t8[ T[ rgb[1] ] ];
			p[_p+2] = _5t8[ T[ rgb[2] ] ];
			p[_p+3] = 255;
		}) :
		(function(){
			p[_p+0] = rgb[0];
			p[_p+1] = rgb[1];
			p[_p+2] = rgb[2];
			p[_p+3] = 255;
		}) ;
	
	if(!drawImg){
	
		let hslToRgb_call = (hue===undefined) ?
			(function(){ return hslToRgb(x/W, sat, y/H) }) :
			(function(){ return hslToRgb(hue, sat, y/H) }) ;
		
		/*let overwrite_color = drawImg?
			(function(){}) :
			(function(){}) ;*/
		
		for(y=0; y<H; y++)
			for(x=0; x<W; x++){
			
				i = (y*W) + x;
				
				_p = i * 4;
			
				rgb = hslToRgb_call();
				
				put_pixel();
			}
	}
	else{
	
		let result = sRGB.createImageData(img);
		let r, g, b, hsl;
		
		p = result.data;
	
		for(y=0; y<img.height; y++)
			for(x=0; x<img.width; x++){
			
				i = (y*img.width) + x;
				
				_p = i * 4;
				
				r = img.data[_p+0];
				g = img.data[_p+1];
				b = img.data[_p+2];
				
				hsl = rgbToHsl(r, g, b);
				hsl[1] *= sat;
				rgb = hslToRgb(...hsl);
				
				put_pixel();
			}
	
		s.putImageData(result, 0,0);
		return;
	}
	

		
	s.putImageData(d, 0,0);
};

var fill_BWcanvas = function(s, W, H, table=[]){

	let d = s.getImageData(0, 0, W, H);
	
	let p = d.data;
	
	let x,y, i, _p;
	
	let c;

	let T = table.length===256 ? table : false;
	
	let _5t8 = tbl_5bits_to_8bits;
	
	for(x=0; x<W; x++){
	
		c = Math.round( 255 * (x/W) );
		
		if(T) c = _5t8[ T[c] ];
	
		for(y=0; y<H; y++){
		
			i = (y*W) + x;
			
			_p = i * 4;
		
			p[_p+0] = c;
			p[_p+1] = c;
			p[_p+2] = c;
			p[_p+3] = 255;
			
		}
	}
		
	s.putImageData(d, 0,0);
	
};
	
	
	
	
	
	
	
var set_oneColorPreview = function(_8bitsRow, _5bitsRow, convertSens, table=currentDataTable, reverseTbl=tbl_5bits_to_8bits){

		let r8 = _8bitsRow.R_in;
		let g8 = _8bitsRow.G_in;
		let b8 = _8bitsRow.B_in;
		
		if(convertSens === "from8to5"){
			
			// 8 bits row update
			
			r8 = parseInt(r8.value);
			g8 = parseInt(g8.value);
			b8 = parseInt(b8.value);
			
			let color = rgbStringFromNumbers(r8, g8, b8);
			_8bitsRow.colPrev.style.backgroundColor = color;
			
			_8bitsRow.colPrev.style.color = color;
			_8bitsRow.colPrev.textContent = decimalStr3(r8, g8, b8) + " [    ]";
			
			// 5 bits row update
			
			if(table.length === 256){
			
				let r5 = table[r8];
				let g5 = table[g8];
				let b5 = table[b8];
			
				// 5 bits inputs update
				_5bitsRow.R_in.value = r5
				_5bitsRow.G_in.value = g5
			    _5bitsRow.B_in.value = b5
			
				// 5 bits color preview update
				r5 = reverseTbl[r5]; g5 = reverseTbl[g5]; b5 = reverseTbl[b5];
			
				color = rgbStringFromNumbers(r5, g5, b5);
				_5bitsRow.colPrev.style.backgroundColor = color;
				
				color = rgbStringFromInvNumbers_greyLess(r5, g5, b5, 128, 32);
				_5bitsRow.colPrev.style.color = color;
				
				_5bitsRow.colPrev.textContent = decimalStr3(r5, g5, b5) + " [    ]";
				
			}else
				_5bitsRow.colPrev.textContent = "No Selected Column !"
		
		}

		if(convertSens === "from5to8"){
			
			let r5 = _5bitsRow.R_in;
			let g5 = _5bitsRow.G_in;
			let b5 = _5bitsRow.B_in;
		
			r5 = parseInt(r5.value);
			g5 = parseInt(g5.value);
			b5 = parseInt(b5.value);
			
			r8 = reverseTbl[r5];
			g8 = reverseTbl[g5];
			b8 = reverseTbl[b5];
			
			
			
			// 5 bits color preview update
			let color = rgbStringFromNumbers(r8, g8, b8);
			_5bitsRow.colPrev.style.backgroundColor = color;
			
			let invColor = rgbStringFromInvNumbers_greyLess(r8, g8, b8, 128, 32);
			_5bitsRow.colPrev.style.color = invColor;
			_5bitsRow.colPrev.textContent = decimalStr3(r8, g8, b8) + " [    ]";
			
			// 8 bits color preview update

			_8bitsRow.colPrev.style.backgroundColor = color;
			_8bitsRow.colPrev.style.color = color;
			_8bitsRow.colPrev.textContent = decimalStr3(r8, g8, b8) + " [    ]";
			
			_8bitsRow.R_in.value = r8;
			_8bitsRow.G_in.value = g8;
			_8bitsRow.B_in.value = b8;
			
		}


}
	
	
	
	
	
var rgbStringFromNumbers = function(r,g,b, inv=false){

	if(inv){
		r = 255 - r;
	    g = 255 - g;
	    b = 255 - b;
	}

	rStr = r.toString(16);
	gStr = g.toString(16);
	bStr = b.toString(16);

	rStr = rStr.length < 2 ? '0'+rStr : rStr;
	gStr = gStr.length < 2 ? '0'+gStr : gStr;
	bStr = bStr.length < 2 ? '0'+bStr : bStr;

	return '#' + rStr + gStr + bStr;

};

rgbStringFromInvNumbers_greyLess = function(r,g,b, i, len){

	let rMin = i - (len*3);
	let rMax = i + (len*2);
	
	let gMin = i - (len);
	let gMax = i + (len);
	
	let bMin = i - (len*4);
	let bMax = i + (len*4);

	if(r>=rMin && r<=rMax && g>=gMin && g<=gMax && b>=bMin && b<=bMax)
		return rgbStringFromNumbers(0,0,0);
	else
		return rgbStringFromNumbers(r,g,b, true);

}

var decimalStr = function(num){
	let o = num<10 ? "0" : "";
	o += num<100 ? "0" : "";
	return o + num;
}

var decimalStr3 = function(num1, num2, num3){
	return decimalStr(num1) + ", " + decimalStr(num2) + ", " + decimalStr(num3);
}

	
var create_numberInput = function(min, max, styleWidth, convertSens, oninput_callback){
	elem = document.createElement("input");
	elem.type = "number";
	elem.min = min;
	elem.max = max;
	elem.value = max;
	
	//elem.style.fontFamily = "Courier New";
	
	elem.style.width = styleWidth;
	
	elem.className = convertSens;
	
	elem.oninput = oninput_callback;
	
	return elem;
};

var create_oneColPrevRow = function(labelName, convertSens, oninput_callback){
	let elem = document.createElement("div");
	elem.style.whiteSpace = "nowrap"
	
	let label = document.createElement("span");
	label.textContent = labelName;
	
	let colPrev = document.createElement("span");
	colPrev.textContent = "COLOR[ ]";
	colPrev.style.whiteSpace = "pre"
	
	let cs = convertSens;
	let max = cs==="from8to5" ? 255 : (cs==="from5to8"? 31 : 0xBAD)
	
	let styleWidth = "4em"
	let R_in = create_numberInput(0, max, styleWidth, convertSens, oninput_callback);
	let G_in = create_numberInput(0, max, styleWidth, convertSens, oninput_callback);
	let B_in = create_numberInput(0, max, styleWidth, convertSens, oninput_callback);
	
	elem.appendChild(label);
	elem.appendChild(colPrev);
	elem.appendChild(R_in);
	elem.appendChild(G_in);
	elem.appendChild(B_in);
	
	let objectPack = {
		elem : elem,
		colPrev : colPrev,
		R_in : R_in,
		G_in : G_in,
		B_in : B_in
	};
	
	return objectPack;
};

var create_oneColorPreview = function(){
	
	let elem = document.createElement("div");
	
	elem.style.fontFamily = "Courier New";
	
	elem.style.width = "100%";
	
	let _8bPrevObj = create_oneColPrevRow("8bits color channels : ", "from8to5", colorChannelOninput);
	let _8bitsPrev = _8bPrevObj.elem;
	
	let _5bPrevObj = create_oneColPrevRow("5bits color channels : ", "from5to8", colorChannelOninput);
	let _5bitsPrev = _5bPrevObj.elem;
	
	
	function colorChannelOninput(){
		
		set_oneColorPreview(_8bPrevObj, _5bPrevObj, this.className);
		
	}
	
	elem.appendChild(_8bitsPrev);
	elem.appendChild(_5bitsPrev);
		
	let objectPack = {
		elem : elem,
		_8bPrevObj : _8bPrevObj,
		_5bPrevObj : _5bPrevObj
	};
	
	
	return objectPack;
};
	
	
	
	
	
	
	
var create_gradientPreviews = function(){

	let W, H = 512, h = 32;

	let cRGBcolSel = undefined;

	let cRGBsat = 1;

	let droppedImageData = undefined;
	let drawDroppedImg = false;
	
	// create color preview
	
	cRGB = document.createElement("canvas");
	sRGB = cRGB.getContext("2d");
	
	
	// create black and white preview
	
	cBW = document.createElement("canvas");
	sBW = cBW.getContext("2d");
	
	
	// create one color previer
	
	oneColPrev = create_oneColorPreview();
	//oneColPrev.style.heigth = 50;
	
	
	
	// create background panel
	let panel = document.createElement("div");
	panel.style.backgroundColor = "#ffffff"
	panel.appendChild(cRGB);
	panel.appendChild(cBW);
	panel.appendChild(oneColPrev.elem);
	document.body.appendChild(panel);
	
	
	// user event
	
	// make fixed position for previews
	window.onscroll = function(e){
		cRGB.style.marginLeft = window.scrollX;
		cBW.style.marginLeft = window.scrollX;
		
		oneColPrev.elem.style.marginLeft = window.scrollX;
	};
	
	
	// also used as previews display update function
	window.onresize = function(e){
		
		// cRGB
		
		cRGB.style.width = "100%";
		cRGB.style.height = H;
		
		styles = getComputedStyle(cRGB);
		
		W = parseInt(styles.width);
		
		cRGB.width = W;
		cRGB.height = H;
		
		// update gradient image
		fill_RGBcanvas(sRGB, W, H, cRGBsat, cRGBcolSel, currentDataTable, drawDroppedImg, droppedImageData);
		
		// cBW
		
		cBW.style.width = "100%";
		cBW.style.height = h;
		
		cBW.width = W;
		cBW.height = h;
		
		fill_BWcanvas(sBW, W, h, currentDataTable);
	}
	
	
	// saturation selection
	cBW.onmousedown = function(e){
	
		if(e.shiftKey){
			let c = sBW.getImageData(e.offsetX, e.offsetY, 1,1).data;
		
			let r8 = c[0];
			let g8 = c[1];
			let b8 = c[2];
			
			let _8bPrev = oneColPrev._8bPrevObj;
			let _5bPrev = oneColPrev._5bPrevObj;
			
			_8bPrev.R_in.value = r8;
			_8bPrev.G_in.value = g8;
			_8bPrev.B_in.value = b8;
			
			set_oneColorPreview(_8bPrev, _5bPrev, "from8to5");
		}
		else if(e.buttons & 0x1 === 1){
		
			if(e.buttons === 3)
				cRGBsat = 1;
			else
				cRGBsat = e.offsetX / (cBW.width-1)
				
			fill_RGBcanvas(sRGB, W, H, cRGBsat, cRGBcolSel, currentDataTable, drawDroppedImg, droppedImageData);
		}
			
	};
	
	cBW.oncontextmenu = function(e){
		e.preventDefault();
	};
	
	
	// hue selection
	cRGB.ondblclick = function(e){
	
		e.preventDefault();
		e.stopPropagation();
		window.getSelection().removeAllRanges();
			
		if(cRGBcolSel !== undefined)
			cRGBcolSel = undefined;
		else
			cRGBcolSel = e.offsetX / (cBW.width-1);
	
		window.onresize();
	};
	
	
	// pixel color selection
	cRGB.onclick = function(e){
	
		if(e.shiftKey && !e.ctrlKey){
			let c = sRGB.getImageData(e.offsetX, e.offsetY, 1,1).data;
		
			let r8 = c[0];
			let g8 = c[1];
			let b8 = c[2];
			
			let _8bPrev = oneColPrev._8bPrevObj;
			let _5bPrev = oneColPrev._5bPrevObj;
			
			_8bPrev.R_in.value = r8;
			_8bPrev.G_in.value = g8;
			_8bPrev.B_in.value = b8;
			
			set_oneColorPreview(_8bPrev, _5bPrev, "from8to5");
		}
		
		if(e.shiftKey && e.ctrlKey)
			if(droppedImageData !== undefined){
				drawDroppedImg = !drawDroppedImg;
				window.onresize();
			}
	};
	
	
	cRGB.ondragover = function(e){
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};
	
	cRGB.ondrop = function(e){
		e.stopPropagation();
		e.preventDefault();

		let filePointer = e.dataTransfer.files[0];
		
		let reader = new FileReader();
		
		reader.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) { // DONE == 2
				let imgDataUrl = e.target.result;
				let img = new Image();
				img.onload = function(){
					sRGB.drawImage(img, 0,0);
					droppedImageData = sRGB.getImageData(0,0, img.width, img.height);
					drawDroppedImg = true;
					window.onresize();
				};
				img.src = imgDataUrl;
			}
		};
		//reader.readAsBinaryString(filePointer);
		reader.readAsDataURL(filePointer);
		
		
	};
	

	// init
	window.onresize();
	
	// return public function pack
	return {
	
		update_oneColorPreview : function(convertSens){
			set_oneColorPreview(oneColPrev._8bPrevObj, oneColPrev._5bPrevObj, convertSens);
		}
	
	};

};

	

	
	
	
	
	
	
	
	
	
var test_tableReversibility = function(table){

	for(let i=0; i<256; i++){
	
		_5_1 = table[i];
		
		_8_cap = tbl_5bits_to_8bits[_5_1];
		
		_5_2 = table[_8_cap];
		
		if(_5_1 !== _5_2)
			return i
	}

	return -1;

}


















var test_tableReversibilityTwice = function(table){

	for(let i=0; i<256; i++){
	
		_5_1 = table[i];
		
		_8_cap = tbl_5bits_to_8bits[_5_1];
		
		_5_2 = table[_8_cap];
		
		if(_5_1 !== _5_2){
		
			console.log("first : ", i);
			
			_8_cap2 = tbl_5bits_to_8bits[_5_2];
			
			_5_3 = table[_8_cap2];
			
			if(_5_2 !== _5_3)
				return i
		
		}
			
	}

	return -1;

}
	
	
