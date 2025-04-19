const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGVzaHRvbWFyciIsImEiOiJjbTlvYTl4cnMwODd0MnFzNHoxc2Z6bm5rIn0.A7QDniha7rUEhyHghUCX3Q';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/visheshtomarr/cm9oalm6b00d501sb35ht9fqc',
    scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
    // Create marker
    const element = document.createElement('div');
    element.className = 'marker';

    // Add marker to map
    new mapboxgl.Marker({
        element,
        // This will make sure that the bottom of the marker
        // points to the coordinates.
        anchor: 'bottom'
    })
        .setLngLat(location.coordinates)
        .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(location.coordinates)
        .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
        .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});