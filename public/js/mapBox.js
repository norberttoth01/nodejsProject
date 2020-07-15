/* eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoibm9yYmVydDAxIiwiYSI6ImNrY2wxajczeTF0YWUyd2xwejZza212NTQifQ.H_qDvbTCiO_0uAhlTsEjwg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/norbert01/ckcl1t7hg08q91imovrs9z46g',
    scrollZoom: false,
    // center: [-118.377815, 34.064534],
    // zoom: 4,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);

    // extends tha map bound to include the current location

    const lngLat = new mapboxgl.LngLat(loc.coordinates[0], loc.coordinates[1]);

    bounds.extend(lngLat);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
