//This script uses the Google Maps API and the Bing Maps API

var pushpin;
var location;
var bingMap;
var options;
var googleCenter;
var centerLocation;

//getMap is the constructor for the bingMap object.
function getMap() {
    bingMap = new Microsoft.Maps.Map(document.getElementById('BingMap'), {
        credentials: 'AkppuX8pl5h5wfUSoZpPgnRMMoewtRCFx4xpmdUefPPxdJ2serPtqj58BqeiVWFE',
        center: new Microsoft.Maps.Location(37.7831, -122.4039),
        zoom: 12,
        //useInertia: true,
        disableBirdseye: true,
        disableKeybourdInput: true,
        disableMouseInput: true,
        disablePanning: true,
        disableTouchInput: true,
        disableUserInput: true,
        disableZooming: true,
        showMapTypeSelector: false,
        showDashboard: false
	});
    
    //This initializes a pushpin object on Google Headquarters's location.
    pushpin = new Microsoft.Maps.Pushpin(bingMap.getCenter(), null);
    bingMap.entities.push(pushpin);
}

//initGoogleMap is the constructor for the googleMap object.
function initGoogleMap() {
	var googleMap = new google.maps.Map(document.getElementById('GoogleMap'), {
	center: {lat: 37.7831, lng: -122.4039},
	zoom: 12
	});
	
	//This initializes a marker object on Google Headquarters's location.
	var googleMarker = new google.maps.Marker({
		map: googleMap,
		draggable: true,
		position: {lat:37.7831, lng:-122.4039}
	});
	
	//This googleMarker listener, dragend, moves the bingMap pushpin and repositions the bingMap object to match the googleMap object when the marker is released.
	googleMarker.addListener('dragend',function() {
		var latMark = this.getPosition().lat();
		var lngMark = this.getPosition().lng();
		
		var location = new Microsoft.Maps.Location(latMark,lngMark);
		pushpin = new Microsoft.Maps.Pushpin(location, null);
		
		bingMap.entities.clear();
		bingMap.entities.push(pushpin);
		
		googleCenter = googleMap.getCenter();
		centerLocation = new Microsoft.Maps.Location(googleCenter.lat(),googleCenter.lng());
		
		//the Bing Location object is not as precise as the Google interface. This double zoom was a quick fix to make the maps match more easily.
		options = bingMap.getOptions();
		options.center = centerLocation;
		options.zoom = googleMap.getZoom()-1;
		bingMap.setView(options);
		options.zoom = googleMap.getZoom();
		bingMap.setView(options);
		
	});
	
	//googleMap.addListener('idle',function() {
		//var test = googleMap.getCenter();
		//googleMap.center = test;
	//});
	
	//This googleMap listener, drag, repositions the bingMap object to match the googleMap object.
	googleMap.addListener('drag',function() {
		googleCenter = googleMap.getCenter();
		centerLocation = new Microsoft.Maps.Location(googleCenter.lat(),googleCenter.lng());
		
		options = bingMap.getOptions();
		options.center = centerLocation;
		options.zoom = googleMap.getZoom()-1;
		bingMap.setView(options);
		options.zoom = googleMap.getZoom();
		bingMap.setView(options);
	});
	
	//This googleMap listener, zoom_changed, changes the bingMap object to match the zoom of the googleMap object.
	googleMap.addListener('zoom_changed',function() {
		var zoom = googleMap.getZoom();
		
		options = bingMap.getOptions();
		options.zoom = zoom;
		bingMap.setView(options);
	});
	
	//This googleMap listener, dragend, repositions the bingMap object to match the googleMap object when the marker is released.
	googleMap.addListener('dragend',function() {
		googleCenter = googleMap.getCenter();
		centerLocation = new Microsoft.Maps.Location(googleCenter.lat(),googleCenter.lng());
		
		options = bingMap.getOptions();
		options.center = centerLocation;
		options.zoom = googleMap.getZoom()-1;
		bingMap.setView(options);
		options.zoom = googleMap.getZoom();
		bingMap.setView(options);
	});
}

window.onload = initGoogleMap;