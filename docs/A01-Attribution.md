# Introduction

## Why Google Earth Engine?
Research in Remote Sensing has evolved drastically over the past few decades.

In the earliest years of remote sensing analysis, only a handful of governments had the capability to deploy satellites and reliably process the imagery, and their use was largely limited to the military and intelligence communities. In the late 1950s, the US and Europe established the National Aeronautics and Space Administration (NASA) and the origins of the European Space Agency (ESA) to support a civilian space program as well as space and aeronautics research. Even then, data access was unwieldy and costly - even if a researcher had identified the data they needed, they would have to go through the highly complicated and time-intensive steps of downloading the data onto a mainframe computer with sufficient storage and processing capability to perform a series of pre-processing steps (e.g. orthorectification and atmospheric corrections), all before they could start analysis.

Enter Google Earth Engine (GEE). As part of Google's quest to make the world's information universally accessible and useful, Google Earth Engine emerged in 2010 to aid in organizing and simplifying geospatial data in a way that supports an end-to-end solution. This is a valuable tool that simplifies many of the historical problems that Remote Sensing researchers have struggled with. Google has collected and maintains petabytes of imagery from both public and private sources, including well-known platforms such as Landsat, MODIS, and Sentinel. Additionally, GEE allows users to process the data and conduct sophisticated analysis built upon Google's compute power (even allowing advanced Machine Learning using TensorFlow Processing Units). They geo-rectify the imagery and provide pre-built algorithms that facilitate analysis. In case you need to build your own algorithms, Google Earth Engine supports both JavaScript and Python, which in turn extends the opportunities for processing data and displaying results using your preferred tools. The user can even import their own data and work with it within GEE. Finally, the user fully owns the analysis and algorithms written within GEE, providing fair and open use.

As researchers involved in Remote Sensing, Google Earth Engine provides an invaluable toolset that you can use throughout your career.

#### License and Attribution
This work is licensed under a Creative Commons Attribution 4.0 International License. The foundation of these lab exercises were generously shared with us by Nicholas Clinton (Google) and Dr. David Saah (University of San Francisco, Geospatial Analysis Lab). We thank them for this great public good and take responsibility for any errors that arose from our adaptation.

Elinor Ben-Ami and Ozzy Campos have extended and customized these labs and exercise and incorporated them into the course taught at Virginia Tech, 'Remote Sensing for Social Science'.

We will also like to mention the extensive use of the `geemap` package, developed by Qiusheng Wu. 

* Wu, Q., (2020). `geemap`: A Python package for interactive mapping with Google Earth Engine. The Journal of Open Source Software, 5(51), 2305. https://doi.org/10.21105/joss.02305
