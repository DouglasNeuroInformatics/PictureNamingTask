Welcome to PictureNamingTask's documentation!
==============================================

This is task is a modernized version of a classic neuropsychological task known as a "picture naming task", where an individual is presented with a set of pictures of sheet of paper and asked to name each of them (The "Boston Naming Test"[#f1]_ being the most frequently used).jhhk
The classic task is "fixed" in terms of the number of images and which images are shown.
Classically, the number correct and the answer provided are recorded as a measurement.
This expands on the classic version by allowing a user to add and remove stimuli as they deem necessary.
Each stimulus also has a difficulty level associated with it. This allows for dynamic advancement and regression according to schedule set by the task administrator. 

The following pieces of data are recorded and downloaded in a .csv file at the end of session or sent to `Open Data Capture <https://opendatacapture.org/en/>`_ :

- The stimulus
- The correct response
- The difficulty level
- The language
- Response time for stimulus screen
- The correct/incorrect answer
- The response/notes logged by experimenter


Check out the :doc:`usage` section for further information, including
how to :ref:`installation` the project.


.. toctree::
  :caption: Contents
  :maxdepth: 1

  usage
  usageODC
  language

.. rubric:: Footnotes

.. [#f1] Kaplan, E., Goodglass, H., & Weintraub, S. (2001). Boston naming test. The Clinical Neuropsychologist. 


