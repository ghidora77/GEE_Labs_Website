# Appendix - Working with Vector Data

## Overview

Going back to the original flow chart in Lab 01, we are will normally have an 'area of interest' that we want to better understand. Working with vector data, we can reduce our analysis to just that area and output our results for further analysis.

![Building a use Case Flowchart](https://github.com/ghidora77/03_GEE_Labs_DSPG/blob/main/im/im_00_06.png?raw=true)


```python
#!pip install geemap
#!pip install geopandas

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

### Geospatial Data

Geospatial Analysis is a pretty vast topic, so we are only going to cover the basics and then provide a few resources for you to follow along with. 

As mentioned earlier, a basic definition of vector data is points, lines, polygons associated with some metadata. A few examples might be:

1. Polygon with the boundaries of France
2. Line that denotes the Mississippi River, along with information about river width.
3. Points that locate the center of all the capitals of South America, along with population

Each of the different vector types have different  operations associated with them.
1. Is the city of Richmond contained within the state of North Carolina?
2. Does Interstate-77 cross the Mississippi river? 
3. What is the overall area of France?

[Data Carpentry](https://datacarpentry.org/organization-geospatial/02-intro-vector-data/) provides some good information that will help provide some good examples. 

### Vector Data Types
There are a surpringly large number of vector datatypes. You've likely heard of `shapefiles`, which originated as an ESRI (Makers of Arc-GIS) propritary format of transferring data, but was then open-sourced and is the most prominent vector data type. However, there's some downsides.
1. At a minimum, it's four separate files (projection, attributes, metadata, geometries)
2. A shapefile can only be one type (cannot mix and match points and polygons)
3. Designed in the 1980s
4. 2GB size limitation
5. Attribute information

In recent years, there's a large number of other spatial data types to address these limitations. A few newer types:
1. geojson
2. geopkg
3. postgis
4. feather/pyarrow
5. parquet

Bottom line - be able to recognize spatial datatypes and know some of the limitations of shapefiles.

### Geopandas
In Python, there's a cascade of geospatial packages that build upon each other - the most common and prevalent package for working with vector data is called `geopandas`. Again, getting very comfortable with `geopandas` will take a few weeks but it is an essential tool for working with geospatial packages. Additionally, it has data that you can reference immediately, without having to go out and find your own data. 

Geopandas supports all the spatial data types above, but the biggest benefit is that you can then interact with the spatial data frame using Pandas, which is a staple library in data. Whichever type of vector data you read in, whether it is a shapefile, a geojson or a parquet file, when you read it in it becomes a `geopandas` dataframe. Let's see an example.


```python
import geopandas as gpd
# Available datasets in geopandas
print(gpd.datasets.available)
# Country boundaries within geopandas 
world_filepath = gpd.datasets.get_path('naturalearth_lowres')
```

    ['naturalearth_cities', 'naturalearth_lowres', 'nybb']



```python
world = gpd.read_file(world_filepath)
world.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
    
    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>pop_est</th>
      <th>continent</th>
      <th>name</th>
      <th>iso_a3</th>
      <th>gdp_md_est</th>
      <th>geometry</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>920938</td>
      <td>Oceania</td>
      <td>Fiji</td>
      <td>FJI</td>
      <td>8374.0</td>
      <td>MULTIPOLYGON (((180.00000 -16.06713, 180.00000...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>53950935</td>
      <td>Africa</td>
      <td>Tanzania</td>
      <td>TZA</td>
      <td>150600.0</td>
      <td>POLYGON ((33.90371 -0.95000, 34.07262 -1.05982...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>603253</td>
      <td>Africa</td>
      <td>W. Sahara</td>
      <td>ESH</td>
      <td>906.5</td>
      <td>POLYGON ((-8.66559 27.65643, -8.66512 27.58948...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>35623680</td>
      <td>North America</td>
      <td>Canada</td>
      <td>CAN</td>
      <td>1674000.0</td>
      <td>MULTIPOLYGON (((-122.84000 49.00000, -122.9742...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>326625791</td>
      <td>North America</td>
      <td>United States of America</td>
      <td>USA</td>
      <td>18560000.0</td>
      <td>MULTIPOLYGON (((-122.84000 49.00000, -120.0000...</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Filter it down 
df_africa = world.loc[world.continent == 'Africa']
df_africa.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
    
    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>pop_est</th>
      <th>continent</th>
      <th>name</th>
      <th>iso_a3</th>
      <th>gdp_md_est</th>
      <th>geometry</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>53950935</td>
      <td>Africa</td>
      <td>Tanzania</td>
      <td>TZA</td>
      <td>150600.0</td>
      <td>POLYGON ((33.90371 -0.95000, 34.07262 -1.05982...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>603253</td>
      <td>Africa</td>
      <td>W. Sahara</td>
      <td>ESH</td>
      <td>906.5</td>
      <td>POLYGON ((-8.66559 27.65643, -8.66512 27.58948...</td>
    </tr>
    <tr>
      <th>11</th>
      <td>83301151</td>
      <td>Africa</td>
      <td>Dem. Rep. Congo</td>
      <td>COD</td>
      <td>66010.0</td>
      <td>POLYGON ((29.34000 -4.49998, 29.51999 -5.41998...</td>
    </tr>
    <tr>
      <th>12</th>
      <td>7531386</td>
      <td>Africa</td>
      <td>Somalia</td>
      <td>SOM</td>
      <td>4719.0</td>
      <td>POLYGON ((41.58513 -1.68325, 40.99300 -0.85829...</td>
    </tr>
    <tr>
      <th>13</th>
      <td>47615739</td>
      <td>Africa</td>
      <td>Kenya</td>
      <td>KEN</td>
      <td>152700.0</td>
      <td>POLYGON ((39.20222 -4.67677, 37.76690 -3.67712...</td>
    </tr>
  </tbody>
</table>
</div>




```python
niger = df_africa.loc[df_africa.name == 'Niger']
niger.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }
    
    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>pop_est</th>
      <th>continent</th>
      <th>name</th>
      <th>iso_a3</th>
      <th>gdp_md_est</th>
      <th>geometry</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>55</th>
      <td>19245344</td>
      <td>Africa</td>
      <td>Niger</td>
      <td>NER</td>
      <td>20150.0</td>
      <td>POLYGON ((14.85130 22.86295, 15.09689 21.30852...</td>
    </tr>
  </tbody>
</table>
</div>




```python
niger.plot()
```




    <AxesSubplot:>




​    
![png](output_9_1.png)
​    


### Convert to Earth Engine

We have a polygon that contains the boundary of Niger that is in a `geopandas` format. We now have to convert it into an Earth Engine feature so that GEE can interact with it. The easiest way to do this is using the `geemap` package. 


```python
# Create a GEE Feature
gee_feature = geemap.geopandas_to_ee(niger)
```


```python

```


```python
Map = geemap.Map()
Map.addLayer(gee_feature, {}, "geopandas to ee example")
Map
```


    Map(center=[20, 0], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(Togg…


#### Exercise 1
1. Use the geopandas method above to get the boundary of the country of your study area, convert it to an earth engine feature and plot it.

#### Exercise 2
2. Use `print(gpd.datasets.available)` to see the other datasets available.
3. Read in one of the datasets and look at the dataframe
4. Filter the dataset down to a manageable size
5. Convert to a GEE feature
6. Plot it

## Importing Shapefiles
Using `geopandas` is the preferred method as it's flexible for many different datatypes and supports a wide array of operations before you convert into a GEE feature. However, in some cases you might want to just read in a shapefile directly. Follow along with the [notebook](https://geemap.org/notebooks/10_shapefiles/) to understand the basic operations of using shapefiles

#### Exercise 3

1. Find a shapefile of your study area and download it
2. Add the path to the shapefile into your notebook (easiest method is to just bring the shapefile into the same location as your notebook)
3. Convert it into GEE feature
4. Plot the result


```python
# Sample Solution to Exercise 3

# 1. Download administrative units shapefile for the country of Nigeria from the World Bank [Data Catalog](https://datacatalog.worldbank.org/search/dataset/0039368)
# 2. Put all files associated with the shapefile in a folder called `data` next to 
# 3. You can use the code below to look at the filenames and copy and paste
# !ls ./data
```


```python
# 4. Include the relative path name to the shapefile
df = './data/nga_admbnda_adm2_osgof_20170222.shp'
# 5. Convert the shapefile to a GEE feature
gee_vector = geemap.shp_to_ee(df)
```


```python
# 6. Plot the map
Map2 = geemap.Map()
Map2.addLayer(gee_vector, {}, 'Admin Units - Nigeria')
Map2
```


    Map(center=[20, 0], controls=(WidgetControl(options=['position', 'transparent_bg'], widget=HBox(children=(Togg…


## Taking this further

This was a quick introduction to working with vector data and incorporating it into GEE. For most of the projects we will be working on, polygons are the most prominent, but you can do some sophisticated analysis with both points and lines as well. GIS and working with vector data is a pretty wide-ranging topic, but below are some good resources to learn more and improve your analysis. 

In the next topic, we will start the process of clipping the satellite imagery to our study area, building an index, and reducing the information down to summary statistics. Look through the two notebooks below to get a better feel of the next step in the process.
[Zonal Statistics](https://geemap.org/notebooks/12_zonal_statistics/#convert-geopandas-geodataframe-to-eefeaturecollection)
[Zonal Statistics by Group](https://geemap.org/notebooks/13_zonal_statistics_by_group/#calculate-land-cover-compostion-of-each-us-state)

## Resources 

1. [Geopandas](https://geopandas.org/en/stable/)
2. DataCamp - [Working with Geospatial Data in Python](https://app.datacamp.com/learn/courses/working-with-geospatial-data-in-python)
3. [EarthLab](https://www.earthdatascience.org/courses/intro-to-earth-data-science/file-formats/use-spatial-data/file-formats-exercise/)
