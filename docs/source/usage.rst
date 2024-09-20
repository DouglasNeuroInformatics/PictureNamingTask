Usage
=====

.. _installation:

Serving locally
----------------

To use PictureNamingTask locally a simple http server can be used. 
There are 2 options available:

- Go to the `GitHub repository <https://github.com/DouglasNeuroInformatics/PictureNamingTask>`_, download/clone project and build the from source e.g. ``npm build`` to obtain the ``dist`` directory which will contain ``index.html``
- To obtain the already built files, the dist directory, navigate to the `releases <https://github.com/DouglasNeuroInformatics/PictureNamingTask/releases>`_ on the GitHub page and download. ``index.html`` will be present in the ``dist`` directory

The ``index.html`` file can be now be served locally.
For example Python3 offers a command to serve the ``index.html`` locally with one command. 
First ensure Python3 is installed. 
`It can be found here <https://www.python.org/downloads/>`_.
Choose the appropriate package for the OS that you have. 
Using a terminal or powershell first navigate to the directory containing the index.html file:

.. code-block:: console

  $ cd path/to/directory/containing/index.html

Then start the Python server:

.. code-block:: console

  $ python -m http.server

This will provide an output that looks something like this: 

.. code-block:: console

  $ Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...

To access this go to the provided URL in your browser.
For example http://0.0.0.0:8000/
If port 8000 is already in use an error will be displayed.
To start the server on another port use (example 8080):

.. code-block:: console

   $ python -m http.server 8080

More information about ``python http.server`` can be found here https://docs.python.org/3/library/http.server.html

.. _adding-stimuli:

Adding stimuli
----------------

Stimuli are added to the data.csv found in the ``dist/`` directory as follows:

.. table:: Grid table

+---------------------------+------------------+-------------------+----------+
| Stimulus Image Path       | Difficulty Level | Correct Response  | Language |
+===========================+==================+===================+==========+
| path/to/img_of_a_dog.jpg  | 1                | A dog             | en       |
+---------------------------+------------------+-------------------+----------+
| path/to/img_of_a_cat.jpg  | 2                | A cat             | en       |
+---------------------------+------------------+-------------------+----------+
| path/to/img_of_a_dog.jpg  | 1                | Un chien          | fr       |
+---------------------------+------------------+-------------------+----------+
| path/to/img_of_a_cat.jpg  | 2                | Un chat           | fr       |
+---------------------------+------------------+-------------------+----------+

Currently there are nine directories with images corresponding to nine difficulty levels. 
These are located in ``dist/level1 ... dist/level9`` if the ``dist`` was download. 
In source code they are located in the ``public`` directory.

.. _changing-experiment-settings:

Changing experiment settings
----------------------------

Experiment settings are changed in the ``experimentSettings.csv`` file which is located in the ``dist/`` directory.
A template for this file can be found in the ``public`` directory: `public/experimentSettings  <https://github.com/DouglasNeuroInformatics/PictureNamingTask/blob/main/public/experimentSettings.csv>`_
These settings are described below:

- **totalNumberOfTrialsToRun**  <number>: this is the number of images to be shown
- **advancementSchedule** <number>: the number of correct answers that are required to increase the difficulty level by one
- **regressionSchedule** <number>: the number of incorrect answers required to decrease the difficulty level by one
- **language** <text>: the language of experiment, currently ``en`` or ``fr``
- **seed** <number>: a seed for the psuedorandom number generator
- **initialDifficulty** <number>: the difficulty that the task will start with
- **numberOfLevels** <number>: the number of levels that are available for the task

.. table:: Grid table

+-------------------------+-------+
| Setting                 | Value |
+=========================+=======+
| totalNumberOfTrialsToRun| 5     |
+-------------------------+-------+
| advancementSchedule     | 2     |
+-------------------------+-------+
| regressionSchedule      | 0     |
+-------------------------+-------+
| language                | en    |
+-------------------------+-------+
| seed                    | 42    |
+-------------------------+-------+
| initialDifficulty       | 1     |
+-------------------------+-------+
| numberOfLevels          | 9     |
+-------------------------+-------+
| downloadOnFinish        | False |
+-------------------------+-------+



