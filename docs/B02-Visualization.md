# Lab 2 - Image Processing

## Overview
In this lab, we will search for and visualize imagery in Google Earth Engine. We will discuss the difference between radiance and reflectance, make true color and false color composites from different bands and visually identify land cover types based on characteristics from the imagery. We will also discuss atmospheric effect on data collection by looking at the different data products available. 

####  Learning Outcomes

- Extract single scenes from collections of images
- Create and visualize different composites according
- Use the Inspector tab to assess pixel values
- Understand the difference between radiance and reflectance through visualization

## Searching for Imagery

The Landsat program is a joint program between NASA and the United States Geological Survey (USGS) that has launched a sequence of Earth observation satellites (Landsat 1-9).  Originating in 1984, the Landsat program provides the [longest continuous observation of the Earth's surface](https://www.youtube.com/embed/ZZx1xmNGcXI?list=PLD240BBC85537B9BE). Take the time to monitor some of the fascinating [timelapses](https://earthengine.google.com/timelapse/) using Landsat to showcase things like urban development, glacial retreat and deforestation.  

Let's load a Landsat scene over our region of interest, inspect the units and plot the radiance. Specifically, use imagery from the Landsat 8, the most recent of the [sequence of Landsat satellites](https://www.usgs.gov/core-science-systems/nli/landsat/landsat-8) (at the time of writing, Landsat 9 just launched and data is not yet available). 

To inspect a Landsat 8 image (also called a *scene*) in our region of interest (ROI), we can choose a point to center our map, filter the image collection to get a scene with few clouds, and display information about the image in the console.

You can either scroll to the area on the map you're interested in and choose a point or use the search bar to find your location. Use the geometry tool to make a point in the country Niger (for these exercises we will include the point location in the script). 

![Using Search Bar](https://github.com/ghidora77/03_GEE_Labs_DSPG/blob/main/im/im_02_01a.png?raw=true)

We will specifically be using USGS Landsat 8 Collection 1 Tier 1 Raw Scenes - if you read the documentation, the values refer to scaled, calibrated at-sensor radiance. Tier 1 means it is ready for analysis and is the highest quality imagery. There's quite a bit to learn about how the Landsat data is processed - if you will be working with Landsat extensively, take the time to read the Data Users [Handbook](https://www.usgs.gov/landsat-missions/landsat-8-data-users-handbook) for more information.

We will filter the `ImageCollection` by date (year 2014) and location (to the ROI, which for this exercise is in Niger), sort by a metadata property included in the imagery called `CLOUD_COVER` and get the first image out of this sorted collection.


```python
#!pip install geemap

import ee, geemap, pprint, folium
#ee.Authenticate()

def build_map(lat, lon, zoom, vizParams, image, name):
    map = geemap.Map(center = [lat, lon], zoom = zoom)
    map.addLayer(image, vizParams, name)
    return map

def add_ee_layer(self, ee_image_object, vis_params, name):
  map_id_dict = ee.Image(ee_image_object).getMapId(vis_params)
  folium.raster_layers.TileLayer(
      tiles=map_id_dict['tile_fetcher'].url_format,
      attr='Map Data &copy; <a href="https://earthengine.google.com/">Google Earth Engine</a>',
      name=name,
      overlay=True,
      control=True
  ).add_to(self)

# Initialize the Earth Engine module.
ee.Initialize()
```


```python
lat = 13.7; lon = 2.6
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2014-01-01'
date_end = '2014-12-31'
name = 'Landsat'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

bands = ['B4', 'B3', 'B2']

vizParams = {
    'bands': bands, 
    'min': 0, 
    'max': 0.4
}

map = build_map(lat, lon, zoom, vizParams, image, name)
map
```


    Map(center=[13.7, 2.6], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(…


The variable `image` now stores a reference to an object of type `ee.Image`. In other words, we have taken the image collection and reduced it down to a single image, which is now ready for visualization. 

Before we visualize the data, go to the console and click on the dropdown. 

![Image Properties](https://github.com/ghidora77/03_GEE_Labs_DSPG/blob/main/im/im_02_01b.png?raw=true)


Expand and explore the image by clicking the triangle next to the image name to see more information stored in that object. Specifically, expand `properties` and inspect the long list of metadata items stored as properties of the image. This is where the `CLOUD_COVER` property you just used is stored.

There are band specific coefficients (`RADIANCE_ADD_*`, `RADIANCE_MULT_*` where \* is a band name) in the metadata for converting from the digital number (DN) stored by the image into physical units of radiance. These coefficients will be useful in later exercises.

## Visualizing Landsat Imagery

Recall from the last lab that Landsat 8 measures radiance in multiple spectral bands. A common way to visualize images is to set the red band to display in red, the green band to display in green and the blue band to display in blue - just as you would create a normal photograph. This means trying to match the [spectral response of the instrument](http://landsat.gsfc.nasa.gov/?p=5779) to the spectral response of the photoreceptors in the human eye. It's not a perfect match but this is called a *true-color* image. When the display bands don't match human visual perception (as we will see later), the visualization is called a *false-color composite*. 

#### True Color Composite

To build a true color image we are building a variable called `trueColor`  that selects the red / green / blue bands in order and includes the min and max value to account for the appropriate radiometric resolution - this piece can be tricky, as it is unique for each dataset you work with. You can find the band names and min-max values to use from the dataset documentation page, but a great starting point is to use the 'code example' snippet for each dataset, which will set up the visualization parameters for you.  


```python
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1"
date_start = '2014-01-01'
date_end = '2014-12-31'
name = 'Landsat - True Color'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

bands = ['B4', 'B3', 'B2']

vizParams = {
    'bands': bands, 
    'min': 4000, 
    'max': 18000
}

map1 = build_map(lat, lon, zoom, vizParams, image, name)
map1
```


    Map(center=[13.7, 2.6], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(…


There is more than one way to discover the appropriate min and max values to display. Try going to the **Inspector** tab and clicking somewhere on the map. The value in each band, in the pixel where you clicked, is displayed as a list in the console. Try clicking on dark and bright objects to get a sense of the range of pixel values. Also, [layer manager](https://developers.google.com/earth-engine/playground#layer-manager) in the upper right of the map display lets you automatically compute a linear stretch based on the pixels in the map display. 

#### False Color Composite

Let's do the same thing, but this time we will build a false-color composite. This particular set of bands results in a *color-IR composite* because the near infra-red (NIR) band is set to red. As you inspect the map, look at the pixel values and try to find relationships between the NIR band and different land types. Using false color composites is a very common and powerful method of identifying land characteristics by leveraging the power of signals outside of the visible realm. Mining engineers commonly use hyperspectral data to pinpoint composites with unique signatures, and urban growth researchers commonly use the infrared band to pinpoint roads and urban areas. 


```python
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1"
date_start = '2014-01-01'
date_end = '2014-12-31'
name = 'Landsat - False Color'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

bands = ['B5', 'B4', 'B3']

vizParams = {
    'bands': bands, 
    'min': 6000,
    'max': 20000
}

map2 = build_map(lat, lon, zoom, vizParams, image, name)
map2
```


    Map(center=[13.7, 2.6], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(…


Read through the Landsat data documentation and try playing with different band combinations, min and max values to build different visualizations. 

**Unique Feature**: You can include multiple visualization parameters in your script and toggle the layers on and off with the layer manager for easy comparison. 

![Layer Manager](https://github.com/ghidora77/03_GEE_Labs_DSPG/blob/main/im/im_02_03.png?raw=true)

## At-Sensor Radiance

The image data you have used so far is stored as a digital number that measures the intensity within the bit range - if data is collected in an 8-bit system, 255 would be very high intensity and 0 will be no intensity. To convert each digital number into a physical unit (at-sensor [radiance](https://en.wikipedia.org/wiki/Radiance) in Watts/m2/sr/𝝁m), we can use a linear equation:

$$
L_{\lambda} = a_{\lambda} * DN_{\lambda} + b_{\lambda}  \qquad
$$


Note that every term is indexed by lamda ($\lambda$, the symbol for wavelength) because the coefficients are different in each band. See [Chander et al. (2009)](http://www.sciencedirect.com/science/article/pii/S0034425709000169) for details on this linear transformation between DN and radiance. In this exercise, you will generate a radiance image and examine the differences in radiance from different targets.

Earth Engine provides built-in functions for converting Landsat imagery to radiance in Watts/m2/sr/𝝁m. It will automatically reference the metadata values for each band and apply the equation for you, saving you the trouble of conducing numerous calculations.

This code applies the transformation to a subset of bands (specified by a list of band names) obtained from the image using select(). That is to facilitate interpretation of the radiance spectrum by removing the panchromatic band ('B8'), an atmospheric absorption band ('B9') and the QA band ('BQA'). 

Note that the visualization parameters are different to account for the radiance units.


```python
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1"
date_start = '2014-01-01'
date_end = '2014-12-31'
name = 'Landsat'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11']

dnImage = image.select(bands)

radiance =  ee.Algorithms.Landsat.calibratedRadiance(dnImage)

vizParams = {
    'bands': ['B5', 'B4', 'B3'], 
    'min': 50, 
    'max': 150
}

map3 = build_map(lat, lon, zoom, vizParams, image, name)
map3.add_ee_layer(radiance, vizParams)
map3
```


    Map(center=[13.7, 2.6], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(…


Examine the radiance image by using **Inspector** and clicking different land cover types on the map near Blacksburg, VA. Click the chart icon (![Chart](./im/im_02_04.png)) in the console to get a bar chart of the different radiance values for each pixel. If the shape of the chart resembles Figure 1, that's because the radiance (in bands 1-7) is mostly reflected solar irradiance. The radiance detected in bands 10-11 is thermal, and is *emitted* (not reflected) from the surface.

![Electromagnetic Spectrum](https://github.com/ghidora77/03_GEE_Labs_DSPG/blob/main/im/im_02_05.png?raw=true)

## Top-of-Atmosphere (TOA) Reflectance 

The Landsat sensor is in orbit approximately 700 kilometers above Earth. If we are focused on the imagery of remote sensing (as opposed to studying something like atmospheric conditions or ambient temperature), then we want to find insights about the surface of the earth. To understand the way we calculate information, there are three main components.

Digital Number (DN) is a value that is associated with each pixel - it is generic (in that it is an intensity value dependent upon the bit range), and it allows you to visualize the image where all pixels are in context. In most cases, DN is appropriate for analysis, image processing, machine learning, etc.

Radiance is the radiation that collected by a sensor - this includes radiation from the surface of Earth, radiation scattered by clouds, position of the sun relative to the Earth and sensor, etc. In general, we want to correct radiance values and convert to reflectance. 

Reflectance is the ratio (unitless)  of energy from the sun to the energy reflected off Earth's surface. In fact, it's more complicated than this because radiance is a directional quantity, but this definition captures the basic idea  We can identify materials based on their reflectance spectra. Because this ratio is computed using whatever radiance the sensor measures (which may contain all sorts of atmospheric effects), it's called *at-sensor* or *top-of-atmosphere* (TOA) reflectance. 

Top of Atmosphere reflectance is the reflectance that includes the radiation from earth's surface and radiation from earth's atmosphere. 

Let's examine the spectra for TOA Landsat data. To get TOA data for Landsat, we can do the transformation using the built-in functions created by Earth Engine. We will be using 'USGS Landsat 8 Collection 1 Tier 1 TOA Reflectance' ImageCollection.


```python
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2014-01-01'
date_end = '2014-12-31'
name = 'Landsat  8 TOA spectrum in Blacksburg, VA'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11']
reflectiveBands = bands[0:8]; 
# See http://landsat.usgs.gov/band_designations_landsat_satellites.php  
wavelengths = [0.44, 0.48, 0.56, 0.65, 0.86, 1.61, 2.2]

reflectanceImage =  image.select(reflectiveBands);  

radiance =  ee.Algorithms.Landsat.calibratedRadiance(dnImage)

vizParams = {
    'bands': ['B5', 'B4', 'B3'], 
    'min': 0.1, 
    'max': 0.6
}

map4 = build_map(lat, lon, zoom, vizParams, image, name)
map4.add_ee_layer(reflectanceImage, vizParams)
map4

```


    Map(center=[13.7, 2.6], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(…


Since reflectance is a unitless ratio in [0, 1], change the visualization parameters to correctly display the TOA data:

Using **Inspector**, click several locations on the map and examine the resultant spectra. It should be apparent, especially if you chart the spectra, that the scale of pixel values in different bands is drastically different. Specifically, bands 10-11 are not in [0, 1].  The reason is that these are thermal bands, and are converted to brightness temperature, in Kelvin, as part of the TOA conversion. Very little radiance is reflected in this wavelength range; most is emitted from the Earth's surface. That emitted radiance can be used to estimate [brightness temperature](https://en.wikipedia.org/wiki/Brightness_temperature) using the inverted [Planck equation](https://en.wikipedia.org/wiki/Planck's_law). Examine the temperature of various locations. To make plots of reflectance, select the reflective bands from the TOA image and use the Earth Engine [charting API](https://developers.google.com/earth-engine/charts). 

There are several new methods in this code. The `slice()` method gets entries in a list based on starting and ending indices. Search the docs (on the **Docs** tab) for 'slice' to find other places this method can be used. Construction of the chart is handled by an object of customization parameters ([learn more about customizing charts](https://developers.google.com/earth-engine/charts_image_histogram)) passed to [Chart.image.regions()](https://developers.google.com/earth-engine/charts_image_regions). Customizing charts within GEE can be difficult, so spend time modifying the characteristics. 

## Surface Reflectance 

The ratio of upward radiance *at the Earth's surface* to downward radiance *at the Earth's surface* is called surface reflectance. Unlike TOA reflectance, in which this information is collected at the sensor, the radiances at the Earth's surface have been affected by the atmosphere. both the inbound and outbound radiance from the sun is affected by its path through the atmosphere to the sensor. Unravelling those effects is called atmospheric correction ("compensation" is probably a more accurate term) and is beyond our scope of this lab. However, most satellite imagery providers complete this correction for the consumers. While you could use the raw scenes directly, if your goal is conduct analysis quickly and effectively, using the corrected Surface Reflectance image collections are quite beneficial and will save you quite a bit of time.