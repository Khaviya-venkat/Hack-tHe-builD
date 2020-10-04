var div =  document.getElementById("uploadDiv");
var image =  document.getElementById("uploadOne");
image.addEventListener("click",function(){
	div.style.opacity = 1;
	div.style.background = "white";
})
$("#uploadOne").click(function(){
      $("#mainInfo").fadeTo("fast",0.2,function(){
		$("#uploadDiv").addClass("display");
		$("#uploadDiv").removeClass("displayNone");
	})
  });