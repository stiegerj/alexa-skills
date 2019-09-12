'use strict'

exports.handler = function(event, context){
    try{
        var request = event.request;
        var session = event.session;

        if(!event.session.attributes){
            event.session.attributes={};
        }

        if(request.type === "LaunchRequest"){
            let options = {};
            options.speechText = "Welcome to the Pulse Labs testing skill. This is an adventure game where your objective is to get across the river. You can interact with the environment around you and move around. To begin, say 'begin'.";
            options.repromptText = "To begin, say 'begin'. For help, say 'help'. If you don't say anything, the game will close. ";
            options.endSession=false;
            context.succeed(buildResponse(options));
        }

        else if (request.type === "IntentRequest"){
            let options = {};
            options.session={};
            options.session.attributes = event.session.attributes;

            if(request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent"){
                options.speechText = "Thank you for your interest in Pulse Labs. Goodbye"
                options.endSession=true;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "HintIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "You can't ask for a hint before the game has started. Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }

                else if(!(event.session.attributes.hasUnlitTorch || event.session.attributes.hasFlint)){
                    options.speechText = "That dark cave seems suspiciously useful. You'll need two items to light it up. There are only five locations total in this game. Remember to ask for details in order to know what you can examine or take. ";
                }

                else if (event.session.attributes.hasUnlitTorch && !event.session.attributes.hasFlint){
                    options.speechText = "You have a torch, but no way to light it. Maybe look around for some flint. ";
                }

                else if (event.session.attributes.hasFlint && !event.session.attributes.hasUnlitTorch){
                    options.speechText = "You have an accelerant. Now you just need something to light on fire. That cottage looks like it will advance the plot. ";
                }

                else if (!event.session.attributes.hasKey){
                    options.speechText = "The cottage is locked. That seems important. They key is probably somewhere dark. Try saying 'light torch'. ";
                }

                else if (!event.session.attributes.hasRope){
                    options.speechText = "You've unlocked the cottage. There's probably something important inside. Something to tie together some forest lumber to make a raft, maybe. ";
                }

                else if (!event.session.attributes.hasLumber){
                    options.speechText = "You may need a raft to cross the river. Try looking for some wood in the forest to the south of the starting zone. ";
                }

                else if (!event.session.attributes.hasRaft){
                    options.speechText = "You've got everything you need to build a raft. Try saying 'build raft'. ";
                }

                else{
                    options.speechText = "You've got a raft. Time to go home! The river is north of the starting zone. ";
                }

                options.repromptText = "You've received your hint. To hear it again, say hint. Otherwise, continue playing! If you don't respond to this, the game will close. ";
                options.endSession = false;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "UseKeyIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    if(event.session.attributes.currentLoc == 1){
                        if(event.session.attributes.hasKey){
                            options.speechText = "You unlock the door to the cottage and go inside. You find yourself inside the cozy cottage. What's next?" ;
                            options.repromptText = "You performed some light breaking and entering. What's next on the agenda? If you don't respond, the game will close. ";
                        }
                        else{
                            options.speechText = "What key? You don't have a key, you dunce. ";
                            options.repromptText = "You tried to use a key you don't have. Try something else. If you don't respond, the game will close. ";
                        }
                        options.endSession = false;
                        context.succeed(buildResponse(options));
                    }
                    else{
                        if(event.session.attributes.hasKey){
                            options.speechText = "Calm down, cowboy. There's nothing here to unlock. ";
                            options.repromptText = "You have a key, but there's no lock here. Try something else. If you don't respond, the game will close. ";
                        }
                        else{
                            options.speechText = "So you tried to use a key you don't have on a lock that isn't here. I almost want to spawn a dragon to eat you now, but I won't. Carry on. "
                            options.repromptText = "You don't have a key, and there is no lock here. Try something else. If you don't respond, the game will close. ";
                        }
                        options.endSession = false;
                        context.succeed(buildResponse(options));
                    }
                }
            }

            else if (request.intent.name === "ExamineIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    let examineable = request.intent.slots.Examineable.value;
                    switch(examineable){
                        case "grass":
                            options.speechText = "It's grass. what did you expect? ";
                        break;
                        case "skeleton":
                            if(options.session.attributes.currentLoc == 4 && options.session.attributes.hasLitTorch){
                                if(options.session.attributes.hasKey){
                                    options.speechText = "This poor soul has already given you all he has left to give. ";
                                }
                                else options.speechText = "The skeleton is mostly decomposed, with nothing of note save for a key hanging loosely from its extended index finger. ";
                            }
                            else options.speechText = "Skeleton? What skeleton? I don't know what you're talking about. ";
                        break;
                        case "mineral deposit":
                        case "ore":
                        case "flint":
                        case "mineral":
                        case "minerals":
                            if(options.session.attributes.currentLoc == 3){
                                if(options.session.attributes.hasFlint){
                                    options.speechText = "You already took all the flint! What more does it have to give? ";
                                }
                                else options.speechText = "This appears to be flint, very helpful for starting fires. To take the flint, say 'take flint'";
                            }
                            else options.speechText = "There's no mineral deposit here to examine. "
                        break;
                        case "key":
                            if(options.session.attributes.currentLoc == 4 && options.session.attributes.hasLitTorch){
                                if(options.session.attributes.hasKey){
                                    options.speechText = "This poor soul has already given you all he has left to give. ";
                                }
                                else options.speechText = "Good on you for looking before jumping. But it's just a key. It probably unlocks something. Maybe even the only lock in the game. ";
                            }
                            else options.speechText = "Key? What key? I don't know what you're talking about. ";
                        break;
                        case "cave":
                            options.speechText = "It's a big dark cave. ";
                        break;
                        case "river":
                            options.speechText = "It's a river with a very strong current. No lifeguards either. I wouldn't swim. ";
                        break;
                        case "lumber":
                            if(options.session.attributes.currentLoc == 6){
                                options.speechText = "There's enough wood here to build a raft. You'd just need something to tie it together. Say 'take lumber' to grab the wood. "
                            }
                            else options.speechText = "Lumber? What lumber? I don't know what you're talking about. ";
                        break;
                        case "cottage":
                            options.speechText = "It's a sturdy stone cottage. No huffing and puffing and blowing this bad boy down. ";
                        break;
                        case "door":
                            if(options.session.attributes.currentLoc == 1){
                                if(options.session.attributes.hasKey){
                                    options.speechText = "It's a locked door, but you've got a key that looks conveniently fitting for this lock. ";
                                }
                                else options.speechText = "It's a locked door. Yeah that's about it. ";
                            }
                            else if(options.session.attributes.currentLoc == 0){
                                options.speechText = "The door is unlocked now. Be polite and lock it on your way out. ";
                            }
                            else options.speechText = "Door? What door? I don't know what you're talking about. ";
                        break;
                        case "lock":
                            if(options.session.attributes.currentLoc == 1){
                                if(options.session.attributes.hasKey){
                                    options.speechText = "It's a lock, but you have the key! ";
                                }
                                else options.speechText = "It's a lock on a door. Yeah that's about it. ";
                            }
                            else if(options.session.attributes.currentLoc == 0){
                                options.speechText = "The lock is unlocked now. Be polite and lock it on your way out. ";
                            }
                            else options.speechText = "Lock? What lock? I don't know what you're talking about. ";
                        break;
                        case "torch":
                            if(options.session.attributes.currentLoc == 1 && !options.session.attributes.hasUnlitTorch){
                                options.speechText = "It's an unlit torch. Why'd you bother examining it? Say 'take torch' to take it.";
                            }
                            else if(options.session.attributes.hasUnlitTorch && !options.session.attributes.hasLitTorch){
                                options.speechText = "Yeah, you've got an unlit torch. Have you tried setting it on fire? ";
                            }
                            else if(options.session.attributes.hasLitTorch){
                                options.speechText = "You now hold the power of fire. Use it wisely. ";
                            }
                            else options.speechText = "Torch? What torch? I don't know what you're talking about. ";
                        break;
                        case "rope":
                            if(options.session.attributes.currentLoc == 0){
                                options.speechText = "Sturdy rope, seems like it could be handy for building a raft";
                            }
                            else options.speechText = "Rope? What time? I don't know what you're talking about. ";
                        break;
                        case "chair":
                            if(options.session.attributes.currentLoc == 0){
                                options.speechText = "It's a pretty comfy looking rocking chair. Not of much use to you, though. ";
                            }
                            else options.speechText = "Chair, what chair? I don't know what you're talking about. ";
                        break;
                        case "fireplace":
                            if(options.session.attributes.currentLoc == 0){
                                options.speechText = "It's a fireplace. This would have came in handy earlier. ";
                            }
                            else options.speechText = "Fireplace, what fireplace? I don't know what you're talking about. ";
                        break;
                        case "kitchen":
                            if(options.session.attributes.currentLoc == 0){
                                options.speechText = "It's an abandonded kitchen. Luckily, nothing smells. ";
                            }
                            else options.speechText = "Kitchen? What kitchen? I don't know what you're talking about. ";
                        break;
                        default:
                            options.speechText = "How did you manage to examine the unexaminable? That's odd. ";
                        break;
                    }
                    options.repromptText = "What next? If you don't respond, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "AMAZON.FallbackIntent"){
                options.speechText = "I'm sorry, either I misunderstood, or that is not a valid action at this time. ";
                switch(options.session.attributes.currentLoc){
                    case 0:
                        options.speechText += "You're inside the cottage. You can leave the cottage, ask for details to see what's around you, or examine the rope hanging off the wall. ";
                    break;

                    case 1:
                        options.speechText += "You're outside the cottage. You can go inside if you have the key, you can ask for details to see what's around you, you can go east back to the plains, or you can examine that unlit torch if you have not already. ";
                    break;
                    
                    case 2:
                        options.speechText += "You're at the grassy plains at the center of it all. You can ask for details to see what's around you, you can go north to the river, west to the cottage, east to the cave, or south to the forest. ";
                    break;

                    case 3:
                        options.speechText += "You're outside the dark cave. You can ask for details to see what's around you, you can go inside the cave, you can go west back to the grassy plains, or you can examine that mineral deposit. ";
                    break;

                    case 4:
                        if(options.session.attributes.hasLitTorch){
                            options.speechText += "You're inside the dark cave. You can ask for details to see what's around you, you can go back outside, or you can examine that skeleton on the ground. ";
                        }
                        else{
                            options.speechText += "You're inside the dark cave. You should go back outside the cave until you find a way to light a torch to see. ";
                        }
                    break;

                    case 5:
                        options.speechText += "You're at the river. You can ask for details to see what's around, you can try to cross the river if you've found a way to beat the current, or you can go south back to the plains. ";
                    break;

                    case 6:
                        options.speechText += "You're in the forest. You can ask for details to see what's around, you can take the lumber, or you can go back north to the grassy plains. ";
                    break;

                    default:
                        options.speechText = "I'm not quite sure how you've left the boundaries of the game, but I'll send you back to the plains. You'll still have all your items. The cottage is to your west, the river is to your north, the forest is to your south, and the cave is to your east. ";
                        options.session.attributes.currentLoc = 2;
                    break;
                    }
                options.repromptText = "Sorry, try again. If you don't respond, the game will close. ";
                options.endSession=false;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "MakeTorchIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    if(options.session.attributes.hasUnlitTorch && !options.session.attributes.hasFlint){
                        options.speechText = "You've got a torch, but no way to light it. ";
                        options.repromptText = "You've got a steel knife in your pocket that would go great with some flint. Try the cave. If you don't respond, the game will close. ";
                    }
                    else if(options.session.attributes.hasFlint && !options.session.attributes.hasUnlitTorch){
                        options.speechText = "I'm not sure where you got the idea to make a torch without having a torch. Try something else. ";
                        options.repromptText = "You can't light a torch without a torch. Try the cottage. If you don't respond, the game will close. ";
                    }
                    else if(options.session.attributes.hasLitTorch){
                        options.speechText = "You already lit the torch on fire, what more do you want? Try something else .";
                        options.repromptText = "You couldn't light your flaming torch on fire. What a surprise. Try something else. If you don't respond, the game will end. ";
                    }
                    else if(options.session.attributes.hasFlint && options.session.attributes.hasUnlitTorch){
                        options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You take the flint you gathered from the cave and strike it against the steel knife in your pocket, lighting the torch on fire. Torch acquired! ";
                        options.session.attributes.hasLitTorch = true;
                        options.repromptText = "You've got a lit torch, what's next? If you don't respond, the game will close. ";
                    }
                    else{
                        options.speechText = "Sorry, either I misunderstood, or you can't do that right now. Please try again. ";
                        options.repromptText = "You can't light a torch with neither a torch nor an igniter. What are you doing fam? If you don't respond, the game will close. ";
                    }
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "MakeRaftIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    if(options.session.attributes.hasLumber && !options.session.attributes.hasRope){
                        options.speechText = "You've got a bunch of good lumber to tie together, but nothing to tie it together with. ";
                        options.repromptText = "You can't make a raft without some way to hold the lumber together. Try the cottage. If you don't respond, the game will close. ";
                    }
                    else if(!options.session.attributes.hasLumber && options.session.attributes.hasRope){
                        options.speechText = "I'm not sure where you got the idea to make a raft just by having rope. Try something else. ";
                        options.repromptText = "You can't make a raft without lumber. Try the forest. If you don't respond, the game will close. ";
                    }
                    else if(options.session.attributes.hasRaft){
                        options.speechText = "You've already built the raft. Who else are you trying to ferry across this river?";
                        options.repromptText = "You tried to build a raft, but you already have a raft. You only need one, trust me. Try something else. If you don't respond, the game will close. ";
                    }
                    else if(options.session.attributes.hasLumber && options.session.attributes.hasRope){
                        options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You use the rope to string the logs together into a sturdy and well built raft. Good job! ";
                        options.session.attributes.hasRaft = true;
                        options.repromptText = "You've got a raft, I'm sure you can figure out what to do with it. If you don't respond, the game will close. ";
                    }
                    else{
                        options.speechText = "Sorry, either I misunderstood, or you can't do that right now. Please try again. ";
                        options.repromptText = "You can't make a raft right now. What are you doing fam? If you don't respond, the game will close. ";
                    }
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "CheatIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/SuperMarioBrosLevelComplete.mp3' /> Oops, silly me - I forgot to tell you you have wings! You can just fly across the river. You win! Thanks for playing! ";
                    options.endSession=true;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "DetailIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    switch(options.session.attributes.currentLoc){
                        case 0:
                            if(options.session.attributes.hasRope){
                                "Its still a cozy cottage with a rocking chair, fireplace, and kitchen, but none of that matters now that you've burgled the rope. The outside of the cottage is to your east, and the plains are east of that. ";
                            }
                            else options.speechText = "it's a very cozy looking cottage. There's a rocking chair near the fireplace, an empty kitchen, and some rope hanging loosely off of a hook on the wall. The outside of the cottage is to your east, and the plains are east of that. ";
                        break;

                        case 1:
                            options.speechText = "It's a very well built cottage. The front and only door is locked, but there appears to be an unlit torch hanging off the side of the cottage. The inside of the cottage lies to your west, the grassy plains lie to the east.";
                        break;
                        
                        case 2:
                            options.speechText = "The grassy plains are mostly featureless, but to the west you can see a cottage, to the north you see a river, to the south you see a forest, and to the east you see the mouth of a cave.";
                        break;

                        case 3:
                            if(options.session.attributes.hasLitTorch){
                                "You are standing at the mouth of the still extremely dark cave, but the torch gives you a brighter outlook. The inside of the cave is to your east, the grassy plains are to the west. ";
                            }
                            else{
                                options.speechText = "You are standing at the mouth of an extremely dark cave. You see a mineral deposit near the mouth of the cave, before the cave gets too dark. The inside of the cave is to your east, the grassy plains are to the west. ";
                            }
                        break;

                        case 4:
                            if(options.session.attributes.hasLitTorch){
                                if(options.session.attributes.hasKey){
                                    "After pillaging this poor dead soul for all he has of value, there is nothing important to note in the cave. The mouth of the cave is to your west. ";
                                }
                                else options.speechText = "By brightening the area with your torch, you notice what appears to be a human skeleton a little ways into the cave. The mouth of the cave is to your west. ";
                            }
                            else{
                                options.speechText = "It's far too dark to see anything of use or value. The mouth of the cave is to your west. ";
                            }
                        break;

                        case 5:
                            options.speechText = "You see your destination, twenty yards across from you. The current is too heavy to try to swim across, however. You'll probably need some sort of raft to get across. Your destination is to your north, if you can get there, and the grassy plains are to the south. ";
                        break;

                        case 6:
                            options.speechText = "It's a fairly large forest, with more trees than the eye can see. It's big enough that you don't want to go too far in for fear of getting lost. Luckily, there appears to be lumber left behind by someone else, ready to gather and build into whatever you need, like maybe a raft. The grassy plains are to your north."
                        break;

                        default:
                            options.speechText = "I'm not quite sure how you've left the boundaries of the game, but I'll send you back to the plains. You'll still have all your items. The cottage is to your west, the river is to your north, the forest is to your south, and the cave is to your east. ";
                            options.session.attributes.currentLoc = 2;
                        break;
                    }
                    options.repromptText = "You've heard the details. You can ask for details again, or take action. If you don't respond, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "LightFireplaceIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    if(event.session.attributes.currentLoc == 0){
                        options.speechText = "You decide to liven up the area by tending to the fireplace. Using your torch to light the fireplace gives the cottage an even more homey feel.";
                        options.repromptText = "You accomplished nothing of note by lighting this fireplace, but good on you for making yourself at home, Goldilocks. ";
                        options.endSession = false;
                        context.succeed(buildResponse(options));
                    }
                    else{
                        options.speechText = "There's no good place to start a fire here. Try something else, pyro. ";
                        options.repromptText = "You tried to start a fire somewhere that it would be a bad idea to, you pyro. Calm down. If you don't respond, the game will end. ";
                        options.endSession = false;
                        context.succeed(buildResponse(options));
                    }
                }
            }

            else if(request.intent.name === "TakeIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    let takeable = request.intent.slots.Takeable.value;
                    switch(takeable){
                        case "flint":
                            if(!options.session.attributes.hasFlint){
                                if(options.session.attributes.currentLoc == 3){
                                    options.session.attributes.hasFlint = true;
                                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You were able to take all the exposed flint and imagine it will come in handy later."
                                    options.repromptText = "You now have the flint. Time to get a move on. If you don't respond, the game will end. ";
                                }
                                else{
                                    options.speechText = "Flint? What flint? There's no flint here. ";
                                    options.repromptText = "You couldn't grab the flint, there's no flint to grab. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                                }
                            }
                            else{
                                options.speechText = "You already have the flint you dunce. You're still in the same spot. What next?";
                                options.repromptText = "You tried to grab something you already have. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                            }
                        break;
                        case "lumber":
                            if(!options.session.attributes.hasLumber){
                                if(options.session.attributes.currentLoc == 6){
                                    options.session.attributes.hasLumber = true;
                                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You've got all the lumber you could ever need. You're still in the forest. What next?";
                                    options.repromptText = "You grabbed the lumber and are still in the forest. Time to move along. If you don't respond, the game will end. ";
                                }
                                else {
                                    options.speechText = "Lumber, what lumber? There's no lumber here. ";
                                    options.repromptText = "You couldn't grab the lumber, there's no lumber to grab. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                                }

                            }
                            else {
                                options.speechText = "You already have the lumber, silly. ";
                                options.repromptText = "You tried to grab something you already have. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                            }
                        break;
                        case "rope":
                            if(!options.session.attributes.hasRope){
                                if(options.session.attributes.currentLoc == 0){
                                    options.session.attributes.hasRope = true;
                                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You grab the rope off the wall and stand satisifed in the abandoned cottage. What next?";
                                    options.repromptText = "You now have the rope. Time to get a move on. If you don't respond, the game will end. ";
                                }
                                else{
                                    options.speechText = "Rope? What rope? There's no rope here. ";
                                    options.repromptText = "You couldn't take the rope, there's no rope to take. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                                }
                            }
                            else{ 
                                options.speechText = "You already have the rope, silly. ";
                                options.repromptText = "You tried to grab the rope you already have. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                            }
                        break;
                        case "key":
                            if(!options.session.attributes.hasKey){
                                if(options.session.attributes.currentLoc == 4 && options.session.attributes.hasLitTorch){
                                    options.session.attributes.hasKey = true;
                                    options.speechText = `<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You hold the key high above your head just like Link from Zelda does. What next? `;
                                    options.repromptText = "You now have the key. Time to get a move on. If you don't respond, the game will end. ";
                                }
                                else{
                                    options.speechText = "Key? What key? There are no keys here. ";
                                    options.repromptText = "You couldn't take the key, there's no key to take. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                                }
                            }
                            else{ 
                                options.speechText = "You already have the key, you dunce. ";
                                options.repromptText = "You tried to grab the key you already have. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                            }
                        break;
                        case "torch":
                            if(!options.session.attributes.hasUnlitTorch){
                                if(options.session.attributes.currentLoc == 1){
                                    options.session.attributes.hasUnlitTorch = true;
                                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3' /> You now have the unlit torch. Neat. What next?";
                                    options.repromptText = "You hold in your hands the amazing unlit torch. Time to get a move on. If you don't respond, the game will end. ";
                                }
                                else{
                                    options.speechText = "Torch? What torch? There are no keys here. ";
                                    options.repromptText = "You couldn't take the torch, there's no torch to take. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                                }
                            }
                            else{ 
                                options.speechText = "You already have the torch, you dunce. ";
                                options.repromptText = "You tried to grab the torch you already have. You're still in the same spot. Time to get a move on. If you don't respond, the game will end. ";
                            }
                        break;
                        default:
                            options.speechText = "I'm not sure what you just tried to take, but it's not takeable. Try something else. ";
                            options.repromptText = "You couldn't take whatever it was you tried to take. Try something else. If you don't respond, the game will end. ";
                        break;
                    }
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "CustomMovementIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    if(options.session.attributes.currentLoc == 0){
                        options.speechText = "You exit the cottage and are now back outside of the cottage. Where to now? ";
                        options.repromptText = "You stand outside the cottage with the cottage to your west and the plains where you started to your east. If you don't respond, the game will close. ";
                        options.session.attributes.currentLoc = 1;
                        options.endSession=false;
                        context.succeed(buildResponse(options));
                    }
                    else if(options.session.attributes.currentLoc == 1){
                        if(event.session.attributes.hasKey){
                            options.speechText = "You open the door and go inside the cottage. What next? ";
                            options.repromptText = "You stand inside the cottage. You can say 'details' to look at your surroundings, or 'go east' to leave the cottage. If you don't respond, the game will close. ";
                            options.session.attributes.currentLoc = 0;
                        }
                        else{
                            options.speechText = "That door is locked. You'll need a key to enter. Try something else. ";
                            options.repromptText = "You can't enter the cottage - it's locked. Try something else. If you don't respond, the game will close. ";
                        }
                        options.endSession=false;
                        context.succeed(buildResponse(options));
                    }
                    else if(options.session.attributes.currentLoc == 3){
                        options.speechText = "You head into the dark cave. ";
                        options.repromptText = "You went into the cave. What next? If you don't respond, the game will close. ";
                        options.session.attributes.currentLoc = 4;
                        options.endSession=false;
                        context.succeed(buildResponse(options));
                    }
                    else if(options.session.attributes.currentLoc == 4){
                        options.speechText = "You step out of the darkened cave and now stand right outside. Where to now? ";
                        options.session.attributes.currentLoc = 3;
                        options.repromptText = "You stand outside the cave with the plains to your west and the cave to your east. If you don't respond, the game will close. ";
                        options.endSession=false;
                        context.succeed(buildResponse(options));
                    }
                    else{
                        options.speechText = "Sorry, either I misunderstood, or that is not a valid action. Please try again. ";
                        options.repromptText = "Sorry, try again. If you don't respond, the game will close. ";
                        options.endSession=false;
                        context.succeed(buildResponse(options));
                    }
                }
            }
            else if(request.intent.name === "MoveIntent"){
                if(!event.session.attributes.gameStarted){
                    options.speechText = "The game has not started yet! Say begin to start the game. ";
                    options.repromptText = "Say begin to start the game, or say help for help. If you don't say anything, the game will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    let dir = request.intent.slots.Direction.value;
                    switch(options.session.attributes.currentLoc){
                        case 0:
                            //inside cottage: can only go east
                            if(dir === "east"){ //might have to do .equalsIgnoreCase js equiv
                                options.speechText = "You exit the cottage and are now back outside of the cottage. Where to now? ";
                                options.repromptText = "You stand outside the cottage with the cottage to your west and the plains where you started to your east. If you don't respond, the game will close. ";
                                options.session.attributes.currentLoc = 1;
                                options.endSession = false;
                            }
                            else{
                                options.speechText = "You can't go that direction from inside the cottage. Your only movement option is east. Try something else. ";
                                options.repromptText = "You're still inside the cottage. Try something else. If you don't respond, the game will close. ";
                                options.endSession = false;
                            }
                            break;
                        case 1:
                            //outside cottage: can only go west if key, otherwise east
                            if(dir === "east"){
                                options.speechText = "You turn around and leave the cottage behind and find yourself back in the grassy plain you started in. What's next? ";
                                options.repromptText = "You stand in the middle of a grassy plains with the river to your north, the cottage to your west, the cave to your east, and the forest to your south. If you don't respond, the game will close. ";
                                options.session.attributes.currentLoc = 2;
                                options.endSession = false;
                            }
                            else if(dir === "west"){
                                if(event.session.attributes.hasKey){
                                    options.speechText = "You unlock the door, open the door, and go inside the cottage. What next? ";
                                    options.repromptText = "You stand inside the cottage. You can say 'details' to look at your surroundings, or 'go east' to leave the cottage. If you don't respond, the game will close. ";
                                    options.session.attributes.currentLoc = 0;
                                    options.endSession = false;
                                }
                                else{
                                    options.speechText = "That door is locked. You'll need a key to enter. Try something else. ";
                                    options.repromptText = "You can't enter the cottage - it's locked. Try something else. If you don't respond, the game will close. ";
                                    options.endSession = false;
                                }
                            }
                            else{
                                options.speechText = "You can't go north or south from the cottage. Your options are to go west into the cottage if you have a way past the lock, or east back to the plains. Try something else. ";
                                options.repromptText = "You're still outside the cottage. If you don't respond, the game will close. ";
                                options.endSession = false;
                            }
                            break;
                        case 2:
                            //spawn: can go anywhere
                            if(dir === "east"){
                                options.speechText = "You head east and find yourself standing in front of a dark cave. ";
                                options.repromptText = "You went east and now you're outside the cave. If you don't respond, the game will close. ";
                                options.session.attributes.currentLoc = 3;
                                options.endSession = false;
                            }
                            else if(dir === "west"){
                                options.speechText = "You head west and find yourself looking at a quaint little cottage. The door appears to be locked";
                                options.repromptText = "You went west and now you're outside the cottage. If you don't respond, the game will close. ";
                                options.session.attributes.currentLoc = 1;
                                options.endSession = false;
                            }
                            else if(dir === "south"){
                                options.speechText = "You head south and find yourself in a giant forest with lots of trees. ";
                                options.repromptText = "You're in the forest. If you don't respond, the game will close. ";
                                options.session.attributes.currentLoc = 6;
                                options.endSession = false;
                            }
                            else if(dir === "north"){
                                options.speechText = "You head north and find yourself at the raging river with a strong current. ";
                                options.repromptText = "You went north and you're now at the river. If you don't respond, the game will close. ";
                                options.endSession = false;
                                options.session.attributes.currentLoc = 5;
                            }
                            break;
                        case 3:
                            //outside cave: can go east/west
                            if(dir === "east"){
                                options.endSession = false;
                                options.speechText = "You head into the dark cave. ";
                                options.repromptText = "You went into the cave. What next? If you don't respond, the game will close. ";
                                options.session.attributes.currentLoc = 4;
                            }
                            else if (dir === "west"){
                                options.speechText = "You leave the cave and head back to the grassy plains. ";
                                options.repromptText = "You're back at the grassy plains where you started. What next? If you don't respond, the game will close. ";
                                options.endSession = false;
                                options.session.attributes.currentLoc = 2;
                            }
                            else{
                                options.speechText = "You can't go north or south from outside the cave. Your movement options are to go east back to the plains, or west into the terrifyingly dark cave. Try something else. ";
                                options.endSession = false;
                                options.repromptText = "You can't go that way. Try something else. If you don't respond, the game will close. ";
                            }
                            break;
                        case 4:
                            //inside cave: can only go west
                            if(dir === "west"){
                                options.speechText = "You leave the darkness of the cave and stop just outside of the cave with the plains to your west. Where to now? ";
                                options.session.attributes.currentLoc = 3;
                                
                                options.endSession = false;
                                options.repromptText = "You stand outside the cave with the plains to your west and the cave to your east. If you don't respond, the game will close. ";
                            }
                            else{
                                options.speechText = "It's a dark cave and you don't want to get lost. You don't want to stray too far from the entrance. Your only movement option is to leave the cave by going west. Try something else. ";
                                options.endSession = false;
                                options.repromptText = "You're still inside the cave. Try something else. If you don't respond, the game will close. ";
                            }
                            break;
                        case 5:
                            //at the river, can go north with raft, or south
                            if(dir === "south"){
                                options.speechText = "Good idea, let's head back to the plains. That's a scary current. You find yourself back in the grassy plains you started in. What next? ";
                                options.session.attributes.currentLoc = 2;
                                options.endSession = false;
                                options.repromptText = "You're back in the grassy plains with the river to your north, the forest to your south, the cottage to your west, and the cave to your east. If you don't respond, the game will close. ";
                            }
                            else if(dir === "north"){
                                if(options.session.attributes.hasRaft){
                                    options.endSession = true;
                                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/SuperMarioBrosLevelComplete.mp3' /> You take your trusty raft and sail it across the raging river without too much trouble. You sigh in relief as this ordeal has finally come to its conclusion. The secret password is Snow. Thank you for testing with Pulse Labs, and have a wonderful day.";
                                }
                                else{
                                    options.speechText = "You're not Michael Phelps - you can't swim across. You'll need to figure out a different way to cross the river. ";
                                    options.endSession = false;
                                    options.repromptText = "You can't go that way - the current is too dangerous. Try something else. If you don't respond, the game will end. ";
                                }
                            }
                            else{
                                options.speechText = "You can't go east or west from here. You can only go north if you've found a way to beat the current, or south back to the grassy plains. Try something else. ";
                                options.endSession = false;
                                options.repromptText = "You're still at the river. Try something else. If you don't respond, the game will close. ";
                            }
                            break;
                        case 6:
                            //in the forest, can only go north
                            if(dir === "north"){
                                options.speechText = "You turn around and leave the forest behind you, arriving back at the grassy plains you started in. What next? ";
                                options.session.attributes.currentLoc = 2;
                                options.repromptText = "You're back in the grassy plains with the river to your north, the forest to your south, the cottage to your west, and the cave to your east. If you don't respond, the game will close. ";
                                options.endSession = false;
                            }
                            else{
                                options.speechText = "It's a big forest -- you don't wanna get lost. Your only movement option is north back to the plains. Try something else. ";
                                options.repromptText = "You're still in the forest. Try something else. If you don't respond, the game will close. ";
                                options.endSession = false;
                            }
                            break;
                        default:
                            //where are you, reset to spawn
                            options.speechText = "Well, you broke the game and left the boundaries, somehow. I'll send you back to where you started -- don't worry, you'll keep all your stuff. ";
                            options.repromptText = "You're back in the grassy plains with the river to your north, the forest to your south, the cottage to your west, and the cave to your east. If you don't respond, the game will close. ";
                            options.session.attributes.currentLoc = 2;
                            options.endSession = false;
                            break;
                    }
                    context.succeed(buildResponse(options));
                }
            }

            else if(request.intent.name === "CrossIntent"){
                if(options.session.attributes.hasRaft){
                    options.endSession = true;
                    options.speechText = "<audio src='https://s3-us-west-2.amazonaws.com/jessie.stieger/SuperMarioBrosLevelComplete.mp3' /> You take your trusty raft and sail it across the raging river without too much trouble. You sigh in relief as this ordeal has finally come to its conclusion. The secret password is Snow. Thank you for testing with Pulse Labs, and have a wonderful day.";
                }
                else{
                    options.speechText = "You're not Michael Phelps - you can't swim across. You'll need to figure out a different way to cross the river. ";
                    options.endSession = false;
                    options.repromptText = "You can't go that way - the current is too dangerous. Try something else. If you don't respond, the game will end. ";
                }
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "AMAZON.HelpIntent"){
                options.speechText = "";
                if(event.session.attributes.gameStarted){
                    options.speechText = `Your goal is to cross the river. You can say 'details' to explore the area you are currently in, you can interact with the environment around you by saying "Examine", or you can move to a new location through cardinal directions by saying "go north", "go south", "go east", or "go west". Once the game has begun, you can ask for a hint by saying "hint". `;
                }
                else{
                    options.speechText = `Your goal is to cross the river. You can say 'details' to explore the area you are currently in, you can examine something specific, like a mineral deposit, by saying "examine mineral deposit", you can attempt to interact with the environment around you, or you can move to a new location through cardinal directions by saying "go north", "go south", "go east", or "go west". To begin, say begin. For a hint, say "hint". `;
                }
                options.repromptText = "To hear this again, say help. To hear a hint, say hint. Otherwise keep playing. If you don't respond to this, the game will close. "
                options.endSession = false;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "StartIntent"){
                if(event.session.attributes.gameStarted){
                    options.speechText = "The game has already started! For help, say help. ";
                }
                else{
                    options.speechText = `You find yourself alone in a grassy plains with a strong desire to get back home across the river. There's a cottage to the west, a cave to the east, a forest to the south, and a river to the north. Time to get started. Remember you can always ask for details to hear more about your current location. `;
                    options.session.attributes.gameStarted = true;
                    options.session.attributes.currentLoc = 2;
                    options.session.attributes.hasUnlitTorch = false;
                    options.session.attributes.hasFlint = false;
                    options.session.attributes.hasLitTorch = false;
                    options.session.attributes.hasKey = false;
                    options.session.attributes.hasRope = false;
                    options.session.attributes.hasRaft = false;
                    options.session.attributes.hasLumber = false;
                }
                options.repromptText = "The game has started. For help, say help. For a hint, say hint. If you don't respond to this, the game will close";
                options.endSession = false;
                context.succeed(buildResponse(options));
            }

            else{ 
                context.fail("Unknown intent");
            }
        }
        else if(request.type === "SessionEndedRequest"){
        }
        else{
            context.fail("Unknown request type");
        }

    }
    catch(e){
        context.fail("Exception: "+e);
    }
}

function buildResponse(options){
    var response = {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>"+options.speechText+"</speak>"
            },
            shouldEndSession: options.endSession
        }
    }

    if(options.repromptText){
        response.response.reprompt = {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>"+options.repromptText+"</speak>"
            }
        };
    }

    if(options.cardTitle){
        response.response.card = {
            type: "Simple",
            title: options.cardTitle
        }

        if(options.imageUrl){
            response.response.card.type = "Standard";
            response.response.card.text = options.cardContent;
            response.response.card.image = {
                smallImageUrl: options.imageUrl,
                largeImageUrl: options.imageUrl
            };
        }
        else{
            response.response.card.content = options.cardContent;
        }
    }

    if("session" in options && "attributes" in options.session){
        response.sessionAttributes = options.session.attributes;
    }

    return response;
}
