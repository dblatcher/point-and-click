**Interactions** define what the player character can do in the game world. An **Interaction** has three components:
 - the *command* that the player must give to make the **Interaction** happen
 - the *conditions* (if any) that must apply for the *command* to work
 - the *consequences* that occur in the game world if the *command* works

Every *command* needs a *target* and a **Verb**. They can have an **Inventory Item** if the **Verb** has supports them. The *target* is either:
 - a *hotspot* in a **Room**,
 - an **Actor**, or
 - an **Inventory Item** the player character has

The game has an ordered list of **Interactions** when the player issues a *command*, the engine will:
 - go down the list to find the first **Interaction** with a matching *command* for which the *conditions* are met; 
 - If it finds one, the *consequences* for the **Interaction** are carried out;
 - If not, the player character says the fallback message for the *command's* **Verb** (E.G. "I cannot do that.")

Because you can create multiple **Interactions** for the same *command*, but with different *conditions*, you have different outcomes for the same *command* depending on the state of the game. 
 
For example - if you had a "door" **Actor**, you might want the the *consequences* of the *command* "OPEN DOOR" to depend on whether or not the "door" had a *status* of "locked" - let's say if the door is locked, the player character should fail to open the door and say that it is locked, but otherwise, the door should be opened. To do this, you would create two **Interactions** for the *command* "OPEN DOOR" and have the first one in the list include a *condition* that the target have a status of "locked".