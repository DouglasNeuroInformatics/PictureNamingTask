Usage
=====

.. _installation:

Serving locally
------------

To use PictureNameingTask locally a simple http server can be used. Either download the dist from the github or build the package from source eg `npm build`. Then the index.html file can be served locally. 
For example using python3 first navitage to the directory containing the index.html file then:

.. code-block:: console
cd path/to/index.html
python3 -m http.server

Adding stimuli
----------------

Stimuli are added to the data.csv found in the `dist/assets` directory as follows:

.. csv-table:: stimuli :rst:dir:`csv-table`
   :header: "stimulus", "difficultyLevel", "correctResponse","language"

   "path/to/img_of_a_dog.jpg",    "1",      "A dog",          "EN"
   "path/to/img_of_a_cat.jpg",    "2",      "A cat",          "EN"
   "path/to/img_of_a_dog.jpg",    "1",      "Un chien",       "FR"
   "path/to/img_of_a_cat.jpg",    "2",      "Un chat",        "FR"

Changing experiment settings
----------------

Experiment settings are changed in the experimentSettings.csv file which can found in the `dist/assets` directory. These settings are described below:

- totalNumberOfTrialsToRun: this is the number of images to be shown, a number
- advancementSchedule: the number of correct answers that are required to increase the difficutly level by one, a number
- regressionSchedule: the number of incorrect answers required to decrease the difficutly level by one, a number
- language: the language of experiment, `EN` or `FR`
- seed: a seed for the psuedorandom number generator, a number 

.. csv-table:: experimentSettings :rst:dir:`csv-table`
   :header: totalNumberOfTrialsToRun, advancementSchedule, regressionSchedule, language, seed
   5, 2, 0, EN, 42


