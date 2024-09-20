Multi-language 
==============

.. _adding-additional-languge:

Adding additional language
--------------------------

Adding additional languages can be accomplished by accessing the ``i18n.ts`` file.
This file provides the translations for the task. 
To add another language two things must be done. 
- Adding the translated text the to the 10 keys in the ``translation`` JSON object on lines 8 through 48
- Adding the two-letter language code to ``const $language = z.enum(["en", "fr"]);`` found on line 4 of ``schema.ts``

For example adding Spanish would look like this:

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
    //  other translations 
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



