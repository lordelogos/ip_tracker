var mymap;
var a;
var b;
var clientIp = localStorage.getItem('ip');

//getting the client IP address
function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] 
               || document.documentElement;

    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

}
/*
getJSONP('https://api.ipify.org?format=jsonp&callback=?', function(data){
    clientIp = data['ip'];
    localStorage.setItem('ip', clientIp);
}); */

if (clientIp == null || clientIp == ''){
	getJSONP('https://api.ipify.org?format=jsonp&callback=?', function(data){
    var clientIp = data['ip'];
    console.log(2)
    localStorage.setItem('ip', clientIp);
	});
}



//getting client location
const api_key = 'at_qM5mgWRLjhTNuDDiKGcOf421T5VkK';
if (window.navigator.geolocation) {
	window.navigator.geolocation.getCurrentPosition(function(position){
		var a = position['coords']['latitude'];
		var b = position['coords']['longitude'];
		mymap.setView([a,b]);
		var marker = L.marker([a,b]).addTo(mymap);
		marker.bindPopup(`Your location`).openPopup();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${clientIp}`, true);

		xhr.onload = function(){
			if(this.status == 200){
				var update = JSON.parse(this.responseText);
				console.log(update);
				updateEntry(update);
			}else{
				window.alert('Invalid IP/Domain address')
			}
		}
		xhr.send();
	}, console.log);
}


var mymap = L.map('map', {
center: [51.505, -0.09],
zoom: 13
});


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF1bG9lLW1lIiwiYSI6ImNrZzd6bzZldjBjZGUyeXFubmtvN3NycDkifQ.-P495y88So4PLt3wz4QPNQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGF1bG9lLW1lIiwiYSI6ImNrZzd6bzZldjBjZGUyeXFubmtvN3NycDkifQ.-P495y88So4PLt3wz4QPNQ'
}).addTo(mymap);




// form submition
var form = document.querySelector('#form');
var ip = document.querySelector('#ip');
var error = document.querySelector('#error');
form.addEventListener('submit', function(e){
	e.preventDefault();
	if (ip.value == '' || ip.value == null){
		window.alert('Please Input a valid IP/domain address');
	}else{
		var search = ip.value.toLowerCase();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${search}`, true);

		xhr.onload = function(){
			if(this.status == 200){
				var update = JSON.parse(this.responseText);
				updateEntry(update);
			}else{
				window.alert('Invalid IP/Domain address')
			}
		}
		xhr.send();
}
})

function updateEntry(update){
	var ip_address = document.querySelector('#ip_address');
	var location = document.querySelector('#location');
	var timezone = document.querySelector('#timezone');
	var isp = document.querySelector('#isp');

	ip_address.textContent = `${update['ip']}`;
	location.textContent = `${update['location']['region']}, ${update['location']['city']}, ${update['location']['postalCode']}`;
	timezone.textContent = `UTC ${update['location']['timezone']}`;
	isp.textContent = `${update['isp']}`
	var marker = L.marker([`${update['location']['lat']}`, `${update['location']['lng']}`]).addTo(mymap);
	mymap.setView([`${update['location']['lat']}`, `${update['location']['lng']}`]);
	marker.bindPopup(`${update['location']['city']}, ${update['location']['country']}`).openPopup();
	return ip.value = '';
}