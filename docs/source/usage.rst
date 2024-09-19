Usage
=====

.. _installation:

Serving locally
----------------

To use PictureNamingTask locally a simple http server can be used. 
Either download the dist from the github or build the package from source eg ``npm build`` Then the index.html file can be served locally.
Python3 offers a command to serve the index.html locally with one command. 
First ensure python3 is installed. 
`It can be found here <https://www.python.org/downloads/>`_.
Choose the appropriate package for the OS that you have. 
Using a terminal or powershell first navitage to the directory containing the index.html file then:

.. code-block:: console

  $ cd path/to/directory/containing/index.html
  $ python -m http.server

This will provide an ouput that looks something like this: 

.. code-block:: console

  $ Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...

To access this go to the provided url in your browser.
For example http://0.0.0.0:8000/
If port 8000 is already in use an error will be displayed.
To start the server on another port use (example 8080):

.. code-block:: console

   $ python -m http.server 8080

More information about ``python http.server`` can be found here https://docs.python.org/3/library/http.server.html

.. _adding-stimuli:

Adding stimuli
----------------

Stimuli are added to the data.csv found in the `dist/assets` directory as follows:

.. csv-table:: data.csv 
   :header: "stimulus", "difficultyLevel", "correctResponse","language"

   "path/to/img_of_a_dog.jpg",    "1",      "A dog",          "en"
   "path/to/img_of_a_cat.jpg",    "2",      "A cat",          "en"
   "path/to/img_of_a_dog.jpg",    "1",      "Un chien",       "fr"
   "path/to/img_of_a_cat.jpg",    "2",      "Un chat",        "fr"

.. _changing-experiment-settings:

Changing experiment settings
----------------------------

Experiment settings are changed in the experimentSettings.csv file which is located in the `dist/assets` directory.
A template for this file can be found in the ``public`` directory: `public/experimentSettings  <https://github.com/DouglasNeuroInformatics/PictureNamingTask/blob/main/public/experimentSettings.csv>`_
These settings are described below:

- totalNumberOfTrialsToRun <number>: this is the number of images to be shown
- advancementSchedule <number>: the number of correct answers that are required to increase the difficulty level by one
- regressionSchedule <number>: the number of incorrect answers required to decrease the difficulty level by one
- language <text>: the language of experiment, currently ``en`` or ``fr``
- seed <number>: a seed for the psuedorandom number generator
- initialDifficulty <number>: the difficulty that the task will start with
- numberOfLevels <number>: the number of levels that are available for the task

.. csv-table:: experimentSettings :rst:dir:`csv-table`
   :header: totalNumberOfTrialsToRun, advancementSchedule, regressionSchedule, language, seed, initialDifficulty, numberOfLevels, downloadOnFinish
   5, 2, 0, en, 42, 1, 9, false

.. _adding-additional-languge:

Adding additional language
--------------------------

Adding additional languages can be accomplished by accessing the ``i18n.ts`` file.
This file provides the translations for the task. 
To add another language two things must be done. 
- Adding the translated text the to the 10 keys in the ``translation`` json object on lines 8 through 48
- Adding the two-letter lanague code to ``const $language = z.enum(["en", "fr"]);`` found on line 4 of ``schema.ts``

For example adding spanish would look like this:

.. code-block:: typescript

   // i18n.ts
  const i18n = createI18Next({
  translations: {
    welcome: {
      en: "Welcome. Press any key to begin",
      fr: "Bienvenue. Appuyez sur n'importe quelle touche pour commencer",
      es: "Bienvenido. Presione cualquier tecla para comenzar",
    },
    //  ...
    //  other tranlations 
    //  ...
    submit: {
      en: "Submit",
      fr: "Soumettre",
      es: "Entregar",
    },
   },
  });

.. code-block:: typescript

   // schema.ts
  import { z } from "/runtime/v1/zod@3.23.x";
  const $language = z.enum(["en", "fr", "es"]);



