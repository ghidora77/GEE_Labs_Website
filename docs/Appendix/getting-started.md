# Getting Started

This module guides you through setting up your Google Earth Engine (GEE) account and getting started with the platform. It also covers the setup process for integrating GEE with Python, enabling you to leverage its capabilities within Python-based workflows. The process is easier for JavaScript than Python, which requires several additional steps and package installs. 

### Setting up an Account

Whether you're using the JavaScript or Python API, registering for a Google Earth Engine (GEE) account is the first step [here](https://signup.earthengine.google.com). Registration is tied to your email address. Academic users can sign up for free, and organizational or business accounts are also available, typically set up by the organization's IT department. Approval to use the code editor is automated, although there may be up to a 24 hour delay. Note that regardless of the account type, users must have access to a Google Cloud project to utilize GEE. Note that when signing up with an organizational or educational email account there may be restrictions that will have to be handled by the account owner. This guidance may change as GEE's authentication processes evolve.

Once the account is approved and activated, you can access Google Earth Engine. 

### JavaScript

With JavaScript, you can get started immediately - as long as you are logged into the Google account you created your account with, you can access the [code editor](https://code.earthengine.google.com) immediately and begin running scripts. A common issue is when users have multiple Google accounts and the account is incorrect. 

### Python

Python takes a little more effort to set up - you have to:
1. Install the Earth Engine library (one-time per environment)
2. Authenticate your Earth Engine Account (one-time per environment)
3. Install dependency libraries (one-time per environment)
4. Initiate the API (every time you run a script)

In addition, we will be using the [`geemap`](https://geemap.org) package for visualization in conjunction with Earth Engine - installation instructions are also included. 
In the terminal, run the following commands - we suggest creating a virtual environment. 

```python
# Install using `pip`
pip install earthengine-api --upgrade
pip install geemap
```

This is enough to get started - however, if working within Python it is very likely that you will need to use additional libraries. If comfortable using Conda / Mamba, we suggest using the `geospatial` [package]([https://geospatial.gishub.org/installation/]), which consolidates the install of numerous important geospatial libraries while avoiding dependency conflicts. Instructions are in the linked website. 

### Authenticate Earth Engine

Once the Earth Engine and `geemap` libraries are installed, you will need to authenticate your environment. This is (theoretically) a one-time event, although this might happen more frequently. 

In the code chunk below, we import the GEE library and then authenticate. You will be redirected to another page where you will receive an token, which you then enter into the prompt a pop-up will show, follow the instructions and *make sure you are signed into Google with the account associated with GEE*. 

```python
import ee
ee.Authenticate()
```

### Initiate Earth Engine

Once it is installed, you will have to initiate a session with the API every time you run a script. In the import section of your code, include the following to start using Earth Engine.

```python
# Initialize Earth Engine
import ee, geemap
ee.Initialize()
```
