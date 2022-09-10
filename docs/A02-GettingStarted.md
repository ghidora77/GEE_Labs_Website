# PreLab - Authentication
This is a short module that explains the process of authenticating your Earth Engine account and working with the Python API. There is no need to run this script, but it is designed to explain the process of getting scripts running. If you are new to Earth Engine and running into errors, it is likely in package management or authentication.

## Setting up an Account

Whether you use the JavaScript or Python API, you will have to sign-up for a Google Earth Engine account [here](https://signup.earthengine.google.com). Registration is free and straightforward, but it takes approximately 24 hours to be approved to use the code editor. 

 * Note: For the moment, use a personal email address instead of your .edu account, as the educational accounts will not let you create a new project. This is a frequently-changing process and may need to be revised if the authentication process changes.

## Getting Started

Once the account is approved, you can access Google Earth Engine. 

#### JavaScript

With JavaScript, you can get started immediately - as long as you are logged into Google with the account you created your account with, you can access the [code editor](https://code.earthengine.google.com) immediately and start running scripts.

#### Python

Python takes a little more effort to set up - you have to:

1. Install the Earth Engine library (one-time per environment)
2. Authenticate your Earth Engine Account (one-time per environment)
3. Initiate the API (every time you run a script)
4. Install and import the dependency libraries (every time you run a script)

In addition, we will be using the [`geemap`](https://geemap.org) package for visualization in conjunction with Earth Engine, installation instructions are also included.

#### Python with Google Colab

This course is designed to work with Google Colab, although if you are comfortable working with a local environment then we suggest you do that (however, we cannot guarantee support for this). Colab already has the Earth Engine library and many dependencies installed. You will have to install libraries that are not natively supported for the scripts you run each time. In the example below, we are using `pip` (a package and environment manager, similar to Anaconda) to ensure that your libraries are installed correctly. With Colab, you will have to complete this step each time you start working with a notebook - ensure that it's in a code chunk at the top of your notebook.

> Note: Over the long-term, it would benefit you to learn how to set up your local environment, as you have control over your work and environment. There are some resources in the 'Local Environment' section of this course that may help get you started.  

**No need to run any of these scripts**


```python
# Install using `pip` - Use with Google Colab
# Not necessary with Colab because GEE is already installed
!pip install earthengine-api --upgrade
!pip install geemap
```

#### Authenticate Earth Engine

Once the Earth Engine and `geemap` libraries are installed, you will need to authenticate for your environment. In Colab, you have to go through this process at least every 12 hours (it theoretically keeps your environment running as long as you are active for up to 12 hours, but in the free tier there is no guarantee). In the code chunk below, we import the GEE library and then authenticate - follow the instructions (you will be redirected to another page where you will receive an token, which you then enter into the prompt) and *make sure you are signed into Google with the account associated with GEE*. 


```python
import ee
ee.Authenticate()
```

Another benefit of working with a local environment is that this process only happens once - when you authenticate, it stores your access token associated with your environment. 

#### Initiate Earth Engine

Once it is installed, you will have to initiate a session with the API every time you run a script (both in Colab or locally). In the import section of your code, include the following to start using Earth Engine.


```python
# Initialize the Earth Engine module.
import ee, geemap
ee.Initialize()
```

