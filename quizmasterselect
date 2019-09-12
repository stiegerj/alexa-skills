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
            options.speechText = "Today you'll be listening to the voices of 10 candidates who are trying to be the host and Quiz Master of a new game skill for Alexa. After hearing each one, we'll ask you to rate that voice on a scale of 1 to 10, 10 being highest and 1 being lowest. Please rate all 10 voices before ending the test. To hear the first voice, say begin. ";
            options.repromptText = "I didn't hear a response. To hear the instructions again, say 'help'. If you don't say anything, the skill will close. ";
            options.endSession=false;
            context.succeed(buildResponse(options));
        }

        else if (request.type === "IntentRequest"){
            let options = {};
            options.session={};
            options.session.attributes = event.session.attributes;

            if(request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent"){
                options.speechText = "I have interpreted whatever you said as a command to close this skill. Goodbye. "
                options.endSession=true;
                context.succeed(buildResponse(options));
            }

           else if(request.intent.name === "StartIntent"){
               if(options.session.attributes.index){
                   options.speechText = "You've already started. Say repeat to hear the last voice, or if you really want to start over, you can close and reopen this skill by saying open quiz master select. ";
                   options.repromptText = "I didn't hear a response. If you don't respond to this, the skill will close and you will have to start over .";
                   options.endSession = false;
               }
               else{
                    options.speechText = "Here's the first quiz master candidate. ";
                    options.speechText += grabAudioFile(1);
                    options.speechText += " In the context of this voice hosting a game show, how would you rate the voice on a scale of 1 to 10? To hear the voice again, say repeat. ";
                    options.session.attributes.index = 2;
                    options.endSession = false;
                    context.succeed(buildResponse(options));
               }
           }

           else if(request.intent.name === "NextVoiceIntent"){
               if(!options.session.attributes.index){
                    options.speechText = "It sounds like you tried to rate a voice before hearing a voice. Say begin to begin. ";
                    options.repromptText = "I didn't hear a response. To begin, say begin. If you don't respond to this, the skill will close. ";
                    options.endSession = false;
               }

               else if(options.session.attributes.index > 10){
                   options.speechText = "Thanks for rating all of the quiz masters and for testing with Pulse Labs. Have a great day! "
                   options.endSession = true;
               }
               else if(options.session.attributes.index == 2){
                options.speechText = `Here's the <say-as interpret-as="ordinal">` + options.session.attributes.index + `</say-as> quiz master candidate. `;
                options.speechText += grabAudioFile(options.session.attributes.index);
                options.speechText += " How would you rate the voice on a scale of 1 to 10? If you want to hear the voice again, say repeat.";
                options.repromptText = "I didn't hear a response. To hear this voice again, say repeat. To rate it, say a number between one and ten. If you don't respond to this, the skill will close and you will have to start over. ";
                options.session.attributes.index++;
                options.endSession = false;
               }
               else{
                    options.speechText = `Here's the <say-as interpret-as="ordinal">` + options.session.attributes.index + `</say-as> quiz master candidate. `;
                    options.speechText += grabAudioFile(options.session.attributes.index);
                    options.speechText += " How would you rate the voice on a scale of 1 to 10?";
                    options.repromptText = "I didn't hear a response. To hear this voice again, say repeat. To rate it, say a number between one and ten. If you don't respond to this, the skill will close and you will have to start over. ";
                    options.session.attributes.index++;
                    options.endSession = false;
               }
               context.succeed(buildResponse(options));
           }

            else if(request.intent.name === "AMAZON.FallbackIntent"){
                options.speechText = "I'm sorry, either I misunderstood, or that is not a valid command. Say 'help' to hear the instructions, or repeat to hear the last voice. ";
                options.repromptText = "I didn't hear a response. You can say 'help' for help, or you can say 'repeat' to hear the last voice again. If you don't respond, the skill will close. ";
                options.endSession=false;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "RepeatIntent"){
                if(options.session.attributes.index){
                    options.session.attributes.index--;
                    options.speechText = "Here's the last candidate's voice again. ";
                    options.speechText += grabAudioFile(options.session.attributes.index);
                    options.speechText += " In the context of hosting a game show, how would you rate the voice on a scale of 1 to 10? To hear the voice again, say repeat";
                    options.repromptText = "I didn't hear a response. You can say 'help' for help, or you can say 'repeat' to hear the last voice again. If you don't respond, the skill will close. ";
                }
                else{
                    options.speechText = "It sounds like you tried to repeat a voice before hearing the first candidate. Say begin to begin. ";
                    options.repromptText = "I didn't hear a response. You can say begin to hear the first candidate. If you don't respond to this, the skill will close. ";
                }
                options.endSession = false;
                options.session.attributes.index++;
                context.succeed(buildResponse(options));
            }

            else if(request.intent.name === "AMAZON.HelpIntent"){
                if(options.session.attributes.index){
                    options.speechText = "We need you to rate 10 different Quiz Master voices for a potential new game show skill. You have currently listened to and rated " + (options.session.attributes.index - 2) + " voices so far. You can say repeat to hear the last voice. ";
                    options.repromptText = "To hear this again, say help. If you don't respond to this, the skill will close and you will have to start over. "
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
                else{
                    options.speechText = "We need you to rate 10 different potential voices for the Quiz Master of a new game show. You can always say repeat to hear the last voice again. To begin, say begin. ";
                    options.repromptText = "I didn't hear a response. Say begin to begin. If you don't respond to this, the skill will close. ";
                    options.endSession = false;
                    context.succeed(buildResponse(options));
                }
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

function grabAudioFile(index){
    let url = "";
    switch(index){
        case 1:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/SuperMarioBrosLevelComplete.mp3";
        break;
        case 2:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/itemfanfare.mp3";
        break;

        case 3:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/badumts.mp3";
        break;

        case 4:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/combobreaker.mp3";
        break;

        case 5:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/george-micael-wham-careless-whisper-1.mp3";
        break;

        case 6:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/johncena.mp3";
        break;

        case 7:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/sadtrombone.swf.mp3";
        break;

        case 8:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/rickroll.mp3";
        break;

        case 9:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/the-price-is-right-losing-horn.mp3";
        break;

        case 10:
            url = "https://s3-us-west-2.amazonaws.com/jessie.stieger/mlg-airhorn.mp3";
        break;
    }
    return "<audio src='" + url + "' /> ";

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
