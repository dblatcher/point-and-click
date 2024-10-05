**Flags** represent facts about the game world that can change during the story.

They can be used used to control whether an **interaction** will be triggered by a matching command. **flags** are initially set to "on" or "off" at the start of a game. They can be changed during the game by *flag* **consequences**.

For example, your game might involve a door with a keypad that the player character has to open. A **flag** called "knows_door_code" which starts "off" could be used to represent whether the character has learned the code or not. You could then have two **interactions** for the command "OPEN DOOR" - the first  which the **flag** must be "on" which results in the character opening the door, the second which result in the character saying that they do not know the code. 
