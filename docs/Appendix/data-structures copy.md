# Data Structures - Detailed

## Imagery

**Images in Google Earth Engine** are **Raster** data types consisting of multiple bands. Each band represents a layer within the image that has its own unique characteristics, including:

- **Data Type**: The kind of data the band represents, such as temperature levels or moisture content.

- **Scale**: The spatial resolution of the band, indicating the size of each pixel within the band.

- **Projection**: The method used to project the band's data onto a flat surface, affecting how it aligns with geographical coordinates.

Additionally, images contain **Metadata**, a collection of properties that provide more information about each band, such as the time of capture and sensor type.

Images can be generated from constants, lists, or other objects. Within the code editor documentation, you'll discover a variety of processes to manipulate and analyze images. It's important to distinguish between a single image and an **Image Collection**, which aggregates multiple images into a series. A common mistake is to apply a method that is associated with an image onto an image collection, and vice versa. Often referred to as a `stack`, an Image Collection typically organizes images as a time series, allowing for analyses that track changes over time. 

### Sensed versus Derived Imagery

It's important to distinguish between two primary types of datasets: **sensed data** and **derived data**.

**Sensed Data**

This category includes data directly captured from sensors, whether it is from a satellite platform or aircraft. Often referred to as 'raw' data, it represents minimally processed observations of the Earth's surface. These datasets provide a direct snapshot of reality as captured at the time of the satellite or aerial sensor pass. Imagery datasets, such as Landsat, MODIS and Sentinel are all sensed data. 

**Derived Data**

While derived data also comes in the form of images, it's fundamentally different from sensed data. Derived datasets are the result of analyses and processing applied to raw sensed data, intended to extract specific information or identify patterns not immediately apparent in the original imagery. An example is the *Global Map of Oil Palm Plantations* [dataset](https://developers.google.com/earth-engine/datasets/catalog/BIOPAMA_GlobalOilPalm_v1) , which, through analysis of Sentinel composite imagery, classifies each 10m pixel into categories such as industrial Palm Oil Plantation, small farm Palm Oil Plantation, or non-palm oil areas. These datasets are tailored for specific analytical purposes, offering insights beyond the raw imagery. Derived datasets emphasize particular features or characteristics of interest, and often involve categorization or a simplified metric to distill raw data into actionable information.

![Sensed Versus Derived](https://loz-webimages.s3.amazonaws.com/GEE_Labs/A03-03.png)

Another common derived dataset that is used extensively in agriculture and land use analysis is the National Cropland Data Layer - each pixel has 30m resolution, and defines the predicted crop type for the United States. One important note - not all derived datasets are available globally, being that many are sponsored by government agencies acting in the purview of their own country. When building an application or workflow, consider the implications of relying on a dataset that is constrained to a specific area. 

Below is sample code to get started working with the Cropland Data Layer. 

<Tabs>
<TabItem value="js" label="JavaScript">

```javascript
// Code Chunk 2
var lat = 40.71; var lon = -100.55; var zoom = 11
var image = (ee.ImageCollection('USDA/NASS/CDL')
             .filter(ee.Filter.date('2018-01-01', '2019-12-31'))
             .filterBounds(ee.Geometry.Point(lon, lat))
             .first())
var image = image.select('cropland')
Map.centerObject(image, zoom);
Map.addLayer(image, {}, 'NLCD');
```

</TabItem>
<TabItem value="py" label="Python">

```python
# Code Chunk 2
lat = 40.71; lon = -100.55; zoom = 11
image = (ee.ImageCollection('USDA/NASS/CDL')
         .filter(ee.Filter.date('2018-01-01', '2019-12-31'))
         .filterBounds(ee.Geometry.Point(lon, lat))
         .first())
image = image.select('cropland')
map = build_map(lat, lon, zoom, {}, image, 'NLCD')
map
```
</TabItem>
</Tabs>

![NLCD](https://loz-webimages.s3.amazonaws.com/GEE_Labs/A03-04.png)

## Features and Geometries

### Geometries

Google Earth Engine handles vector data with the `geometry` data structure. Traditionally, this follows the basics of vector data, broadly: 
* Point
* Line
* Polygon

However, GEE has several different nuances. 

* `Point`
* `LineString`
  - List of points that do not start and end at the same location
* `LinearRing`
  - LineString which starts and ends at the same location
* `Polygon`
  - List of LinearRing's - first item of the list is the outer shell and other components of the list are interior shells

GEE also recognizes `MultiPoint`, `MultiLineString` and `MultiPolygon`, which are simply collections of more than one element. Additionally, you can combine any of these together to form a `MultiGeometry`. Here is a quick [video](https://www.youtube.com/watch?v=gcvhoznx0E8) of working with the geometry tools within GEE. 

Once you have a set of geometries, there are associated operations you can use for analysis, such as building buffer zones, area analysis, rasterization, etc. The [documentation](https://developers.google.com/earth-engine/guides/geometric_operations) contains examples to show you how to get started, and all of the functions are listed under the 'docs' tab in the code editor.

### Features

A Feature in GEE is an object which stores a `geometry`  (`Point`, `Line`, `Polygon`) along with its associated properties. GEE uses the GeoJSON data format to store and transmit these features. In the previous video, we saw how to build geometries within Google Earth Engine, while a feature adds meaningful information to it. This would be a good section to review working with dictionaries within JavaScript.

Let's say we created an individual point, which we want to associate with data that we collected. The first line establishes the variable `point`, which is then used as the `geometry` to create a `feature`. The curly braces represent a dictionary, which creates `Key:Value` pairs, which in our case is the type of tree and a measurement of the size. This new variable, `treeFeature`, now contains geographic information along with attribute data about that point. 

<Tabs>
<TabItem value="js" label="JavaScript">

```javascript
// Earth Engine Geometry
var point = ee.Geometry.Point([-79.68, 42.06]);
// Create a Feature from the geometry
var treeFeature = ee.Feature(point, {type: 'Pine', size: 15});
print(treeFeature)
```

</TabItem>
<TabItem value="py" label="Python">

```python
# Earth Engine Geometry
point = ee.Geometry.Point([-79.68, 42.06])
# Create a Feature from the geometry
treeFeature = ee.Feature(point, {'type': 'Pine', 'size': 15})
print(treeFeature.getInfo())
```
</TabItem>
</Tabs>

Obviously this is just one point, but JavaScript and GEE engine provide functionality for bringing different data sources together and automatically associating geometries with attribute data. This can be done within GEE or outside, depending on your preferences.

### Feature Collections

Just like the relationship between images and image collections, feature collections are features that can be grouped together for ease of use and analysis. They can be different types and combinations of geometry, as well as associated tabular data. The code segment from the documentation consolidates the operations discussed earlier. Each line has an interior layer which creates the geometry, which is then associated with attribute data (information within the {} ) and then converted to a Feature. This variable is a `list`, which contains three separate, individual features.  This is then converted to a feature collection with the command `ee.FeatureCollection(features)`

<Tabs>
<TabItem value="js" label="JavaScript">
```javascript
// Make a list of Features.
var features = [
  ee.Feature(ee.Geometry.Rectangle(30.01, 59.80, 30.59, 60.15), {name: 'Voronoi'}),
  ee.Feature(ee.Geometry.Point(-73.96, 40.781), {name: 'Thiessen'}),
  ee.Feature(ee.Geometry.Point(6.4806, 50.8012), {name: 'Dirichlet'})
];

// Create a FeatureCollection from the list and print it.
var fromList = ee.FeatureCollection(features);
print(fromList);
```

</TabItem>
<TabItem value="py" label="Python">
```python
# Make a list of Features.
features = [
  ee.Feature(ee.Geometry.Rectangle(30.01, 59.80, 30.59, 60.15), {'name': 'Voronoi'}),
  ee.Feature(ee.Geometry.Point(-73.96, 40.781), {'name': 'Thiessen'}),
  ee.Feature(ee.Geometry.Point(6.4806, 50.8012), {'name': 'Dirichlet'})
]
# Create a FeatureCollection from the list and print it.
fromList = ee.FeatureCollection(features)
print(fromList.getInfo())
```
</TabItem>
</Tabs>

If you run this code block in the code editor, you can see the information that is contained within the Feature Collection - three elements (features) and two columns (the `index` and the `properties`). By clicking on the dropdown next to each one, you can see that the first feature is a Polygon that has the name of 'Voronoi'.

![Feature Collection Information](https://loz-webimages.s3.amazonaws.com/GEE_Labs/A03-05.png)

Once you have information in a Feature Collection, you can filter it to find specific information, such as the name of an object or based on the size of a polygon, or provide aggregated analysis. The [documentation](https://developers.google.com/earth-engine/guides/features) on working with Feature Collections  is comprehensive and provides many ideas on how to use them efficiently in in your analysis. 

## Methods: Reducers

Up until now, we have focused on objects: Images, Features, and Geometries. Reducers are a method of aggregating data for analysis. For instance, we could take an Image Collection and use `reducer` to find the average value of the magnitude of each pixel across all the images of the collection, simplifying the data into a single layer. Or we could reduce an image to a set of regions, grouping similar data together to create an aggregated map. The applications of Reducer are endless, and can be applied to both Images and Features. There are different functions for different object types, and Reducer can be combined and sequenced to create a chain of analysis. From the documentation, the code chunk below creates the variable `max` which is the maximum elevation (in meters) of the imagery within our bounding box.

<Tabs>
<TabItem value="js" label="JavaScript">
```javascript
// Define the variables
var lat = 13.7; var lon = 2.54; var zoom = 9
// The input image to reduce, in this case an SRTM elevation map.
var image = ee.Image('CGIAR/SRTM90_V4');
Map.centerObject(ee.Geometry.Point(lon, lat), zoom);
Map.addLayer(image, {'min':0, 'max':800}, 'Shuttle Radar Topography Mission (SRTM)')
```

</TabItem>
<TabItem value="py" label="Python">
```python
# Define the variables
lat = 13.7; lon = 2.54; zoom = 9
# The input image to reduce, in this case an SRTM elevation map.
image = ee.Image('CGIAR/SRTM90_V4')
map = build_map(lat, lon, zoom, {'min':0, 'max':800}, image, 
                 'Shuttle Radar Topography Mission (SRTM)')
map
```
</TabItem>
</Tabs>

![Elevation Map](https://loz-webimages.s3.amazonaws.com/GEE_Labs/A03-06.png)

<Tabs>
<TabItem value="js" label="JavaScript">
```javascript
// Build a polygon within the country of Niger in GEE Code Editor
var poly = ee.Geometry.Polygon(
        [[[1.0381928005666774, 23.471775399486358],
          [1.0381928005666774, 12.477838833503146],
          [15.825790456816677, 12.477838833503146],
          [15.825790456816677, 23.471775399486358]]]
)

//Reduce the image within the given region, using a reducer that
// computes the max pixel value.  We also specify the spatial
// resolution at which to perform the computation, in this case 200
// meters.
var max = image.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: poly,
  maxPixels: 1e10,
  scale: 200
})
// Print the result (a Dictionary) to the console.
print(max)
```

</TabItem>
<TabItem value="py" label="Python">
```python
# Code Chunk 3B
# Build a polygon within the country of Niger in GEE Code Editor
poly = ee.Geometry.Polygon(
        [[[1.0381928005666774, 23.471775399486358],
          [1.0381928005666774, 12.477838833503146],
          [15.825790456816677, 12.477838833503146],
          [15.825790456816677, 23.471775399486358]]]
)

# Reduce the image within the given region, using a reducer that
# computes the max pixel value.  We also specify the spatial
# resolution at which to perform the computation, in this case 200
# meters.
max = image.reduceRegion(
  reducer = ee.Reducer.max(),
  geometry = poly,
  maxPixels = 1e10,
  scale = 200
)
# Print the result (a Dictionary) to the console.
pprint.pprint(max.getInfo())
```
</TabItem>
</Tabs>

We have successfully calculated the maximum elevation in an area about the size of Niger in under 1 second! There are hundreds of different operations for using `Reducer`, with the functions listed on the left hand table under 'Docs'. Certain functions will only work with specific object types, but follow along with the Reducer [documentation](https://developers.google.com/earth-engine/guides/reducers_intro) to get a better understanding of how to aggregate data and extract meaningful results. Getting familiar with Reducer is an essential component to working with Google Earth Engine. 

### Joins

If you have programmed in the past, joining data together is a familiar concept. This process associates information from different dataset together. Let's say you have an Image Collection of Landsat data that is filtered to the first six months of the year 2016 and a bounding box of your area of study. You also have a table of Redwood tree locations that is filtered to the same area of study, although it contains information over the past decade. You can use a join to associate information about the trees from the Feature Collection and include it in the Image Collection, keeping only the relevant data that falls within that timeframe. You now have a consolidated dataset with useful information from both the Image Collection and Feature Collection. Although there are different types of joins, the process brings information together, keeping only relevant information. The [documentation](https://developers.google.com/earth-engine/guides/joins_save_all) on joins goes over specific examples and concepts, but a crucial component is understanding the type of join you need the three most prominent within GEE are: 

**Left Join**

  - Keeps all the information from the primary dataset, and only information that joins from the secondary dataset
  
**Inner Join**

  - Keeps only the information where the primary and secondary data match
  
**Spatial Join**

  - A join based on spatial location (e.g., keep only the geometry points that fall within a polygon)
  
GEE provides some unique types of joins, including 'Save-All', 'Save-Best' and 'Save-First', which are useful if you want to look at a specific area. However, those familiar with Python tend to prefer doing joins using popular data manipulation packages, such as Pandas or Geopandas. 

### Arrays

Arrays are a collection of data where information is stored contiguously - matrices are a multi-dimensional array. For instance, an image might have 1024 rows and 1024 columns. Each row is an array, each column is an array, and taken together, you have a 2-dimensional array, also known as a matrix. If the image has three separate color channels, then that is a 3-dimensional array. Some of the terminology changes depending on discipline (ie, physics vs. computer science), but if you are familiar with working with matrices and arrays in programming languages such as Matlab, NumPY or OpenCV, it is important to understand the role of arrays within GEE. 

In fact, Google Earth Engine states that working with arrays outside of the established functions that they have built is not recommended, as GEE is not specifically designed for array-based math, and will lead to unoptimized performance. 

There is a very informative [video](https://developers.google.com/earth-engine/guides/arrays_intro) that delves into the engineering behind Google Earth Engine, but in this course we will only be doing a limited amount with array transformations and Eigen Analysis. In many cases, you will probably be better off aggregating the specific data and then conducting array mathematics with programming languages more geared for this (Python, R, MatLab).

