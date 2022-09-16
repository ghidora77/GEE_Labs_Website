# Lab 3B - Transformations

We've gone over indices to highlight unique characteristics in our imagery by utilizing the bands outside of the visible spectrum. 

Linear transforms are linear combinations of input pixel values. These can result from a variety of different strategies, but a common theme is that pixels are treated as arrays of band values, and we can use these arrays to create weighted values for specific purposes.

#### Tasseled cap (TC)

Based on observations of agricultural land covers in the NIR-red spectral space, [Kauth and Thomas (1976)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.461.6381&rep=rep1&type=pdf) devised a [rotational transform](https://en.wikipedia.org/wiki/Change_of_basis) of the form 

$$p_1 = R^T p_0$$

where: 

1. **$p_0$** is the original pixel vector (a stack of the *p* band values as an [Array](https://developers.google.com/earth-engine/arrays_intro)) 

2. **$p_1$** is the rotated pixel

3. **R** is an [orthonormal basis](https://en.wikipedia.org/wiki/Orthonormal_basis) of the new space (inverse of $R^T$). Kauth and Thomas found **R** by defining the first axis of their transformed space to be parallel to the soil line in the following chart, then used the [Gram-Schmidt process](https://en.wikipedia.org/wiki/Gram–Schmidt_process) to find the other basis vectors.

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-12.png)

Assuming that **R** is available, one way to implement this rotation in Earth Engine is with arrays. Specifically, make an array of TC coefficients. Since these coefficients are for the TM sensor, get a less cloudy Landsat 5 scene. To do the matrix multiplication, first convert the input image from a multi-band image to an array image in which each pixel position stores an array. Do the matrix multiplication, then convert back to a multi-band image.


```python
#!pip install geemap
import ee, geemap, pprint, folium
#ee.Authenticate()
def build_map(lat, lon, zoom, vizParams, image, name):
    map = geemap.Map(center = [lat, lon], zoom = zoom)
    map.addLayer(image, vizParams, name)
    return map
# Initialize the Earth Engine module.
ee.Initialize()
```


```python
lat = 39.19; lon = -106.81; 
zoom = 11
image_collection_name = "LANDSAT/LT05/C01/T1_TOA"
date_start = '2008-06-01'
date_end = '2008-12-01'
name = 'Snow'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)
coefficients = ee.Array([    
  [0.3037, 0.2793, 0.4743, 0.5585, 0.5082, 0.1863],    
  [-0.2848, -0.2435, -0.5436, 0.7243, 0.0840, -0.1800],
  [0.1509, 0.1973, 0.3279, 0.3406, -0.7112, -0.4572],
  [-0.8242, 0.0849, 0.4392, -0.0580, 0.2012, -0.2768],
  [-0.3280, 0.0549, 0.1075, 0.1855, -0.4357, 0.8085],
  [0.1084, -0.9022, 0.4120, 0.0573, -0.0251, 0.0238]
]);  

bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B7']
```


```python
# Make an Array Image,  with a 1-D Array per pixel.

arrayImage1D =  image.select(bands).toArray();
# Make an Array Image  with a 2-D Array per pixel, 6x1.
arrayImage2D = arrayImage1D.toArray(1);  
componentsImage = (ee.Image(coefficients).matrixMultiply(arrayImage2D)
    # Get rid of the extra  dimensions.
        .arrayProject([0])  
    # Get a multi-band image  with TC-named bands.  
        .arrayFlatten(
          [['brightness', 'greenness', 'wetness', 'fourth', 'fifth', 'sixth']]
        ))

vizParams = {
  'bands': ['brightness', 'greenness', 'wetness'],
  'min': -0.1, 
    'max': [0.5,  0.1, 0.1]
}

map8 = build_map(lat, lon, zoom, vizParams, componentsImage, 'TC components')
map8
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-13.png)


#### Principal Component Analysis (PCA)

Like the Tasseled Cap transform, the [PCA transform](https://en.wikipedia.org/wiki/Principal_component_analysis) is a rotational transform in which the new basis is orthonormal, but the axes are determined from statistics of the input image, rather than empirical data. Specifically, the new basis is the [eigenvector](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors) of the image's [variance-covariance matrix](https://en.wikipedia.org/wiki/Covariance_matrix). As a result, the principal components are uncorrelated. To demonstrate, use the Landsat 8 image converted to an array image. Use the `reduceRegion()` [method](https://developers.google.com/earth-engine/reducers_reduce_region) to compute statistics (band covariances) for the image.

A [*reducer*](https://developers.google.com/earth-engine/reducers_intro) is an object that tells Earth Engine what statistic to compute. Note that the result of the reduction is an object with one property, an array, that stores the covariance matrix. The next step is to compute the eigenvectors and eigenvalues of that covariance matrix. Since the eigenvalues are appended to the eigenvectors, slice the two apart and discard the eigenvectors. Perform the matrix multiplication, as with the TC components. Finally, convert back to a multi-band image and display the first PC.

Use the [layer manager](https://developers.google.com/earth-engine/playground#layer-manager) to stretch the result appropriately. What do you observe? Try displaying some of the other principal components. The image parameters in the code chunk below are built specifically for Principal Component 1. 


```python
lat = 37.22; lon = -80.42; 
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2013-11-17'
date_end = '2014-03-27'
name = 'PCA'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11']

arrayImage =  image.select(bands).toArray();  
covar = arrayImage.reduceRegion(
  reducer = ee.Reducer.covariance(),
  maxPixels = 1000000000
)

covarArray = ee.Array(covar.get('array'));  
eigens = covarArray.eigen();  
eigenVectors = eigens.slice(1, 1); 

principalComponents = ee.Image(eigenVectors).matrixMultiply(arrayImage.toArray(1));  
pcImage = (principalComponents      
                        .arrayProject([0])    
    # Make the one band  array image a multi-band image, [] -> image.    
                    .arrayFlatten(
          [['pc1', 'pc2', 'pc3', 'pc4', 'pc5', 'pc6', 'pc7', 'pc8']]
        )); 

#Customize the visual parameters for PC1
vizParams = {
  "opacity":1,
  "bands": ["pc1"],
  "min":-420,
    "max":-400,
  "gamma":1}

map8 = build_map(lat, lon, zoom, vizParams, pcImage.select('pc1'), 'TC components')
map8
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-14.png)


#### Spectral Unmixing

The [linear spectral mixing model](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=974727&tag=1) is based on the assumption that each pixel is a mixture of "pure" spectra. The pure spectra, called *endmembers*, are from land cover classes such as water, bare land, vegetation. The goal is to solve the following equation for **f**, the *P*x1 vector of endmember fractions in the pixel:  

$$Sf = p$$

where **S** is a *B*x*P* matrix in which the columns are *P* pure endmember spectra (known) and **p** is the *B*x1 pixel vector when there are *B* bands (known). In this example, $B= 6$: 

The first step is to get the endmember spectra, which we can do by computing the mean spectra in polygons around regions of pure land cover. In this example, we will use a location in northern Washington State and use the geometry tools to select homogeneous areas of bare land, vegetation and water.

Using the [geometry drawing tools](https://developers.google.com/earth-engine/playground#geometry-tools), make three layers clicking **+ new layer**. In the first layer, digitize a polygon around pure bare land, in the second layer make a polygon of pure vegetation, and in the third layer, make a water polygon. Name the imports `bare`, `water` and, and `vegetation`, respectively. 

Note: For a starting point, we included some basic polygons but feel free to replace in a region of your choice.


```python
lat = 48.11; lon = -123.25; 
zoom = 11
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2013-06-17'
date_end = '2014-03-27'
name = 'PCA'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)
# Polygons of bare earth, water and vegetation
bare = (
    ee.Geometry.Polygon(
        [[[-123.2370707334838, 48.1151452657945],
          [-123.2370707334838, 48.11351208612645],
          [-123.23410957473136, 48.11351208612645],
          [-123.23410957473136, 48.1151452657945]]]))
water = (
    ee.Geometry.Polygon(
        [[[-123.2748188020549, 48.12059599002954],
          [-123.2748188020549, 48.118074835535865],
          [-123.2673086168132, 48.118074835535865],
          [-123.2673086168132, 48.12059599002954]]]))
vegetation = (
    ee.Geometry.Polygon(
        [[[-123.27462568300582, 48.11533866992809],
          [-123.27462568300582, 48.114163936320416],
          [-123.27215805071212, 48.114163936320416],
          [-123.27215805071212, 48.11533866992809]]]))
unmixImage = image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7'])
unmixImage = image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7'])
```

Check the polygons you made by charting mean spectra in them using [Chart.image.regions()](https://developers.google.com/earth-engine/charts_image_regions):

Your chart should look something like:

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-15.png)


```python

# TODO: Need to update charts 
"""
var = (
print(Chart.image.regions(unmixImage, ee.FeatureCollection([
    ee.Feature(bare, {label: 'bare'}), 
    ee.Feature(water, {label: 'water'}),
    ee.Feature(vegetation, {label: 'vegetation'})]), 
  ee.Reducer.mean(), 30, 'label', [0.48, 0.56, 0.65, 0.86, 1.61, 2.2])))
  """
```


Use the [reduceRegion() method](https://developers.google.com/earth-engine/reducers_reduce_region) to compute mean spectra in the polygons you made. Note that the return value of reduceRegion() is a Dictionary, with reducer output keyed by band name. Get the means as a list by calling `values()`. Each of these three lists represents a mean spectrum vector. Stack the vectors into a 6x3 Array of endmembers by concatenating them along the 1-axis (or columns direction).

Turn the 6-band input image into an image in which each pixel is a 1D vector (`toArray()`), then into an image in which each pixel is a 6x1 matrix (`toArray(1)`). Now that the dimensions match, in each pixel, solve the equation for **f**. Finally, convert the result from a 2D array image into a 1D array image (`arrayProject()`), then to a multi-band image (`arrayFlatten()`). The three bands correspond to the estimates of bare, vegetation and water fractions in **f**. Display the result where bare is red, vegetation is green, and water is blue (the `addLayer()` call expects bands in order, RGB)


```python
bareMean = unmixImage.reduceRegion(
  ee.Reducer.mean(), bare, 30).values();   
waterMean = unmixImage.reduceRegion(
  ee.Reducer.mean(), water, 30).values();   
vegMean = unmixImage.reduceRegion(
  ee.Reducer.mean(), vegetation, 30).values();

endmembers = ee.Array.cat([bareMean,  vegMean, waterMean], 1);  
arrayImage = unmixImage.toArray().toArray(1);
unmixed =  ee.Image(endmembers).matrixSolve(arrayImage);
unmixedImage = unmixed.arrayProject([0]).arrayFlatten(
          [['bare', 'veg', 'water']]
        );

map8 = build_map(lat, lon, zoom, {}, unmixedImage, 'unmixedImage')
map8
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-16.png)


#### Hue-Saturation-Value Transform

The Hue-Saturation-Value (HSV) model [is a color transform of the RGB color space](https://en.wikipedia.org/wiki/HSL_and_HSV). Among many other things, it is useful for [pan-sharpening](https://en.wikipedia.org/wiki/Pansharpened_image). This involves converting an RGB to HSV, swapping the panchromatic band for the value (V), then converting back to RGB. For example, using the Landsat 8 scene:


```python
lat = 37.22; lon = -80.42; 
zoom = 11;
image_collection_name = "LANDSAT/LC08/C01/T1_TOA"
date_start = '2013-06-17'
date_end = '2014-03-27'
name = 'Hue Saturation'
point = ee.Geometry.Point([lon, lat])
image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)
# Convert Landsat RGB bands to HSV   
hsv = image.select(['B4', 'B3', 'B2']).rgbToHsv();
# Convert back to RGB,  swapping the image panchromatic band for the value.
rgb = ee.Image.cat([
  hsv.select('hue'),
  hsv.select('saturation'),
  image.select(['B8'])]).hsvToRgb();

map8 = build_map(lat, lon, zoom, {'max': 0.4}, rgb, 'hue saturation')
map8
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-17.png)


## Spectral Transformation

### Linear Filtering

In the present context, linear *filtering* (or [convolution](http://www.dspguide.com/ch24/1.htm)) refers to a linear combination of pixel values in a 'neighborhood', or [kernel](https://en.wikipedia.org/wiki/Kernel_(image_processing)), where the weights of the kernel determine the coefficients in the linear combination (for this lab, the terms *kernel* and *filter* are interchangeable.) Filtering an image can be useful for extracting image information at different [spatial frequencies](http://www.dspguide.com/ch24/5.htm) by reducing noise. For this reason, smoothing filters are called *low-pass* filters (they let *low*-frequency data *pass* through) and edge detection filters are called *high-pass* filters. To implement filtering in Earth Engine use [image.convolve()](https://developers.google.com/earth-engine/guides/image_convolutions) with an ee.Kernel for the argument.

#### Smoothing

Smoothing means to convolve an image with a smoothing kernel. 

A simple smoothing filter is a square kernel with uniform weights that sum to one. Convolving with this kernel sets each pixel to the mean of its neighborhood. Print a square kernel with uniform weights (this is sometimes called a "pillbox" or "boxcar" filter):

Expand the kernel object in the console to see the weights. This kernel is defined by how many pixels it covers (i.e. `radius` is in units of 'pixels'). A kernel with radius defined in 'meters' adjusts its size in pixels, so you can't visualize its weights, but it's more flexible in terms of adapting to inputs of different scale. In the following, use kernels with radius defined in meters except to visualize the weights.


```python
lat = 37.22; lon = -80.42; 
zoom = 14
image_collection_name = "USDA/NAIP/DOQQ"
date_start = '2013-06-17'
date_end = '2017-03-27'
name = 'NAIP'
point = ee.Geometry.Point([lon, lat])

image = (
    ee.ImageCollection(image_collection_name)
         .filterBounds(point)
         .filterDate(date_start, date_end)
         .sort('CLOUD_COVER')
         .first()
)

# Print a uniform kernel to see its weights.
# print('A uniform kernel:', ee.Kernel.square(2));
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-18.png)

Define a kernel with 2-meter radius (which corresponds to how many pixels in the NAIP image? Hint: try [projection.nominalScale()](https://developers.google.com/earth-engine/guides/projections)), convolve the image with the kernel and compare the input image with the smoothed image:


```python
# Define a square, uniform kernel.
uniformKernel = ee.Kernel.square(
 radius =  2,
 units = 'meters',
)

# Filter the image by convolving with the smoothing filter.
smoothed = image.convolve(uniformKernel)
vizParams = {
  'min': 0.0,
  'max': 255,
}

map9 = build_map(lat, lon, zoom, vizParams, smoothed, 'Smoothed')
map9
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-19.png)


To make the image even smoother, try increasing the size of the neighborhood by increasing the pixel radius. to the human eye, the image is blurrier, but in many Machine Learning and Computer Vision algorithms, this process improves our output by reducing noise. 


A Gaussian kernel can also be used for smoothing. Think of filtering with a Gaussian kernel as computing the weighted average in each pixel's neighborhood. 


```python
# Print a Gaussian kernel to see its weights.
#print('A Gaussian kernel:', ee.Kernel.gaussian(2))
# Define a square Gaussian kernel:
gaussianKernel = ee.Kernel.gaussian(
 radius =  2,
 units = 'meters',
)
# Filter the image by convolving with the smoothing filter.
gaussiansmooth = image.convolve(gaussianKernel)

map9 = build_map(lat, lon, zoom, vizParams, gaussiansmooth, 'Smoothed')
map9
```


#### Edge Detection

Convolving with an edge-detection kernel is used to find rapid changes in values that usually signify the edges of objects in the image data. 

A classic edge detection kernel is the [Laplacian](https://en.wikipedia.org/wiki/Discrete_Laplace_operator) kernel. Investigate the kernel weights and the image that results from convolving with the Laplacian. Other edge detection kernels include the [Sobel](https://en.wikipedia.org/wiki/Sobel_operator), [Prewitt](https://en.wikipedia.org/wiki/Prewitt_operator) and [Roberts](https://en.wikipedia.org/wiki/Roberts_cross) kernels. [Learn more about additional edge detection methods in Earth Engine](https://developers.google.com/earth-engine/image_edges). 


```python
# Define a Laplacian, or edge-detection kernel.
laplace = ee.Kernel.laplacian8(normalize= False)
edges = image.convolve(laplace)
vizParams = {
  'min': 0,
  'max': 255,
  'format': 'png'
}
zoom = 18

map10 = build_map(lat, lon, zoom, vizParams, edges, 'Edge Detection')
map10
```

![Tassled Cap](https://loz-webimages.s3.amazonaws.com/GEE_Labs/B03-20.png)
