# Appendix - Python in a Local environment
Unfortunately, building your Python environment can be challenging. Many packages are built upon other packages, and when changes are made this can create a cascade of conflicts. Additionally, there are fundamental differences between Windows and Linux/Mac, both of which can have an array of issues. Geospatial packages in particular are notorious for requiring robust conflict management.

For short courses or running a one-off script, Google Colab works well - you can immediately start running scripts and do not have to maintain an environment. However, there are some drawbacks, including having to constantly re-authenticate with GEE, install any packages not natively supported on Colab, certain visualization packages do not work, and everything is tied to GSuite. If you will be using GEE for more than a few weeks or working with Python in the future, we recommend that you learn how to work with a package and environment management system or a hosted solution that maintains your environment.

This course was developed on a Mac using *Visual Studio Code* as the text editor and *Anaconda* as the package and environment manager. *Visual Studio Code* is the best-supported open-source text editor (owned by Microsoft) and Anaconda is a widely used environment manager in the data science world. You are free to use your own system and methods, and we will include several different options below.

Here are three resources that you can use to get started. Working with your own local environment is a never-ending process, but learning how to use the terminal, Anaconda and getting comfortable with a text editor (or Integrated Development Environment) are essential.

1. [Getting Started with Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/getting-started.html)
2. Free Udacity [Course](https://classroom.udacity.com/courses/ud1111) on Anaconda and Jupyter Notebooks
3. [Python in Visual Studio Code](https://code.visualstudio.com/docs/languages/python)

Once you are comfortable using the code editor or IDE that you want to use, the `geospatial` consolidation [package](https://geospatial.gishub.org/installation/) is very helpful when working with geospatial data. It combines virtually all the geospatial packages we will be using in this course, including GEE and all the dependencies to create the visualizations. We have found best results using the instructions under **Using Momba**.

#### Colab vs. Local Environments

There are some downsides of Google Colab - to access the terminal, you have to upgrade to the Pro version. Additionally, as a Google product it is tied in with Google Drive/Google Cloud, which might be a hindrance if your data is stored in another location. The Python development ecosystem is vast, with many options. If you will be working with Python in the long-term, it would be worthwhile to learn how to use popular tools such as 

* Anaconda
  * Environment and Package manager
* Visual Studio Code
  * Open Source text editor run by Microsoft
* [Atom](https://atom.io)
  * Open Source text editor
* [Sublime](https://www.sublimetext.com)
  * Open Source text editor
* Git, Github, Bitbucket
  * Version Control - Open source technology businesses built around it
* [Jupyter Labs](https://jupyter.org)
  * Open Source project for combining text and code
* DeepNote
  * Similar to Colab, but full control over environment, integrations with many tools and ability to increase compute power
* [Spyder](https://www.spyder-ide.org)
  * IDE for Python, Open Source

There are too many technologies to name, people have different preferences and opinions and this falls outside of the scope of this course. Bottom line, explore the tools that you find interesting and get comfortable with them.

The site [Real Python](https://realpython.com/learning-paths/perfect-your-python-development-setup/) provides a good starting point that might help get you started





