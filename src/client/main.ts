import maplibregl from 'maplibre-gl'

import 'maplibre-gl/dist/maplibre-gl.css'

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [-118.805, 34.027],
  zoom: 12
})

map.once('load', () => {
  map.addSource('parcels', {
    type: 'vector',
    tiles: [
      'https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/tile/{z}/{y}/{x}.pbf'
    ]
  })

  map.loadImage("https://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png", (error, image) => {
    if (error) {
      console.error(error)
    } else {
      map.addImage("hiker-icon", image as HTMLImageElement)
    }
  })

  const trailheadsLayerName = "Trailheads"

  const trailheadsLayerURL =
    "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/" +
    trailheadsLayerName +
    "/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=pgeojson"

  map.addSource("trailheads", {
    type: "geojson",
    data: trailheadsLayerURL
  })

  map.addLayer({
    id: "trailheads-symbol",
    type: "symbol",
    source: "trailheads",
    layout: {
      "icon-image": "hiker-icon",
      "icon-size": 0.3,
      "icon-allow-overlap": true,
      "text-field": ["get", "TRL_NAME"],
      "text-size": 12,
      "text-anchor": "bottom",
      "text-offset": [0, -2]
    },
    paint: {
      "text-color": "white",
      "text-halo-color": "seagreen",
      "text-halo-width": 2
    }
  })

  const trailsLayerName = "Trails"
  const trailsLayerURL =
    "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/" +
    trailsLayerName +
    "/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=pgeojson"

  map.addSource("trails", {
    type: "geojson",
    data: trailsLayerURL
  })

  map.addLayer({
    id: "trails-line",
    type: "line",
    source: "trails",
    paint: {
      "line-color": "hsl(291, 44%, 60%)",
      "line-width": ["interpolate", ["linear"], ["get", "ELEV_GAIN"], 0, 3, 2300, 7],
      "line-opacity": 0.75
    }
  })

  map.addLayer({
    id: "biketrails-line",
    type: "line",
    source: "trails",
    filter: ["==", ["get", "USE_BIKE"], "Yes"],
    paint: {
      "line-dasharray": [1, 2],
      "line-width": 2,
      "line-color": "hsl(300, 100%, 78.4%)"
    }
  })

  const parksLayerName = "Parks_and_Open_Space"

  const parksLayerURL =
    "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/" +
    parksLayerName +
    "/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=pgeojson"

  map.addSource("parks", {
    type: "geojson",
    data: parksLayerURL
  })

  map.addLayer({
    id: "parks-fill",
    type: "fill",
    source: "parks",
    paint: {
      "fill-color": [
        "match",
        ["get", "TYPE"],
        "Natural Areas",
        "#9E559C",
        "Regional Open Space",
        "#A7C636",
        "Local Park",
        "#149ECE",
        "Regional Recreation Park",
        "#ED5151",
        "black"
      ],
      "fill-opacity": 0.2
    }
  })
})
