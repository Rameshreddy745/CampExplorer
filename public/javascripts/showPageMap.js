mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: campgroundData.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
const nav=new mapboxgl.NavigationControl({
  visualizePitch:true
})
map.addControl(nav);

const popup = new mapboxgl.Popup({
      offset: 35, className: 'my-class'
    }).setHTML(`<h3>${campgroundData.title}</h3> <p>${campgroundData.location}</p>`)
      .setMaxWidth('300px')


      var marker=new mapboxgl.Marker({
    color:'#fc0335',
}).setLngLat(campgroundData.geometry.coordinates)
  .addTo(map)
  .setPopup(popup)

  
