import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lab 3 - Spectral Indices 

## Overview

In this lab, we will work with the spectral characteristics in our data to visualize and extract insights that go beyond basic visual interpretation. We will work with the different spectral bands offered by Landsat 8 to find unique patterns that can help us solve problems and conduct analysis. By the end of this lab, you should be able to understand how to build and visualize existing indices, as well as construct your own, identify how different indices can help your use case, and understand the mechanism behind how they work. 

## Spectral Indices

Spectroscopy is the study of how radiation is absorbed, reflected and emitted by different materials. While this discipline has its origins in chemistry and physics, we can utilize the same techniques to identify different land cover types from satellite data.  In the chart below, land cover types have unique spectral characteristics. Snow has a major peak at lower wavelengths and is near zero above 1.5 micrometer, whereas soil has very low reflectance at lower levels of wavelength but relatively strong and steady reflectance after ~0.75 micrometers. Spectral indices are built to leverage these unique characteristics and isolate specific types of land cover. 

Land covers are separable at different wavelengths. Vegetation curves (green) have high reflectance in the NIR range, where radiant energy is scattered by cell walls ([Bowker, 1985](http://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/19850022138.pdf)) and low reflectance in the red range, where radiant energy is [absorbed by chlorophyll](https://en.wikipedia.org/wiki/Chlorophyll#/media/File:Chlorophyll_ab_spectra-en.svg). We can leverage this information to build indices that help us differentiate vegetation from urban areas. In the next few sections, we will cover several of the most important indices in use. 

![Land Cover Reflectance](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-01.png)

## Important Indices 

#### Normalized Difference Vegetation Index (NDVI)

The Normalized Difference Vegetation Index ([NDVI](https://developers.google.com/earth-engine/apidocs/ee-image-normalizeddifference)) has a [long history](https://en.wikipedia.org/wiki/Normalized_Difference_Vegetation_Index) in remote sensing, and is one of the most widely used measures. The typical formulation is:

$$\text{NDVI} = (\text{NIR} - \text{red}) / (\text{NIR} + \text{red})$$

Where *NIR* refers to the near infrared band and *red* refers to the red peak in the visible spectrum.

Because NDVI is a popular and well-known index, we can use the built-in functionality within Earth Engine `normalizedDifference()`to calculate NDVI. You can follow the steps below to build your own indices. 

First, build a baseline true color image around our region of interest, Niger. We will work with the Landsat 8 Collection 1 Tier 1 TOA Reflectance data from 2015, sort by cloud cover and extract the first image.


<Tabs>

<TabItem value="py" label="Python">

```python
#!pip install geemap
import ee, geemap, pprint
#ee.Authenticate()
def build_map(lat, lon, zoom, vizParams, image, name):
    map = geemap.Map(center = [lat, lon], zoom = zoom)
    map.addLayer(image, vizParams, name)
    return map
ee.Initialize()

```
</TabItem>
</Tabs>



<Tabs>
<TabItem value="js" label="JavaScript">

```javascript
var point = ee.Geometry.Point([-80.42, 37.22]);
var landsat = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
var  image = ee.Image(landsat     
                      .filterBounds(point)     
                      .filterDate('2015-06-01', '2015-09-01')
                      .sort('CLOUD_COVER')
                      .first());
var trueColor = {bands: ['B4', 'B3', 'B2'], 
                 min: 0, max: 0.3};   
Map.centerObject(point, 12);                  
Map.addLayer(image, trueColor, 'image');  
```

</TabItem>

<TabItem value="py" label="Python">

```python
lat = 13.7; lon = 2.6
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2015-06-01'
date_end = '2015-09-01'
name = 'Landsat 8 TOA spectrum'
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
    'max': 0.3
}
# Define a map centered on Blacksburg
map = build_map(lat, lon, zoom, vizParams, image, name)
map.add_ee_layer(image, vizParams)
map
```
</TabItem>
</Tabs>


![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-02.png)


Now that we have the true color baseline image, we can build the NDVI index and visualize it. For visualization, we are creating a custom palette, where low values trend towards white and high values trend towards green. 


```python
ndvi = image.normalizedDifference(['B5', 'B4']); 
vegPalette = ['white', 'green']; 
vizParams = {
    'min': -1, 
    'max': 1,
    'palette': vegPalette
}

map1 = build_map(lat, lon, zoom, vizParams, ndvi, name)
map1
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-03.png)

> **Question 1A**: What are some of the sample pixel values of the NDVI in the below categories. Indicate which parts of the images you used and how you determined what each of their values were.
>
> 1. Vegetation
> 2. Urban features
> 3. Bare earth 
> 4. Water

#### Enhanced Vegetation Index (EVI) 

The Enhanced Vegetation Index (EVI) is designed to minimize saturation and background effects in NDVI ([Huete, 2002](http://www.sciencedirect.com/science/article/pii/S0034425702000962)). 

$$\text{EVI} = 2.5 * (\text{NIR} - \text{red}) / (\text{NIR} + 6 * \text{red} - 7.5 * \text{blue} + 1)$$

Since it is not a normalized difference index, we need to build a unique [expression](https://developers.google.com/earth-engine/image_math#expressions) and then identify all of the different segments. Programmatically, bands are specifically referenced with the help of [an object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types#Object_literals) that is passed as the second argument to `image.expression()` (everything within the curly brackets). 


```python
# Build the expression
exp = '2.5  * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))'
evi = image.expression( exp, 
                            {
                             'NIR': image.select('B5'),
                             'RED': image.select('B4'),
                             'BLUE': image.select('B2')
                            }) 

map2 = build_map(lat, lon, zoom, vizParams, evi, name)
map2
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-04.png)

> **Question 1B**: Compare EVI to NDVI across those same land use categories as in the previous question. What do you observe -- how are the images and values similar or different across the two indices?

#### Normalized Difference Water Index (NDWI)

The Normalized Difference Water Index (NDWI) was developed by [Gao (1996)](http://www.sciencedirect.com/science/article/pii/S0034425796000673) as an index to identify the water content within vegetation. SWIR stands for short-wave infrared, which is the Landsat band 6.  This is not an exact implementation of NDWI, according to the [OLI spectral response](http://landsat.gsfc.nasa.gov/?p=5779), since OLI does not have a band in the right position (1.26 𝛍m) - but for our purposes, this is an approximation that does an acceptable job of identifying water content. 

$$\text{NDWI} = (\text{NIR} - \text{SWIR})) / (\text{NIR} + \text{SWIR})$$


```python
ndwi = image.normalizedDifference(['B5', 'B6']);  
waterPalette = ['white', 'blue'];   

vizParams = {
    'min': -1, 
    'max': 1,
    'palette': waterPalette
}

map3 = build_map(lat, lon, zoom, vizParams, ndwi, name)
map3
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-05.png)


#### Normalized Difference Water *Body* Index (NDWBI)

The fact that two different NDWI indices were independently invented in 1996 complicates things. While the NDWI looks at water content within vegetation, the NDWBI is built to identify bodies of water (rivers, lakes, oceans). To distinguish, define the Normalized Difference Water *Body* Index (NDWBI) as the index described in [McFeeters (1996)](http://www.tandfonline.com/doi/abs/10.1080/01431169608948714#.VkThFHyrTlM):

$$\text{NDWBI} = (\text{green} - \text{NIR}) / (\text{green} + \text{NIR})$$

As previously, implement NDWBI with `normalizedDifference()` and display the result.


```python
ndwbi = image.normalizedDifference(['B3', 'B5']);  
vizParams = {
    'min': -1, 
    'max': 0.5,
    'palette': waterPalette
}

map4 = build_map(lat, lon, zoom, vizParams, ndwbi, name)
map4
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-06.png)

You can combine the code blocks to compare the actual values at different pixel locations. Use inspector to test out different land areas.

> **Question 2**: Compare NDWI and NDWBI. What do you observe? What do each of the indices try to focus on?


#### Normalized Difference Bare Index (NDBI)

The Normalized Difference Bare Index (NDBI) was developed by [Zha, 2003)](http://www.tandfonline.com/doi/abs/10.1080/01431160304987) to aid in the differentiation of urban areas by using a combination of the shortwave and near infrared. 

$$\text{NDBI} = (\text{SWIR} - \text{NIR}) / (\text{SWIR} + \text{NIR})$$

Note that NDBI is the negative of NDWI. Compute NDBI and display with a suitable palette. (Check [this reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) to demystify the palette reversal)


```python
ndbi = image.normalizedDifference(['B6', 'B5']); 
# Reverse the water palette
barePalette =  waterPalette.copy()
barePalette.reverse() 
vizParams = {
    'min': -1, 
    'max': 0.5,
    'palette': barePalette
}
  
map4 = build_map(lat, lon, zoom, vizParams, ndbi, name)
map4
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-07.png)


#### Burned Area Index (BAI) 

The Burned Area Index (BAI) was developed by [Chuvieco et al. (2002)](http://www.tandfonline.com/doi/abs/10.1080/01431160210153129) to assist in the delineation of burn scars and assessment of burn severity. It is based on maximizing the spectral characteristics of charcoal reflectance. To examine burn indices, load an image from 2013 showing the [Rim fire](https://en.wikipedia.org/wiki/Rim_Fire) in the Sierra Nevadas. We'll start by creating a true image of the area to see how well this index highlights the presence of wildfire.


```python
lat = 37.850; lon = -120.083; 
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2013-08-17'
date_end = '2013-09-27'
name = 'Landsat  8 TOA spectrum in Blacksburg, VA'
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
    'max': 0.3
}

# Define a map centered on southern Maine.
map5 = build_map(lat, lon, zoom, vizParams, image, name)
map5.add_ee_layer(image, vizParams)
map5
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-08.png)


Closely examine the true color display of this image. Can you spot where the fire occurred? If difficult, let's look at the burn index.


```python
# Build Burn Index expression
exp = '1.0  / ((0.1 - RED)**2 + (0.06 - NIR)**2)';
bai = image.expression(exp, 
                       {
                            'NIR': image.select('B5'), 
                            'RED': image.select('B4') 
                       }
                      );
                                
burnPalette = ['green', 'blue', 'yellow', 'red'];

vizParams = {
    'min': 0, 
    'max': 400,
    'palette': burnPalette
}

# Define a map centered on Northern California
map6 = build_map(lat, lon, zoom, vizParams, bai, name)
map6
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-09.png)

The charcoal burn area is now very evident. Being that Landsat has historical data and a wide array of sensors, this can be a powerful way to understand natural phenomena. 

> **Question 3**: Compare NDBI and the BAI displayed results -- what do you observe?

#### Normalized Burn Ratio Thermal (NBRT)

The Normalized Burn Ratio Thermal (NBRT) was developed based on the idea that burned land has low NIR reflectance (less vegetation), high SWIR reflectance (think ash), and high brightness temperature ([Holden et al. 2005](http://www.tandfonline.com/doi/abs/10.1080/01431160500239008)). Unlike the other indices, a lower NBRT means a higher likelihood of recent burn (for visualization, reverse the scale). This index can be used to diagnose the severity of wildfires (see [van Wagtendonk et al. 2004](http://www.sciencedirect.com/science/article/pii/S003442570400152X)).


```python
   
# Build Burn Index expression
exp = '(NIR - 0.0001 * SWIR *  Temp) / (NIR + 0.0001 * SWIR * Temp)'
nbrt = image.expression(exp, {
        'NIR': image.select('B5'),   
        'SWIR': image.select('B7'),   
        'Temp': image.select('B11')  
        });  
vizParams = {
    'min': 1, 
    'max': 0.9,
    'palette': burnPalette
}

map7 = build_map(lat, lon, zoom, vizParams, nbrt, name)
map7
#Map.addLayer(nbrt, {min: 1, max: 0.9,  palette: burnPalette}, 'NBRT'); 
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-10.png)


#### Normalized Difference Snow Index (NDSI)

The Normalized Difference Snow Index (NDSI) was designed to estimate the amount of a pixel covered in snow ([Riggs et al. 1994](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=399618&tag=1)).

$$\text{NDSI} = (\text{green} - \text{SWIR}) /(\text{green} + \text{SWIR})$$

Let's look at Aspen, Colorado and use Landsat 8 data in the winter. You can use the layer manager to turn on and off the snow layer to compare results with the true color image. How does it compare? Reference the spectral reflectance chart at the beginning of the lab and look at the profile for snow. You will see that it has a distinct profile. In the image below, it does a very good job of matching the true color image - valleys and roads that do not have snow on them are accurately shown. 


```python
lat = 39.19; lon = -106.81; 
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2013-11-17'
date_end = '2014-03-27'
name = 'Snow'
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
    'max': 0.3
}
          
ndsi = image.normalizedDifference(['B3', 'B6']);      
snowPalette = ['red', 'green', 'blue', 'white'];   

vizParams2 = {
    'min': -0.5, 
    'max': 0.7,
    'palette': snowPalette
}

# Define a map centered on southern Maine.
map8 = build_map(lat, lon, zoom, vizParams, image, name)
map8.add_ee_layer(ndsi, vizParams2)
map8
```

![image](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-11.png)



## Additional Exercises

> **Question 9**: Look in google scholar to identify 2-3 publications that have used NDVI and two-three that used EVI. For what purposes were these indices used and what was the justification provided for that index? 

> **Question 10**: Discuss a spectral index that we did not cover in this lab relates to your area of research/interest. What is the the name of the spectral index, the formula used to calculate it, and what is it used to detect? Provide a citation of an academic article that has fruitfully used that index. 

> **Question 11**: Find 1-2 articles that use any of the linear transformation methods we practiced in this lab in the service of addressing an important social issue (e.g., one related to agriculture, environment, or development). Provide the citations and discussed how the transformation is used and how it's justified in the article. 
