**Verbs** represent the types of actions that the player character can make. Every **Interaction** requires a **Verb** as part of the *command* that triggers it.

You can have as many **Verbs** as you like in your game. As a minimum, you will likely want to have a "move"/"walk to" **Verb** and a "look at"/"examine" **Verb** and at least one that allow the player character to interact with the world in some way. You might just a have a generic "use" **Verb** or a set of more specific **Verbs** if you want puzzles which require the player to be more precise about the solution - for example "GIVE CUSTARD PIE TO CLOWN" might convey a different intent to "USE CUSTARD PIE WITH CLOWN".

If you want your **Verb** to be useable in **Interactions** that have an **Inventory Item**, you must specify a *preposition*. For example, to allow commands like "GIVE CUSTARD PIE TO CLOWN", "to" would be the *preposition* for the "give" **Verb**.
