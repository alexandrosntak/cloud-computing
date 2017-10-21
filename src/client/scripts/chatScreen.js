function ChatScreen(parent,username) {
    
    var chatScreen = {};

    var domElement = document.createElement("DIV");
  	var textField = document.createElement("DIV");
  	var logo = document.createElement("IMG");
  	var messageBox = document.createElement("DIV");
  	var username = document.createElement("DIV");
  	var messageText = document.createElement("DIV");
  	var messageTime = document.createElement("DIV");
  	
  	parent.appendChild(domElement);
	domElement.appendChild(logo);
	domElement.appendChild(textField);
	textField.appendChild(messageBox);
	messageBox.appendChild(username);
	messageBox.appendChild(messageText);
	messageBox.appendChild(messageTime);
	
	logo.setAttribute("src","resources/logo.jpg");
	logo.setAttribute("width", "250");
	logo.setAttribute("height", "67");
	

	domElement.className = "ChatScreen";
	textField.className = "textField";
	messageBox.className = "messageBox";
	username.className = "username";
	messageText.className = "messageText";
	messageTime.className = "messageTime";

	messageText.textContent = "Hello world";
	username.textContent = "TOM";
	messageTime.textContent = "08:00";
	//messageText.textContent = "Lorem Ipsum adalah contoh teks atau dummy dalam industri percetakan dan penataan huruf atau typesetting. Lorem Ipsum telah menjadi standar contoh teks sejak tahun 1500an, saat seorang tukang cetak yang tidak dikenal mengambil sebuah kumpulan teks dan mengacaknya untuk menjadi sebuah buku contoh huruf. Ia tidak hanya bertahan selama 5 abad, tapi juga telah beralih ke penataan huruf elektronik, tanpa ada perubahan apapun. Ia mulai dipopulerkan pada tahun 1960 dengan diluncurkannya lembaran-lembaran Letraset yang menggunakan kalimat-kalimat dari Lorem Ipsum, dan seiring munculnya perangkat lunak Desktop Publishing seperti Aldus PageMaker juga memiliki versi Lorem Ipsum";

	return chatScreen;
}