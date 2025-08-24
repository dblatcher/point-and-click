**Conversations** allow the player to choose from sets of choices, usually representing things that the player character will say to another person. A **Conversation** consists of a number of *Branches* and each *Branch* consists of an ordered list of *choices*.

*Choices* are either enabled or disabled. When building you **Conversation** you can configure choices to start disabled. When a **Conversation** is running, the player can choose from the enabled *choices* in the active *branch*. The effect of the player picking a *choice* can be:
 - disabled the *choice*, so it can only be used once
 - ending the **Conversation**, (often by saying "goodbye", or similar, by tradition these *choices* are at the end of a *branch's* list)
 - changing the conversation to another *branch*
 - enabling or disabling a difference *choice* using its "reference"- either in this **Conversation** or another.
 
 As well as the above, picking a *choice* usually runs a **Sequence**. You can either create a **Sequence** associated directly with the *choice* (a "conversation choice sequence") or choose a **Sequence** created from the main Sequence Editor (an "external sequence"). The main benefit of using external sequences is that you can re-use the same sequence for multiple **Interactions** or *choices* without duplicating them. For example, you might want the same **Sequence** to result from the player talking to another character and using the *choice* "Here, have this hammer" as you would from the **Interaction** "GIVE HAMMER to PERSON".