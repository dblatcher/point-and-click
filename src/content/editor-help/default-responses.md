If the player issues a *command* for which there is no matching **interaction**, the player character will say a generic line in response as feedback to the player. This means it is not necessary to include an **interaction** for every possible combination of **verb**, target and **inventory item**.

You can customise the responses for particular **verbs** to something more relevant. For example, for a "look" verb might want the character to say something like "It looks normal" and for a "push" verb something like "I can't move that".

If you use the "wildcards" in the templates, it will be replaced with the name of the **inventory item**, target and **verb** used in the *command*.

There are three templates you can define for each verb:
 - for a VERB / TARGET command with no **interaction**
 - for a VERB / TARGET / ITEM command with no **interaction** (only relevant for **verbs** with a preposition)
 - for commands that cannot be completed because the player character cannot reach the TARGET