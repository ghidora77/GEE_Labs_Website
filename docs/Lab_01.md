# Lab 01 - Remote Sensing Background


## Overview

The purpose of this lab is to introduce you to the core concepts of remote sensing. We will cover digital images, datum and projections, and the different types of resolution: spatial, spectral, temporal and radiometric. We will also cover some of the most well-known satellite platforms that we will be working with. At the completion of this lab, you will be able to work within Google Earth Engine to select the data that is the best fit for your use case, visualize the data and begin to extract insight from it.


#### Learning Outcomes


1. Understand and describe the following terms:
    - Digital image
    - Datum
    - Projection
    - Resolution (spatial, spectral, temporal, radiometric)
2. Navigate the Google Earth Engine console to gather information about the imagery contained within a satellite platform
4. Visualize a digital image within Google Earth Engine and use inspector to look at pixel values

## Digital Image
A digital image is a matrix of equally-sized square pixels that are each defined by two main attributes:

1. The position within the matrix, as defined by row, column and layer
2. A value associated with that position

In the context of geospatial imagery, we will refer to these pixel-based data structures as 'raster', as opposed to 'vector' data (points, lines, polygons). While vector and raster data both work in conjunction with one another, they have different attributes and characteristics. Before we discuss geospatial raster imagery, let's understand how a regular photograph is created. All of the images below were used from example photographs in the documentation in MatLab and OpenCV. 

#### One Layer Grayscale

Let's start with a grayscale image of some peppers. This image is rectangle that contains 384 rows and 512 columns of pixels - because it is greyscale, there is only one brightness magnitude value (between 0 and 255) for each position. While humans see shapes, hues and definition, a computer is only recording a brightness value for each pixel. 

![im_01_01](im/im_01_01.png)

Below is a small segment of the matrix of values of the greyscale image between rows 50 and 60 and columns 50 and 60. Note that when working with imagery, the row/column position starts on the top left. Using our row/column designation:

* `greyscale(54, 50)`  has a value of 52
* `greyscale(50, 54)` has a value of 49
* `greyscale(60, 60)` has a value of 47

![im_01_02](im/im_01_02.png)

#### Three Layer Color Image

The image is still the same, although this now has color. The number of rows, columns and the size of each pixel remain the same, but unlike the greyscale image, we now have three layers, or bands. Each band represents the value in each of the three primary colors: red, green, blue. If we look at the size of our matrix, it is now 384x512x3. For each row and column position, we now have 3 separate values between 0 and 255, which blend together into a color that we, as humans, can process. 

![im_01_03](im/im_01_03.png)



#### Extension to Geospatial Imagery

Geospatial imagery poses two additional complications on top of a traditional color photograph. For analysis, we need to be able to tie our imagery to the real world. In the image of peppers, each pixel was built on an arbitrary axis of rows and columns that start at zero. However, this gives us no meaningful information about where in the world the red bell pepper is located. With geospatial imagery, we need to associate pixels with location. We need to know the exact size of the pixel, and position on earth. The high-resolution imagery below is produced by the 'National Agriculture Imagery Program'. This imagery has a red, green and blue value and a latitude and longitude (-74.01, 40.72), in addition to a size (each pixel represents 1 meter by 1 meter). With this information, we can associate our pixel values with location on earth (New York), and aggregate the information we need. 

![im_01_04](im/im_01_04.png)

The other complexity we are faced with is that satellite imagery often has many layers. While our image of peppers had only a red, green and blue value, many satellite platforms are equipped to provide much more information. Most platforms have a value in the near infra-red range - while others have numerous bands, with different scales and resolutions. For instance, the Landsat 8 sensor has eleven bands capturing information from eleven different portions of the electromagentic spectrum, including near infrared (NIR) and thermal bands that are invisible to the human eye. Many Machine Learning projects, which we will explore in later labs, involve normalizing or transforming the information contained within each of these layers. Note that while each pixel size must be the same within each individual layer, the layers can be different. For instance, a satellite platform may have 5 meter spatial resolution in the red/green/blue range, but 60m resolution in the near infra-red range. While visualizing satellite imagery as a traditional photograph is a good starting point, there's much more information that we can incorporate into our analysis. We often build false or pseudocolor images by utilizing different combintions of bands, or we can focus in on certain infrared signatures to detect asphalt roads and roofs. The possibilities of analysis within remote sensing are endless, but this also leads to complications. 

![im_01_05](im/im_01_05.png)

As said before, digital images are often referred to as 'raster' data. ESRI, makers of ArcGIS has an excellent overview of using raster imagery in geospatial analysis featured [here](https://desktop.arcgis.com/en/arcmap/10.3/manage-data/raster-and-images/what-is-raster-data.htm).


### From Digital Image to Geospatial Image
To make the connection between our satellite imagery and real-world location even more complicated is the fact that a digital image is a flat, square surface - the earth is spherical. 

To make use remote sensing imagery, we need to align the pixels in our image to a real-world location. There's quite a bit of mathematics involved in this process, but we will focus on two main components - establishing a Geographic Coordinate System (GCS) and a Projected Coordinate System (PCS).

The GCS defines the spherical location of the image whereas the PCS defines how the grid around that location is constructed. Because the earth is not a perfect sphere, there are different GCS for different regions, such as 'North American Datum: 83' which is used to accurately define North America, and 'World Geodetic System of 1984', which is used globally. 

The PCS then constructs a flat grid around the GCS to create a relationship between each pixel of a 2-dimensional image to the corresponding area on the world. Some of the common PCS formats include EPSG, Albers Conic, Lambert, Eckert, Equidistant, etc. Different types of PCS's are designed for different use cases, as the needs of a petroleum engineer working over a few square miles will differ from than a climate change researcher measuring global change. Much of the discussion of defining GCS is outside the scope of this course, but the important thing to note is that a GCS defines the starting point for a projection.

ESRI has an [article](https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/gcs_vs_pcs/) discussing the difference between GCS and PCS that provides further context on this relationship. While you should be aware of these two major terms - especially when you intend to run analysis on the data you download from GEE in another system, such as R, Python, or ArcGIS - GEE takes care of much of the complexity of these differences behind the scenes. Further documentation on the GEE methodology can be found [here](https://developers.google.com/earth-engine/guides/projections). In our first exercise, we will show you how to identify the PCS so you can understand the underlying structure. 

Understanding the bands available in your datasets, identifying which bands are necessary (and appropriate) for your analysis, and ensuring that these data represent consistent spatial locations is essential. While GEE simplifies many complex calculations behind the scenes, this lab will help us unpack the products available to us and their essential characteristics.

#### Summary
Each pixel has a position, measured with respect to the axes of some coordinate reference system (CRS), such as a [geographic coordinate system](https://en.wikipedia.org/wiki/Geographic_coordinate_system). A CRS in Earth Engine is often referred to as a projection, since it combines a shape of the Earth with a [datum](https://en.wikipedia.org/wiki/Geodetic_datum) and a transformation from that spherical shape to a flat map, called a [projection](https://en.wikipedia.org/wiki/Map_projection). 
![im_02_02](./im/im_02_02.png)


### Visualize a Digital Image

Let’s view a digital image in GEE to better understand this concept:

1. In the map window of GEE, click on the Point geometry tool using the [geometry drawing tools](https://developers.google.com/earth-engine/playground#geometry-tools) to define your area of interest (for the purposes of consistency in this exercise, place a point on the Virginia Tech Drillfield, which will bring you roughly to`[-80.42,37.23]`). As a reminder, you can find more information on geometry drawing tools in GEE’s Guides. Name the import `point`.
  
2. Import NAIP imagery by searching for 'naip' and choosing the *'NAIP: National Agriculture Imagery Program'* raster dataset. Name the import `naip`. 

3. Get a single, recent NAIP image over your study area and inspect it:
  
   ```javascript
   //  Get a single NAIP image over the area of interest.  
   var  image = ee.Image(naip  
                         .filterBounds(point)
                         .sort('system:time_start', false)
                         .first());      
   //  Print the image to the console.  
   print('Inspect the image object:', image);     
   //  Display the image with the default visualization.  
   Map.centerObject(point, 18);  
   Map.addLayer(image, {}, 'Original image');
   ```
   
4. Expand the image object that is printed to the console by clicking on the dropdown triangles. Expand the property called `bands` and expand one of the bands (0, for example). Note that the CRS transform is stored in the `crs_transform` property underneath the band dropdown and the CRS is stored in the `crs` property, which references an EPSG code. 

    > **EPSG Codes** are 4-5 digit numbers that represent CRS definitions. The acronym EPGS, comes from the (now defunct) European Petroleum Survey Group.  The CRS of this image is [EPSG:26917](https://spatialreference.org/ref/epsg/nad83-utm-zone-17n/). You can often learn more about those [EPSG codes](http://www.epsg-registry.org/) from [thespatialreference.org](http://spatialreference.org/) or from the [ESPG homepage](https://epsg.org/home.html). 
  
    > The CRS transform is a list  `[m00, m01, m02, m10, m11, m12]`  in the notation of [this reference](http://docs.oracle.com/javase/7/docs/api/java/awt/geom/AffineTransform.html).  The CRS transform defines how to map pixel coordinates to their associated spherical coordinate through an affine transformation. While affine transformations are beyond the scope of this class, more information can be found at [Rasterio](https://rasterio.readthedocs.io/en/latest/topics/georeferencing.html), which provides detailed documentation for the popular Python library designed for working with geospatial data. 
    
5. In addition to using the dropdowns, you can also access these data programmatically with the `.projection()` method:
                                                                                             
    ```javascript
    // Display the projection of band 0
    print('Inspect the projection of band 0:', image.select(0).projection());
    ```
    
6. Note that the projection can differ by band, which is why it's good practice to inspect the projection of individual image bands. 

7. (If you call `.projection()` on an image for which the projection differs by band, you'll get an error.) Exchange the NAIP imagery with the Planet SkySat MultiSpectral image collection, and note that the error occurs because the 'P' band has a different pixel size than the others.

8. Explore the `ee.Projection` docs to learn about useful methods offered by the `Projection` object. To play with projections offline, try [this tool](http://www.giss.nasa.gov/tools/gprojector/).


### Digital Image Visualization and Stretching

You've learned about how an image stores pixel data in each band as digital numbers (DNs) and how the pixels are organized spatially. When you add an image to the map, Earth Engine handles the spatial display for you by recognizing the projection and putting all the pixels in the right place. However, you must specify how to stretch the DNs to make an 8-bit display image (e.g., the `min` and `max` visualization parameters). Specifying `min` and `max` applies (where DN' is the displayed value):

   $$ DN' =   \frac{ 255 (DN - min)}{(max - min)} $$

1. To apply a [gamma correction](https://en.wikipedia.org/wiki/Gamma_correction) (DN' = DN$_\gamma$), use:

    ```javascript
    // Display gamma stretches of the input image.
    Map.addLayer(image.visualize({gamma: 0.5}), {}, 'gamma = 0.5');
    Map.addLayer(image.visualize({gamma: 1.5}), {}, 'gamma = 1.5');
    ```
  
    Note that gamma is supplied as an argument to [image.visualize()](https://developers.google.com/earth-engine/apidocs/ee-image-visualize) so that you can click on the map to see the difference in pixel values (try it!). It's possible to specify `gamma`, `min`, and `max` to achieve other unique visualizations.


2. To apply a [histogram equalization](https://en.wikipedia.org/wiki/Histogram_equalization) stretch, use the [`sldStyle()`](https://devsite.googleplex.com/earth-engine/image_visualization#styled-layer-descriptors) method


```javascript
// Define a RasterSymbolizer element with '_enhance_' for a placeholder.
  var histogram_sld =
    '<RasterSymbolizer>' +
      '<ContrastEnhancement><Histogram/></ContrastEnhancement>' +
      '<ChannelSelection>' +
        '<RedChannel>' +
          '<SourceChannelName>R</SourceChannelName>' +
        '</RedChannel>' +
        '<GreenChannel>' +
          '<SourceChannelName>G</SourceChannelName>' +
        '</GreenChannel>' +
        '<BlueChannel>' +
          '<SourceChannelName>B</SourceChannelName>' +
        '</BlueChannel>' +
      '</ChannelSelection>' +
    '</RasterSymbolizer>';

  // Display the image with a histogram equalization stretch.
  Map.addLayer(image.sldStyle(histogram_sld), {}, 'Equalized');
```

The [`sldStyle()`](https://devsite.googleplex.com/earth-engine/image_visualization#styled-layer-descriptors) method requires image statistics to be computed in a region (to determine the histogram).

## Spatial Resolution                                                     

In the present context, spatial resolution refers to pixel size. This ranges widely, with Maxar announcing 15cm [resolution]([Introducing 15 cm HD: The Highest Clarity From Commercial Satellite… (maxar.com)](https://blog.maxar.com/earth-intelligence/2020/introducing-15-cm-hd-the-highest-clarity-from-commercial-satellite-imagery)), Landsat at 30m, and large global products covering multiple squared kilometers.  The key point in dealing with spatial resolution is ensuring that your analysis drives your data collection. Using high resolution imagery will be extremely expensive, both monetarily and computationally, if conducting continent wide analysis. Yet using low-resolution imagery will not be effective in identifying individual buildings or small vehicles. Understanding the appropriate spatial resolution needed for your analysis is essential. 

In practice, spatial resolution depends on the projection of the sensor's instantaneous field of view (IFOV) of the ground and how a set of radiometric measurements are resampled into a regular grid. To see the difference in spatial resolution resulting from different sensors, visualize data at different scales from different sensors.

### MODIS 
There are two Moderate Resolution Imaging Spectro-Radiometers ([MODIS](http://modis.gsfc.nasa.gov/)) aboard the [Terra](http://terra.nasa.gov/) and [Aqua](http://aqua.nasa.gov/) satellites. Different MODIS [bands](http://modis.gsfc.nasa.gov/about/specifications.php) produce data at different spatial resolutions. For the visible bands, the lowest common resolution is 500 meters (red and NIR are 250 meters). Data from the MODIS platforms are used to produce a large number of data sets having daily, weekly, 16-day, monthly, and annual data sets. Outside this lab, you can find a list of MODIS land products [here](https://lpdaac.usgs.gov/dataset_discovery/modis/modis_products_table). 

1. Search for '[MYD09GA](https://lpdaac.usgs.gov/dataset_discovery/modis/modis_products_table/myd09ga_v006)' and import '*MYD09GA.006 Aqua Surface Reflectance Daily Global 1km and 500m*'. Name the import `myd09`. 
  
2. Zoom the map to San Francisco (SFO) airport:

    ```javascript
    // Define a region of interest as a point at SFO airport.
    var sfoPoint = ee.Geometry.Point(-122.3774, 37.6194);
    // Center the map at that point.
    Map.centerObject(sfoPoint, 16);
    ```
    
3. To display a false-color MODIS image, select an image acquired by the Aqua MODIS sensor and display it for SFO:

    ```javascript
    // Get a surface reflectance image from the MODIS MYD09GA collection.
    var modisImage = ee.Image(myd09.filterDate('2017-07-01').first());
    // Use these MODIS bands for red, green, blue, respectively.
    var modisBands = ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'];
    // Define visualization parameters for MODIS.
    var modisVis = {bands: modisBands, min: 0, max: 3000};
    // Add the MODIS image to the map
    Map.addLayer(modisImage, modisVis, 'MODIS');
    ```
    
4. Note the size of pixels with respect to objects on the ground. (It may help to turn on the satellite basemap to see high-resolution data for comparison.) Print the size of the pixels (in meters) with:

    ```javascript
    // Get the scale of the data from the first band's projection:
    var modisScale = modisImage.select('sur_refl_b01')
    .projection().nominalScale();
    
    print('MODIS scale:', modisScale);
    ```
    
5. Note these `MYD09` data are surface reflectance scaled by 10000 (not TOA reflectance), meaning that clever NASA scientists have done a fancy atmospheric correction for you!

### Multispectral Scanners  

Multi-spectral scanners were flown aboard Landsats 1-5.  ([MSS](https://landsat.gsfc.nasa.gov/multispectral-scanner-system)) data have a spatial resolution of 60 meters.                                                                
1. Search for 'landsat 5 mss' and import the result called *'USGS Landsat 5 MSS Collection 1 Tier 2 Raw Scenes'*. Name the import `mss`.

2. To visualize MSS data over SFO (for a relatively cloud-free) image, use:
  
    ```javascript
    // Filter MSS imagery by location, date and cloudiness.   
    var mssImage = ee.Image(mss     
                            .filterBounds(Map.getCenter())     
                            .filterDate('2011-05-01',  '2011-10-01')     
                            .sort('CLOUD_COVER')     
                            //  Get the least cloudy image.     
                            .first());  
    
    // Display the MSS image as a color-IR composite.
    Map.addLayer(mssImage, {bands: ['B3', 'B2', 'B1'], min: 0, max: 200}, 'MSS');
    ```
3. Check the scale (in meters) as before:

    ```javascript
    // Get the scale of the MSS data from its projection:
    var mssScale = mssImage.select('B1').projection().nominalScale();
    print('MSS scale:', mssScale);
    ```

### Thematic Mapper (TM)
The Thematic Mapper ([TM](https://landsat.gsfc.nasa.gov/landsat-4-5/tm)) was flown aboard Landsats 4-5. (It was succeeded by the Enhanced Thematic Mapper ([ETM+](https://landsat.gsfc.nasa.gov/about/enhanced-thematic-mapper)) aboard Landsat 7 and the Operational Land Imager ([OLI](https://landsat.gsfc.nasa.gov/landsat-8/operational-land-imager)) / Thermal Infrared Sensor ([TIRS](https://landsat.gsfc.nasa.gov/landsat-8/thermal-infrared-sensor-tirs)) sensors aboard Landsat 8.) TM data have a spatial resolution of 30 meters.

1. Search for 'landsat 5 toa' and import the first result (which should be '*USGS Landsat 5 TM Collection 1 Tier 1 TOA Reflectance*'. Name the import `tm`.

2. To visualize TM data over SFO, for approximately the same time as the MODIS image, use:


```javascript
// Filter TM imagery by location, date and cloudiness.
var tmImage = ee.Image(tm
            .filterBounds(Map.getCenter())
            .filterDate('2011-05-01', '2011-10-01')
            .sort('CLOUD_COVER')
            .first());
  
// Display the TM image as a color-IR composite.
Map.addLayer(tmImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.4}, 'TM'); 
```

3. For some hints about why the TM data is not the same date as the MSS data, see [this page](https://www.usgs.gov/core-science-systems/nli/landsat/landsat-5?qt-science_support_page_related_con=0#qt-science_support_page_related_con).

4. Check the scale (in meters) as previously:

     ```javascript
    // Get the scale of the TM data from its projection:
     var tmScale = tmImage.select('B1').projection().nominalScale();
    print('TM scale:', tmScale);
    ```

-------------------------

![im_q](./im/im_q.png)**Question 1: By assigning the NIR, red, and green bands in RGB (4-3-2), what features appear bright red in a Landsat 5 image and why?**

---

### National Agriculture Imagery Program (NAIP)                           
The National Agriculture Imagery Program ([NAIP](http://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/)) is an effort to acquire imagery over the continental US on a 3-year rotation using airborne sensors. The imagery has a spatial resolution of 1-2 meters. 

1. Search for 'naip' and import the data set for *'NAIP: National Agriculture Imagery Program'*. Name the import naip. Since NAIP imagery is distributed as quarters of Digital Ortho Quads at irregular cadence, load everything from the closest year to the examples in its acquisition cycle (2012) over the study area and [mosaic()](https://developers.google.com/earth-engine/guides/ic_composite_mosaic) it:
  ```javascript
  // Get NAIP images for the study period and region of interest.
    var naipImages = naip.filterDate('2012-01-01', '2012-12-31')
    .filterBounds(Map.getCenter());
    // Mosaic adjacent images into a single image.
    var naipImage = naipImages.mosaic();
    // Display the NAIP mosaic as a color-IR composite.
    Map.addLayer(naipImage, {bands: ['N', 'R', 'G']}, 'NAIP');
  ```
  
2. Check the scale by getting the first image from the mosaic (a mosaic doesn't know what its projection is, since the mosaicked images might all have different projections), getting its projection, and getting its scale (meters):

    ```javascript
    // Get the NAIP resolution from the first image in the mosaic.
    var naipScale = ee.Image(naipImages.first()).
                  projection().nominalScale();   
    print('NAIP scale:', naipScale);
    ```


---


![im_q](./im/im_q.png)**Question 2: What is the scale of the most recent round of NAIP imagery for the sample area (2018), and how did you determine the scale?**


---


## Spectral Resolution

Spectral resolution refers to the number and width of spectral bands in which the sensor takes measurements. You can think of the width of spectral bands as the wavelength intervals for each band. A sensor that measures radiance in multiple bands is called a *multispectral* sensor (generally 3-10 bands), while a sensor with many bands (possibly hundreds) is called a *hyperspectral* sensor (these are not hard and fast definitions). For example, compare the [multi-spectral OLI](http://landsat.gsfc.nasa.gov/?p=5779) aboard Landsat 8 to [Hyperion](https://eo1.usgs.gov/sensors/hyperioncoverage), a hyperspectral sensor aboard the [EO-1 satellite](https://eo1.usgs.gov/).

A figure representing common optical sensors and their spectral resolution can be viewed below [(image source)](https://www.researchgate.net/figure/Spectral-resolution-of-currently-available-optical-satellite-sensors-grouped-by-different_fig1_348695518):

![im_02_03](./im/im_02_03.png)

There is an easy way to check the number of bands in Earth Engine, but no way to get an understanding of the relative *spectral response* of the bands, where spectral response is a function measured in the laboratory to characterize the detector. 

1. To see the number of bands in an image, use:

    ```javascript
    // Get the MODIS band names as a List
    var modisBands = modisImage.bandNames();
    // Print the list.
    print('MODIS bands:', modisBands);
    // Print the length of the list.
    print('Length of the bands list:', modisBands.length());
    ```
    
2. Note that only some of those bands contain radiometric data. Lots of them have other information, like quality control data. So the band listing isn't necessarily an indicator of spectral resolution, but can inform your investigation of the spectral resolution of the dataset. Try printing the bands from some of the other sensors to get a sense of spectral resolution.
  
---


![im_q](./im/im_q.png)**Question 3.1: What is the spectral resolution of the MODIS instrument, and how did you determine it?**                                                                           


![im_q](./im/im_q.png)**Question 3.2: Investigate the bands available for the USDA NASS Cropland Data Layers (CDL). What does the band information for the CDL represent? Which band(s) would you select if you were interested in evaluating the extent of pasture areas in the US? **

---

## Temporal Resolution
Temporal resolution refers to the *revisit time*, or temporal *cadence* of a particular sensor’s image stream. Think of this as the frequency of pixels in a time series at a given location.

### MODIS 
MODIS (either Terra or Aqua) produces imagery at approximately a daily cadence. To see the time series of images at a location, you can `print()` the `ImageCollection`, filtered to your area and date range of interest. For example, to see the MODIS images in 2011:

```javascript
// Filter the MODIS mosaics to one year.   
var modisSeries = myd09.filterDate('2011-01-01', '2011-12-31');      

// Print the filtered  MODIS ImageCollection.   
print('MODIS series:', modisSeries);  
```

Expand the `features` property of the printed `ImageCollection` to see a `List` of all the images in the collection. Observe that the date of each image is part of the filename. Note the daily cadence. Observe that each MODIS image is a global mosaic, so there's no need to filter by location.

### Landsat
Landsats (5 and later) produce imagery at 16-day cadence. TM and MSS are on the same satellite (Landsat 5), so it suffices to print the TM series to see the temporal resolution. Unlike MODIS, data from these sensors is produced on a scene basis, so to see a time series, it's necessary to filter by location in addition to time:

```javascript

// Filter to get a year's worth of TM scenes.
var tmSeries = tm
  .filterBounds(Map.getCenter())
  .filterDate('2011-01-01', '2011-12-31');
// Print the filtered TM ImageCollection. 
print('TM series:', tmSeries);
  
```

1. Again expand the `features` property of the printed `ImageCollection`. Note that a [careful parsing of the TM image IDs](http://landsat.usgs.gov/naming_conventions_scene_identifiers.php) indicates the day of year (DOY) on which the image was collected. A slightly more cumbersome method involves expanding each Image in the list, expanding its properties and looking for the 'DATE_ACQUIRED' property. 

2. To make this into a nicer list of dates, [map()](https://en.wikipedia.org/wiki/Map_(higher-order_function)) a function over the ImageCollection. First define a function to get a Date from the metadata of each image, using the system properties:

    ```javascript
    var getDate = function(image) {
    // Note that you need to cast the argument
    var time = ee.Image(image).get('system:time_start');
    // Return the time (in milliseconds since Jan 1, 1970) as a Date
    return ee.Date(time);
    };
    ```

3. Turn the `ImageCollection` into a `List` and[ map() the function](https://developers.google.com/earth-engine/getstarted#mapping-what-to-do-instead-of-a-for-loop) over it:

    ```javascript
    var dates = tmSeries.toList(100).map(getDate);
    ```
  
4. Print the result:

    ```javascript
    print(dates);
    ```


---

![im_q](./im/im_q.png)**Question 4: What is the temporal resolution of the Sentinel-2 satellites? How can you determine this from within GEE? **

---------------------

## Radiometric Resolution

Radiometric resolution refers to the ability of an imaging system to record many levels of brightness: _coarse_ radiometric resolution would record a scene with only a few brightness levels, whereas _fine_ radiometric resolution would record the same scene using many levels of brightness. Some also consider radiometric resolution to refer to the _precision_ of the sensing, or the level of _quantization_.

![im_01_05](im/im_01_09.jpeg)

Radiometric resolution is determined from the minimum radiance to which the detector is sensitive (L<sub>min</sub>), the maximum radiance at which the sensor saturates (L<sub>max</sub>), and the number of bits used to store the DNs (Q): 


$$  \text{Radiometric resolution} = \frac{(L_{max} - L_{min})}{2^Q} $$


It might be possible to dig around in the metadata to find values for L<sub>min</sub> and L<sub>max</sub>, but computing radiometric resolution is generally not necessary unless you're studying phenomena that are distinguished by very subtle changes in radiance.

## Resampling and ReProjection

Earth Engine makes every effort to handle projection and scale so that you don't have to. However, there are occasions where an understanding of projections is important to get the output you need. As an example, it's time to demystify the [reproject()](https://developers.google.com/earth-engine/apidocs/ee-image-reproject) calls in the previous examples. Earth Engine requests inputs to your computations in the projection and scale of the output. The map attached to the playground has a [Maps Mercator projection](http://epsg.io/3857). 

The scale is determined from the map's zoom level. When you add something to this map, Earth Engine secretly reprojects the input data to Mercator, resampling (with nearest neighbor) to screen resolution pixels based on the map's zoom level, then does all the computations with the reprojected, resampled imagery. In the previous examples, the reproject() calls force the computations to be done at the resolution of the input pixels: 1 meter.

1. Re-run the edge detection code with and without the reprojection (Comment out all previous `Map.addLayer()` calls except for the original one)

    ```javascript
    // Zoom all the way in.
    Map.centerObject(point, 21);
    // Display edges computed on a reprojected image.
    Map.addLayer(image.convolve(laplacianKernel), {min: 0, max: 255}, 
           'Edges with little screen pixels');
    // Display edges computed on the image at native resolution.
    Map.addLayer(edges, {min: 0, max: 255}, 
           'Edges with 1 meter pixels'); 
    ```

    What's happening here is that the projection specified in `reproject()` propagates backwards to the input, forcing all the computations to be performed in that projection. If you don't specify, the computations are performed in the projection and scale of the map (Mercator) at screen resolution.

2. You can control how Earth Engine resamples the input with [`resample()`](https://developers.google.com/earth-engine/guides/resample). By default, all resampling is done with the nearest neighbor. To change that, call `resample()` on the *inputs*. Compare the input image, resampled to screen resolution with a bilinear and bicubic resampling:

    ```javascript
    // Resample the image with bilinear instead of the nearest neighbor.
    var bilinearResampled = image.resample('bilinear');
    Map.addLayer(bilinearResampled, {}, 'input image, bilinear resampling');
    
    // Resample the image with bicubic instead of the nearest neighbor.
    var bicubicResampled = image.resample('bicubic');
    Map.addLayer(bicubicResampled, {}, 'input image, bicubic resampling');
    ```

3. Try zooming in and out, comparing to the input image resampled with the nearest with nearest neighbor (i.e. without `resample()` called on it).

    **You should rarely, if ever, have to use `reproject()` and `resample()`.** Do not use `reproject()` or `resample()` unless necessary. They are only used here for demonstration purposes.


## Additional Exercises


Now that we have some familiarity with higher quality images, lets look at a few from the (broken) Landsat 7 satellite. Using your downloading skills, select an image that contains the Blacksburg area with minimal cloud cover from Landsat 7 (for now, using the Collection 1 Tier 1 calibrated top-of-atmosphere (TOA) reflectance data product).  Look at the image. 

![im_q](./im/im_q.png)**Question 5: What is the obvious (hint: post-2003) problem with the Landsat 7 image? What is the nature of that problem and what have some researchers done to try to correct it? Please research online in addition to using what you have learned in class/from the book.** 

**![im_q](./im/im_q.png)Question 6: Name three major changes you can view in the Blacksburg Area in the last decade using any of the above imagery (and state the source).**

---

Conduct a search to compare the technical characteristics of the following sensors: 

(i) MODIS (NASA) versus Sentinel (ESA), and 
(ii) AVHRR (NASA) versus IRS-P6 (or choose another Indian Remote Sensing satellite)  


![im_q](./im/im_q.png)**Question 7: Based on the characteristics you describe, for which applications is one sensor likely to be more suitable than the other ones? **

Note: when using the internet to answer this question, be sure to cite your sources and ensure that you are obtaining information from an official, reputable source!

---

