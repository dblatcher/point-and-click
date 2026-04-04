**Verbs** represent the types of actions that the player character can make. Every **Interaction** requires a **Verb** as part of the *command* that triggers it.

If you want your **Verb** to be useable in **Interactions** that have an **Inventory Item**, you must specify a *preposition*. For example, to allow commands like "GIVE CUSTARD PIE TO CLOWN", "to" would be the *preposition* for the "give" **Verb**.

In the verb config, you can flag your **Verb** as being a "move", "give" or "look" action - this can be useful for custom Layouts that might (for example) make right-clicking/long pressing on an target trigger a "look at item" *Command*.

### Give verbs
Being a "give" **Verb** has an additional effect - if the player is able to control multiple **Actors**, a "give" **Verb** can be used to transfer **Inventory Items** to another controllable **Actor** without needing a specific **Interaction** - you can still define **Interactions** to override this default behaviour. 

For example, if Indy and Sophia are your playable **Actors** and you create an **Interaction** for "GIVE MEDALION TO INDY", this will override the default inventory transfer action for that *command* and instead run the *consequences* of the  **Interaction** - which might be for Sophia to say that she doesn't want to give the medalion to Indy.

### How many verbs should a game have?
You can have as many **Verbs** as you like in your game. As a minimum, you will likely want to have a "move"/"walk to" **Verb** and a "look at"/"examine" **Verb** and at least one that allow the player character to interact with the world in some way - often this might be a "use" **Verb**. 

You might just a have a generic "use" **Verb** or a set of more specific **Verbs** if you want puzzles which require the player to be more precise about the solution - for example "THROW CUSTARD PIE AT CLOWN" might convey a different intent to "USE CUSTARD PIE WITH CLOWN".
