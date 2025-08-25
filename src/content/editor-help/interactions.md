The **Rooms**, **Actors** and **Inventory Items** make up the contents of the game world, but **Interactions** define what the player character can do in the world.

An **Interaction** has three components:
 - the *command* that the player must give to make the **Interaction** happen
 - the *conditions* (if any) that must apply for the *command* to work
 - the *consequences* that happen if the *command* works

 The game has an ordered list of **Interactions** when the player issues a *command*, the engine goes through the list to find the first **Interaction** with a matching *command* for which the *conditions* are met. If it finds one, the *consequences* for the **Interaction** are carried out. If not, the player character says the default dialogue for the **Verb** in the *command* to communicate to the player that nothing happened.

 Because you can create multiple **Interactions** for the same *command*, but with different *conditions*, you have different outcomes for the same *command* depending on the state of the game. 
 
 For example - if you had a "door" **Actor**, you might want the the *consequences* of the *command* "OPEN DOOR" to depend on whether or not the "door" had a *status* of "locked" - let's say if the door is locked, the player character should fail to open the door and say that it is locked, but otherwise, the door should be opened. To do this, you would create two **Interactions** for the *command* "OPEN DOOR" and have the first one in the list include a *condition* that the target have a status of "locked".