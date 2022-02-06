
var verticaleDisplayerArea = (function(){

	let elem = document.createElement("div");
	elem.style.width = "fit-content";
	elem.style.display = "flex";
	elem.style.flexDirection = "row";
	
	elem.style.backgroundColor = "#aaaaaa"
	
	return elem

})();

var verticalDisplayerList = [];

var create_verticalDisplayer = function(color="#ffffff", isTable=false){

	let elem = document.createElement("span");
	
	elem.style.display = "flex";
	elem.style.border = "1px solid black";
	elem.style.width = "fit-content";
	elem.style.height = "fit-content";
	elem.style.flexDirection = "column";
	
	elem.style.backgroundColor = color;
	elem.style.margin = "0px 32px 0px 0px";
	
	elem.appdata = {
		isTable : isTable,
		rawData : [],
		description : "undescripted"
	};
	
	elem.onclick = function(e){
	
		// hide column
		if(e.ctrlKey && e.shiftKey){
			window.getSelection().removeAllRanges();
			elem.style.display = "none";
		}
		
		// select column
		else if(elem.appdata.rawData !== undefined){
		
			// update color screen
			currentDataTable = elem.appdata.rawData;
			window.onresize();
			
			if(currentDataTable.length === 256){
				// display reversibility table
				let reversible = test_tableReversibility(currentDataTable) === -1 ? true : false;
				let reverTestText = reversible ? reversibleTableText : notReversibleTableText;
				create_miniPopup(reverTestText, 1000);
			
				// convert 8bits preview to 5bits preview
				oneColPrevFunctions.update_oneColorPreview("from8to5");
			}
			
		}
	};
	
	elem.onmouseenter = function(e){
		if(e.ctrlKey && !e.shiftKey && !e.altKey){
			create_miniPopup(elem.appdata.description, 0);
		}
	};
	
	elem.onmouseleave = function(e){
		if(currentMiniPopup !== undefined){
		
			if(currentMiniPopup.appdata.currentTimerID !== undefined)
				clearTimeout(currentMiniPopup.appdata.currentTimerID);
		
			document.body.removeChild(currentMiniPopup);
			currentMiniPopup = undefined;
		}
	};
	
	verticaleDisplayerArea.appendChild(elem);
	
	verticalDisplayerList[verticalDisplayerList.length] = elem;
	
	return elem;
};

var create_block = function(content){

	let elem = document.createElement("span");
	
	elem.style.position = "relative";
	elem.className = "display_block";
	
	elem.style.border = "1px solid black";
	elem.style.width = "fit-content";
	elem.style.height = "fit-content";
	elem.style.display = "flex";
	elem.style.padding = "4px 4px";
	elem.style.fontFamily = "Courier New";
	
	elem.style.whiteSpace = "pre";
	
	elem.textContent = content;
	
	return elem;
};

var get_hexStringFromNumber = function(number){
	
	let output = number.toString(16).toUpperCase();
	
	if(output.length === 1) output = "0" + output;
	
	return output;
};

var fill_verticalDisplayer = function(verticalDisplayer, data){

	if(verticalDisplayer.appdata.isTable)
		verticalDisplayer.appdata.rawData = data;

	let len = data.length;
	
	for(let i=0; i<len; i++){
			
		let d = data[i];
		
		let spaceStr = "";
		spaceStr = d<10 ? " " : "";
		spaceStr += d<100 ? " " : "";
		
		let elem = create_block(spaceStr+d);
	
		verticalDisplayer.appendChild(elem);
	}
};

var create_rowPointer = function(){

	let elem = document.createElement("div");
	elem.style.position = "absolute";
	
	elem.style.pointerEvents = "none";
	
	elem.style.border = "2px solid red";
	
	document.body.appendChild(elem);

	document.body.onmousemove = function(e){
	
		if(e.target.className === "display_block"){

			let block = e.target;
			block.appendChild(elem);
			
			let parentRef = block.parentNode.parentNode;
			
			elem.style.left = -(block.offsetLeft);
			elem.style.width = parentRef.offsetWidth;
			
			elem.style.top = 0;
			elem.style.bottom = 0;
		}
	};
};

var start_verticalDislayerHideControl = function(){

	document.body.onkeydown = function(e){
	
		let key = parseInt(e.key);
		
		/*
		let len = verticalDisplayerList.length
		if(false)
		if(key < len){
		
			let vDisplayer = verticalDisplayerList[key];
			
			if(vDisplayer.style.display === "none")
				vDisplayer.style.display = "flex";
			else
				vDisplayer.style.display = "none";
		}
		*/
		

		
		if(e.code === "F1" && e.shiftKey){
			let helpHideStat = helpPanel.style.display==="none" ? true : false;
			helpPanel.style.display = helpHideStat ? "flex" : "none";
			document.body.style.overflow = helpHideStat ? "hidden" : "";
		}
			
		
		
		if(e.code === "Space"){
		
			e.preventDefault();
		
			for(let i=0; i<len; i++)
				verticalDisplayerList[i].style.display = "flex";
		}
	}
};



var currentMiniPopup = undefined;

var create_miniPopup = function(htmlText, lifeTime=2000){

	if(currentMiniPopup !== undefined){
		
		clearTimeout(currentMiniPopup.appdata.currentTimerID);
		
		document.body.removeChild(currentMiniPopup);
	}
	
	htmlText = "<div>"+htmlText+"</div>";
	
	let elem = (new DOMParser()).parseFromString(htmlText, "text/html").body.firstElementChild;
	
	//let elem = document.createElement("div");

	elem.style.position = "fixed";
	elem.style.opacity = 1;
	elem.style.transition = "opacity 3s";
	
	elem.style.backgroundColor = "#ffeedd";
	elem.style.left = 0;
	elem.style.top = 0;
	//elem.style.width = 100;
	//elem.style.height = 100;
	elem.style.margin = 8;
	elem.style.padding = 16;
	elem.style.whiteSpace = "pre";
	elem.style.fontFamily = "Courier New";
	
	//elem.textContent = text;
	//elem.innerText = text;

	let startHideTransition = function(){
		elem.style.opacity = 0;
	};
	
	elem.ontransitionend = function(e){
		if(e.propertyName === "opacity"){
			document.body.removeChild(elem);
			currentMiniPopup = undefined;
		}
	};
	
	elem.appdata = {
		currentTimerID : undefined
	}
	
	currentMiniPopup = elem;
	
	document.body.appendChild(elem);
	
	if(lifeTime !== 0)
		elem.appdata.currentTimerID = setTimeout(startHideTransition, lifeTime);
	
};













